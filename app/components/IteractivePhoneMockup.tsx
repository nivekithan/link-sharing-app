import { PhoneMockup } from "./illustrations/phoneMockup";
import { usePlatformLinkStore } from "./inputs";
import { PlatformLinks } from "./platformLinks";

export function InteractivePhoneMockup({
  email,
  firstName,
  lastName,
  pictureUrl,
}: {
  firstName?: string;
  lastName?: string;
  email?: string;
  pictureUrl?: string;
}) {
  const links = usePlatformLinkStore((store) => store.links);
  const firstFivelinks = links.slice(0, 5);

  return (
    <div className="hidden xl:grid min-w-[560px] max-h-[810px] bg-white p-6 place-items-center sticky top-[96px]">
      <div className="relative">
        <PhoneMockup />
        {pictureUrl ? (
          <img
            className="w-[104px] h-[104px] bg-size border-4 border-purple rounded-full absolute left-[105px] right-[105px] top-[63.5px]"
            src={pictureUrl}
            alt={`${firstName} ${lastName}`}
          />
        ) : null}

        {firstName || lastName ? (
          <p className="text-dark-gray text-base font-semibold leading-[150%] absolute bg-white top-[184.5px] left-0 right-0 mx-auto text-center w-[160px]">{`${firstName} ${lastName}`}</p>
        ) : null}

        {email ? (
          <p className="text-gray text-sm absolute text-center w-[160px] top-[213.5px] left-0 right-0 mx-auto bg-white">
            {email}
          </p>
        ) : null}

        {firstFivelinks.map((platformLink, i) => {
          const platform = platformLink.platform;
          const link = platformLink.link;

          if (link === undefined) {
            return null;
          }

          return (
            <div
              className="absolute left-[35.5px] right-[35.5px]"
              key={platformLink.id}
              style={{ top: `${277.5 + i * (42 + 23)}px` }}
            >
              <PlatformLinks platformLink={{ link, platform }} small />
            </div>
          );
        })}
      </div>
    </div>
  );
}
