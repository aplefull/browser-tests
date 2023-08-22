import styles from './styles.module.scss';
import { Button } from '@/app/components/Button/Button';
import { getErrorMessage } from '@/utils/utils';
import { useState } from 'react';
import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';

type TGeolocationData = {
  latitude?: number;
  longitude?: number;
  country?: string;
  city?: string;
  error?: string;
};

type TGeolocationResponse = {
  address?: {
    country?: string;
    city?: string;
  };
  error?: string;
};

export const NavigatorGeolocation = () => {
  const [geolocationData, setGeolocationData] = useState<TGeolocationData | null>(null);

  const onSuccess = async (position: GeolocationPosition) => {
    const { coords } = position;
    const { latitude, longitude } = coords;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      );
      const data: TGeolocationResponse = await response.json();

      if (data.error) {
        setGeolocationData({
          latitude,
          longitude,
          error: `${data.error}. Where the hell are you?`,
        });

        return;
      }

      if (!data.address) {
        setGeolocationData({
          latitude,
          longitude,
          error: 'Where the hell are you?',
        });

        return;
      }

      setGeolocationData({
        latitude,
        longitude,
        city: data.address.city,
        country: data.address.country,
      });
    } catch (error) {
      setGeolocationData({
        error: getErrorMessage(error),
      });
    }
  };

  const onError = (error: GeolocationPositionError) => {
    setGeolocationData({
      error: error.message,
    });
  };

  const testGeolocation = async () => {
    const geolocation = navigator.geolocation;

    if (!geolocation || !geolocation.getCurrentPosition) {
      setGeolocationData({
        error: 'Geolocation is not supported',
      });

      return;
    }

    geolocation.getCurrentPosition(onSuccess, onError);
  };

  const getLocationString = (data: TGeolocationData) => {
    if (data.error) return '';

    const { city, country } = data;

    if (!city && !country) return 'You are in the middle of nowhere';

    if (!city) return `You are in ${country} :^)`;

    return `You are in ${city}, ${country} :^)`;
  };

  return (
    <div className={styles.geolocation}>
      <h2>Geolocation</h2>
      <Button text="Run" onClick={testGeolocation} />
      {geolocationData && (
        <>
          <pre>
            <Json
              data={{
                ...(geolocationData.longitude ? { longitude: geolocationData.longitude } : {}),
                ...(geolocationData.latitude ? { latitude: geolocationData.latitude } : {}),
                ...(geolocationData.error ? { error: geolocationData.error } : {}),
              }}
            />
          </pre>
          <span>{getLocationString(geolocationData)}</span>
        </>
      )}
    </div>
  );
};
