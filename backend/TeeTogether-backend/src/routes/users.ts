import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Simulerad databas (du kan ersätta detta med DynamoDB senare)
const users: { id: string; username: string; password: string }[] = [];

// POST: Skapa ett konto
router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Användarnamn och lösenord krävs.' });
  }

  try {
    // Kontrollera om användarnamnet redan finns
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return res.status(409).json({ error: 'Användarnamnet är redan taget.' });
    }

    // Kryptera lösenordet
    const hashedPassword = await bcrypt.hash(password, 10);

    // Skapa användar-ID
    const id = uuidv4();

    // Lägg till användaren i databasen
    users.push({ id, username, password: hashedPassword });

    res.status(201).json({ message: 'Användare skapad!', id });
  } catch (error) {
    res.status(500).json({ error: 'Något gick fel vid skapandet av kontot.' });
  }
});

export default router;
