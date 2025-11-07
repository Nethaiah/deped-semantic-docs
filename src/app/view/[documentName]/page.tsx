import { notFound, redirect } from "next/navigation";
import { documents } from "@/lib/mock-data";
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
  const doc = documents.find((d) => d.slug === documentName);
  if (!doc) return notFound();

  const similar = documents.filter((d) => d.slug !== doc.slug).slice(0, 2);

  return <ViewDocument doc={doc} similar={similar} />;
}

