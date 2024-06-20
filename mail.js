import "dotenv/config";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = (email, userMessage) => {
    const message = {
        to: "taskpro.project@gmail.com",
        from: "mashabatyuta.work@gmail.com",
        replyTo: email,
        subject: "Need help - from Task Manager",
        html: `<strong>User email:</strong>
                <p>${email}</p>
                <strong>User message:</strong>
                <p>${userMessage}</p>`,
        text: `User email: ${email}\nUser Message: ${userMessage}`,
    }
    return sgMail.send(message);
};
