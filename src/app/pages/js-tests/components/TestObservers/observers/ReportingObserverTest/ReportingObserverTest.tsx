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
  request.open('GET', window.location.href, false);
  request.send(null);
};

export const getReportData = (report: Report): TReport => {
  const reportType = report.type ?? 'unknown';

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
      url: report.url ?? '',
    };
  }

  return {
    type: reportType,
    url: report.url ?? '',
    body: report.body ? JSON.parse(JSON.stringify(report.body)) : null,
  };
};

const updater = (reports: Report[]) => (prevState: TReportingObserverResults | null) => {
  const nextState: TReportingObserverResults = { ...prevState };

  reports.forEach((report) => {
    const type = report.type ?? 'unknown';
    nextState[type] = [...(nextState[type] ?? []), getReportData(report)];
  });

  return nextState;
};

export const ReportingObserverTest = () => {
  const [unsupported, setUnsupported] = useState(false);
  const [reportingObserverResults, setReportingObserverResults] = useState<TReportingObserverResults | null>(null);

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
      <p>Expected: 1 deprecation report (once per page load)</p>
      <Button text="Simulate violation" onClick={runDeprecation} />
      <Button text="Reset" onClick={reset} />
      {reportingObserverResults && <Json data={reportingObserverResults} settings={jsonSettings} />}
    </div>
  );
};
