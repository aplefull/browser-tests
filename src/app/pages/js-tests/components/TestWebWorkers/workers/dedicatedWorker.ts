import { QMath } from '@math';

self.onmessage = (event: MessageEvent) => {
  const { data } = event;
  const { value } = data;

  const doHeavyWork = () => {
    let sum = 0;
    for (let i = -100_000_000; i < 100_000_000; i++) {
      sum += QMath.sin(QMath.cos(i));
    }

    return sum;
  };

  doHeavyWork();

  if (QMath.erf(value) === 1) {
    self.postMessage({ result: '200' });
  } else {
    self.postMessage({ result: 'Worker appears to be ok, but computation is wrong for some reason...' });
  }
};
