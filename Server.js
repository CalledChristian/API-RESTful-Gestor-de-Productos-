//definimos las constantes , importando las librerias
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
//const conexionDB = require('Database/db');
const mysql = require("mysql2");
//constante "app"
const app = express();
//constante para definir las subrutas
const router = express.Router();
//carga de variables de entorno
require('dotenv').config();


//Definimos el puerto de escucha para el servidor de API RESTful:
app.listen(3000, ()=>{
   console.log("Servidor corriendo en el puerto 3000")
});

//Definimos la conexión de base de datos MySQL:
const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
});

conn.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log("Conexión exitosa a base de datos");
});

//Definimos la Ruta Base para la API RESTful - Gestor de Productos
//--> app.use("/rutaBase", router);
app.use("/api/productos " , router );

/*Lista de Codigos HTTP
* 200 OK (POR DEFECTO)
* 201 CREATED
* 400 BAD REQUEST
* 404 NOT FOUND
* 500 INTERNAL SERVER ERROR
*/

//Definimos las subrutas para la API RESTful + Su Función CallBack (req,res) => {indicaciones}
//[con la variable router]
router.get("/", (req, res) => {
    conn.query("select * from productos", (err, results) => {
        //si hay algún error lo mostramos
        if (err){
            res.status(500).json({
                "msg": "ocurrió un error en el servidor",
                "status": 500
            });
        }else {
            //Sino mostramos los productos en formato json
            res.json({
                "productos":results
            });
        }
    });
});

//SubRuta para ver productos según el ID
//localhost:3000/api/productos/idProducto/1
//[Caso: req.params.<parameter> → params]
router.get("/idProducto/:id", (req,res)=>{

    let idProducto = req.params.id;

    console.log(idProducto);

    let sql = "select * from productos where idProducto = ? ";

    let parametros = [idProducto];

    //isNaN() --> metodo "is not a number", verifica si no es un numero
    if(isNaN(idProducto)){
        //Number.isInteger() --> verifica si el numero es entero
        //Number(str) --> convierte un string a numero
        if(!Number.isInteger(Number(idProducto))){
            res.status(400).json({
                "msg": "el ID del producto debe ser número entero",
                "status": 400
            });
        }else {
            conn.query(sql, parametros, (err, results) => {
                if (err) {
                    res.status(500).json({
                        "msg": "ocurrió un error en el servidor",
                        "status": 500
                    });
                } else if (results.length == 0) {
                    res.status(404).json({
                        "msg": "producto no encontrado",
                        "status": 404
                    });
                } else {
                    res.json({
                        "msg": "producto encontrado",
                        "producto": results
                    });
                }
            });
        }
    }else {
        res.status(400).json({
            "msg": "el ID del producto debe ser número entero",
            "status": 400
        });
    }
});

//Ruta para gestionar cuando se envie ID vacio
router.get("/idProducto", (req,res)=>{

    let idProducto = req.params.id;

    console.log(idProducto);

    res.status(400).json({
        "msg":"debe enviar el ID del producto a buscar",
        "status":400
    });
});

//SubRuta para ver productos según la marca
//localhost:3000/api/productos/marca/samsung
//[Caso: req.params.<parameter> → params]
router.get("/marca/:marca", (req,res)=>{

    let marcaStr = req.params.marca;

    console.log(marcaStr);

    let sql = "select * from productos where marca = ? ";

    let parametros = [marcaStr];


    conn.query(sql, parametros, (err, results) => {
        if (err) {
            res.status(500).json({
                "msg": "ocurrió un error en el servidor",
                "status": 500
            });
        } else if (results.length == 0) {
            res.status(404).json({
                "msg": "No se encuentran productos disponibles de la Marca",
                "status": 404
            });
        } else {
            res.json({
                "msg": "productos encontrados",
                "productos": results
            });
        }
    });
});

//Ruta para gestionar cuando no se envie marca
router.get("/marca", (req,res)=>{

    res.status(400).json({
        "msg":"debe enviar la marca de productos a buscar",
        "status":400
    });
});

//SubRuta para ver productos según la categoria
//localhost:3000/api/productos/categoria/celulares
//[Caso: req.params.<parameter> → params]
router.get("/categoria/:categoria",function (req,res){

    //res.send("la categoria es:"+req.query.categoria);

    let categoriaStr = req.params.categoria;

    console.log(categoriaStr);

    let sql = "select * from productos where categoria = ? ";

    let parametros = [categoriaStr];


    conn.query(sql, parametros, (err, results) => {
        if (err) {
            res.status(500).json({
                "msg": "ocurrió un error en el servidor",
                "status": 500
            });
        } else if (results.length == 0) {
            res.status(404).json({
                "msg": "No se encuentran productos disponibles de la Categoria",
                "status": 404
            });
        } else {
            res.json({
                "msg": "productos encontrados",
                "productos": results
            });
        }
    });
});

//Ruta para gestionar cuando no se envie categoria
router.get("/categoria", (req,res)=>{

    res.status(400).json({
        "msg":"debe enviar la categoria de productos a buscar",
        "status":400
    });
});

//SubRuta para ver productos según el precio o menos
//localhost:3000/api/productos/precio/1000
//[Caso: req.params.<parameter> → params]
router.get("/precio/:precio", (req,res)=>{

    let precio = req.params.precio;

    console.log(precio);

    let sql = "select * from productos where precio <= ? ";

    let parametros = [precio];


    if(!isNaN(precio)){
        conn.query(sql,parametros,(err,results)=>{
            if(err){
                res.status(500).json({
                    "msg":"ocurrió un error en el servidor",
                    "status":500
                })
            }else if(results.length == 0){
                res.status(404).json({
                    "msg":"No se encuentran productos disponibles menor igual al precio ingresado",
                    "status":404
                })
            }else{
                res.json({
                    "msg":"productos encontrados",
                    "productos":results
                });
            }
        });
    }else{
        res.status(400).json({
            "msg":"Precio No Numérico",
            "status":400
        })
    }
});

//Ruta para gestionar cuando no se envie el precio
router.get("/precio", (req,res)=>{

    res.status(400).json({
        "msg":"debe enviar el precio del producto a buscar",
        "status":400
    });
});

//SubRuta para ver productos según el nombre
//localhost:3000/api/productos/nombre/samsung galaxy
//[Caso: req.params.<parameter> → params]
router.get("/nombre/:nombre", function(req,res){

    let nombreStr = req.params.nombre;

    console.log(nombreStr);

    let sql = "select * from productos where nombre = ? ";

    let parametros = [nombreStr];


    conn.query(sql, parametros, (err, results) => {
        if (err) {
            res.status(500).json({
                "msg": "ocurrió un error en el servidor",
                "status": 500
            });
        } else if (results.length == 0) {
            res.status(404).json({
                "msg": "producto no encontrado",
                "status": 404
            });
        } else {
            res.json({
                "msg": "producto encontrado",
                "productos": results
            });
        }
    });

});

//Ruta para gestionar cuando no se envie el nombre
router.get("/nombre", (req,res)=>{

    res.status(400).json({
        "msg":"debe enviar el nombre del producto a buscar",
        "status":400
    });
});

//SubRuta para ver productos según la categoria y marca
//localhost:3000/api/productos/marca/samsung
//[Caso: req.query.<parameter> → query]
//NOTA: Se requiere definir una ruta para conocer los "req.query.<parameter>"
//En este caso "/consulta"
router.get("/consulta", function(req,res){

    let categoria = req.query.categoria;
    let marca = req.query.marca;

    console.log(categoria+" "+marca);

    let sql = "select * from productos where categoria = ? and marca = ? ";

    let parametros = [categoria,marca];

    conn.query(sql,parametros,(err,results)=>{
        if(err) throw err;
        res.json(results);
    });
});

//SubRuta para Crear un Producto

router.post("/crear", bodyParser.urlencoded({extended:true}),(req,res)=>{

    //obtenemos los datos del form-body (si es vacio , es undefined)
    //let idProducto = req.body.idProducto;
    let nombre = req.body.nombre;
    let categoria = req.body.categoria;
    let marca = req.body.marca;
    let precio = req.body.precio;

    //console.log(idProducto);


    let sql = "insert into productos (nombre,categoria,marca,precio) values (?,?,?,?)";

    let parametros = [nombre,categoria,marca,precio];

    if(nombre!=undefined && categoria!=undefined && marca!=undefined && precio!=undefined ) {
        if(nombre!="" && categoria!="" && marca!="" && precio!=""){
            //isNaN() --> devuelve false si es número y true si es string u otro tipo de variable
            if(!isNaN(precio)) {
                conn.query(sql, parametros, (err, results) => {
                    if (err) {
                        res.status(500).json({
                            "msg": "ocurrió un error en el servidor",
                            "status":500
                        });
                    } else {
                        conn.query("select * from productos order by idProducto desc ", (err, results) => {
                            if (err) {
                                res.status(500).json({
                                    "msg": "ocurrió un error en el servidor",
                                    "status":500
                                });
                            } else {
                                res.status(201).json({
                                    "msg": "Producto Creado exitosamente",
                                    "status": 201,
                                    "productos": results
                                });
                            }
                        });
                    }
                });
            }else{
                res.status(400).json({
                    "msg": "Precio No Numérico",
                    "status":400
                });
            }
        }else {
            res.status(400).json({
                "msg": "Los campos del nuevo producto No deben ser Vacíos.",
                "status":400
            });
        }
    }else{
        res.status(400).json({
            "msg":"Debe enviar todos los campos para el nuevo producto",
            "status":400
        })
    }
});

//SubRuta para editar un Producto
router.put("/editar/:id", bodyParser.urlencoded({extended:true}),(req,res)=> {

    //obtenemos el idProducto por params
    let idProducto = req.params.id;
    //obtenemos los datos del form-body
    let nombre = req.body.nombre;
    let categoria = req.body.categoria;
    let marca = req.body.marca;
    let precio = req.body.precio;

    //let sql = "update productos set nombre=?,categoria=?,marca=?,precio=? where idProducto = ? ";
    let sql = "update productos set ";
    let parametros = [nombre, categoria, marca, precio, idProducto];
    console.log(parametros.length)
    let parametrosName = ["nombre", "categoria", "marca", "precio"];
    let flag = true;
    let flag2 = true;


    //if (idProducto != undefined && idProducto != "") {
    if (!isNaN(idProducto)) {
        if(Number.isInteger(Number(idProducto))) {
            let param = [idProducto];
            conn.query("select * from productos where idProducto = ?", param, (err, results) => {
                if (err) {
                    res.status(500).json({
                        "msg": "ocurrió un error en el servidor",
                        "status": 500,
                    });
                } else if (results.length == 0) {
                    res.status(404).json({
                        "msg": "producto no encontrado",
                        "status": 404,
                    });
                } else {
                    while (flag && flag2) {
                        for (i = 0; i <= parametros.length - 2; i++) {
                            if (parametros[i] != undefined) {
                                sql = sql + parametrosName[i] + "=? ,";
                                console.log(parametros[i])
                            } else {
                                //función .splice(i,1) para eliminar 1 elemento de cierto indice i en un arreglo
                                parametros.splice(i, 1);
                            }
                            console.log(sql);
                        }
                        console.log(parametros);
                        //función .slice(0,-n) para eliminar los ultimos n caracteres de un string
                        //let sql2 = sql.slice(0, -1) + " where idProducto = ?";
                        for (i = 0; i <= parametros.length - 2; i++) {
                            if (parametros[i] != "") {
                                //sql = sql + parametrosName[i] + "=? ,";
                                continue;
                            } else {
                                res.status(400).json({
                                    "msg": "No debe haber campos vacios",
                                    "status": 400
                                });
                                //parametros.splice(i, 1);
                                flag = false;
                                break;
                            }
                        }
                        if(flag==true) {
                            flag2 = false;
                        }
                    }
                    if (flag) {
                        console.log(precio);
                        if(!isNaN(precio)) {
                            //función .slice(0,-n) para eliminar los ultimos n caracteres de un string
                            let sql2 = sql.slice(0, -1) + " where idProducto = ?";
                            console.log(sql2);
                            conn.query(sql2, parametros, (err, results) => {
                                if (err) {
                                    res.status(500).json({
                                        "msg": "ocurrió un error en el servidor",
                                        "status": 500,
                                    });
                                } else {
                                    let param = [idProducto];
                                    conn.query("select * from productos where idProducto= ?", param, (err, results) => {
                                        if (err) {
                                            res.status(500).json({
                                                "msg": "ocurrió un error en el servidor",
                                                "status": 500
                                            });
                                        } else {
                                            res.json({
                                                "msg": "producto editado exitosamente",
                                                "producto": results
                                            });
                                        }
                                    });
                                }
                            });
                        }else{
                            res.status(400).json({
                                "msg":"Precio No Numérico",
                                "status":400
                            })
                        }
                    }
                }
            });
        }else{
            res.status(400).json({
                "msg": "El ID producto debe ser número entero",
                "status": 400
            });
        }
    } else {
        res.status(400).json({
            "msg": "El ID producto debe ser número entero",
            "status": 400
        });
    }
});

router.put("/editar",(req,res)=>{
    res.status(400).json({
        "msg":"debe enviar el ID del producto a editar",
        "status":400
    });
});

//subRuta para borrar producto según el ID
router.delete("/borrar/:id" , (req,res) => {

    let idProducto = req.params.id;

    let sql = "select * from productos where idProducto = ? ";

    let parametros = [idProducto];

    if(!isNaN(idProducto)){
        if(Number.isInteger(Number(idProducto))){
            conn.query(sql, parametros, (err, results) => {
                //si el tamaño del arreglo es 0 (no hay resultados)
                if (results.length == 0) {
                    res.status(404).json({
                        "msg": "producto no encontrado",
                        "status": 404
                    });
                    //throw err; (comentado para no finalizar la app)
                } else {
                    //Si no hay error , borramos el producto:
                    conn.query("delete from productos where idProducto = ? ", parametros, (err, results) => {
                        if (err) {
                            res.status(500).json({
                                "msg": "ocurrio un error en el servidor",
                                "status": 500
                            });
                        } else {
                            //y mostramos los productos y el "msg":"producto borrado",
                            conn.query("select * from productos", (err, results) => {
                                if (err) {
                                    res.status(500).json({
                                        "msg": "ocurrio un error en el servidor",
                                        "status":500
                                    });
                                } else {
                                    res.json({
                                        "msg": "producto borrado",
                                        "productos": results
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }else{
            res.status(400).json({
                "msg": "el ID del producto debe ser número entero",
                "status": 400
            });
        }
    }else{
        res.status(400).json({
            "msg": "el ID del producto debe ser número entero",
            "status": 400
        });
    }
});


//Ruta para gestionar cuando no se envie el ID del producto a borrar
router.delete("/borrar", (req,res)=>{

    res.status(400).json({
        "msg":"debe enviar el ID del producto a borrar",
        "status":400
    });
});

