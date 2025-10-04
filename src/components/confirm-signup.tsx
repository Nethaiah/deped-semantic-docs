import React from "react";

type ConfirmSignupEmailProps = {
  confirmationUrl?: string;
};

export default function ConfirmSignupEmail({
  confirmationUrl = "{{ .ConfirmationURL }}",
}: ConfirmSignupEmailProps) {
  return (
    <html>
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Confirm your signup</title>
      </head>
      <body style={{ margin: 0, padding: 16, backgroundColor: "#f9fafb", color: "#111827", fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Confirm your signup</h2>
        <p style={{ margin: 0, marginBottom: 12 }}>Follow this link to confirm your user:</p>
        <p style={{ margin: 0, marginBottom: 16 }}>
          <a href={confirmationUrl} style={{ color: "#2563eb" }}>Confirm your mail</a>
        </p>
      </body>
    </html>
  );
}


