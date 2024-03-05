"use server";

import nodemailer from "nodemailer";

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Replace with your SMTP server
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "", // Replace with your email
    pass: "your-email-password", // Replace with your email password
  },
});

export async function sendEmail(data) {
  const { recipientEmail, subject, emailBody, pdfBlob } = data; // Destructure data
  console.log(recipientEmail, subject, emailBody, pdfBlob);
  // Setup email data with unicode symbols
  const mailOptions = {
    from: '"Your Name" <>', // Replace with your sender address
    to: recipientEmail,
    subject: subject,
    text: emailBody, // Plain text body
    attachments: [
      {
        filename: "detail_ticket.pdf", // Adjust filename as needed
        content: pdfBlob,
        contentType: "application/pdf",
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return { success: true, message: "Email sent successfully" }; // Return success message
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Error sending email" }; // Return error message
  }
}
