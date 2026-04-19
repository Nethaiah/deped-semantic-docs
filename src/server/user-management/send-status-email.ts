"use server"

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function getApprovedEmailHtml(fullName: string): string {
	return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#1C402E,#1a6d8a);padding:32px 24px;text-align:center;">
      <h1 style="color:#ffffff;font-size:22px;margin:0;">Account Approved ✅</h1>
    </div>
    <div style="padding:32px 24px;">
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px;">
        Hi <strong>${fullName}</strong>,
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px;">
        Great news! Your DocuLens account has been <strong style="color:#059669;">approved</strong> by an administrator. You can now log in and start using the platform.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login"
           style="display:inline-block;background:#1C402E;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
          Log in to DocuLens
        </a>
      </div>
      <p style="color:#6b7280;font-size:13px;line-height:1.5;margin:0;">
        If you didn't create an account on DocuLens, you can safely ignore this email.
      </p>
    </div>
    <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">© ${new Date().getFullYear()} DocuLens. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

function getRejectedEmailHtml(fullName: string): string {
	return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#dc2626,#991b1b);padding:32px 24px;text-align:center;">
      <h1 style="color:#ffffff;font-size:22px;margin:0;">Account Not Approved</h1>
    </div>
    <div style="padding:32px 24px;">
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px;">
        Hi <strong>${fullName}</strong>,
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px;">
        Unfortunately, your DocuLens account request has been <strong style="color:#dc2626;">rejected</strong> by an administrator.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px;">
        If you believe this was a mistake, please contact your system administrator for assistance.
      </p>
      <p style="color:#6b7280;font-size:13px;line-height:1.5;margin:0;">
        If you didn't create an account on DocuLens, you can safely ignore this email.
      </p>
    </div>
    <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">© ${new Date().getFullYear()} DocuLens. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendStatusEmail({
	to,
	fullName,
	status,
}: {
	to: string;
	fullName: string;
	status: "approved" | "rejected";
}) {
	const isApproved = status === "approved";

	const { data, error } = await resend.emails.send({
		from: "DocuLens <noreply@doculens.online>",
		to: [to],
		subject: isApproved
			? "Your DocuLens Account Has Been Approved!"
			: "DocuLens Account Update",
		html: isApproved
			? getApprovedEmailHtml(fullName)
			: getRejectedEmailHtml(fullName),
	});

	if (error) {
		console.error("Failed to send status email:", error);
		return { error: error.message };
	}

	return { success: true, emailId: data?.id };
}
