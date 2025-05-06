export type UserRole = "user" | "admin";
export type User = {
  id: string;
  email: string | null;
  role: UserRole;
  username: string;
} | null;
