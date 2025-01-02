import express from 'express';
import userRoutes from './routes/userRoutes'; // Se till att filen existerar enligt tidigare instruktioner

const app = express();

// Middleware för att hantera JSON
app.use(express.json());

// Använd routen för användare
app.use('/users', userRoutes);

// Starta servern
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
