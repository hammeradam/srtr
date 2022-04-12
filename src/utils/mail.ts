import { createTransport, getTestMessageUrl } from 'nodemailer';

export const sendMail = async (to: string[], subject: string, html: string) => {
    const transporter = createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
        },
        from: process.env.EMAIL_FROM,
    });

    const info = await transporter.sendMail({
        from: `srtr - ${process.env.EMAIL_FROM}`,
        to: to.join(', '),
        subject,
        html,
    });

    const preview = getTestMessageUrl(info);

    if (preview) {
        console.log('Preview URL:', preview);
    }
};
