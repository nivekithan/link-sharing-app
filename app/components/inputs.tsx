import { cn } from "@/utils/styles";
import Icon, { type IconName } from "./icons/icon";
import { TextBodyS } from "./typography";
import { useId } from "react";

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
        <Icon icon={icon} className="w-full h-full text-gray" />
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
