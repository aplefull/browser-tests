import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { ColorPicker as ColorPickerIcon } from 'tabler-icons-react';
import styles from './styles.module.scss';
import { nextElement } from '@/utils/utils';
import { Popover } from '@/app/components/Popover/Popover';
import { Color } from '@/app/components/ColorPicker/Color';
import { ChannelInput, ColorArea, ColorSlider } from '@/app/components/ColorPicker/controls';
import { HSLToHSV, HSVToHSL, normalizeHue } from '@/app/components/ColorPicker/utils.color';
import { Input } from '@/app/components/Input/Input';

type TMode = 'HSV' | 'HSL';

type TPickerState = {
  hue: number;
  saturation: number;
  level: number;
  alpha: number;
};

export type TPickerProps = {
  onChange: (color: Color) => void;
  value: Color;
  type?: TMode;
};

const FORMATS = ['HEX', 'RGB', 'HSL', 'HSV'] as const;
type TFormat = (typeof FORMATS)[number];

const HUE_GRADIENT = `linear-gradient(to right, ${[0, 60, 120, 180, 240, 300, 360].map((hue) => `hsl(${hue} 100% 50%)`).join(', ')})`;
const HUE_WHEEL = `conic-gradient(${[0, 60, 120, 180, 240, 300, 360].map((hue) => `hsl(${hue} 100% 50%)`).join(', ')})`;

const toColor = ({ hue, saturation, level, alpha }: TPickerState, mode: TMode) => {
  return mode === 'HSV'
    ? new Color().fromHSVA(hue, saturation, level, alpha)
    : new Color().fromHSLA(hue, saturation, level, alpha);
};

const fromColor = (color: Color, mode: TMode, previous?: TPickerState): TPickerState => {
  const { h, s, a, ...rest } = mode === 'HSV' ? color.toHSVA() : color.toHSLA();
  const level = 'v' in rest ? rest.v : rest.l;
  const isGray = s === 0;
  const isSaturationLost = mode === 'HSV' ? level === 0 : level === 0 || level === 1;

  return {
    hue: isGray && previous ? previous.hue : h,
    saturation: isSaturationLost && previous ? previous.saturation : s,
    level,
    alpha: a,
  };
};

const getHSV = (state: TPickerState, mode: TMode) => {
  return mode === 'HSV'
    ? { h: state.hue, s: state.saturation, v: state.level }
    : { h: state.hue, ...HSLToHSV(state.saturation, state.level) };
};

const getHSL = (state: TPickerState, mode: TMode) => {
  return mode === 'HSL'
    ? { h: state.hue, s: state.saturation, l: state.level }
    : { h: state.hue, ...HSVToHSL(state.saturation, state.level) };
};

const formatColor = (color: Color) => {
  return color.a < 1 ? color.toHexaString() : color.toHexString();
};

type TPanelProps = {
  mode: TMode;
  state: TPickerState;
  onChange: (state: TPickerState) => void;
  onClose: () => void;
};

const Panel = ({ mode, state, onChange, onClose }: TPanelProps) => {
  const [format, setFormat] = useState<TFormat>('HEX');
  const [hexDraft, setHexDraft] = useState<string | null>(null);

  const color = toColor(state, mode);
  const opaque = color.toRGBString();
  const pureHue = `hsl(${state.hue} 100% 50%)`;
  const hsv = getHSV(state, mode);
  const hsl = getHSL(state, mode);

  const set = (patch: Partial<TPickerState>) => onChange({ ...state, ...patch });

  const setFromColor = (next: Color) => onChange({ ...fromColor(next, mode, state), alpha: state.alpha });

  const setHSV = (patch: Partial<typeof hsv>) => {
    const next = { ...hsv, ...patch };

    if (mode === 'HSV') {
      set({ hue: next.h, saturation: next.s, level: next.v });
      return;
    }

    const { s, l } = HSVToHSL(next.s, next.v);
    set({ hue: next.h, saturation: s, level: l });
  };

  const setHSL = (patch: Partial<typeof hsl>) => {
    const next = { ...hsl, ...patch };

    if (mode === 'HSL') {
      set({ hue: next.h, saturation: next.s, level: next.l });
      return;
    }

    const { s, v } = HSLToHSV(next.s, next.l);
    set({ hue: next.h, saturation: s, level: v });
  };

  const applyHex = (text: string, allowShort: boolean) => {
    const digits = text.trim().replace(/^#/, '');
    const pattern = allowShort ? /^([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i : /^([0-9a-f]{6}|[0-9a-f]{8})$/i;
    if (!pattern.test(digits)) return;

    const next = fromColor(new Color().fromHex(`#${digits}`), mode, state);
    const hasAlpha = digits.length === 4 || digits.length === 8;

    onChange(hasAlpha ? next : { ...next, alpha: state.alpha });
  };

  const handleHexChange = (text: string) => {
    setHexDraft(text);
    applyHex(text, false);
  };

  const commitHex = () => {
    if (hexDraft !== null) applyHex(hexDraft, true);
    setHexDraft(null);
  };

  const pickFromScreen = async () => {
    try {
      const { sRGBHex } = await new EyeDropper().open();
      setFromColor(new Color().parse(sRGBHex));
    } catch {
      return;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && hexDraft !== null) {
      commitHex();
      return;
    }

    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
    }
  };

  const renderArea = () => {
    if (mode === 'HSL') {
      const angle = (state.hue * Math.PI) / 180;
      const lightnessOverlay =
        state.level < 0.5 ? `rgb(0 0 0 / ${(0.5 - state.level) * 2})` : `rgb(255 255 255 / ${(state.level - 0.5) * 2})`;

      return (
        <ColorArea
          round
          label="Hue and saturation"
          valueText={`Hue ${Math.round(state.hue)}°, saturation ${Math.round(state.saturation * 100)}%`}
          thumb={{
            x: 0.5 + (Math.sin(angle) * state.saturation) / 2,
            y: 0.5 - (Math.cos(angle) * state.saturation) / 2,
          }}
          thumbColor={opaque}
          onMove={({ x, y }) => {
            const dx = x - 0.5;
            const dy = y - 0.5;
            const hue = normalizeHue((Math.atan2(dx, -dy) * 180) / Math.PI);
            set({ hue, saturation: Math.min(Math.hypot(dx, dy) * 2, 1) });
          }}
          onKey={(dx, dy) =>
            set({
              hue: normalizeHue(state.hue + dx),
              saturation: Math.min(Math.max(state.saturation + dy / 100, 0), 1),
            })
          }
        >
          <div className={styles.layer} style={{ background: HUE_WHEEL }} />
          <div
            className={styles.layer}
            style={{ background: 'radial-gradient(closest-side, hsl(0 0% 50%), transparent)' }}
          />
          <div className={styles.layer} style={{ background: lightnessOverlay }} />
        </ColorArea>
      );
    }

    return (
      <ColorArea
        label="Saturation and brightness"
        valueText={`Saturation ${Math.round(state.saturation * 100)}%, brightness ${Math.round(state.level * 100)}%`}
        thumb={{ x: state.saturation, y: 1 - state.level }}
        thumbColor={opaque}
        style={{ backgroundColor: pureHue }}
        onMove={({ x, y }) => set({ saturation: x, level: 1 - y })}
        onKey={(dx, dy) =>
          set({
            saturation: Math.min(Math.max(state.saturation + dx / 100, 0), 1),
            level: Math.min(Math.max(state.level + dy / 100, 0), 1),
          })
        }
      >
        <div className={styles.layer} style={{ background: 'linear-gradient(to right, white, transparent)' }} />
        <div className={styles.layer} style={{ background: 'linear-gradient(to top, black, transparent)' }} />
      </ColorArea>
    );
  };

  const renderInputs = () => {
    const alpha = (
      <ChannelInput label="A" value={state.alpha * 100} max={100} onChange={(value) => set({ alpha: value / 100 })} />
    );

    switch (format) {
      case 'HEX':
        return (
          <>
            <Input
              className={styles.hex}
              value={hexDraft ?? color.toHexString()}
              onChange={handleHexChange}
              onBlur={commitHex}
            />
            {alpha}
          </>
        );
      case 'RGB': {
        const { r, g, b } = color.toRGB();
        const setChannel = (patch: Partial<{ r: number; g: number; b: number }>) => {
          const next = { r, g, b, ...patch };
          setFromColor(new Color().fromRGB(next.r, next.g, next.b));
        };

        return (
          <>
            <ChannelInput label="R" value={r} max={255} onChange={(value) => setChannel({ r: value })} />
            <ChannelInput label="G" value={g} max={255} onChange={(value) => setChannel({ g: value })} />
            <ChannelInput label="B" value={b} max={255} onChange={(value) => setChannel({ b: value })} />
            {alpha}
          </>
        );
      }
      case 'HSL':
        return (
          <>
            <ChannelInput label="H" value={hsl.h} max={360} onChange={(value) => setHSL({ h: value })} />
            <ChannelInput label="S" value={hsl.s * 100} max={100} onChange={(value) => setHSL({ s: value / 100 })} />
            <ChannelInput label="L" value={hsl.l * 100} max={100} onChange={(value) => setHSL({ l: value / 100 })} />
            {alpha}
          </>
        );
      case 'HSV':
        return (
          <>
            <ChannelInput label="H" value={hsv.h} max={360} onChange={(value) => setHSV({ h: value })} />
            <ChannelInput label="S" value={hsv.s * 100} max={100} onChange={(value) => setHSV({ s: value / 100 })} />
            <ChannelInput label="V" value={hsv.v * 100} max={100} onChange={(value) => setHSV({ v: value / 100 })} />
            {alpha}
          </>
        );
    }
  };

  return (
    <div className={styles.panel} onKeyDown={handleKeyDown}>
      {renderArea()}
      <div className={styles.controls}>
        {'EyeDropper' in window && (
          <button type="button" className={styles.iconButton} title="Pick from screen" onClick={pickFromScreen}>
            <ColorPickerIcon size={16} />
          </button>
        )}
        <div className={styles.preview}>
          <div style={{ backgroundColor: color.toRGBAString() }} />
        </div>
        <div className={styles.sliders}>
          {mode === 'HSV' ? (
            <ColorSlider
              label="Hue"
              value={state.hue}
              max={360}
              unit="°"
              background={HUE_GRADIENT}
              thumbColor={pureHue}
              onChange={(hue) => set({ hue })}
            />
          ) : (
            <ColorSlider
              label="Lightness"
              value={state.level * 100}
              max={100}
              unit="%"
              background={`linear-gradient(to right, black, hsl(${state.hue} ${state.saturation * 100}% 50%), white)`}
              thumbColor={opaque}
              onChange={(value) => set({ level: value / 100 })}
            />
          )}
          <ColorSlider
            label="Alpha"
            value={state.alpha * 100}
            max={100}
            unit="%"
            checkered
            background={`linear-gradient(to right, transparent, ${opaque})`}
            thumbColor={color.toRGBAString()}
            onChange={(value) => set({ alpha: value / 100 })}
          />
        </div>
      </div>
      <div className={styles.inputs}>
        <button
          type="button"
          className={styles.format}
          title="Switch format"
          onClick={() => setFormat(nextElement(FORMATS, format))}
        >
          {format}
        </button>
        {renderInputs()}
      </div>
    </div>
  );
};

export const ColorPicker = ({ onChange, value, type = 'HSV' }: TPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(() => fromColor(value, type));

  const triggerRef = useRef<HTMLButtonElement>(null);
  const emittedRef = useRef(value.toRGBAString());

  const color = toColor(state, type);

  const handleChange = (next: TPickerState) => {
    const nextColor = toColor(next, type);

    setState(next);
    emittedRef.current = nextColor.toRGBAString();
    onChange(nextColor);
  };

  const close = useCallback(() => setIsOpen(false), []);

  const closeAndFocus = () => {
    close();
    triggerRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    const rgba = value.toRGBAString();
    if (rgba === emittedRef.current) return;

    emittedRef.current = rgba;
    setState((previous) => fromColor(value, type, previous));
  }, [value, type]);

  return (
    <Popover
      isOpen={isOpen}
      onClickOutside={close}
      closeWhenTriggerOutOfViewport={true}
      zIndex={100}
      content={<Panel mode={type} state={state} onChange={handleChange} onClose={closeAndFocus} />}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={styles.trigger}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={styles.swatch}>
          <span style={{ backgroundColor: color.toRGBAString() }} />
        </span>
        <span className={styles.triggerText}>{formatColor(color)}</span>
      </button>
    </Popover>
  );
};
