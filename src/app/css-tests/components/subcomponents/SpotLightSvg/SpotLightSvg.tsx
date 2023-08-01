import styles from './style.module.scss';

import { ChangeEvent, useReducer } from 'react';
import { TAction, TDimensions } from '@/types';

enum actionTypes {
  CHANGE_SPOT_LIGHT_X = 'CHANGE_SPOT_LIGHT_X',
  CHANGE_SPOT_LIGHT_Y = 'CHANGE_SPOT_LIGHT_Y',
  CHANGE_SPOT_LIGHT_Z = 'CHANGE_SPOT_LIGHT_Z',
  CHANGE_SPOT_LIGHT_POINTS_AT_X = 'CHANGE_SPOT_LIGHT_POINTS_AT_X',
  CHANGE_SPOT_LIGHT_POINTS_AT_Y = 'CHANGE_SPOT_LIGHT_POINTS_AT_Y',
  CHANGE_SPOT_LIGHT_POINTS_AT_Z = 'CHANGE_SPOT_LIGHT_POINTS_AT_Z',
  CHANGE_SPECULAR_EXPONENT = 'CHANGE_SPECULAR_EXPONENT',
  CHANGE_LIMITING_CONE_ANGLE = 'CHANGE_LIMITING_CONE_ANGLE',
}

const initialValues = {
  spotLightX: 176,
  spotLightY: 73,
  spotLightZ: 22,
  spotLightPointsAtX: 292,
  spotLightPointsAtY: 116,
  spotLightPointsAtZ: 0,
  specularExponent: 44,
  limitingConeAngle: 12,
};

type TState = typeof initialValues;

const reducer = (state: typeof initialValues, action: TAction<number>): TState => {
  switch (action.type) {
    case actionTypes.CHANGE_SPOT_LIGHT_X:
      return {
        ...state,
        spotLightX: action.payload,
      };
    case actionTypes.CHANGE_SPOT_LIGHT_Y:
      return {
        ...state,
        spotLightY: action.payload,
      };
    case actionTypes.CHANGE_SPOT_LIGHT_Z:
      return {
        ...state,
        spotLightZ: action.payload,
      };
    case actionTypes.CHANGE_SPOT_LIGHT_POINTS_AT_X:
      return {
        ...state,
        spotLightPointsAtX: action.payload,
      };
    case actionTypes.CHANGE_SPOT_LIGHT_POINTS_AT_Y:
      return {
        ...state,
        spotLightPointsAtY: action.payload,
      };
    case actionTypes.CHANGE_SPOT_LIGHT_POINTS_AT_Z:
      return {
        ...state,
        spotLightPointsAtZ: action.payload,
      };
    case actionTypes.CHANGE_SPECULAR_EXPONENT:
      return {
        ...state,
        specularExponent: action.payload,
      };
    case actionTypes.CHANGE_LIMITING_CONE_ANGLE:
      return {
        ...state,
        limitingConeAngle: action.payload,
      };
    default:
      return state;
  }
};

export const SpotLightSvg = ({ width, height }: TDimensions) => {
  const [state, dispatch] = useReducer(reducer, initialValues);

  const {
    spotLightX,
    spotLightY,
    spotLightZ,
    spotLightPointsAtX,
    spotLightPointsAtY,
    spotLightPointsAtZ,
    specularExponent,
    limitingConeAngle,
  } = state;

  const spotLightControls = [
    {
      label: 'X',
      min: 0,
      max: width,
      value: spotLightX,
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        dispatch({ type: 'CHANGE_SPOT_LIGHT_X', payload: Number(e.target.value) }),
    },
    {
      label: 'Y',
      min: 0,
      max: height,
      value: spotLightY,
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        dispatch({ type: 'CHANGE_SPOT_LIGHT_Y', payload: Number(e.target.value) }),
    },
    {
      label: 'Z',
      min: 0,
      max: 1000,
      value: spotLightZ,
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        dispatch({ type: 'CHANGE_SPOT_LIGHT_Z', payload: Number(e.target.value) }),
    },
    {
      label: 'Points At X',
      min: 0,
      max: width,
      value: spotLightPointsAtX,
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        dispatch({ type: 'CHANGE_SPOT_LIGHT_POINTS_AT_X', payload: Number(e.target.value) }),
    },
    {
      label: 'Points At Y',
      min: 0,
      max: height,
      value: spotLightPointsAtY,
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        dispatch({ type: 'CHANGE_SPOT_LIGHT_POINTS_AT_Y', payload: Number(e.target.value) }),
    },
    {
      label: 'Points At Z',
      min: 0,
      max: 1000,
      value: spotLightPointsAtZ,
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        dispatch({ type: 'CHANGE_SPOT_LIGHT_POINTS_AT_Z', payload: Number(e.target.value) }),
    },
    {
      label: 'Specular Exponent',
      min: 0,
      max: 128,
      value: specularExponent,
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        dispatch({ type: 'CHANGE_SPECULAR_EXPONENT', payload: Number(e.target.value) }),
    },
    {
      label: 'Limiting Cone Angle',
      min: 0.001,
      max: 90,
      value: limitingConeAngle,
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        dispatch({ type: 'CHANGE_LIMITING_CONE_ANGLE', payload: Number(e.target.value) }),
    },
  ];

  return (
    <div style={{ width }} className={styles.container}>
      <div className={styles.controls}>
        {spotLightControls.map((control) => (
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
        <filter id="noise-spot-light" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence baseFrequency="0.04" result="noise" />

          <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="2">
            <feSpotLight
              x={spotLightX}
              y={spotLightY}
              z={spotLightZ}
              pointsAtX={spotLightPointsAtX}
              pointsAtY={spotLightPointsAtY}
              pointsAtZ={spotLightPointsAtZ}
              specularExponent={specularExponent}
              limitingConeAngle={limitingConeAngle}
            />
          </feDiffuseLighting>
        </filter>

        <rect x="0" y="0" width="100%" height="100%" filter="url(#noise-spot-light)" />
      </svg>
    </div>
  );
};
