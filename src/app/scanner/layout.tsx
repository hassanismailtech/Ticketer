import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ScannerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role;

  if (!session) redirect("/login?callbackUrl=/scanner");
  if (role !== "GATEKEEPER" && role !== "ORGANIZER" && role !== "ADMIN") redirect("/");

  return children;
}
