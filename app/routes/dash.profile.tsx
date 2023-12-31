import { requireUser } from "@/authSession.server";
import { getLinksForUser } from "@/models/links.server";
import { getProfileDetails, setProfileDetails } from "@/models/profile.server";
import { uploadFileToS3 } from "@/utils/fileUpload.server";
import { cn } from "@/utils/styles";
import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { type ChangeEvent, useRef, useState } from "react";
import { z } from "zod";
import { InteractivePhoneMockup } from "~/components/IteractivePhoneMockup";
import { PrimaryActionButton } from "~/components/buttons";
import { Icon } from "~/components/icons";
import { InputField, PlatformLinkStoreProvider } from "~/components/inputs";
import {
  TextBodyM,
  TextBodyS,
  TextHeadingM,
  TextHeadingS,
} from "~/components/typography";
import "~/styles/overlayButton.css";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUser(request);
  const [profileDetails, links] = await Promise.all([
    getProfileDetails(userId),
    getLinksForUser({ userId }),
  ]);

  return json({ profileDetails, links });
}
const SetProfileDetialsSchema = z.object({
  profilePicture: z
    .instanceof(File, {
      message: "Profile picture is required",
    })
    .optional(),
  firstName: z.string({ required_error: "First name is required" }).min(0),
  lastName: z.string({ required_error: "Lastname is required" }).min(0),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Provide valid email address" }),
});

export async function action({ request }: ActionFunctionArgs) {
  const [userId, formData] = await Promise.all([
    requireUser(request),
    request.formData(),
  ]);

  const submission = parse(formData, { schema: SetProfileDetialsSchema });

  if (!submission.value || submission.intent !== "submit") {
    return json({ submission });
  }

  const imageUrl = submission.value.profilePicture
    ? await uploadFileToS3(submission.value.profilePicture)
    : undefined;

  const { email, firstName, lastName } = submission.value;
  await setProfileDetails({
    email,
    firstName,
    lastName,
    pictureUrl: imageUrl,
    userId,
  });

  return json({ submission });
}

export default function DashProfile() {
  const { profileDetails, links } = useLoaderData<typeof loader>();

  const fileUploadRef = useRef<HTMLInputElement | null>(null);
  const actionData = useActionData<typeof action>();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    profileDetails?.pictureUrl || null,
  );

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
    <div className="p-4 bg-lightGray md:p-6">
      <div className="flex gap-x-6">
        <PlatformLinkStoreProvider links={links}>
          <InteractivePhoneMockup
            email={profileDetails?.email}
            firstName={profileDetails?.firstName}
            lastName={profileDetails?.lastName}
            pictureUrl={profileDetails?.pictureUrl}
          />
        </PlatformLinkStoreProvider>
        <Form
          className="bg-white flex-1"
          method="POST"
          encType="multipart/form-data"
          {...profileForm.props}
        >
          <div className="p-6 flex flex-col gap-y-10">
            <div className="flex flex-col gap-y-2">
              <h3 className="font-bold text-2xl leading-[150%] text-dark-gray md:hidden">
                Profile Details
              </h3>
              <TextHeadingM className="text-dark-gray hidden md:block">
                Profile Details
              </TextHeadingM>
              <TextBodyM className="text-gray">
                Add your details to create a personal touch to your profile
              </TextBodyM>
            </div>

            <div className="flex flex-col gap-y-6">
              <div className="p-5 bg-lightGray rounded-xl flex flex-col gap-y-4 md:flex-row md:gap-x-4 md:items-center">
                <TextBodyM className="text-gray md:min-w-[240px]">
                  Profile Picture
                </TextBodyM>
                <div className="flex flex-col gap-y-6 md:flex-row md:gap-x-6 md:items-center">
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
                        imagePreviewUrl
                          ? "overlay-button text-white"
                          : undefined,
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
                    Image must be below 1024x1024 px. Use PNG or JPG format.
                  </TextBodyS>
                </div>
              </div>

              <div className="bg-lightGray p-5 flex flex-col gap-y-3">
                <InputField
                  labelValue={
                    <>
                      <p className="md:hidden">First Name*</p>
                      <TextBodyM className="hidden text-gray md:block">
                        First Name*
                      </TextBodyM>
                    </>
                  }
                  labelProps={{ className: "md:min-w-[240px]" }}
                  inputProps={{
                    ...conform.input(firstNameField),
                    error: firstNameField.error,
                    placeholder: "John",
                    defaultValue: profileDetails?.firstName,
                  }}
                  className="md:flex-row md:gap-x-4 md:items-center"
                />
                <InputField
                  labelValue={
                    <>
                      <p className="md:hidden">Last Name*</p>
                      <TextBodyM className="hidden text-gray md:block">
                        Last Name*
                      </TextBodyM>
                    </>
                  }
                  labelProps={{ className: "md:min-w-[240px]" }}
                  inputProps={{
                    ...conform.input(lastNameField),
                    error: lastNameField.error,
                    placeholder: "Doe",
                    defaultValue: profileDetails?.lastName,
                  }}
                  className="md:flex-row md:gap-x-4 md:items-center"
                />
                <InputField
                  labelValue={
                    <>
                      <p className="md:hidden">Email</p>
                      <TextBodyM className="hidden text-gray md:block">
                        Email
                      </TextBodyM>
                    </>
                  }
                  labelProps={{ className: "md:min-w-[240px]" }}
                  inputProps={{
                    ...conform.input(emailField),
                    type: "email",
                    error: emailField.error,
                    placeholder: "johndoe@email.com",
                    defaultValue: profileDetails?.email,
                  }}
                  className="md:flex-row md:gap-x-4 md:items-center"
                />
              </div>
            </div>
          </div>
          <div className="border-t border-borders p-4 md:flex md:justify-end">
            <PrimaryActionButton className="w-full md:w-fit" type="submit">
              Save
            </PrimaryActionButton>
          </div>
        </Form>
      </div>
    </div>
  );
}
