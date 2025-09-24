import styles from './styles.module.scss';

import { useReducer } from 'react';
import { TAction, TDimensions } from '@/types';
import { RangeInput } from '@/app/components/RangeInput/RangeInput';

enum actionTypes {
  CHANGE_POINT_LIGHT_X = 'CHANGE_POINT_LIGHT_X',
  CHANGE_POINT_LIGHT_Y = 'CHANGE_POINT_LIGHT_Y',
  CHANGE_POINT_LIGHT_Z = 'CHANGE_POINT_LIGHT_Z',
}

const initialValues = {
  pointLightX: 60,
  pointLightY: 60,
  pointLightZ: 8,
};

type TState = typeof initialValues;

const reducer = (state: typeof initialValues, action: TAction<number>): TState => {
  switch (action.type) {
    case actionTypes.CHANGE_POINT_LIGHT_X:
      return {
        ...state,
        pointLightX: action.payload,
      };
    case actionTypes.CHANGE_POINT_LIGHT_Y:
      return {
        ...state,
        pointLightY: action.payload,
      };
    case actionTypes.CHANGE_POINT_LIGHT_Z:
      return {
        ...state,
        pointLightZ: action.payload,
      };
    default:
      return state;
  }
};

export const PointLightSvg = ({ width, height }: TDimensions) => {
  const [state, dispatch] = useReducer(reducer, initialValues);

  const { pointLightX, pointLightY, pointLightZ } = state;

  const pointLightControls = [
    {
      label: 'X',
      min: 0,
      max: width,
      value: pointLightX,
      onChange: (value: number) => dispatch({ type: 'CHANGE_POINT_LIGHT_X', payload: value }),
    },
    {
      label: 'Y',
      min: 0,
      max: height,
      value: pointLightY,
      onChange: (value: number) => dispatch({ type: 'CHANGE_POINT_LIGHT_Y', payload: value }),
    },
    {
      label: 'Z',
      min: -200,
      max: 200,
      value: pointLightZ,
      onChange: (value: number) => dispatch({ type: 'CHANGE_POINT_LIGHT_Z', payload: value }),
    },
  ];

  return (
    <div style={{ width }} className={styles.container}>
      <div className={styles.controls}>
        {pointLightControls.map((control) => (
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
        <filter id="noise-point-light" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence baseFrequency="0.04" result="noise" />

          <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="2">
            <fePointLight x={pointLightX} y={pointLightY} z={pointLightZ} />
          </feDiffuseLighting>
        </filter>

        <rect x="0" y="0" width="100%" height="100%" filter="url(#noise-point-light)" />
      </svg>
    </div>
  );
};
