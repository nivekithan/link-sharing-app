import { PrimaryActionButton } from "~/components/buttons";
import { Icon } from "~/components/icons";
import { InputField } from "~/components/inputs";
import { TextBodyM, TextBodyS, TextHeadingS } from "~/components/typography";

export default function DashProfile() {
  return (
    <div className="p-4 bg-lightGray">
      <div className="bg-white">
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
                <button
                  className="bg-lightPurple rounded-xl w-[193px] h-[193px] flex justify-center items-center flex-col gap-y-2 text-purple"
                  type="button"
                >
                  <div className="w-10 h-10">
                    <Icon icon="icon-upload-image" />
                  </div>
                  <TextHeadingS>+ Upload Image</TextHeadingS>
                </button>
                <TextBodyS className="text-gray">
                  Image must be blow 1024x1024 px. Use PNG or JPG format
                </TextBodyS>
              </div>
            </div>

            <div className="bg-lightGray p-5 flex flex-col gap-y-3">
              <InputField labelValue="First name*" inputProps={{}} />
              <InputField labelValue="Last name*" inputProps={{}} />
              <InputField labelValue="Email" inputProps={{}} />
            </div>
          </div>
        </div>
        <div className="border-t border-borders p-4">
          <PrimaryActionButton className="w-full">Save</PrimaryActionButton>
        </div>
      </div>
    </div>
  );
}
