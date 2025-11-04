import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import noteRoutes from './routes/noteRoutes.js';
dotenv.config();
console.log(process.env.MONGO_URI);
const app = express()
const PORT = process.env.PORT || 5000;
connectDB();
//middleware
app.use(cors());
app.use(express.json());
app.use("/api/notes", noteRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
    });
