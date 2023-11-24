import type { MetaFunction } from "@remix-run/node";
import { useId } from "react";
import { LogoDevlinksSmall } from "~/components/icons";
import { Input } from "~/components/inputs";
import { TextBodyM, TextBodyS, TextHeadingS } from "~/components/typography";

export const meta: MetaFunction = () => {
  return [
    { title: "Link sharing app" },
    { name: "description", content: "Submission for frontend mentor" },
  ];
};

export default function Index() {
  const passwordId = useId();
  const emailId = useId();

  return (
    <div className="p-8 flex flex-col gap-y-16">
      <div className="flex gap-x-2 items-center">
        <LogoDevlinksSmall />
        <span className="font-bold text-2xl">devlinks</span>
      </div>
      <div className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-2">
          <p className="text-2xl font-bold">Login</p>
          <TextBodyM className="text-gray">
            Add your details below to get back into the app
          </TextBodyM>
        </div>
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-1">
            <TextBodyS asChild>
              <label htmlFor={emailId}>Email address</label>
            </TextBodyS>
            <Input
              icon="icon-email"
              id={emailId}
              placeholder="e.g.alex@email.com"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <TextBodyS asChild>
              <label htmlFor={passwordId}>Password</label>
            </TextBodyS>
            <Input
              icon="icon-password"
              placeholder="Enter your password"
              type="password"
              id={passwordId}
            />
          </div>
          <button className="bg-purple text-white px-7 py-3 rounded-lg disabled:bg-purple/25 hover:bg-purpleHover">
            <TextHeadingS>Login</TextHeadingS>
          </button>
          <TextBodyM className="text-center flex flex-col">
            <span className="text-gray">Don't have an account ?</span>{" "}
            <span className="text-purple">Create account</span>
          </TextBodyM>
        </div>
      </div>
    </div>
  );
}
