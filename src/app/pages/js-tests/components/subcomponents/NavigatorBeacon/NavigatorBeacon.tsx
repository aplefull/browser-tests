import { Button } from '@/app/components/Button/Button';
import { useState } from 'react';
import { Input } from '@/app/components/Input/Input';
import { Container } from '@/app/components/Container/Container';

export const NavigatorBeacon = () => {
  const [url, setUrl] = useState('https://webhook.site');
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleClick = () => {
    const data = 'Hello, world!';

    const dataDataView = new DataView(new ArrayBuffer(data.length));
    for (let i = 0; i < data.length; i++) {
      dataDataView.setInt8(i, data.charCodeAt(i));
    }

    const success = navigator.sendBeacon(url, dataDataView);

    setSuccess(success);
  };

  return (
    <Container gap={10} align="start">
      <h2>Beacon API</h2>
      <span>You can use webhook.site to check if beacon request successfully arrived there :^)</span>
      <Input placeholder="Enter url to send beacon to" value={url} onChange={setUrl} />
      {success !== null && <div>Beacon successfully queued</div>}
      <Button text="Send beacon" onClick={handleClick} />
    </Container>
  );
};
