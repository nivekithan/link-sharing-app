import { requireUser } from "@/authSession.server";
import { cn } from "@/utils/styles";
import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { type ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { type ChangeEvent, useRef, useState } from "react";
import { z } from "zod";
import { PrimaryActionButton } from "~/components/buttons";
import { Icon } from "~/components/icons";
import { InputField } from "~/components/inputs";
import { TextBodyM, TextBodyS, TextHeadingS } from "~/components/typography";
import "~/styles/overlayButton.css";

const SetProfileDetialsSchema = z.object({
  profilePicture: z.instanceof(File, {
    message: "Profile picture is required",
  }),
  firstName: z.string({ required_error: "First name is required" }).min(0),
  lastName: z.string({ required_error: "Lastname is required" }).min(0),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Provide valid email address" }),
});

export async function action({ request }: ActionFunctionArgs) {
  const [, formData] = await Promise.all([
    requireUser(request),
    request.formData(),
  ]);

  const submission = parse(formData, { schema: SetProfileDetialsSchema });

  if (!submission.value || submission.intent !== "submit") {
    return json({ submission });
  }

  return json({ submission });
}

export default function DashProfile() {
  const fileUploadRef = useRef<HTMLInputElement | null>(null);
  const actionData = useActionData<typeof action>();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [
    profileForm,
    {
      email: emailField,
      firstName: firstNameField,
      lastName: lastNameField,
      profilePicture: profilePictureField,
    },
  ] = useForm({
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: SetProfileDetialsSchema });
    },
  });

  function onUploadImage() {
    fileUploadRef.current?.click();
  }

  function onUploadImageInputChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.currentTarget.files && e.currentTarget.files[0];

    console.log({ selectedFile });
    if (!selectedFile) {
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = (loadFinishedEvent) => {
      const imageUrl = loadFinishedEvent.target?.result;

      if (typeof imageUrl !== "string") {
        throw new Error("Unable to read file");
      }

      console.log({ imageUrl });
      setImagePreviewUrl(imageUrl);
    };

    fileReader.readAsDataURL(selectedFile);
  }

  return (
    <div className="p-4 bg-lightGray">
      <Form
        className="bg-white"
        method="POST"
        encType="multipart/form-data"
        {...profileForm.props}
      >
        <div className="p-6 flex flex-col gap-y-10">
          <div className="flex flex-col gap-y-2">
            <h3 className="font-bold text-2xl leading-[150%] text-dark-gray">
              Profile Details
            </h3>
            <TextBodyM className="text-gray">
              Add your details to create a personal touch to your profile
            </TextBodyM>
          </div>

          <div className="flex flex-col gap-y-6">
            <div className="p-5 bg-lightGray rounded-xl flex flex-col gap-y-4">
              <TextBodyM className="text-gray">Profile Picture</TextBodyM>
              <div className="flex flex-col gap-y-6">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={fileUploadRef}
                  {...conform.input(profilePictureField)}
                  onChange={onUploadImageInputChange}
                />
                <div className="relative">
                  <button
                    className={cn(
                      "bg-lightPurple rounded-xl w-[193px] h-[193px] flex justify-center items-center flex-col gap-y-2 text-purple z-10 bg-no-repeat",
                      imagePreviewUrl ? "overlay-button text-white" : undefined,
                    )}
                    type="button"
                    onClick={onUploadImage}
                    style={{
                      backgroundImage: `url(${imagePreviewUrl})`,
                    }}
                  >
                    <div className="w-10 h-10">
                      <Icon icon="icon-upload-image" />
                    </div>
                    <TextHeadingS>
                      {imagePreviewUrl ? "Change Picture" : "+ Upload Image"}
                    </TextHeadingS>
                  </button>
                </div>
                <TextBodyS className="text-gray">
                  Image must be blow 1024x1024 px. Use PNG or JPG format
                </TextBodyS>
              </div>
            </div>

            <div className="bg-lightGray p-5 flex flex-col gap-y-3">
              <InputField
                labelValue="First name*"
                inputProps={{
                  ...conform.input(firstNameField),
                  error: firstNameField.error,
                  placeholder: "John",
                }}
              />
              <InputField
                labelValue="Last name*"
                inputProps={{
                  ...conform.input(lastNameField),
                  error: lastNameField.error,
                  placeholder: "Doe",
                }}
              />
              <InputField
                labelValue="Email"
                inputProps={{
                  ...conform.input(emailField),
                  type: "email",
                  error: emailField.error,
                  placeholder: "johndoe@email.com",
                }}
              />
            </div>
          </div>
        </div>
        <div className="border-t border-borders p-4">
          <PrimaryActionButton className="w-full" type="submit">
            Save
          </PrimaryActionButton>
        </div>
      </Form>
    </div>
  );
}
