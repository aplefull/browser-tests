import { Button } from '@/app/components/Button/Button';
import { getErrorMessage } from '@/utils/utils';
import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';

type TMediaConstraintsData = {
  constraints?: MediaTrackSupportedConstraints;
  error?: string;
};

type TMediaDevicesData = {
  devices?: {
    readonly deviceId: string;
    readonly groupId: string;
    readonly kind: MediaDeviceKind;
    readonly label: string;
  }[];
  error?: string;
};

type TCaptureData = {
  url?: string;
  error?: string;
};

type TFrameCaptureData = {
  url?: ImageBitmap;
  error?: string;
};

export const NavigatorMediaDevices = () => {
  const [mediaConstraintsData, setMediaConstraintsData] = useState<TMediaConstraintsData | null>(null);
  const [mediaDevicesData, setMediaDevicesData] = useState<TMediaDevicesData | null>(null);
  const [screenCaptureUrl, setScreenCaptureUrl] = useState<TCaptureData | null>(null);
  const [cameraCaptureUrl, setCameraCaptureUrl] = useState<TCaptureData | null>(null);
  const [photoCaptureUrl, setPhotoCaptureUrl] = useState<TCaptureData | null>(null);
  const [frameCaptureUrl, setFrameCaptureUrl] = useState<TFrameCaptureData | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const recordMediaSample = async (stream: MediaStream) => {
    return new Promise<string>((resolve, reject) => {
      try {
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);

          resolve(url);
        };

        recorder.onerror = (error) => {
          reject(error);
        };

        recorder.start();

        setTimeout(() => {
          recorder.stop();
        }, 10000);

        setTimeout(() => {
          stream.getTracks().forEach((track) => track.stop());
        }, 11000);
      } catch (error) {
        reject(error);
      }
    });
  };

  const testSupportedConstraints = () => {
    try {
      const constraints = navigator.mediaDevices.getSupportedConstraints();

      setMediaConstraintsData({
        constraints,
      });
    } catch (error) {
      setMediaConstraintsData({
        error: getErrorMessage(error),
      });
    }
  };

  const testEnumerateDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      setMediaDevicesData({
        devices: devices.map((device) => ({
          deviceId: device.deviceId,
          groupId: device.groupId,
          kind: device.kind,
          label: device.label,
        })),
      });
    } catch (error) {
      setMediaDevicesData({
        error: getErrorMessage(error),
      });
    }
  };

  const testScreenCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const url = await recordMediaSample(stream);
      setScreenCaptureUrl({
        url,
      });
    } catch (error) {
      setScreenCaptureUrl({
        error: getErrorMessage(error),
      });
    }
  };

  const testCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { min: 1280, ideal: 1920 },
          height: { min: 720, ideal: 1080 },
        },
        audio: true,
      });

      const url = await recordMediaSample(stream);
      setCameraCaptureUrl({
        url,
      });
    } catch (error) {
      setCameraCaptureUrl({
        error: getErrorMessage(error),
      });
    }
  };

  const testImageCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { min: 1280, ideal: 1920 },
          height: { min: 720, ideal: 1080 },
        },
      });

      const track = stream.getVideoTracks()[0];

      if (!track) {
        throw new Error('No video track');
      }

      const imageCapture = new ImageCapture(track);
      const photoSettings = await imageCapture.getPhotoSettings();

      const photo = await imageCapture.takePhoto(photoSettings);
      const photoUrl = URL.createObjectURL(photo);

      const frame = await imageCapture.grabFrame();

      setPhotoCaptureUrl({
        url: photoUrl,
      });

      setFrameCaptureUrl({
        url: frame,
      });
    } catch (error) {
      setPhotoCaptureUrl({
        error: getErrorMessage(error),
      });

      setFrameCaptureUrl({
        error: getErrorMessage(error),
      });
    }
  };

  const testMediaDevices = async () => {
    const mediaDevices = navigator.mediaDevices;

    if (!mediaDevices || !mediaDevices.enumerateDevices) {
      setMediaDevicesData({
        error: 'Media devices are not supported',
      });

      return;
    }

    testSupportedConstraints();
    await testEnumerateDevices();
    await testScreenCapture();
    await testCameraCapture();
    await testImageCapture();
  };

  useEffect(() => {
    if (!frameCaptureUrl?.url || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    if (!ctx) return;

    const aspectRatio = frameCaptureUrl.url.width / frameCaptureUrl.url.height;
    const width = 300;
    const height = width / aspectRatio;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    canvasRef.current.style.width = `${width}px`;
    canvasRef.current.style.height = `${height}px`;

    ctx.drawImage(frameCaptureUrl.url, 0, 0, width, height);
  }, [frameCaptureUrl]);

  return (
    <div>
      <h2>Media devices</h2>
      <Button text="Run" onClick={testMediaDevices} />
      <div className={styles.mediaDevices}>
        {mediaConstraintsData && (
          <>
            <p>Media constraints:</p>
            <pre>
              <Json data={mediaConstraintsData} />
            </pre>
          </>
        )}
        {mediaDevicesData && (
          <>
            <p>Media devices:</p>
            <pre>
              <Json data={mediaDevicesData} />
            </pre>
          </>
        )}
        {screenCaptureUrl && <p>Screen capture:</p>}
        {screenCaptureUrl?.url && <video src={screenCaptureUrl.url} controls />}
        {screenCaptureUrl?.error && <span className={styles.error}>{screenCaptureUrl.error}</span>}
        {cameraCaptureUrl && <p>Camera capture:</p>}
        {cameraCaptureUrl?.url && <video src={cameraCaptureUrl.url} controls />}
        {cameraCaptureUrl?.error && <span className={styles.error}>{cameraCaptureUrl.error}</span>}
        {photoCaptureUrl && <p>Photo capture:</p>}
        {photoCaptureUrl?.url && <img src={photoCaptureUrl.url} alt="selfie" />}
        {photoCaptureUrl?.error && <span className={styles.error}>{photoCaptureUrl.error}</span>}
        {frameCaptureUrl && <p>Frame capture:</p>}
        {frameCaptureUrl?.url && <canvas width={300} height={(9 / 16) * 100} ref={canvasRef} />}
        {frameCaptureUrl?.error && <span className={styles.error}>{frameCaptureUrl.error}</span>}
      </div>
    </div>
  );
};
