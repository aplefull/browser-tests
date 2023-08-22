import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/redux/store';
import { ChangeEvent } from 'react';
import { setDropdownState, setPreferUnmount } from '@/app/redux/slices/settings';
import { DROPDOWN_STATE } from '@/utils/constants';
import { getPage } from '@/utils/utils';

export const Settings = () => {
  const { preferUnmount, dropdowns } = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch<AppDispatch>();

  const handlePreferUnmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setPreferUnmount(event.target.checked));
  };

  const handleSectionChange = (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setDropdownState({
        page: getPage(name, dropdowns.pages),
        name,
        dropdownState: event.target.checked ? DROPDOWN_STATE.OPEN : DROPDOWN_STATE.CLOSED,
      }),
    );
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
                        <input
                          type="checkbox"
                          checked={value.initialState === DROPDOWN_STATE.OPEN}
                          onChange={handleSectionChange(value.name)}
                        />
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
