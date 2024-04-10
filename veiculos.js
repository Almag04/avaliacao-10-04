const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const con = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    database: 'locadora'
});

app.get("/", (req, res) => {
    res.send("Back-end respondendo");
});

app.post("/veiculo", (req, res) => {
    const { placa, modelo, marca, tipo, diaria } = req.body;
    const query = `INSERT INTO Veiculo (placa, modelo, marca, tipo, diaria) VALUES (?, ?, ?, ?, ?)`;
    con.query(query, [placa, modelo, marca, tipo, diaria], (err, result) => {
        if (err) {
            console.error("Erro ao adicionar veículo:", err);
            res.status(400).json(err);
        } else {
            console.log("Veículo adicionado com sucesso!");
            const novoVeiculo = { placa, modelo, marca, tipo, diaria, id: result.insertId };
            res.status(201).json(novoVeiculo);
        }
    });
});

app.get("/veiculo", (req, res) => {
    con.query("SELECT * FROM Veiculo ORDER BY id DESC", (err, result) => {
        if (err) {
            console.error("Erro ao obter veículos:", err);
            res.status(500).json(err);
        } else {
            console.log("Veículos obtidos com sucesso!");
            res.status(200).json(result);
        }
    });
});

app.put("/veiculo/:id", (req, res) => {
    const id = req.params.id;
    const { placa, modelo, marca, tipo, diaria } = req.body;
    const query = `UPDATE Veiculo SET placa = ?, modelo = ?, marca = ?, tipo = ?, diaria = ? WHERE id = ?`;
    con.query(query, [placa, modelo, marca, tipo, diaria, id], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar veículo:", err);
            res.status(400).json(err);
        } else {
            if (result.affectedRows > 0) {
                console.log("Veículo atualizado com sucesso!");
                res.status(200).json(req.body);
            } else {
                res.status(404).json("Veículo não encontrado");
            }
        }
    });
});

app.delete("/veiculo/:id", (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM Veiculo WHERE id = ?`;
    con.query(query, [id], (err, result) => {
        if (err) {
            console.error("Erro ao excluir veículo:", err);
            res.status(400).json(err);
        } else {
            if (result.affectedRows > 0) {
                console.log("Veículo excluído com sucesso!");
                res.status(204).end();
            } else {
                res.status(404).json("Veículo não encontrado");
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Back-end respondendo na porta ${PORT}`);
});