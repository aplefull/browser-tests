import styles from './styles.module.scss';
import { Button } from '@/app/components/Button/Button';
import { Checkbox } from '@/app/components/Checkbox/Checkbox';
import { useState } from 'react';
import { Container } from '@/app/components/Container/Container';
import { ErrorMessage } from '@/app/components/ErrorMessage/ErrorMessage';
import { getErrorMessage } from '@utils';
import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';

export const ContactPicker = () => {
  const [multiple, setMultiple] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Contact[] | null>(null);
  const [supportedProperties, setSupportedProperties] = useState<string[]>([]);

  async function getContacts() {
    try {
      if (!navigator.contacts) {
        setError('Contacts API is not supported.');
        return;
      }

      const opts = { multiple: multiple };

      const properties = await navigator.contacts.getProperties();
      const contacts = await navigator.contacts.select(properties, opts);

      setSupportedProperties(properties);
      setData(contacts);
      setError(null);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }

  return (
    <Container align="start" gap={10} className={styles.container}>
      <Checkbox checked={multiple} onChange={setMultiple} label="Allow multiple contacts" />
      <Button text="Select Contacts" onClick={getContacts} />
      <ErrorMessage message={error} />
      {data && (
        <Json
          data={{
            supportedProperties,
            contacts: data.map((el) => {
              const address = (el.address || []).map(
                ({
                  addressLine,
                  country,
                  city,
                  dependentLocality,
                  organization,
                  phone,
                  postalCode,
                  recipient,
                  region,
                  sortingCode,
                }) => {
                  return {
                    addressLine,
                    country,
                    city,
                    dependentLocality,
                    organization,
                    phone,
                    postalCode,
                    recipient,
                    region,
                    sortingCode,
                  };
                },
              );

              return { ...el, address };
            }),
          }}
        />
      )}
    </Container>
  );
};
