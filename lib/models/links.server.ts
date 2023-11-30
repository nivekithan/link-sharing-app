import { type ListOfLinks, linksTable } from "./schema.server";
import { db } from "@/utils/db.server";

export async function setLinksForUser({
  links,
  userId,
}: {
  userId: string;
  links: ListOfLinks;
}) {
  await db
    .insert(linksTable)
    .values({ listOfLinks: links, userId })
    .onConflictDoUpdate({
      target: linksTable.userId,
      set: { listOfLinks: links },
    });
}
