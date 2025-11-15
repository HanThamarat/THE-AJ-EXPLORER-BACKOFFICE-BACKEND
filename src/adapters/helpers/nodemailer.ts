import nodemailer from 'nodemailer';


export const transporterMailer = nodemailer.createTransport({
    service: "gmail",
    port: Number(process.env.MAILER_PORT) as number,
    auth: {
        user: process.env.MAILER_EMAIL as string,
        pass: process.env.MAILER_PASSWORD as string,
    }
});
