import type { NextRequest } from "next/server";
import { ContactEmailTemplate } from "@/components/email-template";
import { resend } from "@/lib/resend";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email: userEmail, subject, contactNumber, message } = body;

  const emailTo = process.env.RESEND_EMAIL_TO;
  const senderEmail = process.env.RESEND_SENDER_EMAIL;

  if (!emailTo) {
    return Response.json({ error: "Email to is required" }, { status: 400 });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: senderEmail
        ? `Send by <${senderEmail}>`
        : "Send by Resend <onboarding@resend.dev>",
      to: [emailTo],
      subject: subject,
      react: (
        <ContactEmailTemplate
          firstName={name}
          email={userEmail}
          contactNumber={contactNumber}
          message={message}
        />
      ),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error("Contact form submission error:", error);
    return Response.json({ error }, { status: 500 });
  }
}
