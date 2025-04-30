// Data Access layer

import "server-only";
import { cache } from "react";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { decrypt } from "./session";
import { db } from "@/drizzle";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) {
    return null;
  }
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return null;
  }

  return { isAuth: true, userId: session.userId, UserRole: session.userRole };
});

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  const userId = session.userId as number;

  try {
    const data = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    const user = data ?? null;

    return user;
  } catch (error) {
    return null;
  }
});
