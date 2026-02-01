import DashboardPage from "@/components/dashboard/dashboard-page";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function DocumentsPage({ searchParams }: Props) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  const role = userData?.role || 'user';

  const displayName = userData?.full_name || user.user_metadata.full_name;

  return <DashboardPage name={displayName} role={role} searchParams={searchParams} />;
}
