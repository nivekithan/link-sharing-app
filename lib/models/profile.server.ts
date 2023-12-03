import { db } from "@/utils/db.server";
import { profileTable } from "./schema.server";
import { eq } from "drizzle-orm";
import { PgCidr } from "drizzle-orm/pg-core";

export async function getProfileDetails(userId: string) {
  const profileList = await db
    .select()
    .from(profileTable)
    .where(eq(profileTable.userId, userId));

  if (profileList.length === 0) {
    return null;
  }

  return profileList[0];
}

export async function setProfileDetails({
  email,
  firstName,
  lastName,
  pictureUrl,
  userId,
}: {
  pictureUrl?: string;
  email: string;
  firstName: string;
  lastName: string;
  userId: string;
}) {
  if (pictureUrl) {
    await db
      .insert(profileTable)
      .values({ email, firstName, lastName, pictureUrl, userId })
      .onConflictDoUpdate({
        target: profileTable.userId,
        set: { email, firstName, lastName, pictureUrl },
      });
  } else {
    await db
      .update(profileTable)
      .set({ email, firstName, lastName })
      .where(eq(profileTable.userId, userId));
  }
}
