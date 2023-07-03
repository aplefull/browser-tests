import { useReducer } from 'react';

enum actionTypes {
  CHANGE_AZIMUTH = 'CHANGE_AZIMUTH',
  CHANGE_ELEVATION = 'CHANGE_ELEVATION',
  CHANGE_SPOT_LIGHT_X = 'CHANGE_SPOT_LIGHT_X',
  CHANGE_SPOT_LIGHT_Y = 'CHANGE_SPOT_LIGHT_Y',
  CHANGE_SPOT_LIGHT_Z = 'CHANGE_SPOT_LIGHT_Z',
  CHANGE_SPOT_LIGHT_POINTS_AT_X = 'CHANGE_SPOT_LIGHT_POINTS_AT_X',
  CHANGE_SPOT_LIGHT_POINTS_AT_Y = 'CHANGE_SPOT_LIGHT_POINTS_AT_Y',
  CHANGE_SPOT_LIGHT_POINTS_AT_Z = 'CHANGE_SPOT_LIGHT_POINTS_AT_Z',
  CHANGE_SPECULAR_EXPONENT = 'CHANGE_SPECULAR_EXPONENT',
  CHANGE_LIMITING_CONE_ANGLE = 'CHANGE_LIMITING_CONE_ANGLE',
  CHANGE_POINT_LIGHT_X = 'CHANGE_POINT_LIGHT_X',
  CHANGE_POINT_LIGHT_Y = 'CHANGE_POINT_LIGHT_Y',
  CHANGE_POINT_LIGHT_Z = 'CHANGE_POINT_LIGHT_Z',
}

const initialValues = {
  // Distant Light
  azimuth: 45,
  elevation: 60,
  // Spot Light
  spotLightX: 0,
  spotLightY: 0,
  spotLightZ: 0,
  spotLightPointsAtX: 0,
  spotLightPointsAtY: 0,
  spotLightPointsAtZ: 0,
  specularExponent: 0,
  limitingConeAngle: 0,
  // Point Light
  pointLightX: 0,
  pointLightY: 0,
  pointLightZ: 0,
};

const reducer = (state: typeof initialValues, action: { type: string; payload: number }) => {
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

export const LightsSvg = () => {
  const [state, dispatch] = useReducer(reducer, initialValues);

  const width = 800;
  const height = 800;

  const {
    azimuth,
    elevation,
    spotLightX,
    spotLightY,
    spotLightZ,
    spotLightPointsAtX,
    spotLightPointsAtY,
    spotLightPointsAtZ,
    specularExponent,
    limitingConeAngle,
    pointLightX,
    pointLightY,
    pointLightZ,
  } = state;

  const distantLightControls = [
    {
      label: 'Azimuth',
      min: 0,
      max: 360,
      value: azimuth,
      onChange: (e) => dispatch({ type: 'CHANGE_AZIMUTH', payload: Number(e.target.value) }),
    },
    {
      label: 'Elevation',
      min: 0,
      max: 360,
      value: elevation,
      onChange: (e) => dispatch({ type: 'CHANGE_ELEVATION', payload: Number(e.target.value) }),
    },
  ];

  const spotLightControls = [
    {
      label: 'X',
      min: 0,
      max: 360,
      value: spotLightX,
      onChange: (e) => dispatch({ type: 'CHANGE_SPOT_LIGHT_X', payload: Number(e.target.value) }),
    },
    {
      label: 'Y',
      min: 0,
      max: 360,
      value: spotLightY,
      onChange: (e) => dispatch({ type: 'CHANGE_SPOT_LIGHT_Y', payload: Number(e.target.value) }),
    },
    {
      label: 'Z',
      min: 0,
      max: 360,
      value: spotLightZ,
      onChange: (e) => dispatch({ type: 'CHANGE_SPOT_LIGHT_Z', payload: Number(e.target.value) }),
    },
    {
      label: 'Points At X',
      min: 0,
      max: 360,
      value: spotLightPointsAtX,
      onChange: (e) => dispatch({ type: 'CHANGE_SPOT_LIGHT_POINTS_AT_X', payload: Number(e.target.value) }),
    },
    {
      label: 'Points At Y',
      min: 0,
      max: 360,
      value: spotLightPointsAtY,
      onChange: (e) => dispatch({ type: 'CHANGE_SPOT_LIGHT_POINTS_AT_Y', payload: Number(e.target.value) }),
    },
    {
      label: 'Points At Z',
      min: 0,
      max: 360,
      value: spotLightPointsAtZ,
      onChange: (e) => dispatch({ type: 'CHANGE_SPOT_LIGHT_POINTS_AT_Z', payload: Number(e.target.value) }),
    },
    {
      label: 'Specular Exponent',
      min: 0,
      max: 100,
      value: specularExponent,
      onChange: (e) => dispatch({ type: 'CHANGE_SPECULAR_EXPONENT', payload: Number(e.target.value) }),
    },
    {
      label: 'Limiting Cone Angle',
      min: 0,
      max: 180,
      value: limitingConeAngle,
      onChange: (e) => dispatch({ type: 'CHANGE_LIMITING_CONE_ANGLE', payload: Number(e.target.value) }),
    },
  ];

  const pointLightControls = [
    {
      label: 'X',
      min: 0,
      max: 360,
      value: pointLightX,
      onChange: (e) => dispatch({ type: 'CHANGE_POINT_LIGHT_X', payload: Number(e.target.value) }),
    },
    {
      label: 'Y',
      min: 0,
      max: 360,
      value: pointLightY,
      onChange: (e) => dispatch({ type: 'CHANGE_POINT_LIGHT_Y', payload: Number(e.target.value) }),
    },
    {
      label: 'Z',
      min: 0,
      max: 360,
      value: pointLightZ,
      onChange: (e) => dispatch({ type: 'CHANGE_POINT_LIGHT_Z', payload: Number(e.target.value) }),
    },
  ];

  return (
    <div>
      <div>
        {distantLightControls.map((control) => (
          <div key={control.label}>
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
      <div>
        {spotLightControls.map((control) => (
          <div key={control.label}>
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
      <div>
        {pointLightControls.map((control) => (
          <div key={control.label}>
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
        <filter id="noise-point-light" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence baseFrequency="0.04" result="noise" />

          <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="2">
            <fePointLight x={pointLightX} y={pointLightY} z={pointLightZ} />
          </feDiffuseLighting>
        </filter>
        <filter id="roughpaper" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" numOctaves="5" />

          <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="2">
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
        </filter>

        <rect x="0" y="0" width="100%" height="200px" filter="url(#noise-distant-light)" />
        <rect x="0" y="200px" width="100%" height="200px" filter="url(#noise-spot-light)" />
        <rect x="0" y="400px" width="100%" height="200px" filter="url(#noise-point-light)" />
        <rect x="0" y="600px" width="100%" height="200px" filter="url(#roughpaper)" />
      </svg>
    </div>
  );
};
