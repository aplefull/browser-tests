import { BROADCAST_CHANNEL_ID } from '@/utils/constants';
import { isServiceWorkerGlobalScope } from '@utils';

const broadcast = new BroadcastChannel(BROADCAST_CHANNEL_ID);
let communicationPort: MessagePort | null = null;

broadcast.addEventListener('message', (event) => {
  if (event.data.type === 'BROADCAST_CHANNEL_API_REQUEST') {
    broadcast.postMessage({ result: '200', type: 'BROADCAST_CHANNEL_API_RESPONSE' });
  }
});

if (isServiceWorkerGlobalScope(self)) {
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
      if (isServiceWorkerGlobalScope(self)) {
        self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
          clients[0]?.postMessage({ result: '200', type: 'CLIENT_API' });
        });
      }

      return;
    }
  });

  self.addEventListener('install', (event: ExtendableEvent) => {
    if (isServiceWorkerGlobalScope(self)) {
      event.waitUntil(self.skipWaiting());
    }
  });

  self.addEventListener('activate', (event: ExtendableEvent) => {
    if (isServiceWorkerGlobalScope(self)) {
      event.waitUntil(self.clients.claim());
    }
  });
}
