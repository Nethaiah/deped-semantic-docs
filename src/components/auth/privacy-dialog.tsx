"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PrivacyDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-theme hover:text-theme/80 font-medium underline"
        >
          {children}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Privacy Policy
          </DialogTitle>
          <DialogDescription>Last updated: December 01, 2025</DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto space-y-4 text-sm text-gray-700 mt-2 pr-2">
            <section>
              <h4 className="font-semibold text-base mb-1.5">
                1. Information We Collect
              </h4>
              <p>
                We collect several types of information: (a) Personal Information
                you provide directly, such as name, email address, and account
                credentials; (b) Academic Content including thesis papers, research
                documents, and related metadata you upload to the Service; (c)
                Usage Data including IP address, browser type, search queries, and
                how you interact with our Service; and (d) Cookies and similar
                tracking technologies to enhance your experience.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-base mb-1.5">
                2. How We Use Your Information
              </h4>
              <p>
                We use collected information to: (a) provide, maintain, and improve
                our thesis management and search services; (b) index and analyze
                thesis papers for semantic search functionality; (c) communicate
                with you about updates, security alerts, and support; (d) detect,
                prevent, and address technical issues; (e) comply with legal
                obligations; and (f) improve the accuracy of search results and
                recommendations.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-base mb-1.5">
                3. Academic Data Protection
              </h4>
              <p>
                We understand the sensitivity of academic research. Thesis papers
                and related documents are stored securely and are only accessible to
                authorized users within your institution. We do not share, sell, or
                distribute academic content to third parties. All uploaded research
                is treated as confidential academic material.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-base mb-1.5">
                4. Information Sharing and Disclosure
              </h4>
              <p>
                We do not sell your personal information or academic content. We may
                share information with: (a) Service providers who assist in
                operating our platform (e.g., cloud hosting, search infrastructure);
                (b) Law enforcement when required by law or to protect our rights;
                (c) University administrators as required by institutional
                agreements; and (d) In connection with a merger, sale, or
                acquisition of our company.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-base mb-1.5">
                5. Data Security and Storage
              </h4>
              <p>
                We implement industry-standard security measures including
                encryption, secure servers, and access controls to protect your
                personal information and academic content. However, no method of
                transmission over the internet is 100% secure. Your data is stored
                on secure servers and retained only as long as necessary to provide
                our services.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-base mb-1.5">
                6. Your Rights and Choices
              </h4>
              <p>
                You have the right to: (a) access and receive a copy of your
                personal information; (b) correct or update inaccurate information;
                (c) request deletion of your account and associated data, subject to
                institutional retention policies; (d) object to or restrict certain
                processing of your data; (e) data portability to transfer your
                information; and (f) withdraw consent at any time.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-base mb-1.5">
                7. Cookies and Tracking
              </h4>
              <p>
                We use cookies and similar technologies to collect usage data and
                enhance functionality. You can control cookie preferences through
                your browser settings, though disabling cookies may limit certain
                features of our Service.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-base mb-1.5">
                8. Children&apos;s Privacy
              </h4>
              <p>
                Our Service is intended for university students and faculty. We do
                not knowingly collect personal information from children under 13
                years of age.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-base mb-1.5">
                9. Changes to Privacy Policy
              </h4>
              <p>
                We may update this Privacy Policy periodically. We will notify you
                of any material changes by posting the new policy on this page and
                updating the &quot;Last Updated&quot; date. Your continued use of the
                Service constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-base mb-1.5">
                10. Contact Information
              </h4>
              <p>
                If you have questions, concerns, or requests regarding this Privacy
                Policy or our data practices, please contact us at:
                privacy@doculens.com.
              </p>
            </section>
          </div>
      </DialogContent>
    </Dialog>
  );
}
