import { type SVGProps } from "react";
import href from "./icon.svg";
export { href };

export default function Icon({ icon, ...props}: SVGProps<SVGSVGElement> & { icon: IconName }) {
  return (
    <svg {...props}>
      <use href={`${href}#${icon}`} />
    </svg>
  );
}

export const iconNames = [
  "icon-email",
  "icon-password",
  "logo-devlinks-large",
  "logo-devlinks-small",
] as const;
export type IconName = typeof iconNames[number];