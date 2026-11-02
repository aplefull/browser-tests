declare const self: SharedWorkerGlobalScope;

self.onconnect = (event) => {
  const port = event.ports[0];

  port.onmessage = () => {
    port.postMessage({
      result: '200',
      type: 'SHARED_WORKER_API',
    });
  };
};

export {};
