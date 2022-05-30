/**** 
 * paso 1: iniciar el proyecto con npm
 * > npm init -y
 * 
 * paso 2: instalar los paquetes que necesito para desarrollar el desafio:
 * > npm i axios
 * > npm i uuid
 * 
 * paso 3: instalar nodemon como dependencia de desarrollo:
 * > npm i nodemon -D
 * 
 * paso 4: levanto el proyecto utilizando nodemon para que se carguen los cambios automaticamente.
 * > npx nodemon index.js
****/

/* variables a utilizar para el desarrollo del desafio. */
const enviar = require("./mailer");
const url = require("url");
const http = require("http");
const axios = require("axios");
const {v4: uuidv4} = require('uuid');
const fs = require("fs");

//paso 1

/* crear el servidor mediante una funcion con dos callback, un request y un response. */
http.createServer(function (req, res) {

    /* declaro las variables que estare recibiendo desde el formulario html. */
    /* luego parseo sus valores de respuesta a los que son obtenidos cuando se presiona el boton del formulario. */
    let { correos, asunto, contenido } = url.parse(req.url, true).query;

    /* creo una sentencia en la ruta raiz del proyecto. */
    if (req.url == "/") {
        /* defino que el encabezado sera en formato text/html. */
        res.setHeader("content-type", "text/html");
        /* con el metodo leer de file system verifico si estoy recibiendo la data del archivo index.html o no. */
        fs.readFile("index.html", "utf8", (err, data) => {
            /* validacion de la data. */
            if (err) {
                res.end("No se puede acceder al sitio web.")
            } else {
                res.end(data);
            }
        });
    }
    
    /* creo un endpoint que es igual que sale en la etiqueta form del index.html */
    if (req.url.startsWith("/mailing")) {
        /* como recomendacion: las validaciones es mejor hacerlas desde el lado del servidor, 
        lo que dara mas seguridad a mi aplicacion, ya que si solo son validaciones por el front pueden ser ignoradas 
        editando las propiedades con el inspector de elementos. */
        if (correos == '' || asunto == '' || contenido == '' ) {
            res.end("Por favor, completar todos los campos del formulario")
        } else {

            /* utilizo axios para hacer la conexion a la API. De esta forma se puede manejar de mejor manera el then() y el catch() */
            axios.get('http://mindicador.cl/api')
                .then(respuesta => {

                    /* creo una variable llamada data y le paso la respuesta de la api junto a su api. */
                    let data = respuesta.data;
                    
                    /* se crea el template con el formato de la respuesta que pide el desafio. */
                    let template = `
                        <h3>${contenido}</h3>
                        <br>
                        <p>El valor del dolar el día de hoy es: ${data.dolar.valor}</p>
                        <p>El valor del euro el día de hoy es: ${data.euro.valor}</p>
                        <p>El valor de la uf el día de hoy es: ${data.uf.valor}</p>
                        <p>El valor de la utm el día de hoy es: ${data.utm.valor}</p>
                    `

                    /* utilizo el metodo split para tomar los correos ingresados y separados por una coma (,) 
                    para crear un arreglo de correos. */
                    enviar(correos.split(','), asunto, template)
                        .then(respuesta => {
                            console.log(respuesta);
                            res.end("correo enviado correctamente.");
                        })
                        .catch(error => {
                            console.log(error);
                            res.end("se ha generado un error al enviar el correo electronico.");
                        })

                    console.log(template)

                    let nombre = uuidv4();

                    /* utilizo file system para crear un nuevo archivo en formato txt que sera guardado en la carpeta correos. */
                    /* ademas, se utiliza como callbakc la variable error, para saber si existe un problema o no y luego imprimir un mensaje. */
                    fs.writeFile(`correos/${nombre}.txt`, template, "utf-8", (error) => {
                        if (error) {
                            res.write("ha ocurrido un error al crear el archivo.")
                        } else {
                            res.write("El archivo a sido creado correctamente")
                        }
                        res.end();
                    })

                })
                /* captura el error en el caso que la API no pueda ser accedida y luego imprimo un mensaje para indicar esto. */
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