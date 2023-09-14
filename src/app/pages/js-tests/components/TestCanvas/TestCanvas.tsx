import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { Button } from '@/app/components/Button/Button';
import { reset } from '@/app/pages/js-tests/components/TestCanvas/utils.canvas';
import classNames from 'classnames';
import { Section } from '@/app/components/Section/Section';
import { CanvasShapes } from '@/app/pages/js-tests/components/TestCanvas/subcomponents/CanvasShapes/CanvasShapes';
import { CanvasText } from '@/app/pages/js-tests/components/TestCanvas/subcomponents/CanvasText/CanvasText';
import { CanvasGradients } from '@/app/pages/js-tests/components/TestCanvas/subcomponents/CanvasGradients/CanvasGradients';
import { CanvasClip } from '@/app/pages/js-tests/components/TestCanvas/subcomponents/CanvasClip/CanvasClip';
import { CanvasTransform } from '@/app/pages/js-tests/components/TestCanvas/subcomponents/CanvasTransform/CanvasTransform';
import { CanvasImage } from '@/app/pages/js-tests/components/TestCanvas/subcomponents/CanvasImage/CanvasImage';
import {
  CanvasCompositing
} from '@/app/pages/js-tests/components/TestCanvas/subcomponents/CanvasCompositing/CanvasCompositing';

// TODO that needs a lot of refactoring
export const TestCanvas = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const paused = useRef<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const wait = (ms: number = 1000) =>
    new Promise<void>((resolve) => {
      setTimeout(async () => {
        while (paused.current) {
          await wait(1000);
        }

        resolve();
      }, ms);
    });

  const testGradients = async (ctx: CanvasRenderingContext2D) => {
    await wait(2000);

    await wait(2000);

    await wait(2000);
  };

  const testClip = async (ctx: CanvasRenderingContext2D) => {
    await wait(2000);
  };

  const testTransform = async (ctx: CanvasRenderingContext2D) => {
    await wait();

    await wait();
  };

  const testImage = async (ctx: CanvasRenderingContext2D) => {
    await wait();
  };

  const testCompositing = async (ctx: CanvasRenderingContext2D) => {
    await wait();
  };

  const tests = [
    {
      name: 'Gradients',
      run: testGradients,
    },
    {
      name: 'Clip',
      run: testClip,
    },
    {
      name: 'Transform',
      run: testTransform,
    },
    {
      name: 'Image',
      run: testImage,
    },
    {
      name: 'Compositing',
      run: testCompositing,
    },
  ];

  const pause = () => {
    paused.current = !paused.current;
    setIsPaused(paused.current);
  };

  const runTests = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    setIsRunning(true);

    for (const test of tests) {
      setCurrentTest(test.name);
      await test.run(ctx);
      await wait();
      reset(ctx);
    }

    setCurrentTest(null);
    setIsRunning(false);
  };

  const handleRunTest = (testName: string) => async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRunning(true);
    setCurrentTest(testName);

    const test = tests.find((t) => t.name === testName);
    if (!test) {
      setIsRunning(false);
      return;
    }

    await test.run(ctx);
    await wait();
    reset(ctx);

    setCurrentTest(null);
    setIsRunning(false);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    });

    resizeObserver.observe(canvasRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const currentTestName = `Current test: ${currentTest || 'none'}`;

  return (
    <Section className={styles.canvasContainer} title="Canvas features">
      <div>
        <h2>Shapes</h2>
        <CanvasShapes />
        <h2>Text</h2>
        <CanvasText />
        <h2>Gradients</h2>
        <CanvasGradients />
        <h2>Clip</h2>
        <CanvasClip />
        <h2>Transform</h2>
        <CanvasTransform />
        <h2>Image</h2>
        <CanvasImage />
        <h2>Compositing</h2>
        <CanvasCompositing />
      </div>
    </Section>
  );
};
