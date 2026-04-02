import Search from "@/components/search/search";
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function SearchPage() {
  const session = await verifySession();
  if (!session.isAuth) {
    redirect('/login');
  }
  return <Search />;
}
