import styles from './style.module.scss';

import { ChangeEvent, useReducer } from 'react';
import { TAction, TDimensions } from '@/types';

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
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        dispatch({ type: 'CHANGE_POINT_LIGHT_X', payload: Number(e.target.value) }),
    },
    {
      label: 'Y',
      min: 0,
      max: height,
      value: pointLightY,
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        dispatch({ type: 'CHANGE_POINT_LIGHT_Y', payload: Number(e.target.value) }),
    },
    {
      label: 'Z',
      min: -200,
      max: 200,
      value: pointLightZ,
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        dispatch({ type: 'CHANGE_POINT_LIGHT_Z', payload: Number(e.target.value) }),
    },
  ];

  return (
    <div style={{ width }} className={styles.container}>
      <div className={styles.controls}>
        {pointLightControls.map((control) => (
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
