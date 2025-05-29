"use server";

import { SignUpFormSchema, FormState, LoginFormSchema } from "../../schemas";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createSession, destroySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { generateUsername } from "unique-username-generator";
import { cache } from "react";
import { revalidatePath } from "next/cache";

export async function modalSignUp(state: FormState, formData: FormData) {
  try {
    const passwordsMatch =
      formData.get("password") === formData.get("confirmPassword");

    if (!passwordsMatch) {
      return {
        success: false,
        errors: {
          password: ["*Passwords don't match"],
        },
      };
    }

    const validatedFields = SignUpFormSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    const { email, password } = validatedFields.data;
    // Check for existing user
    //

    const existingUser = await checkExistingUser(email);

    if (existingUser) {
      return {
        success: false,
        errors: {
          email: ["That email is already in use"],
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = generateUsername();

    //create a user in the db
    const [data] = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
      })
      .returning({ id: users.id });
    const user = data;
    if (!user) {
      return {
        success: false,
        message: "An error occured while creating the user",
      };
    }
    return {
      success: true,
      message: "Successfully created account",
    };
  } catch (error) {
    return {
      success: false,
      message: "An Error occured on the server while processing the request",
    };
  }
}

export const modalSignIn = async (state: FormState, formData: FormData) => {
  try {
    const validatedFields = LoginFormSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    const { email, password } = validatedFields.data;

    // Check for existing user
    const existingUser = await checkExistingUser(email);

    if (!existingUser) {
      return {
        errors: {
          email: ["The email used has not been registered"],
        },
      };
    }

    if (!bcrypt.compareSync(password, existingUser.password!)) {
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      };
    }

    await createSession(existingUser.id, existingUser.role);

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: `An error occured on the server`,
    };
  }
};

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignUpFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { email, password } = validatedFields.data;
  // Check for existing user
  //

  const existingUser = await checkExistingUser(email);

  if (existingUser) {
    return {
      errors: {
        email: ["That email is already in use"],
      },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const username = generateUsername();

  //create a user in the db
  const [data] = await db
    .insert(users)
    .values({
      username,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id });
  const user = data;
  if (!user) {
    return {
      errors: {
        email: ["An error occured while trying to creating the account"],
      },
    };
  }

  redirect("/auth/login");
}

export const signin = async (state: FormState, formData: FormData) => {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { email, password } = validatedFields.data;

  // Check for existing user
  const existingUser = await checkExistingUser(email);

  if (!existingUser) {
    return {
      errors: {
        email: ["The email used has not been registered"],
      },
    };
  }

  if (!bcrypt.compareSync(password, existingUser.password!)) {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }

  await createSession(existingUser.id, existingUser.role);

  revalidatePath("/");

  redirect("/");
};

export const logout = async () => {
  try {
    await destroySession();
    revalidatePath("/");
    return {
      success: true,
      message: `Successfully signed out`,
    };
  } catch (error) {
    console.error("An error occured", error);
    return {
      success: false,
      message: `An error occurred on the server`,
    };
  }
};

const checkExistingUser = cache(async (email: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  return user;
});
