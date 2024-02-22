import styles from './styles.module.scss';
import React, { FormEvent, CompositionEvent, ClipboardEvent, useEffect, useRef, useState, WheelEvent } from 'react';

const KeyboardEvents = () => {
  const [keyDownEvent, setKeyDownEvent] = useState('');
  const [keyUpEvent, setKeyUpEvent] = useState('');
  const [cutEvent, setCutEvent] = useState('');
  const [copyEvent, setCopyEvent] = useState('');
  const [pasteEvent, setPasteEvent] = useState('');
  const [beforeInputEvent, setBeforeInputEvent] = useState('');
  const [inputEvent, setInputEvent] = useState('');
  const [compositionStartEvent, setCompositionStartEvent] = useState('');
  const [compositionUpdateEvent, setCompositionUpdateEvent] = useState('');
  const [compositionEndEvent, setCompositionEndEvent] = useState('');

  const handleKeyDown = (e: KeyboardEvent) => {
    setKeyDownEvent(e.key);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    setKeyUpEvent(e.key);
  };

  const handleCut = () => {
    navigator.clipboard.readText().then((text) => {
      setCutEvent(text);
    });
  };

  const handleCopy = () => {
    navigator.clipboard.readText().then((text) => {
      setCopyEvent(text);
    });
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    setPasteEvent(e.clipboardData.getData('text'));
  };

  const handleBeforeInput = (e: InputEvent) => {
    setBeforeInputEvent(e.data || '');
  };

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    if (!e.target || !(e.target instanceof HTMLInputElement)) return;
    setInputEvent(e.target.value);
  };

  const handleCompositionStart = (e: CompositionEvent<HTMLInputElement>) => {
    setCompositionStartEvent(e.data);
  };

  const handleCompositionUpdate = (e: CompositionEvent<HTMLInputElement>) => {
    setCompositionUpdateEvent(e.data);
  };

  const handleCompositionEnd = (e: CompositionEvent<HTMLInputElement>) => {
    setCompositionEndEvent(e.data);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('beforeinput', handleBeforeInput);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className={styles.kbdEvents}>
      <h2>Keyboard events</h2>
      <p>You probably need IME for composition events to fire. (Japanese keyboard for example)</p>
      <input
        type="text"
        placeholder="Type here..."
        onCut={handleCut}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onInput={handleInput}
        onCompositionStart={handleCompositionStart}
        onCompositionUpdate={handleCompositionUpdate}
        onCompositionEnd={handleCompositionEnd}
      />
      <div className={styles.stats}>
        <p>KeyDown event: {keyDownEvent}</p>
        <p>KeyUp event: {keyUpEvent}</p>
        <p>Cut event: {cutEvent}</p>
        <p>Copy event: {copyEvent}</p>
        <p>Paste event: {pasteEvent}</p>
        <p>BeforeInput event: {beforeInputEvent}</p>
        <p>Input event: {inputEvent}</p>
        <p>CompositionStart event: {compositionStartEvent}</p>
        <p>CompositionUpdate event: {compositionUpdateEvent}</p>
        <p>CompositionEnd event: {compositionEndEvent}</p>
      </div>
    </div>
  );
};

const MouseEvents = () => {
  const [clicksCount, setClicksCount] = useState(0);
  const [dbClicksCount, setDbClicksCount] = useState(0);
  const [auxClicksCount, setAuxClicksCount] = useState(0);
  const [contextMenuCount, setContextMenuCount] = useState(0);
  const [mouseDownCount, setMouseDownCount] = useState(0);
  const [mouseUpCount, setMouseUpCount] = useState(0);
  const [mouseEnterCount, setMouseEnterCount] = useState(0);
  const [mouseLeaveCount, setMouseLeaveCount] = useState(0);
  const [mouseMoveCount, setMouseMoveCount] = useState(0);
  const [mouseOverCount, setMouseOverCount] = useState(0);
  const [mouseOutCount, setMouseOutCount] = useState(0);

  const testClick = () => {
    setClicksCount((prevCount) => prevCount + 1);
  };

  const testContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setContextMenuCount((prevCount) => prevCount + 1);
  };

  const testMouseDown = () => {
    setMouseDownCount((prevCount) => prevCount + 1);
  };

  const testMouseUp = () => {
    setMouseUpCount((prevCount) => prevCount + 1);
  };

  const testMouseEnter = () => {
    setMouseEnterCount((prevCount) => prevCount + 1);
  };

  const testMouseLeave = () => {
    setMouseLeaveCount((prevCount) => prevCount + 1);
  };

  const testMouseMove = () => {
    setMouseMoveCount((prevCount) => prevCount + 1);
  };

  const testMouseOver = () => {
    setMouseOverCount((prevCount) => prevCount + 1);
  };

  const testMouseOut = () => {
    setMouseOutCount((prevCount) => prevCount + 1);
  };

  const testDbClick = () => {
    setDbClicksCount((prevCount) => prevCount + 1);
  };

  const testAuxClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setAuxClicksCount((prevCount) => prevCount + 1);
  };

  return (
    <div className={styles.mouseEvents}>
      <h2>Mouse events</h2>
      <div
        className={styles.testArea}
        onClick={testClick}
        onContextMenu={testContextMenu}
        onMouseDown={testMouseDown}
        onMouseUp={testMouseUp}
        onMouseEnter={testMouseEnter}
        onMouseLeave={testMouseLeave}
        onMouseMove={testMouseMove}
        onMouseOver={testMouseOver}
        onMouseOut={testMouseOut}
        onDoubleClick={testDbClick}
        onAuxClick={testAuxClick}
      >
        <p>Test area</p>
      </div>
      <div className={styles.stats}>
        <p>Clicks: {clicksCount}</p>
        <p>Double Clicks: {dbClicksCount}</p>
        <p>Aux Clicks: {auxClicksCount}</p>
        <p>Context Menu: {contextMenuCount}</p>
        <p>Mouse Down: {mouseDownCount}</p>
        <p>Mouse Up: {mouseUpCount}</p>
        <p>Mouse Enter: {mouseEnterCount}</p>
        <p>Mouse Leave: {mouseLeaveCount}</p>
        <p>Mouse Move: {mouseMoveCount}</p>
        <p>Mouse Over: {mouseOverCount}</p>
        <p>Mouse Out: {mouseOutCount}</p>
      </div>
    </div>
  );
};

export const TestEvents = () => {
  const activeScrollRef = useRef<HTMLDivElement | null>(null);

  const testWheel = (e: WheelEvent<HTMLDivElement> | HTMLElementEventMap['wheel']) => {
    try {
      e.preventDefault();
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    const div = activeScrollRef.current;

    if (div) {
      div.addEventListener('wheel', testWheel);
    }

    return () => {
      if (div) {
        div.removeEventListener('wheel', testWheel);
      }
    };
  }, []);

  return (
    <div className={styles.events}>
      <div className={styles.wheel}>
        <h2>Wheel event</h2>
        <p>
          Scroll on rectangles. Left shouldn't scroll. Right should (also will throw errors in console, because
          apparently you can't catch them)
        </p>
        <div>
          <div ref={activeScrollRef}>Active event</div>
          <div onWheel={testWheel}>Passive event</div>
        </div>
      </div>
      <MouseEvents />
      <KeyboardEvents />
    </div>
  );
};
