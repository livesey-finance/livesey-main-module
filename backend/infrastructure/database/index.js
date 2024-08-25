import { executeQuery } from '../../configs/postgresConfig';

export const find = async (tableName, object) => {
  const query = `SELECT * FROM ${tableName} WHERE $1 = $2`
  await executeQuery(query, field);
};

// executeQuery(query, [userId])
//   .then(result => console.log(result))
//   .catch(error => console.error('Query error:', error));