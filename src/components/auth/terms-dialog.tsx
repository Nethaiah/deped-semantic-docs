"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TermsDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-[#278fb6] hover:text-[#278fb6]/80 font-medium underline"
        >
          {children}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Terms of Service
          </DialogTitle>
          <DialogDescription>Last updated: December 01, 2025</DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto space-y-4 text-sm text-gray-700 mt-2 pr-2">
            <section>
              <h4 className="font-semibold text-base mb-1.5">
                1. Acceptance of Terms
              </h4>
              <p>
                By accessing and using Doculens (&quot;the Service&quot;), you
                agree to be bound by these Terms of Service. If you do not agree
                to these terms, please do not use our Service. We reserve the
                right to update these terms at any time, and continued use of the
                Service constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-base mb-1.5">
                2. Description of Service
              </h4>
              <p>
                Doculens is a thesis management and semantic search platform
                designed for university use. It enables users to upload, manage,
                search, and analyze thesis papers and academic research documents.
                We reserve the right to modify, suspend, or discontinue any
                aspect of the Service at any time without prior notice.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-base mb-1.5">
                3. User Accounts and Security
              </h4>
              <p>
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account. You must immediately notify us of any unauthorized use
                of your account. We are not liable for any loss or damage arising
                from your failure to protect your account information.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-base mb-1.5">
                4. Academic Content and Conduct
              </h4>
              <p>
                You agree to: (a) only upload thesis papers and academic
                documents that you have the right to share; (b) not plagiarize or
                misrepresent the authorship of any work; (c) respect the
                intellectual property rights of thesis authors and researchers;
                (d) not use the Service to distribute unauthorized copies of
                academic work; (e) comply with your university&apos;s academic
                integrity policies; and (f) not interfere with or disrupt the
                Service.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-base mb-1.5">
                5. Intellectual Property Rights
              </h4>
              <p>
                All platform features and functionality are owned by Doculens and
                are protected by intellectual property laws. Thesis papers and
                academic documents uploaded to the Service remain the intellectual
                property of their respective authors. By uploading content, you
                grant us a limited license to store, index, and make it
                searchable within the platform.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-base mb-1.5">
                6. Disclaimer of Warranties
              </h4>
              <p>
                The Service is provided &quot;as is&quot; and &quot;as
                available&quot; without warranties of any kind. We do not
                guarantee the accuracy of search results, semantic analysis, or
                thesis metadata. Users should verify academic information
                independently.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-base mb-1.5">
                7. Limitation of Liability
              </h4>
              <p>
                To the maximum extent permitted by law, Doculens shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages, including but not limited to loss of data or
                academic work resulting from your use of the Service.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-base mb-1.5">
                8. Termination
              </h4>
              <p>
                We reserve the right to terminate or suspend your account and
                access to the Service immediately, without prior notice, for any
                reason, including breach of these Terms or violation of academic
                integrity policies.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-base mb-1.5">
                9. Governing Law
              </h4>
              <p>
                These Terms shall be governed by and construed in accordance with
                applicable laws. Any disputes arising from these Terms or the
                Service shall be resolved in the appropriate courts.
              </p>
            </section>
          </div>
      </DialogContent>
    </Dialog>
  );
}
