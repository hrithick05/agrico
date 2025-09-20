// Configuration with environment variable support
require('dotenv').config();

const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  supabase: {
    url: process.env.SUPABASE_URL || 'https://ycorozkbfeqwybujwnaz.supabase.co',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inljb3JvemtiZmVxd3lidWp3bmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY2MTQ2MCwiZXhwIjoyMDczMjM3NDYwfQ.Uk8pYd76w-UEEzLmnXrTJEMdo86sB71iOA1vnQI8UoQ'
  },
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:8080',
      'http://localhost:5173',
      'https://agrico-7y0qmnypk-hrithicks-projects-be453f76.vercel.app',
      'https://agrico-h75lzlo9z-hrithicks-projects-be453f76.vercel.app',
      'https://agrico-c2mmyrz3u-hrithicks-projects-be453f76.vercel.app'
    ],
    credentials: true
  }
};

module.exports = config;
