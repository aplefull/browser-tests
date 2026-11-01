import styles from './styles.module.scss';
import { QuestionMark } from 'tabler-icons-react';
import { Popover } from '@/app/components/Popover/Popover';
import { KeyboardEvent, useRef, useState } from 'react';

type TInfoProps = {
  text?: string;
  className?: string;
};

export const Info = ({ text, className }: TInfoProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onMouseEnter = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    setIsOpen(true);
  };

  const close = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    setIsOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  };

  const onMouseLeave = () => {
    timeoutIdRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  const infoTooltip = (
    <div role="tooltip" className={styles.infoTooltip} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
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
      onClickOutside={close}
    >
      <button
        type="button"
        aria-label="Info"
        aria-expanded={isOpen}
        className={styles.container}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onMouseEnter}
        onBlur={close}
        onClick={onMouseEnter}
        onKeyDown={onKeyDown}
      >
        <QuestionMark size={12} strokeWidth={2.25} />
      </button>
    </Popover>
  );
};
