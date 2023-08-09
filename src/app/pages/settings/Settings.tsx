import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/redux/store';
import { ChangeEvent } from 'react';
import { setPreferUnmount } from '@/app/redux/slices/settings';
import { DROPDOWN_STATE } from '@/utils/constants';

export const Settings = () => {
  const { preferUnmount, dropdowns } = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch<AppDispatch>();

  const handlePreferUnmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setPreferUnmount(event.target.checked));
  };

  return (
    <div>
      <h1>WIP</h1>
      <div>
        <label>
          Remove children from the dom when collapse is closed
          <input type="checkbox" checked={preferUnmount} onChange={handlePreferUnmountChange} />
        </label>
      </div>
      <div>
        <h2>Initial dropdowns states</h2>
        <div className={styles.dropdownsGrid}>
          {Object.entries(dropdowns.pages).map(([page, values]) => {
            return (
              <div key={page} className={styles.column}>
                <p>{page}</p>
                <div className={styles.columnContent}>
                  {values.map((value) => {
                    return (
                      <label>
                        {value.name}
                        <input type="checkbox" checked={value.initialState === DROPDOWN_STATE.OPEN} />
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
