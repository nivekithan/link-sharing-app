import { cn } from "@/utils/styles";
import BuiltIcon from "./icon";

export function Icon({ className, ...props }: Parameters<typeof BuiltIcon>[0]) {
  return <BuiltIcon {...props} className={cn("w-full h-full", className)} />;
}

export function LogoDevlinksSmall() {
  return (
    <div className="w-10 h-10">
      <Icon icon="logo-devlinks-small" className="w-full h-full text-purple" />
    </div>
  );
}
