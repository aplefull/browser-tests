import styles from './styles.module.scss';
import { useReducer } from 'react';
import { TAction, TDimensions } from '@/types';
import { RangeInput } from '@/app/components/RangeInput/RangeInput';

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
      onChange: (value: number) => dispatch({ type: 'CHANGE_AZIMUTH', payload: value }),
    },
    {
      label: 'Elevation',
      min: 0,
      max: 360,
      value: elevation,
      onChange: (value: number) => dispatch({ type: 'CHANGE_ELEVATION', payload: value }),
    },
  ];

  return (
    <div style={{ width }} className={styles.container}>
      <div className={styles.controls}>
        {distantLightControls.map((control) => (
          <RangeInput
            key={control.label}
            label={control.label}
            min={control.min}
            max={control.max}
            value={control.value}
            onChange={control.onChange}
            className={styles.input}
          />
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
