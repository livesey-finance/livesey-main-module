import express from "express";
import cors from "cors";

import {corsConfig} from "./configs/corsConfig.js";
import {env} from "./configs/envConfig.js";
import {getPostgresDbClient} from "./configs/postgresConfig.js";

const PORT = parseInt(env.PORT, 10);
const app = express();

app.use(express.json());
app.use(cors(corsConfig));
// app.use('/api', router);

(async () => {
  app.listen(PORT, () => console.log(`App is running on ${PORT} port`));
  await getPostgresDbClient();
})();
