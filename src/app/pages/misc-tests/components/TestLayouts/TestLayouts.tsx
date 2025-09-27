import styles from './layouts.module.scss';
import React, { Fragment, useMemo, useState } from 'react';
import classNames from 'classnames';
import { CSSMasonry } from '@/app/pages/misc-tests/components/subcomponents/CSSMasonry/CSSMasonry';
import { TImageModule } from '@/types';
import { JSMasonry } from '@/app/pages/misc-tests/components/subcomponents/JSMasonry/JSMasonry';
import { Select } from '@/app/components/Select/Select';

const images = import.meta.glob<TImageModule>('/src/assets/images/masonry_images/*.*', { eager: true });

const generateVideoData = (count: number) => {
  const containerFormats = {
    '.mp4': { videoCodecs: ['h264', 'hevc', 'av1'], audioCodecs: ['aac', 'ac3'] },
    '.avi': { videoCodecs: ['h264', 'mpeg4', 'h263'], audioCodecs: ['mp3', 'ac3', 'pcm_s16le'] },
    '.mkv': { videoCodecs: ['h264', 'hevc', 'vp9', 'av1'], audioCodecs: ['aac', 'opus', 'flac', 'ac3'] },
    '.mov': { videoCodecs: ['h264', 'hevc'], audioCodecs: ['aac', 'pcm_s16le'] },
    '.webm': { videoCodecs: ['vp9', 'vp8', 'av1'], audioCodecs: ['opus', 'vorbis'] },
    '.flv': { videoCodecs: ['h264', 'h263'], audioCodecs: ['aac', 'mp3'] },
    '.wmv': { videoCodecs: ['wmv3', 'mpeg4'], audioCodecs: ['wmav2', 'mp3'] },
    '.mpg': { videoCodecs: ['mpeg2video', 'mpeg4'], audioCodecs: ['mp3', 'ac3'] },
    '.mpeg': { videoCodecs: ['mpeg2video', 'mpeg4'], audioCodecs: ['mp3', 'ac3'] },
    '.3gp': { videoCodecs: ['h264', 'h263'], audioCodecs: ['aac', 'amr'] },
    '.ts': { videoCodecs: ['h264', 'hevc'], audioCodecs: ['aac', 'ac3'] },
    '.vob': { videoCodecs: ['mpeg2video'], audioCodecs: ['ac3', 'mp3'] },
  };

  const resolutions = [
    { width: 3840, height: 2160, name: '3840x2160' },
    { width: 2560, height: 1440, name: '2560x1440' },
    { width: 1920, height: 1080, name: '1920x1080' },
    { width: 1280, height: 720, name: '1280x720' },
    { width: 854, height: 480, name: '854x480' },
    { width: 640, height: 360, name: '640x360' },
    { width: 1080, height: 1920, name: '1080x1920' },
    { width: 720, height: 1280, name: '720x1280' },
    { width: 540, height: 960, name: '540x960' },
    { width: 360, height: 480, name: '360x480' },
  ];

  const frameRates = [23.976, 24, 25, 29.97, 30, 50, 59.94, 60];

  const generateRandomName = () => {
    const baseChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
    let name = '';
    const length = Math.floor(Math.random() * 30) + 10;

    for (let i = 0; i < length; i++) {
      name += baseChars[Math.floor(Math.random() * baseChars.length)];
    }
    return name;
  };

  const calculateBitrate = (resolution: (typeof resolutions)[0], fps: number, codec: string) => {
    let bitrate = 0;

    if (resolution.width >= 3840) {
      if (codec === 'hevc' || codec === 'av1') {
        bitrate = Math.floor(Math.random() * 20000) + 15000;
      } else if (codec === 'h264') {
        bitrate = Math.floor(Math.random() * 30000) + 25000;
      } else {
        bitrate = Math.floor(Math.random() * 40000) + 35000;
      }
    } else if (resolution.width >= 2560) {
      if (codec === 'hevc' || codec === 'av1') {
        bitrate = Math.floor(Math.random() * 8000) + 6000;
      } else if (codec === 'h264') {
        bitrate = Math.floor(Math.random() * 12000) + 8000;
      } else {
        bitrate = Math.floor(Math.random() * 15000) + 12000;
      }
    } else if (resolution.width >= 1920) {
      if (codec === 'hevc' || codec === 'av1') {
        bitrate = Math.floor(Math.random() * 4000) + 3000;
      } else if (codec === 'h264') {
        bitrate = Math.floor(Math.random() * 6000) + 4000;
      } else {
        bitrate = Math.floor(Math.random() * 8000) + 6000;
      }
    } else if (resolution.width >= 1280) {
      if (codec === 'hevc' || codec === 'av1') {
        bitrate = Math.floor(Math.random() * 2000) + 1500;
      } else if (codec === 'h264') {
        bitrate = Math.floor(Math.random() * 3000) + 2500;
      } else {
        bitrate = Math.floor(Math.random() * 4000) + 3000;
      }
    } else {
      if (codec === 'hevc' || codec === 'av1') {
        bitrate = Math.floor(Math.random() * 800) + 500;
      } else if (codec === 'h264') {
        bitrate = Math.floor(Math.random() * 1200) + 800;
      } else {
        bitrate = Math.floor(Math.random() * 1500) + 1000;
      }
    }

    const fpsMultiplier = fps > 30 ? 1.3 + (fps - 30) * 0.02 : 1;

    return Math.round(bitrate * fpsMultiplier);
  };

  const generateDuration = () => {
    const totalSeconds = Math.floor(Math.random() * 10770) + 30;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      totalSeconds,
    };
  };

  const calculateFileSize = (bitrate: number, audioBitrate: number, duration: number) => {
    const totalBitrate = bitrate + audioBitrate;
    const sizeInBytes = (totalBitrate * 1000 * duration) / 8;
    const sizeInMB = sizeInBytes / (1024 * 1024);

    return sizeInMB;
  };

  const data = [];

  for (let i = 0; i < count; i++) {
    const extensions = Object.keys(containerFormats);
    const ext = extensions[Math.floor(Math.random() * extensions.length)];
    const format = containerFormats[ext as keyof typeof containerFormats];

    const resolution = resolutions[Math.floor(Math.random() * resolutions.length)];
    const fps = frameRates[Math.floor(Math.random() * frameRates.length)];
    const videoCodec = format.videoCodecs[Math.floor(Math.random() * format.videoCodecs.length)];
    const audioCodec = format.audioCodecs[Math.floor(Math.random() * format.audioCodecs.length)];

    const duration = generateDuration();
    const videoBitrate = calculateBitrate(resolution, fps, videoCodec);

    const audioBitrate =
      audioCodec === 'flac' || audioCodec === 'pcm_s16le'
        ? Math.floor(Math.random() * 1000) + 500
        : Math.floor(Math.random() * 256) + 64;

    const fileSizeMB = calculateFileSize(videoBitrate, audioBitrate, duration.totalSeconds);

    const size = fileSizeMB > 1000 ? `${(fileSizeMB / 1000).toFixed(2)} GB` : `${fileSizeMB.toFixed(2)} MB`;

    data.push({
      name: generateRandomName() + ext,
      size,
      resolution: resolution.name,
      duration: duration.formatted,
      fps: `${fps.toFixed(2)} fps`,
      bitrate: `${videoBitrate.toFixed(2)} kb/s`,
      extension: ext,
      codec_v: videoCodec,
      codec_a: audioCodec,
    });
  }

  return data;
};

const LargeTable = ({ headCaptions, data }: { headCaptions: string[]; data: ReturnType<typeof generateVideoData> }) => {
  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            {headCaptions.map((caption, i) => {
              return <th key={i}>{caption}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            return (
              <tr key={i}>
                {Object.values(row).map((value, i) => {
                  const actualValue = value === null ? 'n/a' : value;

                  return <td key={i}>{actualValue}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const LargeGrid = ({ headCaptions, data }: { headCaptions: string[]; data: ReturnType<typeof generateVideoData> }) => {
  return (
    <div className={styles.gridContainer}>
      <div className={styles.grid}>
        {headCaptions.map((caption, i) => {
          return (
            <div key={i} className={styles.headerCell}>
              {caption}
            </div>
          );
        })}
        {data.map((row, i) => {
          return (
            <Fragment key={i}>
              {Object.values(row).map((value, j) => {
                const actualValue = value === null ? 'n/a' : value;

                return (
                  <div
                    key={j}
                    className={classNames(styles.bodyCell, {
                      [styles.odd]: i % 2 === 0,
                    })}
                  >
                    {actualValue}
                  </div>
                );
              })}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

const LAYOUTS = {
  CSS_MASONRY: 'CSS masonry',
  JS_MASONRY: 'JS masonry',
  LARGE_TABLE: 'Large table',
  LARGE_GRID: 'Large grid',
};

const headCaptions = [
  'Name',
  'Size',
  'Resolution',
  'Duration',
  'Fps',
  'Bitrate',
  'Extension',
  'Video codec',
  'Audio codec',
];

const Layout = ({ name, data }: { name: string; data: ReturnType<typeof generateVideoData> }) => {
  const getLayout = (name: string) => {
    switch (name) {
      case LAYOUTS.CSS_MASONRY:
        return <CSSMasonry urls={Object.values(images).map((image) => image.default)} />;
      case LAYOUTS.JS_MASONRY:
        return (
          <JSMasonry className={styles.jsMasonryContainer} urls={Object.values(images).map((image) => image.default)} />
        );
      case LAYOUTS.LARGE_TABLE:
        return <LargeTable headCaptions={headCaptions} data={data} />;
      case LAYOUTS.LARGE_GRID:
        return <LargeGrid headCaptions={headCaptions} data={data} />;
    }

    return null;
  };

  const getDesc = (layout: string) => {
    switch (layout) {
      case LAYOUTS.CSS_MASONRY:
        return 'Simple css masonry';
      case LAYOUTS.JS_MASONRY:
        return 'JS masonry';
      case LAYOUTS.LARGE_TABLE:
        return 'A lot of data displayed using <table>';
      case LAYOUTS.LARGE_GRID:
        return 'Same data displayed using divs and grid layout';
    }
  };

  return (
    <>
      <h2>{getDesc(name)}</h2>
      {getLayout(name)}
    </>
  );
};

export const TestLayouts = () => {
  const [layout, setLayout] = useState(LAYOUTS.CSS_MASONRY);

  const imagePaths = useMemo(() => {
    return Object.values(images).map((image) => image.default);
  }, [images]);

  const tableData = useMemo(() => generateVideoData(2637), []);

  const urls = [];
  for (let i = 1; i <= 100; i++) {
    const url = imagePaths[Math.floor(Math.random() * imagePaths.length)];
    urls.push(url);
  }

  return (
    <div className={styles.testLayouts}>
      <Select options={Object.values(LAYOUTS)} value={layout} onChange={setLayout} />
      <Layout name={layout} data={tableData} />
    </div>
  );
};
