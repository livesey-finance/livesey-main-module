import http from 'node:http';
import { Router } from 'livesey-routing';

import { env } from './configs/envConfig.js';
import { getPostgresDbClient } from './configs/postgresConfig.js';
import { router } from './infrastructure/routes/index.js';
import { setCorsHeaders } from './configs/corsConfig.js';
import { Database } from './infrastructure/database/index.js';

const port = parseInt(env.PORT, 10);

const appRouter = Router.use('/api', router);

(async () => {
  try {
    const server = http.createServer((req, res) => {
      setCorsHeaders(res);
      appRouter.handleRequest(req, res);
    });

    await getPostgresDbClient()
      .then(() => console.log('Successfully connected to Postgres'))
      .catch((err) => console.error('Error connecting to Postgres:', err.message));


    ///////////
    const db = new Database('User');
    db.select()
      .where({ name: 'John' }, false)
      .execute()
      .then((result) => console.log('Select with deleted check:', result))
      .catch((error) => console.error(error));
    ///////////

    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  } catch (error) {
    console.error('Server initialization failed:', error.message);
  }
})();
