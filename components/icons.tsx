type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "square" as const,
  viewBox: "0 0 16 16",
  "aria-hidden": true,
  focusable: false as const,
};

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12 12 4M5.5 4H12v6.5" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2 8h12M9 3l5 5-5 5" />
    </svg>
  );
}

export function ArrowDown(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 2v12M3 9l5 5 5-5" />
    </svg>
  );
}

export function Phone(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.2 2h2.3l1 3-1.4 1a9 9 0 0 0 3.9 3.9l1-1.4 3 1v2.3c0 .7-.6 1.2-1.2 1.2C7.6 13 3 8.4 3 2.2 3 1.6 3.5 2 4.2 2Z" />
    </svg>
  );
}

export function WhatsApp(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 1.6A6.4 6.4 0 0 0 2.3 10.7L1.4 14.6l4-1a6.4 6.4 0 1 0 2.6-11Z" />
      <path d="M5.6 5.2c.2 0 .4 0 .5.4l.6 1.4c0 .2 0 .3-.1.4l-.4.5c-.1.2-.2.3 0 .6.5.9 1.3 1.7 2.3 2.1.3.1.4 0 .6-.1l.5-.5c.1-.2.3-.2.5-.1l1.4.7c.2.1.3.2.3.4v.4c0 .4-.4.7-.8.7-2.4 0-4.6-2-4.9-4.3 0-.3.3-.6.4-.8Z" />
    </svg>
  );
}

export function Instagram(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="2" width="12" height="12" />
      <circle cx="8" cy="8" r="3" />
      <circle cx="11.6" cy="4.4" r=".7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Close(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m3 3 10 10M13 3 3 13" />
    </svg>
  );
}

export function Menu({ open, ...props }: IconProps & { open: boolean }) {
  return (
    <svg {...base} {...props}>
      <path d={open ? "m3 3 10 10M13 3 3 13" : "M2 5h12M2 11h12"} />
    </svg>
  );
}
