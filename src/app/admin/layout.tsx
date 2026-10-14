import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role;

  if (!session) redirect("/login?callbackUrl=/admin");
  if (role !== "ORGANIZER" && role !== "ADMIN") redirect("/");

  return children;
}
