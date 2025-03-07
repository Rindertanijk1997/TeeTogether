import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    // Din logik här
    res.json({ message: 'Användarlista hämtad' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Ett okänt fel inträffade' });
    }
  }
});

router.post('/add', async (req: Request, res: Response) => {
  try {
    // Din logik här
    res.json({ message: 'Användare tillagd' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Ett okänt fel inträffade' });
    }
  }
});

export default router;
