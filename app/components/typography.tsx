import { cn } from "lib/utils/styles";
import { Slot } from "@radix-ui/react-slot";

export type TextBodyMProps = React.HTMLAttributes<HTMLParagraphElement> & {
  asChild?: boolean;
};

export function TextBodyM({
  className,
  children,
  asChild,
  ...props
}: TextBodyMProps) {
  const Comp = asChild ? Slot : "p";

  return (
    <Comp {...props} className={cn("text-base leading-[150%]", className)}>
      {children}
    </Comp>
  );
}

export type TextBodySProps = React.HTMLAttributes<HTMLParagraphElement> & {
  asChild?: boolean;
};

export function TextBodyS({
  className,
  children,
  asChild,
  ...props
}: TextBodySProps) {
  const Comp = asChild ? Slot : "p";

  return (
    <Comp {...props} className={cn("text-xs leading-[150%]", className)}>
      {children}
    </Comp>
  );
}

export type TextHeadingSProps = React.HTMLAttributes<HTMLHeadingElement>;

export function TextHeadingS({
  className,
  children,
  ...props
}: TextHeadingSProps) {
  return (
    <h3
      className={cn("font-bold text-base leading-[150%]", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export type TextHeadingMProps = React.HTMLAttributes<HTMLHeadingElement>;

export function TextHeadingM({
  className,
  children,
  ...props
}: TextHeadingMProps) {
  return (
    <h3
      className={cn("font-bold text-[32px] leading-[150%]", className)}
      {...props}
    >
      {children}
    </h3>
  );
}
