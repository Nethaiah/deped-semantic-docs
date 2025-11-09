import { notFound, redirect } from "next/navigation";
import ViewDocument from "@/features/document-view/components/view-document";
import { createClient } from "@/lib/supabase/server";

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


  return <ViewDocument documentId={documentName} />;
}