import httpServer from './app.js';
import { config } from './config/environment.js';

httpServer.listen(config.port, () => {
  console.log(`Backend running on http://localhost:${config.port}`);
  console.log(`Socket.io ready`);
});
