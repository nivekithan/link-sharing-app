import { eq } from "drizzle-orm";
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

export async function getLinksForUser({ userId }: { userId: string }) {
  const links = await db
    .select({ links: linksTable.listOfLinks })
    .from(linksTable)
    .where(eq(linksTable.userId, userId));

  if (links.length === 0) {
    return [];
  }

  const userLinks = links[0];
  return userLinks.links;
}
