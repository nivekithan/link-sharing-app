import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import {
  json,
  type ActionFunctionArgs,
  type MetaFunction,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { LogoDevlinksSmall } from "~/components/icons";
import { InputField } from "~/components/inputs";
import { TextBodyM } from "~/components/typography";
import { z } from "zod";
import { Form, Link, useActionData } from "@remix-run/react";
import { PrimaryActionButton } from "~/components/buttons";
import { isPasswordCorrect } from "@/models/user.server";
import { authSessionStorage, requireAnon } from "@/authSession.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Link sharing app" },
    { name: "description", content: "Submission for frontend mentor" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnon(request);
  return null;
}

const LoginSchema = z.object({
  email: z
    .string({ required_error: "Can't be empty" })
    .email("Must be valid email"),
  password: z
    .string({ required_error: "Can't be empty" })
    .min(8, "Password is too small"),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = await parse(formData, {
    async: true,
    schema(intent: string) {
      return LoginSchema.transform(async ({ email, password }, ctx) => {
        if (intent !== "submit") {
          return z.NEVER;
        }

        const isPasswordCorrectRes = await isPasswordCorrect({
          email,
          plainTextPassword: password,
        });

        if (isPasswordCorrectRes.status === "ACCOUNT_NOT_FOUND") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "There exists no account with this email",
            path: ["email"],
          });
          return z.NEVER;
        } else if (
          isPasswordCorrectRes.status === "INCORRECT_PASSWORD_OR_EMAIL"
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid email or password",
            path: ["password"],
          });
          return z.NEVER;
        }

        const userAccount = isPasswordCorrectRes.user;
        return userAccount;
      });
    },
  });

  if (!submission.value || submission.intent !== "submit") {
    return json({ submission });
  }

  const authSession = await authSessionStorage.getSession(
    request.headers.get("Cookie"),
  );
  const userData = submission.value;

  authSession.set("userId", userData.id);

  return redirect("/", {
    headers: {
      "Set-Cookie": await authSessionStorage.commitSession(authSession),
    },
  });
}

export default function Index() {
  const actionData = useActionData<typeof action>();

  const [loginForm, { email: emailField, password: passwordField }] = useForm({
    lastSubmission: actionData?.submission,
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema: LoginSchema });
    },
  });

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
        <Form
          className="flex flex-col gap-y-6"
          {...loginForm.props}
          method="POST"
        >
          <InputField
            labelValue="Email address"
            inputProps={{
              icon: "icon-email",
              placeholder: "e.g.alex@email.com",
              type: "email",
              error: emailField.error,
              ...conform.input(emailField),
            }}
          />
          <InputField
            labelValue="Password"
            inputProps={{
              icon: "icon-password",
              placeholder: "Enter your password",
              type: "password",
              error: passwordField.error,
              ...conform.input(passwordField),
            }}
          />
          <PrimaryActionButton type="submit">Login</PrimaryActionButton>
          <TextBodyM className="text-center flex flex-col">
            <span className="text-gray">Don't have an account?</span>{" "}
            <Link to="/register" className="text-purple">
              Create account
            </Link>
          </TextBodyM>
        </Form>
      </div>
    </div>
  );
}
