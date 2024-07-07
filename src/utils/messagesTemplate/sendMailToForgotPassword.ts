import { sendEmail } from "../utilities";

export const sendMailToForgotPassword = async(
    to: string,
    username: string,
    codeOTP: string,
)=> {
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        a {
            color: #007BFF;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .note {
            margin-top: 20px;
            font-size: 0.9em;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Bonjour ${username},</h1>
        <p>Pour réinitialiser votre mot de passe, veuillez siasir le code suivant : <h3>${codeOTP}</h3>.</p>
        <p class="note">Note : Si vous n'avez pas demandé cette réinitialisation, veuillez nous contacter en répondant à ce message.</p>
    </div>
</body>
</html>    
`;

    const result = await sendEmail(to, "Réinitialisation du mot de passe", html);
    return result;
}