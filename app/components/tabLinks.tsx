import { cn } from "@/utils/styles";
import { Link, useLocation } from "@remix-run/react";
import { type IconName } from "./icons/icon";
import { type RemixLinkProps } from "@remix-run/react/dist/components";
import { createContext, useContext } from "react";
import { match } from "path-to-regexp";
import { Icon } from "./icons";

export type TabsProps = React.HTMLAttributes<HTMLDivElement>;

const TabContext = createContext<string | null>(null);

function useTabContext() {
  const value = useContext(TabContext);

  if (value === null) {
    throw new Error("TabLinks must be used within <Tabs />");
  }

  return value;
}

export function Tabs({ className, children }: TabsProps) {
  const location = useLocation();
  const path = location.pathname;

  const decodeUri = match<{ tabValue: string }>("/dash/:tabValue/:left*", {
    decode: decodeURIComponent,
  });

  const decodedUri = decodeUri(path);

  if (!decodedUri) {
    throw new Error("Unexpected Error: Unknown path");
  }

  const tabValue = decodedUri.params["tabValue"];

  return (
    <TabContext.Provider value={tabValue}>
      <div className={cn("flex", className)}>{children}</div>{" "}
    </TabContext.Provider>
  );
}

export type TabLinksProps = RemixLinkProps & { icon: IconName; value: string };

export function TabLinks({ className, icon, value, ...props }: TabLinksProps) {
  const tabValue = useTabContext();
  const isTabActive = tabValue === value;

  return (
    <Link
      className={cn(
        "rounded-lg px-7 py-3 text-gray block",
        isTabActive ? "bg-lightPurple text-purple" : undefined,
        className,
      )}
      prefetch="intent"
      {...props}
    >
      <Icon className="w-5 h-5" icon={icon} />
    </Link>
  );
}
