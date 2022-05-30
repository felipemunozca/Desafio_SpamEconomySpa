
const enviar = require("./mailer");
const url = require("url");
const http = require("http");
const axios = require("axios");
const {v4: uuidv4} = require('uuid');
const fs = require("fs");

http.createServer(function (req, res) {

    let { correos, asunto, contenido } = url.parse(req.url, true).query;

    if (req.url == "/") {
        res.setHeader("content-type", "text/html");

        fs.readFile("index.html", "utf8", (err, data) => {
            if (err) {
                res.end("No se puede acceder al sitio web.")
            } else {
                res.end(data);
            }
        });
    }
    
    if (req.url.startsWith("/mailing")) {

        if (correos == '' || asunto == '' || contenido == '' ) {
            res.end("Por favor, completar todos los campos del formulario")
        } else {
            axios.get('http://mindicador.cl/api')
                .then(respuesta => {

                    let data = respuesta.data;

                    let template = `
                        <h3>${contenido}</h3>
                        <br>
                        <p>El valor del dolar el día de hoy es: ${data.dolar.valor}</p>
                        <p>El valor del euro el día de hoy es: ${data.euro.valor}</p>
                        <p>El valor de la uf el día de hoy es: ${data.uf.valor}</p>
                        <p>El valor de la utm el día de hoy es: ${data.utm.valor}</p>
                    `

                    enviar(correos.split(','), asunto, template)
                        .then(respuesta => {
                            console.log(respuesta);
                            res.end("correo enviado correctamente.");
                        })
                        .catch(error => {
                            console.log(error);
                            res.end("se ha generado un error al enviar el correo electronico.");
                        })

                    let nombre = uuidv4();

                    fs.writeFile(`correos/${nombre}.txt`, template, "utf-8", (error) => {
                        if (error) {
                            res.write("ha ocurrido un error al crear el archivo.")
                        } else {
                            res.write("El archivo a sido creado correctamente")
                        }
                        res.end();
                    })

                })
                .catch(error => {
                    console.log(error);
                    res.end("se ha generado un error al consultar la API.");
                })
            
        }
        
    }
})
.listen(3000, console.log("Servidor corriendo en http://localhost:3000/"));


/* para ejecutar el programa, escribir en la consola el siguiente comando: */
/* > node index.js */