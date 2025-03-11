import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const users = [
    {
        id: 1,
        email: "usuario@gmail.com",
        password: bcrypt.hashSync("123456", 10) 
    }
];

app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.password);
    if (!senhaCorreta) {
        return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "secreto",
        { expiresIn: "1h" }
    );

    res.json({ token });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});