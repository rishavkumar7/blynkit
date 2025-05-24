const forgotPasswordTemplate = ({ name, otp }) => {
    return `
        <div>
            <h3>Dear ${name},</h3>
            <p>You're requested to reset your password. Please use the below otp to reset your password.</p>
            <span style="background:yellow; font-size:20px; font-weight:800; padding:5px">${otp}</span>
            <p>This otp is valid for 1 hour only. Please enter this otp in the Blynkit website to reset your password</p>
            <br/>
            <br/>
            <p>Thanks</p>
            <p>Blynkit</p>
        </div>
    `
}

export default forgotPasswordTemplate