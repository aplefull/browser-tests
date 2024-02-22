import { getReportData } from '@/app/pages/js-tests/components/TestObservers/observers/ReportingObserverTest/ReportingObserverTest';

const reportingObserverSettings = {
  buffered: true,
  types: ['csp-violation', 'deprecation', 'intervention', 'crash'],
};

const onReport = (list: Report[]) => {
  const data = list.map(getReportData);

  window.parent.postMessage({ type: 'iframe-report', report: data }, '*');
};

const reportingObserver = new ReportingObserver(onReport, reportingObserverSettings);

reportingObserver.observe();
