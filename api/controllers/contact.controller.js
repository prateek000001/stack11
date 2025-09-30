import nodemailer from "nodemailer";

export const sendInterestEmail = async (req, res) => {
  const { landlordEmail, userName, userEmail, message } = req.body;

  if (!landlordEmail || !userName || !userEmail) {
    return res.status(400).json({ success: false, message: "Missing fields!" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // App Password
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: landlordEmail,
      subject: "New Interest in Your Property",
      text: `
        A user has shown interest in your property.

        Name: ${userName}
        Email: ${userEmail}
        Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending mail:", error);
    res.status(500).json({ success: false, message: "Failed to send email", error });
  }
};
