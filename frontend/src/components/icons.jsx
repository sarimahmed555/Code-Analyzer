const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconUpload = (props) => (
  <svg {...base} {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const IconCode = (props) => (
  <svg {...base} {...props}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

export const IconBug = (props) => (
  <svg {...base} {...props}>
    <rect x="8" y="6" width="8" height="14" rx="4" />
    <path d="M19 7l-3 2M5 7l3 2M19 17l-3-2M5 17l3-2" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="9" y1="3" x2="12" y2="6" />
    <line x1="15" y1="3" x2="12" y2="6" />
  </svg>
);

export const IconShield = (props) => (
  <svg {...base} {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

export const IconZap = (props) => (
  <svg {...base} {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export const IconSparkles = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
    <path d="M19 15l.9 2.4L22 18.3l-2.1.9L19 21.6l-.9-2.4L16 18.3l2.1-.9L19 15z" />
    <path d="M5 16l.7 1.8L7.5 18.5l-1.8.7L5 21l-.7-1.8L2.5 18.5l1.8-.7L5 16z" />
  </svg>
);

export const IconCopy = (props) => (
  <svg {...base} {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const IconCheck = (props) => (
  <svg {...base} {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const IconRocket = (props) => (
  <svg {...base} {...props}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

export const IconSpinner = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
    <path
      className="opacity-90"
      fill="currentColor"
      d="M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6V3z"
    />
  </svg>
);

export const IconGlobe = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const IconFileCheck = (props) => (
  <svg {...base} {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <polyline points="9 15 11 17 15 13" />
  </svg>
);