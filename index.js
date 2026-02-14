const express = require("express");
const webPush = require("web-push");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());

/* =========================
   VALIDAÇÃO ENV

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  throw new Error("Chaves VAPID não configuradas");
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  throw new Error("Supabase não configurado");
}

/* =========================
   CONFIG PUSH


webPush.setVapidDetails(
  "mailto:jeanldev@hotmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

/* =========================
   SUPABASE


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/* =========================
   ROTAS DO SITE
========================= */

app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando na Hostinger");
});

app.get("/sobre-empresa", (req, res) => {
  res.send("Pagina sobre empresa");
});

app.get("/blog", (req, res) => {
  res.send("Pagina do blog");
});

app.get("/contato", (req, res) => {
  res.send("Pagina de contato");
});
app.get("/debug-env", (req, res) => {
  res.json({
    VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY
  });
});

/* =========================
   ENVIAR PUSH


app.post("/send-to-user", async (req, res) => {
  const { user_id, title, body } = req.body;

  if (!user_id || !title || !body) {
    return res.status(400).json({
      error: "user_id, title e body são obrigatórios"
    });
  }

  try {
    const { data, error } = await supabase
      .from("clinica_subscriptions")
      .select("subscription")
      .eq("user_id", user_id);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        error: "Nenhuma subscription encontrada"
      });
    }

    const payload = JSON.stringify({ title, body });

    const results = await Promise.allSettled(
      data.map(sub =>
        webPush.sendNotification(sub.subscription, payload)
      )
    );

    console.log("Resultado envio:", results);

    res.json({
      success: true,
      enviados: results.length
    });

  } catch (err) {
    console.error("Erro envio push:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
