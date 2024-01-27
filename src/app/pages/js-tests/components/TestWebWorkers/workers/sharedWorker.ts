import { isSharedWorkerGlobalScope } from '@utils';

if (isSharedWorkerGlobalScope(self)) {
  self.onconnect = (event: MessageEvent) => {
    const port = event.ports[0];

    port.onmessage = () => {
      port.postMessage({
        result: '200',
        type: 'SHARED_WORKER_API',
      });
    };
  };
}
