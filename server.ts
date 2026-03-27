import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '50mb' }));

  // API routes
  app.post("/api/send-itinerary", async (req, res) => {
    const { email, htmlContent, pdfBase64, theme } = req.body;

    if (!email || !htmlContent) {
      return res.status(400).json({ error: "Missing email or content" });
    }

    try {
      let transporter;
      let isTestAccount = false;

      // Check if SMTP is configured
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP credentials not configured. Creating Ethereal test account for demo purposes.");
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        isTestAccount = true;
      } else {
        // Configure transporter (using environment variables)
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.example.com",
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      }

      const mailOptions: any = {
        from: `"Dessert (De)Tour" <${process.env.SMTP_USER || "no-reply@dessertdetour.com"}>`,
        to: email,
        subject: `Your Dessert Tour: ${theme}`,
        html: htmlContent,
      };

      if (pdfBase64) {
        mailOptions.attachments = [
          {
            filename: `${theme.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_itinerary.pdf`,
            content: pdfBase64,
            encoding: 'base64'
          }
        ];
      }

      const info = await transporter.sendMail(mailOptions);
      
      let previewUrl: string | false = false;
      if (isTestAccount) {
        previewUrl = nodemailer.getTestMessageUrl(info);
        console.log("Preview URL: %s", previewUrl);
      }

      res.json({ success: true, previewUrl });
    } catch (error: any) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email. Check your SMTP configuration." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use((req, res, next) => {
      if (req.method === 'GET') {
        res.sendFile(path.join(distPath, 'index.html'));
      } else {
        next();
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
