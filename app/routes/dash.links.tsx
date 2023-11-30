import { requireUser } from "@/authSession.server";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { PrimaryActionButton } from "~/components/buttons";
import { Icon } from "~/components/icons";
import { EmptyLinksIllustration } from "~/components/illustrations/emptyLinks";
import {
  InputField,
  type PlatformValue,
  SelectPlatform,
  usePlatformLinkStore,
  validPlatformValue,
} from "~/components/inputs";
import { TextBodyM, TextHeadingS } from "~/components/typography";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useFetcher } from "@remix-run/react";
import { type ZodLiteral, z } from "zod";
import { setLinksForUser } from "@/models/links.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUser(request);

  return null;
}

const SetLinksSchema = z.array(
  z.object({
    platform: z.union(
      validPlatformValue.map((value) => z.literal(value)) as [
        ZodLiteral<PlatformValue>,
        ZodLiteral<PlatformValue>,
      ],
    ),
    link: z.string(),
  }),
);

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUser(request);

  const parsedRes = SetLinksSchema.safeParse(await request.json());

  if (!parsedRes.success) {
    return json({ ok: false, error: "Invalid body" });
  }

  await setLinksForUser({ links: parsedRes.data, userId });

  return json({ ok: true });
}

export default function DashLinks() {
  return (
    <div className="p-4">
      <div className="bg-white">
        <AllLinks />
        <Seperator />
        <SaveButton />
      </div>
    </div>
  );
}

function AllLinks() {
  const linksLength = usePlatformLinkStore((state) => state.links.length);

  return (
    <div className="p-6 flex flex-col gap-y-10">
      <PageHeader />
      <div className="flex flex-col gap-y-6">
        <AddNewLink />
        {linksLength === 0 ? <LinksEmptyState /> : <SortableLinkList />}
      </div>
    </div>
  );
}

function SortableLinkList() {
  const links = usePlatformLinkStore((state) => state.links);
  const linksLength = links.length;
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor),
  );

  const reArrangeLinks = usePlatformLinkStore((state) => state.reArrangeLinks);

  if (linksLength <= 0) {
    throw new Error(
      "SortableLinkList component has rendered when there length of links is 0",
    );
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((v) => v.id === active.id);
      const newIndex = links.findIndex((v) => v.id === over.id);

      reArrangeLinks({ newIndex, oldIndex });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={links} strategy={verticalListSortingStrategy}>
        {links.map((links, i) => {
          return <SingleLinkSelection index={i} key={links.id} />;
        })}
      </SortableContext>
    </DndContext>
  );
}

export type SingleLinkSelectionProps = {
  index: number;
};

/*
 * TODO: Use react context to propagate `index` to child componentes. Instead of passing
 * by props
 */
function SingleLinkSelection({ index }: SingleLinkSelectionProps) {
  const id = usePlatformLinkStore((state) => state.links[index].id);
  const { attributes, listeners, setNodeRef, transform, transition, active } =
    useSortable({ id });

  const isDragging = active?.id === id;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? "999" : undefined,
  };

  return (
    <div
      className="bg-lightGray p-5 flex flex-col gap-y-3"
      ref={setNodeRef}
      style={style}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <button
            className="w-3 h-[6px] text-gray"
            type="button"
            {...attributes}
            {...listeners}
          >
            <Icon icon="icon-drag-and-drop" />
          </button>
          <p className="text-base font-bold leading-[150%] text-gray">
            Link #{index + 1}
          </p>
        </div>
        <RemoveLink index={index} />
      </div>
      <SelectPlatform index={index} />
      <LinkInputField index={index} />
    </div>
  );
}

type LinkInputFieldProps = {
  index: number;
};

function LinkInputField({ index }: LinkInputFieldProps) {
  const { link, setSelectedLink } = usePlatformLinkStore((state) => ({
    link: state.links[index].link,
    setSelectedLink: (link: string) => state.setLink({ index, link }),
  }));

  return (
    <InputField
      labelValue="Link"
      inputProps={{
        icon: "icon-link",
        placeholder: "e.g.https://www.github.com/johnappleseed",
        value: link,
        onChange(e) {
          const newValue = e.currentTarget.value;
          setSelectedLink(newValue);
        },
      }}
    />
  );
}

type RemoveLinkProps = {
  index: number;
};

function RemoveLink({ index }: RemoveLinkProps) {
  const onRemoveLink = usePlatformLinkStore(
    (state) => () => state.removeLink(index),
  );

  return (
    <button type="button" onClick={onRemoveLink}>
      <TextBodyM className="text-gray">Remove</TextBodyM>
    </button>
  );
}

function SaveButton() {
  const links = usePlatformLinkStore((state) => state.links);

  const submitLinksFetcher = useFetcher();

  function onSave() {
    submitLinksFetcher.submit(links, {
      encType: "application/json",
      method: "post",
    });
  }

  const linksLength = links.length;
  const doesAllLinksValid = links.every((link) => Boolean(link.link));
  const isSaveButtonDisabled =
    linksLength === 0 ||
    !doesAllLinksValid ||
    submitLinksFetcher.state === "submitting";

  return (
    <div className="px-7 py-3">
      <PrimaryActionButton
        disabled={isSaveButtonDisabled}
        className="w-full"
        type="button"
        onClick={onSave}
      >
        Save
      </PrimaryActionButton>
    </div>
  );
}
function AddNewLink() {
  const addNewLink = usePlatformLinkStore((state) => state.addNewLink);

  return (
    <button
      className="px-7 py-3 text-purple border border-purple rounded-lg"
      type="button"
      onClick={addNewLink}
    >
      <TextHeadingS>+Add new link</TextHeadingS>
    </button>
  );
}
function PageHeader() {
  return (
    <div className="flex flex-col gap-y-2">
      <h3 className="text-2xl leading-[150%] font-bold">
        Customize your links
      </h3>
      <TextBodyM className="text-gray">
        Add/edit/remove links below and then share your profiles with the world!
      </TextBodyM>
    </div>
  );
}
function Seperator() {
  return <div className="h-[1px] bg-borders w-[full]"></div>;
}

function LinksEmptyState() {
  return (
    <div className="p-5 flex flex-col gap-y-6 items-center">
      <EmptyLinksIllustration height={80} />
      <p className="text-2xl font-bold leading-[150%] text-dark-gray">
        Let's get you started
      </p>
      <TextBodyM className="text-gray text-center">
        Use the "Add new link" button to get started. Once you have more than
        one link, you can reorder and edit them. We're here to help you share
        profiles with everyone
      </TextBodyM>
    </div>
  );
}
