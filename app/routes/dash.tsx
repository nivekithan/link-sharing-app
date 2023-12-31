import { requireUser } from "@/authSession.server";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { Icon, LogoDevlinksSmall } from "~/components/icons";
import { TabLinks, Tabs } from "~/components/tabLinks";
import { TextHeadingS } from "~/components/typography";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUser(request);

  return json({ userId });
}

export default function Dash() {
  const { userId } = useLoaderData<typeof loader>();
  return (
    <div className="bg-lightGray">
      <div className="bg-white flex justify-between items-center pl-6 py-4 pr-4 sticky top-0 z-50">
        <div className="md:hidden">
          <LogoDevlinksSmall />
        </div>
        <div className="hidden md:flex md:gap-x-2 md:items-center">
          <LogoDevlinksSmall />
          <span className="font-bold text-2xl">devlinks</span>
        </div>
        <Tabs>
          <TabLinks icon="icon-link" to="/dash/links" value="links">
            Links
          </TabLinks>
          <TabLinks
            icon="icon-profile-details-header"
            to="/dash/profile"
            value="profile"
          >
            Profile Details
          </TabLinks>
        </Tabs>
        <div>
          <Link
            to={`/preview/${userId}`}
            className="px-4 py-3 text-purple border border-purple rounded-lg block"
          >
            <Icon className="w-5 h-5 md:hidden" icon="icon-preview-header" />
            <TextHeadingS className="hidden md:inline">Preview</TextHeadingS>
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
