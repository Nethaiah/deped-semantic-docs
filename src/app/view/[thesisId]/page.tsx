import { redirect } from "next/navigation";
import ViewThesis from "@/components/thesis/view-thesis";
import TrackThesisView from "@/components/thesis/track-thesis-view";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ thesisId: string }>;
};

export default async function ViewThesisPage({ params }: Props) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { thesisId } = await params;

  return (
    <>
      {/* Client component that tracks the view and refreshes cache */}
      <TrackThesisView thesisId={thesisId} />
      <ViewThesis thesisId={thesisId} />
    </>
  );
}