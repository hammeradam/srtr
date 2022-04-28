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

export const buildMailHtml = (
    title: string,
    text: string,
    buttonText: string,
    link: string
) => {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
            />
            <title>${title}</title>
    
            <link
                href="https://fonts.googleapis.com/css?family=Noto+Sans:400,700,400italic,700italic"
                rel="stylesheet"
                type="text/css"
            />
            <link
                href="https://fonts.googleapis.com/css?family=Martel:400,700"
                rel="stylesheet"
                type="text/css"
            />
    
            <!--[if gte mso 15]>
                <style type="text/css">
                    table {
                        font-size: 1px;
                        line-height: 0;
                        mso-margin-top-alt: 1px;
                        mso-line-height-rule: exactly;
                    }
    
                    * {
                        mso-line-height-rule: exactly;
                    }
                </style>
            <![endif]-->
    
            <style type="text/css">
                /* ----- Reset ----- */
                html,
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                    height: 100% !important;
                    width: 100% !important;
                    font-family: 'Noto sans', sans-serif;
                }
    
                * {
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                }
    
                div[style*='margin: 16px 0'] {
                    margin: 0 !important;
                }
    
                table,
                td {
                    mso-table-lspace: 0pt !important;
                    mso-table-rspace: 0pt !important;
                }
    
                table {
                    border-spacing: 0 !important;
                    border-collapse: collapse !important;
                    table-layout: fixed !important;
                    margin: 0 auto !important;
                }
    
                table table table {
                    table-layout: auto;
                }
    
                img {
                    -ms-interpolation-mode: bicubic;
                }
    
                .yshortcuts a {
                    border-bottom: none !important;
                }
    
                .mobile-link--footer a,
                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: underline !important;
                }
    
                @media (max-width: 700px) {
                    /* ----- Grid ----- */
                    .container {
                        width: 100% !important;
                    }
    
                    .container-outer {
                        padding: 0 !important;
                    }
    
                    /* ----- Header ----- */
                    .logo {
                        float: none;
                        text-align: center;
                    }
    
                    .header-title {
                        text-align: center !important;
                        font-size: 32px !important;
                    }
    
                    /* ----- Article ----- */
                    .article-content,
                    .article-button {
                        text-align: center !important;
                        padding-left: 15px !important;
                    }
    
                    .article-thumb {
                        padding: 30px 0 15px 0 !important;
                    }
    
                    .article-content {
                        padding: 0 15px 0 15px !important;
                    }
    
                    .article-button {
                        padding: 20px 0 0 0 !important;
                    }
    
                    .article-button > table {
                        float: none;
                    }
    
                    /* ----- Footer ----- */
                    .footer {
                        text-align: center !important;
                    }
                }
    
                .button {
                    border: 2px solid #000000;
                    padding: 8px;
                }
    
                .button a {
                    text-decoration: none;
                    color: #000000;
                    font-weight: bold;
                    font-family: 'Noto sans', sans-serif;
                    text-transform: uppercase;
                    font-size: 14px;
                }
            </style>
        </head>
    
        <body
            style="margin: 0; padding: 0"
            bgcolor="#f5f5f5"
            leftmargin="0"
            topmargin="0"
            marginwidth="0"
            marginheight="0"
        >
            <!-- Wrapper 100% -->

            <table
                border="0"
                width="100%"
                height="100%"
                cellpadding="0"
                cellspacing="0"
                bgcolor="#f5f5f5"
            >
                <tr>
                    <td
                        class="container-outer"
                        align="center"
                        valign="top"
                        style="padding: 30px 0 30px 0"
                    >
                        <table
                            border="0"
                            width="700"
                            cellpadding="0"
                            cellspacing="0"
                            bgcolor="#ffffff"
                            class="container"
                            style="width: 700px"
                        >
                            <tr>
                                <td style="border-top: 10px solid blueviolet">
                                    <!-- spacer -->
                                    <table height="30"></table>
                                    <img src="https://srtr-production.up.railway.app/pixel.png?id=3456789347534" alt="hello" />
                                    <!-- spacer End -->
    
                                    <!-- header -->
                                    <table
                                        align="center"
                                        border="0"
                                        width="640"
                                        cellpadding="0"
                                        cellspacing="0"
                                        class="container"
                                        style="width: 640px"
                                    >
                                        <tr>
                                            <td>
                                                <table
                                                    class="logo"
                                                    align="left"
                                                    border="0"
                                                    width="120"
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    style="width: 120px"
                                                >
                                                    <tr>
                                                        <td
                                                            style="
                                                                text-align: center;
                                                                border: 4px solid
                                                                    blueviolet;
                                                                padding: 2px 15px
                                                                    5px 15px;
                                                                font-family: 'Noto sans',
                                                                    sans-serif;
                                                            "
                                                        >
                                                            <a
                                                                href="${
                                                                    process.env
                                                                        .APP_URL
                                                                }"
                                                                style="
                                                                    text-decoration: none;
                                                                    color: blueviolet;
                                                                    font-weight: bold;
                                                                    font-size: 28px;
                                                                "
                                                                >srtr</a
                                                            >
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- header End -->
    
                                    <!-- Container 640px -->
                                    <table
                                        align="center"
                                        border="0"
                                        width="640"
                                        cellpadding="0"
                                        cellspacing="0"
                                        class="container"
                                        style="width: 640px"
                                    >
                                        <tr>
                                            <td
                                                class="header-title"
                                                style="
                                                    padding: 70px 0 20px 0;
                                                    font-weight: bold;
                                                    font-size: 45px;
                                                    font-family: 'Noto sans',
                                                        sans-serif;
                                                    text-align: left;
                                                "
                                            >
                                                ${title}
                                            </td>
                                        </tr>
    
                                        <tr>
                                            <td
                                                class="header-divider"
                                                style="
                                                    padding-bottom: 90px;
                                                    text-align: left;
                                                "
                                            >
                                                <div
                                                    style="
                                                        width: 100px;
                                                        height: 6px;
                                                        background-color: black;
                                                    "
                                                ></div>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- Container 640px End -->
    
                                    <!-- Container 640px -->
                                    <table
                                        align="center"
                                        border="0"
                                        width="640"
                                        cellpadding="0"
                                        cellspacing="0"
                                        class="container"
                                        style="width: 640px"
                                    >
                                        <tr>
                                            <td>
                                                <table
                                                    class="container"
                                                    align="left"
                                                    border="0"
                                                    width="610"
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    style="width: 610px"
                                                >
                                                    <tr>
                                                        <td
                                                            class="article-content"
                                                            style="
                                                                padding: 0 0 2px
                                                                    30px;
                                                                text-align: left;
                                                            "
                                                        >
                                                            ${text}
                                                        </td>
                                                    </tr>
    
                                                    <tr>
                                                        <td
                                                            class="article-button"
                                                            style="
                                                                padding: 20px 0 0
                                                                    30px;
                                                            "
                                                        >
                                                            <table
                                                                align="left"
                                                                border="0"
                                                                width="150"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                style="
                                                                    width: 150px;
                                                                    text-align: center;
                                                                "
                                                            >
                                                                <tr>
                                                                    <td
                                                                        class="button"
                                                                    >
                                                                        <a href="${link}"
                                                                            >${buttonText}</a
                                                                        >
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- Container 640px End -->
    
                                    <!-- spacer -->
                                    <table height="30"></table>
                                    <!-- spacer End -->
    
                                    <!-- footer -->
                                    <table
                                        align="center"
                                        border="0"
                                        width="700"
                                        cellpadding="0"
                                        cellspacing="0"
                                        class="container"
                                        style="
                                            width: 700px;
                                            background-color: blueviolet;
                                        "
                                    >
                                        <tr>
                                            <td style="padding: 40px 0 40px 0">
                                                <table
                                                    class="container"
                                                    align="left"
                                                    width="225"
                                                    border="0"
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    style="width: 225px"
                                                >
                                                    <tr>
                                                        <td
                                                            class="footer"
                                                            style="
                                                                text-transform: uppercase;
                                                                text-align: right;
                                                                font-size: 10px;
                                                                color: #ffffff;
                                                                font-family: 'Noto sans',
                                                                    sans-serif;
                                                                padding: 5px 0 0 0;
                                                            "
                                                        >
                                                            srtr @ srtr ${new Date().getFullYear()}<br />Created
                                                            by hammeradam
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- footer end -->
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <!-- Wrapper 100% End -->
        </body>
    </html>
    
    `;
};
