import { requireUser } from "@/authSession.server";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { PrimaryActionButton } from "~/components/buttons";
import { EmptyLinksIllustration } from "~/components/illustrations/emptyLinks";
import { TextBodyM, TextHeadingS } from "~/components/typography";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUser(request);

  return null;
}

export default function DashLinks() {
  return (
    <div className="p-4">
      <div className="bg-white">
        <div className="p-6 flex flex-col gap-y-10">
          <div className="flex flex-col gap-y-2">
            <h3 className="text-2xl leading-[150%] font-bold">
              Customize your links
            </h3>
            <TextBodyM className="text-gray">
              Add/edit/remove links below and then share your profiles with the
              world!
            </TextBodyM>
          </div>
          <div className="flex flex-col gap-y-6">
            <button
              className="px-7 py-3 text-purple border border-purple rounded-lg"
              type="button"
            >
              <TextHeadingS>+Add new link</TextHeadingS>
            </button>
            <div className="p-5 flex flex-col gap-y-6 items-center">
              <EmptyLinksIllustration height={80} />
              <p className="text-2xl font-bold leading-[150%] text-dark-gray">
                Let's get you started
              </p>
              <TextBodyM className="text-gray text-center">
                Use the "Add new link" button to get started. Once you have more
                than one link, you can reorder and edit them. We're here to help
                you share profiles with everyone
              </TextBodyM>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-borders w-[full]"></div>
      <div className="px-7 py-3">
        <PrimaryActionButton disabled className="w-full">
          Save
        </PrimaryActionButton>
      </div>
    </div>
  );
}
