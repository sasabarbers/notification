const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot aktif ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});

const TelegramBot = require("node-telegram-bot-api");

(async () => {
  const { initializeApp } = await import("firebase/app");
  const { getDatabase, ref, onChildAdded } = await import("firebase/database");

  const token = "7668602853:AAE2tDFRNRviI8vVGDoMBKXCT6FoQeUssGo";
  const chatId = "6419243555";

  const firebaseConfig = {
    apiKey: "AIzaSyCLS_kMDsfaolcRYXWKEIKhcMYqiNN6XcI",
    authDomain: "randevu-sistemi-de0d2.firebaseapp.com",
    databaseURL: "https://randevu-sistemi-de0d2-default-rtdb.firebaseio.com",
    projectId: "randevu-sistemi-de0d2",
    storageBucket: "randevu-sistemi-de0d2.appspot.com",
    messagingSenderId: "43595523203",
    appId: "1:43595523203:web:3db7bafd5ba889322ae7b6"
  };

  const appFirebase = initializeApp(firebaseConfig);
  const db = getDatabase(appFirebase);

  const bot = new TelegramBot(token, { polling: true });

  console.log("Bot çalışıyor...");

  onChildAdded(ref(db, "appointments"), (snapshot) => {
    const appointment = snapshot.val();
    const message = `
📅 *Yeni Randevu Alındı!*

👤 *Ad Soyad:* ${appointment.name}
📞 *Telefon:* ${appointment.phone}
💈 *Hizmet:* ${appointment.service}
📆 *Randevu Tarihi:* ${appointment.date}
🕑 *Randevu Saati:* ${appointment.timeSlot}
📩 *Mail:* ${appointment.userEmail}
    `;
    bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
    console.log("Mesaj gönderildi:", message);
  });
})();
