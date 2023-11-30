import { db } from "@/utils/db.server";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
import { userTable } from "./schema.server";

export type isPasswordCorrectReturns =
  | {
      status: "PASSWORD_MATCHED";
      user: typeof userTable.$inferSelect;
    }
  | { status: "ACCOUNT_NOT_FOUND" }
  | { status: "INCORRECT_PASSWORD_OR_EMAIL" };

export async function isPasswordCorrect({
  email,
  plainTextPassword,
}: {
  email: string;
  plainTextPassword: string;
}): Promise<isPasswordCorrectReturns> {
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (user.length === 0) {
    return { status: "ACCOUNT_NOT_FOUND" };
  }

  const userAccount = user[0];

  const isPasswordCorrect = await compare(
    plainTextPassword,
    userAccount.hashedPassword,
  );

  if (!isPasswordCorrect) {
    return { status: "INCORRECT_PASSWORD_OR_EMAIL" };
  }

  return { status: "PASSWORD_MATCHED", user: userAccount };
}

export async function isEmailUnique({ email }: { email: string }) {
  const user = await db
    .select({ id: userTable.id })
    .from(userTable)
    .where(eq(userTable.email, email));

  return user.length === 0;
}

export async function createUser({
  email,
  plainTextPassword,
}: {
  email: string;
  plainTextPassword: string;
}) {
  const hashedPassword = await hash(plainTextPassword, 10);

  const user = await db
    .insert(userTable)
    .values({ email, hashedPassword })
    .returning();

  if (user.length === 0) {
    throw new Error(
      "Unexpected Error: Expected created user to be returned from the database",
    );
  }

  return user[0];
}
