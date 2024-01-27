const reportingObserverSettings = {
  buffered: true,
  types: ['csp-violation', 'deprecation', 'intervention', 'crash'],
};

const reportingObserver = new ReportingObserver((list: Report[]) => {
  const report = list[0];

  // TODO use getReportBody from ReportingObserver if it's possible to import
  // TODO send array of reports instead of one
  if (report.type === 'csp-violation') {
    const data = {
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

    window.parent.postMessage({ type: 'iframe-report', report: [data] }, '*');
  }
}, reportingObserverSettings);

reportingObserver.observe();
