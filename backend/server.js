const express = require("express");
const app = express();

app.use(express.json());
app.use(require("cors")());

// Test API
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend OK rồi 😎" });
});

// PORT backend chạy
const PORT = 5002;

// KHÔNG CÓ DÒNG NÀY THÌ SERVER KHÔNG BAO GIỜ KHỞI ĐỘNG
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});