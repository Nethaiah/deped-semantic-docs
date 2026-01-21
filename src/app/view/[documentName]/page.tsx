import { redirect } from "next/navigation";
import ViewDocument from "@/components/document/view-document";
import { createClient } from "@/lib/supabase/server";
import TrackDocumentView from "@/components/dashboard/track-document-view";

type Props = {
  params: Promise<{ documentName: string }>;
};

export default async function ViewDocumentPage({ params }: Props) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { documentName } = await params;

  return (
    <>
      {/* Client component that tracks the view and refreshes cache */}
      <TrackDocumentView documentId={documentName} />
      <ViewDocument documentId={documentName} />
    </>
  );
}