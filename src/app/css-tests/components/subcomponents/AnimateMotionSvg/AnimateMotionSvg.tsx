export const AnimateMotionSvg = () => {
  const width = 800;
  const height = 300;

  return (
    <svg width={width} height={height} viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <path
        id="animate-motion-path"
        fill="none"
        stroke="lightgrey"
        d="M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z"
      />

      <rect width="10" height="10" fill="aliceblue">
        <animateMotion
          dur="10s"
          repeatCount="indefinite"
          rotate="auto"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.42 0 0.58 1"
        >
          <mpath href="#animate-motion-path" />
        </animateMotion>
      </rect>
    </svg>
  );
};
