import { requireUser } from "@/authSession.server";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { Icon, LogoDevlinksSmall } from "~/components/icons";
import { TabLinks, Tabs } from "~/components/tabLinks";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUser(request);

  return json({ userId });
}

export default function Dash() {
  const { userId } = useLoaderData<typeof loader>();
  return (
    <div className="bg-lightGray">
      <div className="bg-white flex justify-between items-center pl-6 py-4 pr-4">
        <LogoDevlinksSmall />
        <Tabs>
          <TabLinks icon="icon-link" to="/dash/links" value="links" />
          <TabLinks
            icon="icon-profile-details-header"
            to="/dash/profile"
            value="profile"
          />
        </Tabs>
        <div>
          <Link
            to={`/preview/${userId}`}
            className="px-4 py-3 text-purple border border-purple rounded-lg block"
          >
            <Icon className="w-5 h-5" icon="icon-preview-header" />
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
