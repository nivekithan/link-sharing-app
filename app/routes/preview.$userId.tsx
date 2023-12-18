import { requireUser } from "@/authSession.server";
import { getLinksForUser } from "@/models/links.server";
import { getProfileDetails } from "@/models/profile.server";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { PrimaryActionButton } from "~/components/buttons";
import { PlatformLinks } from "~/components/platformLinks";
import { TextBodyM, TextHeadingM, TextHeadingS } from "~/components/typography";
import { resolveValue, toast, Toaster } from "react-hot-toast";
import { Icon } from "~/components/icons";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUser(request);

  const [profileDetials, userLinks] = await Promise.all([
    getProfileDetails(userId),
    getLinksForUser({ userId }),
  ]);

  if (profileDetials === null || userLinks.length === 0) {
    throw new Response("Not found", { status: 404 });
  }

  return json({ profileDetials, userLinks });
}

export default function PreviewComponent() {
  const { profileDetials, userLinks } = useLoaderData<typeof loader>();

  function onShareLink() {
    navigator.clipboard.writeText(window.location.href);
    toast("The link has been copied to your clipboard");
  }
  return (
    <div>
      <div className="hidden md:block md:absolute bg-purple top-0 left-0 right-0 h-[357px] rounded-b-[32px] -z-10"></div>
      <div className="md:p-6">
        <div className="flex items-center gap-x-4 pl-6 py-4 pr-4 justify-between bg-white rounded-xl">
          <Link
            to="/dash/links"
            className="rounded-lg px-7 py-3 text-purple border border-purple"
          >
            <TextHeadingS>Back to Editor</TextHeadingS>
          </Link>
          <PrimaryActionButton type="button" onClick={onShareLink}>
            Share Link
          </PrimaryActionButton>
        </div>
      </div>
      <div className="grid place-items-center mt-[60px] ">
        <div className="bg-white rounded-xl py-12 px-14 md:shadow-drop w-[349px]">
          <div className="flex flex-col gap-y-14 justify-center items-center">
            <div className="flex flex-col gap-y-6 items-center justify-center">
              <img
                className="w-[104px] h-[104px] bg-size border-4 border-purple rounded-full"
                src={profileDetials.pictureUrl}
                alt={`${profileDetials.firstName} ${profileDetials.lastName}`}
              />

              <div className="flex flex-col gap-y-2 items-center justify-center">
                <TextHeadingM className="text-dark-gray">{`${profileDetials.firstName} ${profileDetials.lastName}`}</TextHeadingM>
                <TextBodyM className="text-gray">
                  {profileDetials.email}
                </TextBodyM>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-y-5 w-full">
              {userLinks.map((userLink) => {
                return (
                  <PlatformLinks
                    platformLink={userLink}
                    key={userLink.platform}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-center">
        {(t) => (
          <div className="bg-dark-gray text-white rounded-xl px-6 py-4 flex gap-x-2 items-center shadow-drop">
            <Icon icon="icon-link" className="w-5 h-5 text-gray" />
            <TextHeadingS>{resolveValue(t.message, t)}</TextHeadingS>
          </div>
        )}
      </Toaster>
    </div>
  );
}
