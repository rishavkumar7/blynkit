const verifyEmailTemplate = ({ name, url }) => {
    return `
    <h3>Dear ${name}</h3>
    <p>Thankyou for registering on Blynkit !!</p>
    <a href=${url} style="color:white; background:#201659; margin-top:30px; padding:10px;">Verify Email</a>
    `
}

export default verifyEmailTemplate