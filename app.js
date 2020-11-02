const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050


const app = express();

app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'node_api_login'
})

app.get('/test', (req, res) => {
    const sql = "SELECT * FROM usuarios";

    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send('Sin resultados');
        }
    })
})

app.post('/register', (req, res) => {
    const sql = "INSERT INTO usuarios SET ?";

    const usuarioObj = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        correo: req.body.correo,
        contra: req.body.contra
    }

    connection.query(sql, usuarioObj, error => {
        if (error) throw error;
        res.send('Usuario guardado con éxito');
    })
})

app.post('/login', (req, res) => {
    const correo = req.body.correo;
    const contra = req.body.contra;   

    const sql = "SELECT * FROM usuarios WHERE correo = ? AND contra = ?";

    connection.query(sql, [correo, contra], (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send('No existe un usuario con ese correo o tu contraseña está equivocada');
        }
    })
})


connection.connect(error => {
    if (error) throw error;
    console.log("Database server running");
})

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))
