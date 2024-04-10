const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const con = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    database: 'alugueis'
});

const teste = (req, res) => {
    res.send("Back-end respondendo ");
}

const create = (req, res) => {
    let cpf = req.body.cpf;
    let numero = req.body.numero;
    let query = `INSERT INTO Telefone(cpf, nome, sobrenome, nascimento) VALUE`;
    query += `('${cpf}', '${numero}');`;
    con.query(query, (err, result) => {
        if (err)
            res.status(400).json(err).end();
        else {
            const novo = req.body;
            novo.id = result.insertId;
            res.status(201).json(novo).end();
        }
    });
};
const read = (req, res) => {
    con.query("SELECT * FROM Telefone ORDER BY id DESC",(err, result)=>{
        if(err)
            res.json(err);
        else
            res.json(result);
    });
}

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", teste);
app.post("/Cliente", create);
app.get("/Cliente", read);

app.listen(3000, () => {
    console.log("Back-end respondendo na porta 3000");
});

const del = (req, res) => {
    let id = req.params.id;
    con.query(`DELETE FROM Telefone WHERE id = ${id}`, (err, result) => {
        if (err)
            res.status(400).json(err).end();
        else {
            if (result.affectedRows > 0)
                res.status(204).json(result).end();
            else
                res.status(404).json("Registro não encontrado").end();
        }
    });
}

  const update = (req, res) => {
    let cpf = req.body.cpf;
    let numero = req.body.numero;
    let query = `UPDATE clientes SET cpf = '${cpf}', numero = '${numero}'`;
    con.query(query, (err, result) => {
        if (err)
            res.status(400).json(err).end;
        else {
            if (result.affectedRows > 0)
                res.status(202).json(req.body).end();
            else
                res.status(404).json("Registro não encontrado").end();
        }
    });
}

module.exports = {
    create,
    read,
    update,
    del
};