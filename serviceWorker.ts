import { BROADCAST_CHANNEL_ID } from './src/app/pages/js-tests/components/TestWebWorkers/workers/constants';

declare const self: ServiceWorkerGlobalScope;

const broadcast = new BroadcastChannel(BROADCAST_CHANNEL_ID);
let communicationPort: MessagePort | null = null;

broadcast.addEventListener('message', (event) => {
  if (event.data.type === 'BROADCAST_CHANNEL_API_REQUEST') {
    broadcast.postMessage({ result: '200', type: 'BROADCAST_CHANNEL_API_RESPONSE' });
  }
});

self.addEventListener('message', (event) => {
  const { data } = event;
  const { type } = data;

  if (type === 'MESSAGE_CHANNEL_PORT') {
    communicationPort = event.ports[0];

    communicationPort.addEventListener('message', (event) => {
      if (event.data.type === 'MESSAGE_CHANNEL') {
        communicationPort?.postMessage({ result: '200', type: 'MESSAGE_CHANNEL' });
      }
    });

    communicationPort.start();
    communicationPort.postMessage({ type: 'MESSAGE_CHANNEL_READY' });

    return;
  }

  if (type === 'CLIENT_API') {
    self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
      clients[0]?.postMessage({ result: '200', type: 'CLIENT_API' });
    });
  }
});

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
