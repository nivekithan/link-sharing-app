import { authSessionStorage, requireAnon } from "@/authSession.server";
import { createUser, isEmailUnique } from "@/models/user.server";
import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import {
  type ActionFunctionArgs,
  json,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { z } from "zod";
import { PrimaryActionButton } from "~/components/buttons";
import { LogoDevlinksSmall } from "~/components/icons";
import { InputField } from "~/components/inputs";
import { TextBodyM, TextBodyS, TextHeadingM } from "~/components/typography";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnon(request);
  return null;
}

const RegisterSchema = z
  .object({
    email: z
      .string({ required_error: "Can't be empty" })
      .email("Must be valid email"),
    password: z
      .string({ required_error: "Can't be empty" })
      .min(8, "Password is too small"),
    confirmPassword: z
      .string({ required_error: "Can't be empty" })
      .min(8, "Password is too small"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Confirm password does not match password",
        path: ["confirmPassword"],
      });
      return z.NEVER;
    }
  });

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = await parse(formData, {
    schema(intent: string) {
      return RegisterSchema.transform(async ({ email, password }, ctx) => {
        if (intent !== "submit") {
          return z.NEVER;
        }

        const isEmailUniqueRes = await isEmailUnique({ email });

        if (!isEmailUniqueRes) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "There already exists a account with this email",
            path: ["email"],
          });
          return z.NEVER;
        }

        return { email: email, password: password };
      });
    },
    async: true,
  });

  if (!submission.value || submission.intent !== "submit") {
    return json({ submission });
  }

  const { email, password } = submission.value;

  const createdUser = await createUser({ email, plainTextPassword: password });

  const authSession = await authSessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  authSession.set("userId", createdUser.id);

  return redirect("/", {
    headers: {
      "Set-Cookie": await authSessionStorage.commitSession(authSession),
    },
  });
}

export default function RegisterPage() {
  const actionData = useActionData<typeof action>();

  const [
    loginForm,
    {
      email: emailField,
      password: passwordField,
      confirmPassword: confirmPasswordField,
    },
  ] = useForm({
    lastSubmission: actionData?.submission,
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema: RegisterSchema });
    },
  });

  return (
    <div className="md:bg-lightGray md:grid md:place-items-center">
      <div className="p-8 flex flex-col gap-y-16 md:items-center md:justify-center md:min-h-screen md:gap-y-[52px] ">
        <div className="flex gap-x-2 items-center">
          <LogoDevlinksSmall />
          <span className="font-bold text-2xl md:text-4xl">devlinks</span>
        </div>
        <div className="flex flex-col gap-y-10 md:bg-white md:p-10 md:rounded-xl md:w-[476px]">
          <div className="flex flex-col gap-y-2">
            <p className="text-2xl font-bold md:hidden text-dark-gray">
              Create Account
            </p>
            <TextHeadingM className="hidden text-dark-gray md:block">
              Create Account
            </TextHeadingM>

            <TextBodyM className="text-gray">
              Let's get you started sharing your links
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
                placeholder: "Atleast 8 characters",
                type: "password",
                error: passwordField.error,
                ...conform.input(passwordField),
              }}
            />
            <InputField
              labelValue="Confirm password"
              inputProps={{
                icon: "icon-password",
                placeholder: "Atleast 8 characters",
                type: "password",
                error: confirmPasswordField.error,
                ...conform.input(confirmPasswordField),
              }}
            />
            <TextBodyS className="text-gray">
              Password must contain at least 8 characters
            </TextBodyS>
            <PrimaryActionButton type="submit">
              Create new account
            </PrimaryActionButton>
            <TextBodyM className="flex flex-col md:flex-row md:gap-x-1 md:justify-center">
              <span className="text-gray">Already have an account?</span>{" "}
              <Link className="text-purple" prefetch="intent" to="/login">
                Login
              </Link>
            </TextBodyM>
          </Form>
        </div>
      </div>
    </div>
  );
}
