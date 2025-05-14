import { Resend } from 'resend';
import dotenv from "dotenv"

dotenv.config()
if (process.env.RESEND_API) {
    console.log("Please provide the RESEND_API as environment variable")
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
    const { data, error } = await resend.emails.send({
        from: 'Blynkit <onboarding@resend.dev>',
        to: sendTo,
        subject: subject,
        html: html,
    });

    if (error) {
        return console.error({ error });
    }

    return data
}

export default sendEmail