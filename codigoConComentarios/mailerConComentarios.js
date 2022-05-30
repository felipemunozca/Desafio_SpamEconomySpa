/**** 
 * paso 1: inicializar npm
 * > npm nit -y
 * 
 * paso 2: instalar el paquete nodemailer
 * > npm i nodemailer
 * 
****/

/* declaro una constante para utilizar el paquete nodemailer. */
const nodemailer = require("nodemailer");

/* creo una funcion para enviar el correo. */
/* cambio el ultimo atributo de text a html, para poder formatear la respuesta como codigo html. */
function enviar(to, subject, html) {

    /* para manejar mejor los errores de ejecucion, es mas adecuado escribir el codigo con promesas. */
    return new Promise((resolve, reject) => {

        /* creo una variable para pasarle el metodo createTransport.
        En su interior debo declarar un objeto con la configuracion de mi correo (puede ser el personal). */
        let transporter = nodemailer.createTransport({

            /* como primer parametro, el tipo de servicio o proveedor de correo que utilizare. */
            service: "gmail",
            /* como segundo parametro, las credenciales de mi correo personal. */
            auth: {
                user: 'correopruebafmunoz@gmail.com',
                pass: 'Programador2022*'
            },
            /* como tercer parametro, el TLS que es un protocolo o capa de seguridad de los correos. */
            tls: {rejectUnauthorized: false}
        });

        /* indico las opciones que tendra el correo. */
        let mailOptions = {
            from: "correopruebafmunoz@gmail.com",
            /* cuando la variable tiene el mismo nombre que la propiedad, el codigo asume que el valor es el mismo por lo que 
            no es necesario volver a definirlo. */
            to,
            subject,
            html,
        };

        /* sendMail() metodo para enviar el correo. Como primer parametro se indica la data o las opciones de correo. 
        Como segundo parametro, un callback. */
        transporter.sendMail(mailOptions, (err, data) => {
            //if (err) console.log(err);
            //if (data) console.log(data);
            /* reescribo las respuestas por consola ahora utilizando las promesas. */
            if (err) reject(err);
            if (data) resolve(data);
        });

    })
    
}
// Paso 2
/* exporto la funcion enviar para ser utilizada en otro archivo. */
module.exports = enviar;
