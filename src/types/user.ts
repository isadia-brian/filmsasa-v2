export type UserRole = "user" | "admin";
export type User = {
  id: number;
  email: string;
  role: UserRole;
  username: string;
} | null;
