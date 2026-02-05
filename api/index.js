/**
 * Vercel serverless function entry point.
 * Imports the Express app and exports it as the default handler.
 * Vercel automatically wraps Express apps into serverless functions.
 */
const app = require('../server/index');

module.exports = app;
