const bcrypt = require('bcryptjs')
const Admin = require('./models/admin')

const transporter = require('./config/mailer')

const createAdmin = async () => {
    try {
        const isAdminExist = await Admin.findOne({
            email: process.env.ADMIN_EMAIL
        })

        if (isAdminExist) {
            console.log('Admin already exists')
            return
        }

        const lastAdmin = await Admin.findOne({
            employeeId: /^ADM\d+$/
        }).sort({ employeeId: -1 })

        let employeeNumber = 1

        if (lastAdmin) {
            employeeNumber =
                parseInt(lastAdmin.employeeId.replace('ADM', ''), 10) + 1
        }

        const employeeId = `ADM${String(employeeNumber).padStart(3, '0')}`

        const password = employeeId.concat("@123")

        const hashedPassword = await bcrypt.hash(password, 10)

        const admin = await Admin.create({
            fullName: 'System Administrator',
            email: process.env.ADMIN_EMAIL,
            phone: '9876543210',
            password: hashedPassword,
            employeeId,
            role: 'admin',
            status: 'Active'
        })

        const { error } = await transporter.sendMail({
            from: `"BlockBank" <${process.env.SMTP_USER}>`,
            to: admin.email,
            subject: 'BlockBank Admin Account Created',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>BlockBank Admin Account</title>
            </head>

            <body style="
                margin: 0;
                padding: 0;
                background-color: #f1f5f9;
                font-family: Arial, Helvetica, sans-serif;
                color: #1e293b;
            ">

                <table
                    role="presentation"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    style="background-color: #f1f5f9; padding: 40px 16px;"
                >
                    <tr>
                        <td align="center">

                            <table
                                role="presentation"
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                border="0"
                                style="
                                    max-width: 600px;
                                    background-color: #ffffff;
                                    border-radius: 12px;
                                    overflow: hidden;
                                    border: 1px solid #e2e8f0;
                                "
                            >

                                <!-- Header -->
                                <tr>
                                    <td style="
                                        background-color: #2563eb;
                                        padding: 28px 32px;
                                        text-align: center;
                                    ">
                                        <div style="
                                            font-size: 28px;
                                            font-weight: bold;
                                            color: #ffffff;
                                            letter-spacing: 0.5px;
                                        ">
                                            BlockBank
                                        </div>

                                        <div style="
                                            margin-top: 6px;
                                            font-size: 13px;
                                            color: #dbeafe;
                                        ">
                                            Secure Blockchain Banking
                                        </div>
                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td style="padding: 36px 32px;">

                                        <h1 style="
                                            margin: 0 0 18px 0;
                                            font-size: 24px;
                                            line-height: 32px;
                                            color: #0f172a;
                                        ">
                                            Welcome to BlockBank
                                        </h1>

                                        <p style="
                                            margin: 0 0 16px 0;
                                            font-size: 15px;
                                            line-height: 24px;
                                            color: #475569;
                                        ">
                                            Hello ${admin.fullName},
                                        </p>

                                        <p style="
                                            margin: 0 0 24px 0;
                                            font-size: 15px;
                                            line-height: 24px;
                                            color: #475569;
                                        ">
                                            Your BlockBank administrator account has been
                                            created successfully. You can use the credentials
                                            below to sign in to the administration portal.
                                        </p>

                                        <!-- Credentials -->
                                        <table
                                            role="presentation"
                                            width="100%"
                                            cellspacing="0"
                                            cellpadding="0"
                                            border="0"
                                            style="
                                                background-color: #f8fafc;
                                                border: 1px solid #e2e8f0;
                                                border-radius: 8px;
                                            "
                                        >
                                            <tr>
                                                <td style="padding: 22px 24px;">

                                                    <p style="
                                                        margin: 0 0 6px 0;
                                                        font-size: 12px;
                                                        color: #64748b;
                                                        text-transform: uppercase;
                                                        letter-spacing: 0.5px;
                                                    ">
                                                        Employee ID
                                                    </p>

                                                    <p style="
                                                        margin: 0 0 18px 0;
                                                        font-size: 16px;
                                                        font-weight: bold;
                                                        color: #0f172a;
                                                    ">
                                                        ${admin.employeeId}
                                                    </p>

                                                    <p style="
                                                        margin: 0 0 6px 0;
                                                        font-size: 12px;
                                                        color: #64748b;
                                                        text-transform: uppercase;
                                                        letter-spacing: 0.5px;
                                                    ">
                                                        Email Address
                                                    </p>

                                                    <p style="
                                                        margin: 0 0 18px 0;
                                                        font-size: 16px;
                                                        color: #0f172a;
                                                        word-break: break-word;
                                                    ">
                                                        ${admin.email}
                                                    </p>

                                                    <p style="
                                                        margin: 0 0 6px 0;
                                                        font-size: 12px;
                                                        color: #64748b;
                                                        text-transform: uppercase;
                                                        letter-spacing: 0.5px;
                                                    ">
                                                        Temporary Password
                                                    </p>

                                                    <p style="
                                                        margin: 0;
                                                        padding: 12px 14px;
                                                        background-color: #ffffff;
                                                        border: 1px solid #cbd5e1;
                                                        border-radius: 6px;
                                                        font-family: monospace;
                                                        font-size: 15px;
                                                        font-weight: bold;
                                                        color: #0f172a;
                                                        word-break: break-all;
                                                    ">
                                                        ${password}
                                                    </p>

                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Security Notice -->
                                        <table
                                            role="presentation"
                                            width="100%"
                                            cellspacing="0"
                                            cellpadding="0"
                                            border="0"
                                            style="
                                                margin-top: 24px;
                                                background-color: #eff6ff;
                                                border-left: 4px solid #2563eb;
                                            "
                                        >
                                            <tr>
                                                <td style="padding: 14px 16px;">

                                                    <p style="
                                                        margin: 0;
                                                        font-size: 13px;
                                                        line-height: 20px;
                                                        color: #1e40af;
                                                    ">
                                                        <strong>Security reminder:</strong>
                                                        Please keep your login credentials
                                                        confidential and do not share your
                                                        password with anyone.
                                                    </p>

                                                </td>
                                            </tr>
                                        </table>

                                        <p style="
                                            margin: 28px 0 0 0;
                                            font-size: 14px;
                                            line-height: 22px;
                                            color: #64748b;
                                        ">
                                            If you did not expect this account to be created,
                                            please contact the BlockBank system administrator.
                                        </p>

                                        <p style="
                                            margin: 28px 0 0 0;
                                            font-size: 15px;
                                            line-height: 24px;
                                            color: #475569;
                                        ">
                                            Regards,<br>
                                            <strong style="color: #0f172a;">
                                                BlockBank Team
                                            </strong>
                                        </p>

                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="
                                        padding: 22px 32px;
                                        background-color: #f8fafc;
                                        border-top: 1px solid #e2e8f0;
                                        text-align: center;
                                    ">

                                        <p style="
                                            margin: 0;
                                            font-size: 12px;
                                            line-height: 18px;
                                            color: #94a3b8;
                                        ">
                                            This is an automated message from BlockBank.
                                            Please do not reply directly to this email.
                                        </p>

                                        <p style="
                                            margin: 8px 0 0 0;
                                            font-size: 12px;
                                            color: #94a3b8;
                                        ">
                                            © ${new Date().getFullYear()} BlockBank
                                        </p>

                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>
                </table>

            </body>
            </html>
            `
        })

        if (error) {
            throw new Error(
                error.message || 'Failed to send admin email'
            )
        }

        console.log('Admin created successfully')
        console.log('Admin credentials email sent successfully')
    } catch (error) {
        console.error('Error creating admin:', error.message)
        throw error
    }
}

module.exports = createAdmin