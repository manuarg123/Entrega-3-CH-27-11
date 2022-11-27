/**
 * Inicializo express
 */
const express = require('express');
const app = express();
const PORT = 8080;

//conecto al servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor http levantado en el puerto ${server.address().port}`);
})
//Si hay un error me lo informa
server.on("error", error => console.log(`Eror en el servidor ${error}`));

/**
 * Utilizo la clase Contenedor de la entrega anterior
 */
class Contenedor{

    //Genero el archivo productos con un array vacio para empezar a trabajarlo
    constructor(archivo){
        this.archivo = archivo;
        this.articulos = [];
        this.fs = require('fs')
    }

    save(objeto){
        const objects = this.getAll();
        let newId = 1;
        if (objects.length !== 0) {
            newId = objects.length + 1;
        } else {
            newId;
        }
        const newObj = { id : newId, ...objeto}
        this.articulos.push(newObj);

        async function guardar(fs, archivo, articulos) {
            try {
                await fs.promises.writeFile(`./${archivo}`, JSON.stringify(articulos, null,2))
                console.log('guardado!')
            } catch (error) {
                console.log(error)
            }
        }
        guardar(this.fs, this.archivo, this.articulos);
    }

    getById(numero){
        if (this.articulos.length !== 0) {
            this.articulos.forEach(element => {
                if (element.id == numero) {
                    return console.log(element);
                }
            });
        } else {
            return console.log('No hay artículos')
        }
    }

    getAll(){
        return this.articulos;
    }

    deleteAll(){
        if (this.articulos.length !== 0) {
            this.articulos = [];
            async function guardar(fs, archivo, articulos) {
                try {
                    await fs.promises.writeFile(`./${archivo}`, JSON.stringify(articulos, null,2))
                    console.log('guardado!')
                } catch (error) {
                    console.log(error)
                }
            }
            guardar(this.fs, this.archivo, this.articulos);
        } else {
            return console.log('No hay artículos')
        }
    }

    deleteById(numero){
        if (this.articulos.length !== 0) {
            let indice = 0;
            this.articulos.forEach((element, index) => {
                if (element.id == numero) {
                    indice = index;
                }
            });
            //Elimina el elemento en ese índice
            delete this.articulos[indice];
            this.articulos.splice(indice,1)
            //Persisto los cambios en el archivo productos.txt
            async function guardar(fs, archivo, articulos) {
                try {
                    await fs.promises.writeFile(`./${archivo}`, JSON.stringify(articulos, null,2))
                     console.log('guardado!')
                 } catch (error) {
                     console.log(error)
                 }
             }
             guardar(this.fs, this.archivo, this.articulos);

        } else {
            return console.log('No hay artículos')
        }
    }

    leerArchivo(){
        this.fs.promises.readFile('./productos.txt', 'utf-8')
        .then(contenido =>{
            console.log(contenido);
        })
        .catch( err =>{
            console.log('Error de lectura ', err)
        })
    }

    setProductos(){
        this.fs.promises.readFile('./productos.txt', 'utf-8')
        .then(contenido =>{
           // const str = JSON.stringify(contenido);
            this.articulos.push(JSON.parse(contenido));
           // this.articulos.push(JSON.parse(contenido));
        })
        .catch( err =>{
            console.log('Error de lectura ', err)
        })
    }
}

let cont = new Contenedor("productos.txt");

//Seteo los productos del txt en el array de la clase
cont.setProductos();

//Directorio inicial
app.get('/', (request,response) => {
    response.send('<h1 style="color: blue; font-weight:bold">Rutas a elegir: </h1> \n <h4 style="color:red"> <a href="./productos">productos</a> </h4> \n <h4><a href="./productoRamdom">/productoRandom</a></h4>')
})

// 1er consigna
app.get('/productos', (request,response) => {
    response.send(cont.getAll()[0])
})

// 2da consigna
app.get('/productoRamdom', (request,response) => {
    response.send(cont.getAll()[0][ Math.floor(Math.random() * 3)])
})

//punto b. Cada vez que ingresa este get visitas va incrementando su valor
let visitas = 0;
app.get('/visitas', (request,response) => {
    response.send(`La cantidad de visitas es ${++visitas}`);
})