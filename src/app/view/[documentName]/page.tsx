import { notFound } from "next/navigation";
import { documents } from "@/lib/mock-data";
import ViewDocument from "@/app/view/[documentName]/_components/view-document";

type Props = {
  params: { documentName: string };
};

export default async function ViewDocumentPage({ params }: Props) {
  const doc = documents.find((d) => d.slug === params.documentName);
  if (!doc) return notFound();

  const similar = documents.filter((d) => d.slug !== doc.slug).slice(0, 2);

  return <ViewDocument doc={doc} similar={similar} />;
}

