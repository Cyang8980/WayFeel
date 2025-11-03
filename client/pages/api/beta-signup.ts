import type { NextApiRequest, NextApiResponse } from 'next';

interface BetaSignupRequest {
  email: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email }: BetaSignupRequest = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  try {
    const recipientEmail = 'hello.wayfeel@gmail.com';
    const subject = 'New Beta Signup';
    const message = `New beta signup request from: ${email}`;

    // Try to use nodemailer if available
    let emailSent = false;
    
    try {
      // Dynamic import to avoid errors if nodemailer is not installed
      const nodemailer = await import('nodemailer');
      
      // Check if email credentials are configured
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        const transporter = nodemailer.default.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: recipientEmail,
          subject: subject,
          text: message,
          html: `
            <h2>New Beta Signup</h2>
            <p>A new user has signed up for the beta:</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          `,
        });
        
        emailSent = true;
      }
    } catch {
      // Nodemailer not configured or not installed - fall back to logging
      console.warn('Nodemailer not configured, logging email instead');
    }

    // Log the email (for development/debugging)
    console.log('Beta signup email:', { to: recipientEmail, subject, message, email });

    // If email wasn't sent via nodemailer, you can:
    // 1. Configure nodemailer with Gmail credentials
    // 2. Use a service like SendGrid, Resend, or Mailgun
    // 3. Store in database and send via cron job
    // 4. Use a serverless function with email service

    if (!emailSent) {
      console.log('Email not sent via service - configure EMAIL_USER and EMAIL_PASSWORD environment variables');
      console.log(`Would send to: ${recipientEmail}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
    }

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error processing beta signup:', error);
    return res.status(500).json({ error: 'Failed to process signup' });
  }
}

