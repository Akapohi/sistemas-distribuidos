import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Simulação de um banco de dados de usuários
const usuariosCadastrados = [
    {
        id: 1,
        email: "usuario@exemplo.com",
        senhaHash: bcrypt.hashSync("minhaSenhaSegura", 10) 
    }
];

// Rota para autenticação
app.post("/autenticar", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Email e senha são obrigatórios" });
    }

    const usuario = usuariosCadastrados.find(u => u.email === email);
    if (!usuario) {
        return res.status(401).json({ mensagem: "Email ou senha incorretos" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
        return res.status(401).json({ mensagem: "Email ou senha incorretos" });
    }

    const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRETO || "segredoPadrao",
        { expiresIn: "2h" } // Tempo de expiração 2 horas
    );

    res.json({ token, mensagem: "Autenticação bem-sucedida!" });
});

// Rota de boas-vindas
app.get("/", (req, res) => {
    res.send("Bem-vindo ao sistema de autenticação!");
});

const PORTA = process.env.PORTA || 3000;
app.listen(PORTA, () => {
    console.log(`Servidor está rodando na porta ${PORTA}`);
});
