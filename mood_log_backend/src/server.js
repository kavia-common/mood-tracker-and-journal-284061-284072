import { createServer } from 'http';
import app from './app.js';
import { env } from './config/env.js';

/**
 * Bootstrap HTTP server.
 */
const port = env.PORT || 3001;

const server = createServer(app);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`MoodLog backend running at http://localhost:${port}`);
});

export default server;
