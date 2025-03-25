import express from 'express';

const app = express();

app.use(express.json()); // Middleware för att hantera JSON-data

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
