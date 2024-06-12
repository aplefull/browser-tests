import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/redux/store';
import { setDropdownState, setPreferUnmount } from '@/app/redux/slices/settings';
import { DROPDOWN_STATE } from '@/utils/constants';
import { getPage } from '@/utils/utils';
import { Checkbox } from '@/app/components/Checkbox/Checkbox';

const sortByLetters = ([str1]: [string, unknown], [str2]: [string, unknown]) => {
  const order = 'hcjm';

  return order.indexOf(str1[0]) - order.indexOf(str2[0]);
};

export const Settings = () => {
  const { preferUnmount, dropdowns } = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch<AppDispatch>();

  const handlePreferUnmountChange = (value: boolean) => {
    dispatch(setPreferUnmount(value));
  };

  const handleSectionChange = (name: string) => (value: boolean) => {
    const page = getPage(name, dropdowns.pages);

    if (!page) return;

    dispatch(
      setDropdownState({
        page,
        name,
        dropdownState: value ? DROPDOWN_STATE.OPEN : DROPDOWN_STATE.CLOSED,
      }),
    );
  };

  return (
    <div className={styles.settings}>
      <h1>Settings</h1>
      <div>
        <Checkbox
          label="Remove children from the dom when collapse is closed"
          checked={preferUnmount}
          onChange={handlePreferUnmountChange}
        />
      </div>
      <div>
        <span>Initial dropdowns states:</span>
        <div className={styles.dropdownsGrid}>
          {Object.entries(dropdowns.pages)
            .toSorted(sortByLetters)
            .map(([page, values]) => {
              return (
                <div key={page} className={styles.column}>
                  <p>{page}</p>
                  <div className={styles.columnContent}>
                    {values.map((value) => {
                      return (
                        <Checkbox
                          key={value.name}
                          label={value.name}
                          labelPosition="left"
                          checked={value.initialState === DROPDOWN_STATE.OPEN}
                          onChange={handleSectionChange(value.name)}
                        />
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
