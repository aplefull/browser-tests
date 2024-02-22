import styles from './styles.module.scss';
import { useEffect, useState, RefObject } from 'react';
import { splitIntoChunks } from '@/utils/utils';

type MasonryProps = {
  images: string[];
  containerRef: RefObject<HTMLDivElement>;
};

type RawImageBox = { width: number; height: number; src: string };

type MasonryBox = { width: number; height: number; src: string; x: number; y: number; scale: number };

export const Masonry = ({ images, containerRef }: MasonryProps) => {
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [naturalDimensions, setNaturalDimensions] = useState<RawImageBox[]>([]);

  const columns = 4;
  const rowGap = 10;
  const columnGap = 10;

  const getNaturalDimensions = async (images: string[]): Promise<RawImageBox[]> => {
    return Promise.all(images.map((image) => getImageDimensions(image)));
  };

  const getImageDimensions = async (src: string) => {
    return new Promise<RawImageBox>((resolve) => {
      const img = document.createElement('img');

      img.onload = () => {
        const dimensions = {
          width: img.naturalWidth,
          height: img.naturalHeight,
          src: src,
        };

        resolve(dimensions);
      };

      img.onerror = () => {
        resolve({
          width: 0,
          height: 0,
          src: src,
        });
      };

      img.src = src;
    });
  };

  const getMasonryBoxes = (rawImages: RawImageBox[]): MasonryBox[] => {
    if (containerWidth === null) return [];

    // 1. group images by rows and set row height to the first image height
    const groupedByRows: { rowHeight: number; images: RawImageBox[] }[] = splitIntoChunks(rawImages, columns, true).map(
      (images) => ({
        rowHeight: images[0].height,
        images,
      }),
    );

    // 2. recalculate images dimensions to the row height keeping aspect ratio
    const recalculatedImagesDimensions = groupedByRows.map(({ rowHeight, images }) => {
      const recalculatedImagesWidth = images.map((dimensions) => {
        const aspectRatio = dimensions.width / dimensions.height;

        return rowHeight * aspectRatio;
      });

      return {
        rowHeight,
        images: images.map((dimensions, index) => {
          return {
            ...dimensions,
            width: recalculatedImagesWidth[index],
            height: rowHeight,
          };
        }),
      };
    });

    // 3. recalculate images dimensions, so they fit the container width keeping aspect ratio
    const recalculatedImagesDimensionsSecondPass = recalculatedImagesDimensions.map(({ rowHeight, images }) => {
      // 3.1 calculate total row width
      const totalRowWidth = images.reduce((acc, dimensions) => acc + dimensions.width, 0);

      // 3.2 calculate new row height
      const newRowHeight = ((containerWidth - (images.length - 1) * columnGap) * rowHeight) / totalRowWidth;

      // 3.3 calculate new images dimensions
      const finalImagesDimensions = images.map((dimensions) => {
        const aspectRatio = dimensions.width / dimensions.height;

        return {
          ...dimensions,
          width: newRowHeight * aspectRatio,
          height: newRowHeight,
        };
      });

      return {
        rowHeight: newRowHeight,
        images: finalImagesDimensions,
      };
    });

    // 4. calculate images x and y positions
    const imagesRects = recalculatedImagesDimensionsSecondPass.map(({ images }, rowIndex) => {
      return images.map((dimensions, columnIndex) => {
        // 4.1 calculate x position by summing all previous images widths
        const x =
          [...images].slice(0, columnIndex).reduce((acc, dimensions) => acc + dimensions.width, 0) +
          columnGap * columnIndex;

        // 4.2 calculate y position by summing all previous rows heights
        const y =
          [...recalculatedImagesDimensionsSecondPass]
            .slice(0, rowIndex)
            .reduce((acc, { rowHeight }) => acc + rowHeight, 0) +
          rowGap * rowIndex;

        // 4.3 calculate scale, based on original image width
        const naturalWidth = naturalDimensions.find((image) => image.src === dimensions.src)?.width || 0;

        const minWidth = Math.min(containerWidth, naturalWidth);

        const scale = dimensions.width / minWidth;

        return {
          ...dimensions,
          x,
          y,
          scale,
        };
      });
    });

    return imagesRects.flat();
  };

  const getContainerHeight = (masonryBoxes: MasonryBox[]) => {
    if (masonryBoxes.length === 0) return 0;

    return masonryBoxes[masonryBoxes.length - 1].y + masonryBoxes[masonryBoxes.length - 1].height;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const boundingRect = entries[0].contentRect;
      setContainerWidth(boundingRect.width);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    getNaturalDimensions(images).then((dimensions) => {
      setNaturalDimensions(dimensions);
    });
  }, [images]);

  const readyToRender = containerWidth !== null && naturalDimensions.length > 0;

  const masonryBoxes = readyToRender
    ? getMasonryBoxes(naturalDimensions.filter((image) => image.width > 0 && image.height > 0))
    : [];
  const containerHeight = getContainerHeight(masonryBoxes);

  return (
    <div className={styles.masonryContainer} style={{ height: containerHeight }}>
      {readyToRender &&
        masonryBoxes.map(({ src, x, y, scale }, index) => {
          const transform = `translate(${x}px, ${y}px) scale(${scale})`;

          return (
            <div key={index} className={styles.item} style={{ transform }}>
              <img src={src} alt={src} />
            </div>
          );
        })}
    </div>
  );
};
