import { executeQuery } from '../../configs/postgresConfig.js';

export class Database {
  constructor(tableName) {
    this.tableName = tableName;
    if (typeof this.tableName !== 'string') {
      throw new Error('Table name must be a string');
    }
    this.query = '';
    this.whereValues = [];
  }

  select(object) {
    if (object) {
      const fields = Object.keys(object)
        .filter((key) => object[key])
        .map((key) => `"${key}"`)
        .join(', ');
      this.query += `SELECT ${fields} FROM "${this.tableName}"`;
    } else {
      this.query += `SELECT * FROM "${this.tableName}"`;
    }
    return this;
  }

  where(object) {
    if (object) {
      const whereConditions = [];
      const whereValues = [];

      Object.keys(object).forEach((key) => {
        whereConditions.push(`"${key}" = $${this.whereValues.length + whereValues.length + 1}`);
        whereValues.push(object[key]);
      });

      let combinedWhereConditions = '';

      if (whereConditions.length > 0) {
        combinedWhereConditions = `WHERE ${whereConditions.join(' AND ')}`;
      }

      this.query += ` ${combinedWhereConditions}`;
      this.whereValues = this.whereValues.concat(whereValues);
    }
    return this;
  }


  insert() {
    this.query += 'INSERT ';
    return this;
  }

  into(columns) {
    if (!Array.isArray(columns) || columns.length === 0) {
      throw new Error('Columns must be a non-empty array');
    }

    const formattedColumns = columns.map((col) => `"${col}"`).join(', ');
    this.query += ` INTO "${this.tableName}" (${formattedColumns})`;
    return this;
  }

  values(valuesArray) {
    if (!Array.isArray(valuesArray) || valuesArray.length === 0) {
      throw new Error('Values must be a non-empty array');
    }

    const placeholders = valuesArray.map((_, index) => `$${index + 1}`).join(', ');

    this.query += ` VALUES (${placeholders})`;
    this.whereValues = this.whereValues.concat(valuesArray);
    return this;
  }

  update() {
    this.query += `UPDATE "${this.tableName}"`;
    return this;
  }

  set(object) {
    if (typeof object !== 'object' || object === null) {
      throw new Error('Set parameter must be an object');
    }

    const setClauses = [];
    const setValues = [];

    Object.keys(object).forEach((key, index) => {
      setClauses.push(`"${key}" = $${this.whereValues.length + index + 1}`);
      setValues.push(object[key]);
    });

    this.query += ` SET ${setClauses.join(', ')}`;
    this.whereValues = this.whereValues.concat(setValues);

    return this;
  }

  delete() {
    this.query += `DELETE FROM "${this.tableName}"`;
    return this;
  }

  async execute() {
    try {
      console.log('Executing Query:', this.query);
      console.log('With Values:', this.whereValues);
      return await executeQuery(this.query, this.whereValues);
    } catch (error) {
      console.error('Error executing query:', error.message);
      throw new Error(`Database query execution error: ${error.message}`);
    }
  }
}
