import { requireUser } from "@/authSession.server";
import { getLinksForUser } from "@/models/links.server";
import { getProfileDetails } from "@/models/profile.server";
import { type ListOfLinks } from "@/models/schema.server";
import { cn } from "@/utils/styles";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { PrimaryActionButton } from "~/components/buttons";
import { Icon } from "~/components/icons";
import { platformLinkOptions } from "~/components/inputs";
import { TextBodyM, TextHeadingM, TextHeadingS } from "~/components/typography";

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
          <PrimaryActionButton>Share Link</PrimaryActionButton>
        </div>
      </div>
      <div className="grid place-items-center mt-[60px]">
        <div className="bg-white rounded-xl py-12 px-14 md:shadow-drop">
          <div className="flex flex-col gap-y-14 justify-center items-center w-fit">
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
    </div>
  );
}

function PlatformLinks({
  platformLink,
}: {
  platformLink: ListOfLinks[number];
}) {
  const platformLinkOption = useMemo(() => {
    return platformLinkOptions.find(
      (option) => option.value === platformLink.platform,
    );
  }, [platformLink]);

  if (platformLinkOption === undefined) {
    throw new Error(`Invalid platformValue: ${platformLink.platform}`);
  }

  return (
    <Link
      to={platformLink.link}
      className={cn(
        "p-4 flex gap-x-2 w-full rounded-lg items-center",
        platformLinkOption.fontColor ? undefined : "text-white",
      )}
      style={{ backgroundColor: platformLinkOption.bgColor }}
      target="_blank"
    >
      <div className="w-5 h-5">
        <Icon icon={platformLinkOption.icon} />
      </div>
      <TextBodyM className="flex-1">{platformLinkOption.displayText}</TextBodyM>
      <div className="w-4 h-4">
        <Icon icon="icon-arrow-right" />
      </div>
    </Link>
  );
}
