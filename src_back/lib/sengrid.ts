import * as sgMail from "@sendgrid/mail";
import * as dotenv from 'dotenv';


dotenv.config()
sgMail.setApiKey(`${process.env.API_SECRET_SENDGRID}`);

async function sendEmail(to, petName, fullName, phone_number, data) {
	return await sgMail
		.send({
			to,
			from: 'alejandravalen0509@gmail.com',
			subject: `${fullName} tiene información sobre ${petName}`,
			text: `Hola soy ${fullName} y tengo información sobre ${petName}. Info: ${data}. Puedes comunicarte conmigo llamando a ${phone_number}`,
			html: `<h2>Hola, soy ${fullName} y tengo informacion sobre ${petName}, Info: ${data}, podes comunicarte conmigo llamando al ${phone_number}</h2>`,
		})
		.then(() => {
			console.log(`email sent`);
            return true
		})
		.catch((err) => {
			console.log(err);
            return err
		});
}

export { sendEmail };