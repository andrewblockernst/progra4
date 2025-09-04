import sqlite3 from "sqlite3";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

class Database {
  private db: sqlite3.Database;

  constructor() {
    const dbPath = path.join(__dirname, "../../database.sqlite");
    this.db = new sqlite3.Database(dbPath);
    // Aca podemos condicionalmente crear las tablas si no existen con una variable de entorno
    this.init();
  }

  private async init() {
    if (process.env.POPULATE_DB === "true") {
      await this.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          password TEXT NOT NULL
        )
      `);

      await this.run(`
      CREATE TABLE IF NOT EXISTS walls (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

      await this.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        wall_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (wall_id) REFERENCES walls (id) ON DELETE CASCADE
      )
    `);

      await this.run(`
       INSERT INTO walls (id, name, description) VALUES ('1', 'Wall 1', 'This is the first wall');
       INSERT INTO messages (id, wall_id, content) VALUES ('1', '1', 'Hello, world!');
     `);
    }
  }

  async run(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row as T);
      });
    });
  }

  async all<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as T[]);
      });
    });
  }

  close(): void {
    this.db.close();
  }
}

export const database = new Database();
