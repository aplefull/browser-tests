import styles from './styles.module.scss';
import dedicatedWorker from './workers/dedicatedWorker?script';
import sharedWorker from './workers/sharedWorker?script';
import serviceWorker from '../../../../../../serviceWorker?script';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/utils/utils';
import { BROADCAST_CHANNEL_ID } from '@/utils/constants';

type TServiceWorkerResult = {
  clientApi: string | null;
  broadcastChannelApi: string | null;
  messageChannelApi: string | null;
};

type TMessageEvent = MessageEvent<{ result: string; type: string }>;

const testClientApi = async (registration?: ServiceWorkerRegistration) => {
  return new Promise<string>((resolve) => {
    if (!registration || registration.active === null || registration.active === undefined) {
      resolve('Service worker is not registered');
      return;
    }

    try {
      registration.active.postMessage({ type: 'CLIENT_API' });

      const onMessage = (event: TMessageEvent) => {
        if (event.data.type === 'CLIENT_API') {
          resolve(event.data.result);
          navigator.serviceWorker.removeEventListener('message', onMessage);
        }
      };

      navigator.serviceWorker.addEventListener('message', onMessage);
    } catch (error) {
      resolve(getErrorMessage(error));
    }
  });
};

const testBroadcastChannelApi = async () => {
  return new Promise<string>((resolve) => {
    try {
      const broadcast = new BroadcastChannel(BROADCAST_CHANNEL_ID);

      broadcast.postMessage({ type: 'BROADCAST_CHANNEL_API_REQUEST' });

      const onMessage = (event: TMessageEvent) => {
        if (event.data.type === 'BROADCAST_CHANNEL_API_RESPONSE') {
          resolve(event.data.result);
          broadcast.close();
          broadcast.removeEventListener('message', onMessage);
        }
      };

      broadcast.addEventListener('message', onMessage);
    } catch (error) {
      resolve(getErrorMessage(error));
    }
  });
};

const testMessageChannelApi = async (registration?: ServiceWorkerRegistration) => {
  return new Promise<string>((resolve) => {
    if (!registration || registration.active === null || registration.active === undefined) {
      resolve('Service worker is not registered [This message is from service worker]');
      return;
    }

    try {
      const messageChannel = new MessageChannel();

      const onMessage = (event: TMessageEvent) => {
        if (event.data.type === 'MESSAGE_CHANNEL') {
          resolve(event.data.result);
          navigator.serviceWorker.removeEventListener('message', onMessage);
        }

        if (event.data.type === 'MESSAGE_CHANNEL_READY') {
          messageChannel.port1.postMessage({ type: 'MESSAGE_CHANNEL' });
        }
      };

      messageChannel.port1.addEventListener('message', onMessage);
      messageChannel.port1.start();

      registration.active.postMessage({ type: 'MESSAGE_CHANNEL_PORT' }, [messageChannel.port2]);
    } catch (error) {
      resolve(getErrorMessage(error));
    }
  });
};

const unregisterAllServiceWorkers = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();

  registrations.forEach((registration) => {
    registration.unregister();
  });
};

export const TestWebWorkers = () => {
  const [dedicatedWorkerResult, setDedicatedWorkerResult] = useState<string | null>(null);
  const [sharedWorkerResult, setSharedWorkerResult] = useState<string | null>(null);
  const [serviceWorkerResult, setServiceWorkerResult] = useState<TServiceWorkerResult>({
    clientApi: null,
    broadcastChannelApi: null,
    messageChannelApi: null,
  });

  const getResult = (value: string | null, message?: string) => {
    if (value === null) {
      return <span>Working...</span>;
    }

    if (value === '200') {
      return <span className={styles.success}>{message}</span>;
    }

    return <span className={styles.error}>{value}</span>;
  };

  useEffect(() => {
    const testDedicatedWorker = async () => {
      const dedicatedWorkerInstance = new Worker(dedicatedWorker, {
        type: 'module',
      });

      const onMessage = (event: TMessageEvent) => {
        setDedicatedWorkerResult(event.data.result);
        dedicatedWorkerInstance.removeEventListener('message', onMessage);
        dedicatedWorkerInstance.terminate();
      };

      dedicatedWorkerInstance.addEventListener('message', onMessage);
      dedicatedWorkerInstance.postMessage({ value: 10 });
    };

    const testSharedWorker = async () => {
      const sharedWorkerInstance = new SharedWorker(sharedWorker, {
        type: 'module',
      });

      const onMessage = (event: TMessageEvent) => {
        setSharedWorkerResult(event.data.result);
        sharedWorkerInstance.port.removeEventListener('message', onMessage);
        sharedWorkerInstance.port.close();
      };

      sharedWorkerInstance.port.addEventListener('message', onMessage);
      sharedWorkerInstance.port.start();
      sharedWorkerInstance.port.postMessage('Hi');
    };

    const testServiceWorker = async () => {
      const registration = await navigator.serviceWorker.register(serviceWorker, {
        type: 'module',
      });

      await navigator.serviceWorker.ready;

      const clientApiResult = await testClientApi(registration);
      const broadcastChannelApiResult = await testBroadcastChannelApi();
      const messageChannelApiResult = await testMessageChannelApi(registration);

      setServiceWorkerResult({
        clientApi: clientApiResult,
        broadcastChannelApi: broadcastChannelApiResult,
        messageChannelApi: messageChannelApiResult,
      });

      await registration.unregister();
    };

    testDedicatedWorker().catch(console.error);
    testSharedWorker().catch(console.error);
    testServiceWorker().catch(console.error);

    return () => {
      unregisterAllServiceWorkers().catch(console.error);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', unregisterAllServiceWorkers);

    return () => window.removeEventListener('beforeunload', unregisterAllServiceWorkers);
  }, []);

  return (
    <div className={styles.container}>
      <h2>Dedicated web worker</h2>
      {getResult(dedicatedWorkerResult, 'Pass')}
      <h2>Shared web worker</h2>
      {getResult(sharedWorkerResult, 'Pass')}
      <h2>Service worker</h2>
      <div className={styles.serviceWorkerResults}>
        {getResult(serviceWorkerResult.clientApi, 'Client API works!')}
        {getResult(serviceWorkerResult.broadcastChannelApi, 'Broadcast channel API works!')}
        {getResult(serviceWorkerResult.messageChannelApi, 'Message channel API works!')}
      </div>
    </div>
  );
};
