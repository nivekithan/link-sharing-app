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
  "icon-arrow-right",
  "icon-chevron-down",
  "icon-codepen",
  "icon-codewars",
  "icon-devto",
  "icon-drag-and-drop",
  "icon-email",
  "icon-facebook",
  "icon-freecodecamp",
  "icon-frontend-mentor",
  "icon-github",
  "icon-gitlab",
  "icon-hashnode",
  "icon-link",
  "icon-linkedin",
  "icon-password",
  "icon-preview-header",
  "icon-profile-details-header",
  "icon-stack-overflow",
  "icon-twitch",
  "icon-twitter",
  "icon-upload-image",
  "icon-youtube",
  "logo-devlinks-large",
  "logo-devlinks-small",
] as const;
export type IconName = typeof iconNames[number];