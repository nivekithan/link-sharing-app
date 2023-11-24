import { cn } from "@/utils/styles";
import Icon, { type IconName } from "./icons/icon";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: IconName;
};

export function Input({ className, icon, ...props }: InputProps) {
  return (
    <div className="relative">
      <input
        className={cn(
          "w-full rounded-lg border-borders border pl-11 pr-4 py-3 text-base leading-[150%] text-dark-gray focus:border-purple outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-active caret-purple ",
        )}
        {...props}
      />
      <div className="w-4 h-4 top-4 left-4 bottom-4 absolute">
        <Icon icon={icon} className="w-full h-full text-gray" />
      </div>
    </div>
  );
}
