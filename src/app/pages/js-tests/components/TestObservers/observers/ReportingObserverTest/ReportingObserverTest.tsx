import styles from './styles.module.scss';
import { Button } from '@/app/components/Button/Button';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import iframeScript from './iframeScript?url';
import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';

type TReport = {
  type: string;
  url: string;
  body: Omit<ReportBody, 'toJSON'> | null;
};

type TReportingObserverResults = Record<string, (TReport | null)[]>;

const runCspViolation = (iframeRoot: Document) => {
  const body = iframeRoot.body;
  const head = iframeRoot.head;

  const testScriptElement = iframeRoot.createElement('script');
  testScriptElement.src = iframeScript;
  body.appendChild(testScriptElement);

  const meta = iframeRoot.createElement('meta');
  meta.setAttribute('http-equiv', 'Content-Security-Policy');
  meta.setAttribute('content', "script-src 'none'");
  head.appendChild(meta);

  const violationScript = iframeRoot.createElement('script');
  violationScript.src = 'https://www.google.com';
  body.appendChild(violationScript);
};

const runDeprecation = () => {
  const request = new XMLHttpRequest();
  request.open('GET', 'http://numbersapi.com/100', false);
  request.send(null);

  const img = document.createElement('img');
  img.style.overflow = 'visible';
  img.style.position = 'fixed';
  img.style.top = '-1000px';
  img.style.left = '-1000px';
  document.body.appendChild(img);

  return new Promise<void>((resolve) => {
    setTimeout(() => {
      document.body.removeChild(img);
      resolve();
    }, 200);
  });
};

export const getReportData = (report: Report): TReport | null => {
  const reportType = report.type;

  if (reportType === 'deprecation') {
    return {
      body: {
        anticipatedRemoval: report.body?.anticipatedRemoval,
        columnNumber: report.body?.columnNumber,
        id: report.body?.id,
        lineNumber: report.body?.lineNumber,
        message: report.body?.message,
        sourceFile: report.body?.sourceFile,
      },
      type: reportType,
      url: report.url,
    };
  }

  if (reportType === 'csp-violation') {
    return {
      type: report.type,
      url: report.url,
      body: {
        sourceFile: report.body?.sourceFile,
        lineNumber: report.body?.lineNumber,
        columnNumber: report.body?.columnNumber,
        documentURL: report.body?.documentURL,
        referrer: report.body?.referrer,
        blockedURL: report.body?.blockedURL,
        effectiveDirective: report.body?.effectiveDirective,
        originalPolicy: report.body?.originalPolicy,
        sample: report.body?.sample,
        disposition: report.body?.disposition,
        statusCode: report.body?.statusCode,
      },
    };
  }

  return null;
};

type TReportTestIframeProps = {
  onMessage: (event: MessageEvent) => void;
};

type TReportTestIframeRef = {
  runCspViolation: () => Promise<void>;
};

const updater = (reports: Report[]) => (prevState: TReportingObserverResults | null) => {
  const currentState = prevState || {};

  reports.forEach((report) => {
    const type = report.type;
    const data = getReportData(report);

    if (!currentState[type]) {
      currentState[type] = [];
    }

    currentState[type].push(data);
  });

  return currentState;
};

const ReportTestIframe = forwardRef<TReportTestIframeRef, TReportTestIframeProps>(({ onMessage }, forwardedRef) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const runTest = async () => {
    const iframeElement = iframeRef.current?.contentWindow?.document;
    if (!iframeElement) return;

    return new Promise<void>((resolve) => {
      const onIframeMessage = (event: MessageEvent<{ type: string; data: Report[] }>) => {
        if (event.data.type === 'iframe-report') {
          onMessage(event);
        }

        window.removeEventListener('message', onIframeMessage);
        resolve();
      };

      window.addEventListener('message', onIframeMessage);

      runCspViolation(iframeElement);
    });
  };

  const handle = () => {
    return {
      runCspViolation: runTest,
    };
  };

  useImperativeHandle(forwardedRef, handle, []);

  return <iframe className={styles.hiddenIframe} ref={iframeRef} />;
});

export const ReportingObserverTest = () => {
  const [unsupported, setUnsupported] = useState(false);
  const [reportingObserverResults, setReportingObserverResults] = useState<TReportingObserverResults | null>(null);
  const [randomKey, setRandomKey] = useState(window.crypto.randomUUID());

  const iframeRef = useRef<TReportTestIframeRef>(null);

  const runTests = async () => {
    await runDeprecation();
    await iframeRef.current?.runCspViolation();
    setRandomKey(window.crypto.randomUUID());
  };

  const reset = () => {
    setReportingObserverResults(null);
  };

  const onMessage = (event: MessageEvent<{ report: Report[] }>) => {
    const reports = event.data.report;

    setReportingObserverResults(updater(reports));
  };

  useEffect(() => {
    const onReport = (list: Report[]) => {
      setReportingObserverResults(updater(list));
    };

    const reportingObserverSettings = {
      buffered: true,
      types: ['csp-violation', 'deprecation', 'intervention', 'crash'],
    };

    let reportingObserver: ReportingObserver | null = null;
    try {
      reportingObserver = new ReportingObserver(onReport, reportingObserverSettings);
      reportingObserver.observe();
    } catch {
      setUnsupported(true);
    }

    return () => {
      reportingObserver?.disconnect();
    };
  }, []);

  if (unsupported) {
    return <div>ReportingObserver is not supported in your browser.</div>;
  }

  const jsonSettings = {
    maxStringLength: 400,
    collapseLevel: 1,
  };

  return (
    <div className={styles.reportingObserver}>
      <p>
        There should be 2 deprecation reports and 1 CSP violation report after running the tests. Note, that subsequent
        runs will add new reports to the existing list. Note that deprecation violations should only be reported once,
        so you'll have to reload the page to see them again if you clear the list.
      </p>
      <Button text="Simulate violations" onClick={runTests} />
      <Button text="Reset" onClick={reset} />
      <ReportTestIframe ref={iframeRef} key={randomKey} onMessage={onMessage} />
      {reportingObserverResults && <Json data={reportingObserverResults} settings={jsonSettings} />}
    </div>
  );
};
