import styles from './style.module.scss';
import { ChangeEvent, useReducer } from 'react';
import { TAction, TDimensions } from '@/types';

enum actionTypes {
  CHANGE_AZIMUTH = 'CHANGE_AZIMUTH',
  CHANGE_ELEVATION = 'CHANGE_ELEVATION',
}

const initialValues = {
  azimuth: 134,
  elevation: 21,
};

type TState = typeof initialValues;

const reducer = (state: typeof initialValues, action: TAction<number>): TState => {
  switch (action.type) {
    case actionTypes.CHANGE_AZIMUTH:
      return {
        ...state,
        azimuth: action.payload,
      };
    case actionTypes.CHANGE_ELEVATION:
      return {
        ...state,
        elevation: action.payload,
      };
    default:
      return state;
  }
};

export const DistantLightSvg = ({ width, height }: TDimensions) => {
  const [state, dispatch] = useReducer(reducer, initialValues);

  const { azimuth, elevation } = state;

  const distantLightControls = [
    {
      label: 'Azimuth',
      min: 0,
      max: 360,
      value: azimuth,
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        dispatch({ type: 'CHANGE_AZIMUTH', payload: Number(e.target.value) }),
    },
    {
      label: 'Elevation',
      min: 0,
      max: 360,
      value: elevation,
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        dispatch({ type: 'CHANGE_ELEVATION', payload: Number(e.target.value) }),
    },
  ];

  return (
    <div style={{ width }} className={styles.container}>
      <div className={styles.controls}>
        {distantLightControls.map((control) => (
          <div key={control.label} className={styles.input}>
            <label htmlFor={control.label}>{control.label}</label>
            <input
              id={control.label}
              type="range"
              min={control.min}
              max={control.max}
              value={control.value}
              onChange={control.onChange}
            />
          </div>
        ))}
      </div>

      <svg width={width} height={height}>
        <filter id="noise-distant-light" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence baseFrequency="0.04" result="noise" />

          <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="2">
            <feDistantLight azimuth={azimuth} elevation={elevation} />
          </feDiffuseLighting>
        </filter>

        <rect x="0" y="0" width="100%" height="100%" filter="url(#noise-distant-light)" />
      </svg>
    </div>
  );
};
