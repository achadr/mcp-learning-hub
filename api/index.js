/**
 * Vercel Serverless Function - API Handler
 * This file is not used in the current setup.
 * See api/serverless.js for the main API handler.
 */
export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'Use /api/serverless for API endpoints'
  });
}
