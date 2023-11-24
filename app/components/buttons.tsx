import { cn } from "@/utils/styles";
import { TextHeadingS } from "./typography";

export type PrimaryActionButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryActionButton({
  className,
  children,
  ...props
}: PrimaryActionButtonProps) {
  return (
    <button
      className={cn(
        "bg-purple text-white px-7 py-3 rounded-lg disabled:bg-purple/25 hover:bg-purpleHover",
        className,
      )}
      {...props}
    >
      <TextHeadingS>{children}</TextHeadingS>
    </button>
  );
}
