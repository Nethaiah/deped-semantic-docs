import ManageDocument from "@/app/manage-document/_components/manage-document";
import { requireAdmin } from "@/lib/auth-utils";

export default async function DocumentsPage() {
  await requireAdmin();

  return (
    <ManageDocument />
  );
}
