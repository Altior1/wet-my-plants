import * as SQLite from "expo-sqlite";
import { Plant } from "../interface/plants";

const DATABASE_NAME = "wetmyplants.db";

class DatabaseService {
  private static instance: DatabaseService;
  private db: SQLite.SQLiteDatabase | null = null;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.db) return;

    this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS plants (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        lastWateredDate TEXT,
        imageUri TEXT,
        frequency INTEGER NOT NULL
      );
    `);
  }

  private getDb(): SQLite.SQLiteDatabase {
    if (!this.db) {
      throw new Error("Database not initialized. Call initialize() first.");
    }
    return this.db;
  }

  public async getAllPlants(): Promise<Plant[]> {
    const db = this.getDb();
    const rows = await db.getAllAsync<{
      id: string;
      name: string;
      lastWateredDate: string | null;
      imageUri: string | null;
      frequency: number;
    }>("SELECT * FROM plants");

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      lastWateredDate: row.lastWateredDate ? new Date(row.lastWateredDate) : null,
      imageUri: row.imageUri ?? undefined,
      frequency: row.frequency,
    }));
  }

  public async addPlant(plant: Plant): Promise<void> {
    const db = this.getDb();
    await db.runAsync(
      `INSERT INTO plants (id, name, lastWateredDate, imageUri, frequency) VALUES (?, ?, ?, ?, ?)`,
      [
        plant.id,
        plant.name,
        plant.lastWateredDate ? plant.lastWateredDate.toISOString() : null,
        plant.imageUri ?? null,
        plant.frequency,
      ]
    );
  }

  public async removePlant(plantId: string): Promise<void> {
    const db = this.getDb();
    await db.runAsync(`DELETE FROM plants WHERE id = ?`, [plantId]);
  }

  public async waterPlant(plantId: string): Promise<void> {
    const db = this.getDb();
    const now = new Date().toISOString();
    await db.runAsync(`UPDATE plants SET lastWateredDate = ? WHERE id = ?`, [
      now,
      plantId,
    ]);
  }

  public async updatePlant(plant: Plant): Promise<void> {
    const db = this.getDb();
    await db.runAsync(
      `UPDATE plants SET name = ?, lastWateredDate = ?, imageUri = ?, frequency = ? WHERE id = ?`,
      [
        plant.name,
        plant.lastWateredDate ? plant.lastWateredDate.toISOString() : null,
        plant.imageUri ?? null,
        plant.frequency,
        plant.id,
      ]
    );
  }
}

export const databaseService = DatabaseService.getInstance();
