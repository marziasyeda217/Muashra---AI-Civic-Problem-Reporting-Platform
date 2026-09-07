/**
 * MUASHRA Server - Entry Point
 * AI Civic Problem-Reporting & Resolution Platform
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const complaintsRouter = require('./routes/complaints');
const analyticsRouter = require('./routes/analytics');
const authRouter = require('./routes/auth');
const { initializeComplaintRepository } = require('./services/complaintRepository');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/analytics', analyticsRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'MUASHRA AI Civic Platform',
    timestamp: new Date().toISOString(),
    aiEngine: process.env.DASHSCOPE_API_KEY ? 'Alibaba Qwen (Live API)' : 'Groq Llama-3.3-70B + Smart Fallback'
  });
});

app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: Arial, sans-serif; padding: 40px; text-align: center; max-width: 600px; margin: auto;">
      <h1 style="color: #0f172a;">🏛️ MUASHRA API Server</h1>
      <p style="color: #475569;">AI Civic Problem-Reporting & Resolution Platform Backend is running successfully.</p>
    </div>
  `);
});

async function startServer() {
  try {
    await initializeComplaintRepository();

    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 MUASHRA Backend Server is running!`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Unable to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
