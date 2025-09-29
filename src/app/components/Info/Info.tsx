import styles from './styles.module.scss';
import { QuestionMark } from 'tabler-icons-react';
import { Popover } from '@/app/components/Popover/Popover';
import { useRef, useState } from 'react';

type TInfoProps = {
  text?: string;
  className?: string;
};

export const Info = ({ text, className }: TInfoProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const onMouseEnter = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    setIsOpen(true);
  };

  const onMouseLeave = () => {
    timeoutIdRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  const infoTooltip = (
    <div className={styles.infoTooltip} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <span>{text}</span>
    </div>
  );

  return (
    <Popover
      anchor={{
        horizontal: 'center',
        vertical: 'bottom',
      }}
      target={{
        horizontal: 'center',
        vertical: 'top',
      }}
      content={infoTooltip}
      className={className}
      isOpen={isOpen}
      closeWhenTriggerOutOfViewport={true}
      onClickOutside={() => setIsOpen(false)}
    >
      <div className={styles.container} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <QuestionMark className={styles.icon} />
      </div>
    </Popover>
  );
};
