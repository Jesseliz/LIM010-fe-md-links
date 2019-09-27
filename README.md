
  

# Markdown Links

  

## Preámbulo

  [Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado ligero muy popular entre developers. Es usado en muchísimas plataformas que manejan texto plano (GitHub, foros, blogs, ...), y es muy común encontrar varios archivos en ese formato en cualquier tipo de repositorio (ejemplo el tradicional `README.md`).

Estos archivos `Markdown` normalmente contienen _links_ vínculos/ligas) que muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de la información que se quiere compartir.

Dentro de una comunidad de código abierto, nos han propuesto crear una herramienta usando [Node.js](https://nodejs.org/), que lea y analice archivos en formato `Markdown`, para verificar los links que contengan y reportar algunas estadísticas.

  

## Diagrama de Flujo 
![enter image description here](https://lh3.googleusercontent.com/yHNn7G7MbewYOFujS30xPS_6TM1My_wyZd2utSG7BlIVH8zVhZtaEMSXLc0xERBGI8nt9erYLGyw "Diagrama de flujo mdLinks") 

## Implementación

  ### Api `mdLinks(path, options)`
  #### Argumentos
  -   `path`: Ruta absoluta o relativa al archivo o directorio. 
  -   `options`: Un objeto con las siguientes propiedades:
	    -   `validate`: Booleano que determina si se desea validar los links encontrados.
#### Valor de retorno
La función retorna una promesa (`Promise`) que resuelva a un arreglo (`Array`) de objetos (`Object`), donde cada objeto representa un link y contiene las siguientes propiedades:
-   `href`: URL encontrada.
-   `text`: Texto que aparecía dentro del link (`<a>`).
-   `file`: Ruta del archivo donde se encontró el link.

Si se considera la opción de validación de links se agregaran dos propiedades más que incluye la palabra `ok` o `fail` después de la URL, así como el status de la respuesta recibida a la petición HTTP a dicha URL.

```js
const mdLinks = require("md-links");

mdLinks("./some/example.md")
  .then(links => {
    // => [{ href, text, file }]
  })
  .catch(console.error);

mdLinks("./some/example.md", { validate: true })
  .then(links => {
    // => [{ href, text, file, status, ok }]
  })
  .catch(console.error);

mdLinks("./some/dir")
  .then(links => {
    // => [{ href, text, file }]
  })
  .catch(console.error);
```
	    
## Documentación Técnica
Para ejecutar la aplicación debe escribir la siguiente linea de comandos a través de la terminal:
`md-links <path-to-file> [options]`

por ejemplo:

![enter image description here](https://lh3.googleusercontent.com/92ZFOGNo5o8HEKIb_7e8tWt5Fv1PEiI501DS38hNpb7M8JQc3GeTlEomYvRZcTZ9YoVZUN9SSVw9 "md-links default")
El comportamiento por defecto no valida si las URLs responden ok o no, solo identifica el archivo markdown (a partir de la ruta que recibe como argumento), analiza el archivo Markdown e imprime los links que vaya encontrando, junto con la ruta del archivo donde se encontraron y el texto que hay dentro del link (truncado a 50 caracteres).

### Options

#### `--validate`

Si pasamos la opción  `--validate`, el módulo hace una petición HTTP para averiguar si el link funciona o no. Si el link resulta en una redirección a una URL que responde ok, entonces considera el link como ok.

Por ejemplo:

![enter image description here](https://lh3.googleusercontent.com/WGM6HATEtN8Db39pvM7Jd1rnqezK1JPtK4DfrqTQtr19_33mnyl4XowfOFhMagaAPvKp8yqo84H4 "mdliks-v")

Vemos que el _output_ en este caso incluye la palabra `ok` o `fail` después de la URL, así como el status de la respuesta recibida a la petición HTTP a dicha URL.

#### `--stats`
Si pasamos la opción  `--stats`  el output (salida) será un texto con estadísticas básicas sobre los links.
Por ejemplo:

![enter image description here](https://lh3.googleusercontent.com/cuVOIi7AOvl7OmhOqSEgqt5jhZi32eDGIL4I53tj3MiEW6iHiitjVlK-KG2L9vmo1fxm4lnIMQTw "mdlibks-s")

#### `--stats y --validate`
También podemos combinar ambas opciones  `--stats`  y  `--validate`  para obtener estadísticas que necesiten de los resultados de la validación.

Por ejemplo:

![
](https://lh3.googleusercontent.com/ZO4K8sKeCcgp2qGPItbXuwjDW0ZGij64ckkmOExxeDrfuQbUU57uWOrS18Y8N5JXBtsTb8qaY-JO "mdlinks-s-v")

## Instalación 

- Para instalar la libreria vía npm ejecutar la siguiente linea a través de la terminal:
  `npm install --global <github-user>/md-links`  :wink:
