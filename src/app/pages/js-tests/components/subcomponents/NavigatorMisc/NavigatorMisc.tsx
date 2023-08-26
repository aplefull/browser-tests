import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';
import { useEffect, useState } from 'react';

export const NavigatorMisc = () => {
  const [data, setData] = useState({});

  const getData = () => ({
    cookieEnabled: navigator.cookieEnabled,
    deviceMemory: navigator.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    language: navigator.language,
    languages: navigator.languages,
    maxTouchPoints: navigator.maxTouchPoints,
    onLine: navigator.onLine,
    pdfViewerEnabled: navigator.pdfViewerEnabled,
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    webdriver: navigator.webdriver,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setData(getData());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <h2>Miscellaneous properties</h2>
      {Object.keys(data).length > 0 && <Json data={data} />}
    </div>
  );
};
