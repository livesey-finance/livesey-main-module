import http from 'node:http';
import { Router } from 'livesey-routing';

import { env } from './configs/envConfig.js';
import { getPostgresDbClient } from './configs/postgresConfig.js';
import { router } from './infrastructure/routes/index.js';
import { setCorsHeaders } from './configs/corsConfig.js';

const port = parseInt(env.PORT, 10);

const appRouter = Router.use('/api', router);

(async () => {
  const server = http.createServer((req, res) => {
    setCorsHeaders(res);
    appRouter.handleRequest(req, res);
  });

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });

  await getPostgresDbClient();
})();
