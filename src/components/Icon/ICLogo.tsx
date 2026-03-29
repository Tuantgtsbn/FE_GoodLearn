const ICLogo = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="38"
    height="34"
    viewBox="0 0 38 34"
    fill="none"
    {...props}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_1_845)">
      <rect
        x="2"
        y="1"
        width="34"
        height="30"
        rx="12"
        fill="#18181B"
        shapeRendering="crispEdges"
      />
      <path
        d="M19 25L12 21.2V15.2L8 13L19 7L30 13V21H28V14.1L26 15.2V21.2L19 25V25M19 16.7L25.85 13L19 9.3L12.15 13L19 16.7V16.7M19 22.725L24 20.025V16.25L19 19L14 16.25V20.025L19 22.725V22.725M19 16.7V16.7V16.7V16.7V16.7V16.7M19 18.95V18.95V18.95V18.95V18.95V18.95V18.95V18.95V18.95V18.95M19 18.95V18.95V18.95V18.95V18.95V18.95V18.95V18.95V18.95V18.95"
        fill="white"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_1_845"
        x="0"
        y="0"
        width="38"
        height="34"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="1" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1_845"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1_845"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export default ICLogo;
