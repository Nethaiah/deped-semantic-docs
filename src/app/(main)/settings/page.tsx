import Settings from "@/components/settings/settings";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await verifySession();
  if (!session.isAuth) {
    redirect('/login');
  }

  const provider = session.user.app_metadata.provider || "email";

  return <Settings provider={provider} />;
}
