"use client";
import { useEffect, useState } from "react";
import PDFViewer from "@/app/manage-document/_components/pdf-viewer";
import { reviewDocs, type ReviewDocMock } from "@/lib/mock-data";

export default function ManageDocument() {
  const docs: ReviewDocMock[] = reviewDocs;
  const [selected, setSelected] = useState<ReviewDocMock | null>(reviewDocs[0] ?? null);
  const [parsedText, setParsedText] = useState<string>(reviewDocs[0]?.parsedText ?? "");
  

  useEffect(() => {
    if (!selected && docs.length > 0) setSelected(docs[0]);
  }, [docs, selected]);

  useEffect(() => {
    if (selected) setParsedText(selected.parsedText);
  }, [selected]);

  

  

  return (
    <div className="h-[calc(100vh-90px)] min-h-[640px] bg-white">
      <div className="h-full grid grid-cols-12 gap-4 px-4 py-4">
        <aside className="col-span-3 border rounded-lg overflow-hidden bg-gray-50">
          <div className="px-4 py-3 border-b bg-white">
            <p className="text-sm font-semibold text-gray-700">Document Management</p>
            <p className="text-xs text-gray-500">Admin Review Panel</p>
          </div>

          <div className="px-4 py-2">
            <p className="text-xs font-medium text-gray-600">Unpublished Documents</p>
          </div>

          <ul className="max-h-[calc(100%-90px)] overflow-auto pb-2">
            {docs.map((doc) => {
              const active = selected?.id === doc.id;
              return (
                <li key={doc.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(doc)}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      active ? "bg-[#008c8b]/10" : "hover:bg-gray-100"
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-800 truncate">{doc.title}</p>
                    {doc.updated_at && (
                      <p className="text-xs text-gray-500 truncate">{new Date(doc.updated_at).toLocaleString()}</p>
                    )}
                  </button>
                </li>
              );
            })}
            {docs.length === 0 && (
              <li className="px-4 py-3 text-xs text-gray-500">No documents found.</li>
            )}
          </ul>
        </aside>

        <section className="col-span-5 flex flex-col gap-3">
          <div className="border rounded-lg p-4 bg-white h-full flex flex-col">
            <div className="pb-2">
              <h2 className="text-sm font-semibold text-gray-700">Parsed Text (Editable)</h2>
            </div>
            <textarea
              className="flex-1 resize-none rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#008c8b]/50 p-3 text-sm text-gray-800 bg-gray-50"
              value={parsedText}
              onChange={(e) => setParsedText(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => console.log("Approve", selected?.title)}
              className="px-5 py-2 rounded-md bg-[#008c8b] text-white text-sm font-medium hover:opacity-90"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => console.log("Reject", selected?.title)}
              className="px-5 py-2 rounded-md bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300"
            >
              Reject
            </button>
          </div>
        </section>

        <section className="col-span-4 border rounded-lg bg-white overflow-hidden flex flex-col">
          {selected?.url ? (
            <PDFViewer file={selected.url} title={selected.title} />
          ) : (
            <div className="p-6 text-sm text-gray-500">No document selected.</div>
          )}
        </section>
      </div>
    </div>
  );
}
