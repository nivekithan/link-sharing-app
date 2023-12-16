import { type ListOfLinks } from "@/models/schema.server";
import { useMemo } from "react";
import { platformLinkOptions } from "./inputs";
import { Link } from "@remix-run/react";
import { cn } from "@/utils/styles";
import { Icon } from "./icons";
import { TextBodyM, TextBodyS } from "./typography";

export function PlatformLinks({
  platformLink,
  small = false,
}: {
  platformLink: ListOfLinks[number];
  small?: boolean;
}) {
  const platformLinkOption = useMemo(() => {
    return platformLinkOptions.find(
      (option) => option.value === platformLink.platform,
    );
  }, [platformLink]);

  if (platformLinkOption === undefined) {
    throw new Error(`Invalid platformValue: ${platformLink.platform}`);
  }

  return (
    <Link
      to={platformLink.link}
      className={cn(
        "px-4 py-4 flex gap-x-2 w-full rounded-lg items-center",
        "fontColor" in platformLinkOption ? undefined : "text-white",
        small ? "py-[12px]" : undefined,
      )}
      style={{
        backgroundColor: platformLinkOption.bgColor,
        color:
          "fontColor" in platformLinkOption
            ? platformLinkOption.fontColor
            : undefined,
      }}
      target="_blank"
    >
      <div className={cn("w-5 h-5", small ? "w-4 h-4" : undefined)}>
        <Icon icon={platformLinkOption.icon} />
      </div>
      <TextBodyM className={cn("flex-1", small ? "hidden" : undefined)}>
        {platformLinkOption.displayText}
      </TextBodyM>
      <TextBodyS className={cn("flex-1 hidden", small ? "block" : undefined)}>
        {platformLinkOption.displayText}
      </TextBodyS>
      <div className="w-4 h-4">
        <Icon icon="icon-arrow-right" />
      </div>
    </Link>
  );
}
