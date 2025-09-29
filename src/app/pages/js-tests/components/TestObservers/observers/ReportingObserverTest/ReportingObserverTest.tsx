import styles from './styles.module.scss';
import { Button } from '@/app/components/Button/Button';
import { useEffect, useState } from 'react';
import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';

type TReport = {
  type: string;
  url: string;
  body: Omit<ReportBody, 'toJSON'> | null;
};

type TReportingObserverResults = Record<string, (TReport | null)[]>;

const runDeprecation = () => {
  const request = new XMLHttpRequest();
  request.open('GET', 'https://api.spacexdata.com/v5/launches/latest', false);
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

export const getReportData = (report: Report): TReport => {
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

  return {
    type: report.type,
    url: report.url,
    body: report.body?.toJSON() || JSON.parse(JSON.stringify(report.body)) || null,
  };
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

export const ReportingObserverTest = () => {
  const [unsupported, setUnsupported] = useState(false);
  const [reportingObserverResults, setReportingObserverResults] = useState<TReportingObserverResults | null>(null);

  const runTests = async () => {
    await runDeprecation();
  };

  const reset = () => {
    setReportingObserverResults(null);
  };

  useEffect(() => {
    const onReport = (list: Report[]) => {
      setReportingObserverResults(updater(list));
    };

    const reportingObserverSettings = {
      buffered: true,
      types: ['deprecation', 'intervention', 'crash'],
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
        There should be 2 deprecation reports after running the tests. Note that deprecation violations should only be
        reported once, so you'll have to reload the page to see them again if you clear the list.
      </p>
      <Button text="Simulate violations" onClick={runTests} />
      <Button text="Reset" onClick={reset} />
      {reportingObserverResults && <Json data={reportingObserverResults} settings={jsonSettings} />}
    </div>
  );
};
