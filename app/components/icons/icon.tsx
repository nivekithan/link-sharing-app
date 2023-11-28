import { type SVGProps } from "react";
import href from "./icon.svg";
import { cn } from "@/utils/styles";
export { href };

export default function Icon({
  icon,
  className,
  ...props
}: SVGProps<SVGSVGElement> & { icon: IconName }) {
  return (
    <svg className={cn("w-full h-full", className)} {...props}>
      <use href={`${href}#${icon}`} />
    </svg>
  );
}

export const iconNames = [
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
  "icon-youtube",
  "logo-devlinks-large",
  "logo-devlinks-small",
] as const;
export type IconName = (typeof iconNames)[number];
