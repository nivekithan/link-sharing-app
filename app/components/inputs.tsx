import { cn } from "@/utils/styles";
import { type IconName } from "./icons/icon";
import { TextBodyS } from "./typography";
import { useId, useState } from "react";
import * as Select from "@radix-ui/react-select";
import { Icon } from "./icons";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: IconName;
  error?: string;
};

function Input({ className, icon, error, ...props }: InputProps) {
  return (
    <div className="relative">
      <input
        className={cn(
          "w-full rounded-lg border-borders border pl-11 pr-4 py-3 text-base leading-[150%] text-dark-gray focus:border-purple outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-active caret-purple",
          error ? "border-red" : undefined,
          className,
        )}
        {...props}
      />
      <div className="w-4 h-4 top-4 left-4 bottom-4 absolute">
        <Icon icon={icon} className="text-gray" />
      </div>
      {error ? (
        <TextBodyS className="absolute top-4 bottom-4 right-4 text-red">
          {error}
        </TextBodyS>
      ) : null}
    </div>
  );
}

export type InputFieldProps = {
  labelValue: string;
  inputProps: InputProps;
};

export function InputField({ labelValue, inputProps }: InputFieldProps) {
  const id = useId();
  const error = inputProps.error;

  return (
    <div className="flex flex-col gap-y-1">
      <TextBodyS asChild>
        <label htmlFor={id} className={cn(error ? "text-red" : undefined)}>
          {labelValue}
        </label>
      </TextBodyS>
      <Input id={id} {...inputProps} />
    </div>
  );
}

const platformLinkOptions = [
  { displayText: "Github", icon: "icon-github", value: "github" },
  {
    displayText: "Frontend Mentor",
    icon: "icon-frontend-mentor",
    value: "frontend-mentor",
  },
  {
    displayText: "Twitter",
    icon: "icon-twitter",
    value: "twitter",
  },
  {
    displayText: "LinkedIn",
    icon: "icon-linkedin",
    value: "linkedin",
  },
  {
    displayText: "Youtube",
    icon: "icon-youtube",
    value: "youtube",
  },
  {
    displayText: "Facebook",
    icon: "icon-facebook",
    value: "facebook",
  },
  {
    displayText: "Twitch",
    icon: "icon-twitch",
    value: "twitch",
  },
  {
    displayText: "Codewars",
    icon: "icon-codewars",
    value: "codewars",
  },
  {
    displayText: "Codepen",
    icon: "icon-codepen",
    value: "codepen",
  },
  {
    displayText: "freecodecamp",
    icon: "icon-freecodecamp",
    value: "freecodecamp",
  },
  {
    displayText: "Gitlab",
    icon: "icon-gitlab",
    value: "gitlab",
  },
  {
    displayText: "Hashnode",
    icon: "icon-hashnode",
    value: "hashnode",
  },
  {
    displayText: "Stack Overflow",
    icon: "icon-stack-overflow",
    value: "stack-overflow",
  },
] as const satisfies { value: string; icon: IconName; displayText: string }[];

type PlatformLinkValue = (typeof platformLinkOptions)[number]["value"];

export function SelectPlatform() {
  const [selectedPlatform, setSelectedPlaform] =
    useState<PlatformLinkValue>("github");

  return (
    <Select.Root
      value={selectedPlatform}
      onValueChange={(v) => setSelectedPlaform(v as PlatformLinkValue)}
    >
      <Select.Trigger className="w-full rounded-lg border-borders border p-4 text-base leading-[150%] text-dark-gray data-[state=open]:border-purple outline-none data-[state=open]:ring-0 data-[state=open]:ring-offset-0 data-[state=open]:shadow-active caret-purple text-start flex items-center justify-between group">
        <div className="flex gap-x-3 items-center">
          <div className="w-4 h-4 text-gray ">
            <Icon
              icon={
                platformLinkOptions.find((v) => v.value === selectedPlatform)!
                  .icon
              }
            />
          </div>
          <Select.Value />
        </div>
        <div className="w-4 h-4 text-purple group-data-[state=open]:rotate-180 transition-transform duration-75">
          <Icon icon="icon-chevron-down" />
        </div>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={8}
          side="bottom"
          className="border border-borders rounded-lg max-h-[--radix-select-content-available-height] w-[--radix-select-trigger-width]"
          avoidCollisions={false}
        >
          <Select.Viewport>
            {platformLinkOptions.map((platformLink) => {
              return (
                <Select.Item
                  value={platformLink.value}
                  key={platformLink.value}
                  className="group flex gap-x-3 p-4 text-base leading-[150%] text-dark-gary bg-white items-center data-[state=checked]:text-purple"
                >
                  <Select.Icon>
                    <div className="w-4 h-4 text-gray group-data-[state=checked]:text-purple">
                      <Icon icon={platformLink.icon} />
                    </div>
                  </Select.Icon>
                  <span>
                    <Select.ItemText>
                      {platformLink.displayText}
                    </Select.ItemText>{" "}
                    <span className="text-purple hidden group-data-[state=checked]:inline">
                      (Selected)
                    </span>
                  </span>
                </Select.Item>
              );
            })}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
