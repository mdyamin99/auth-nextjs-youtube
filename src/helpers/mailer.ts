import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "7642ba55dacf73",
        pass: "9030b5a905af2d",
      },
    });

    const link =
      emailType === "VERIFY"
        ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`
        : `${process.env.DOMAIN}/forgotpassword?token=${hashedToken}`;

    const mailOptions = {
      from: "yamin@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",

      html: `
                <p>
                    Click 
                    <a href="${link}">
                        here
                    </a>
                    to ${
                      emailType === "VERIFY"
                        ? "verify your email"
                        : "reset your password"
                    }

                    or copy and paste the link below in your browser.
                    <br>
                    ${link}
                </p>
            `,
    };

    const mailresponse = await transport.sendMail(mailOptions);

    return mailresponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
