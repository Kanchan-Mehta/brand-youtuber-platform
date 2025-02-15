import { InsertCreator, Creator, InsertBrand, Brand } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getCreator(id: number): Promise<Creator | undefined>;
  createCreator(creator: InsertCreator): Promise<Creator>;
  getAllCreators(): Promise<Creator[]>;
  getBrand(id: number): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  getAllBrands(): Promise<Brand[]>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private creators: Map<number, Creator>;
  private brands: Map<number, Brand>;
  private creatorId: number;
  private brandId: number;
  public sessionStore: session.Store;

  constructor() {
    this.creators = new Map();
    this.brands = new Map();
    this.creatorId = 1;
    this.brandId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getAllCreators(): Promise<Creator[]> {
    return Array.from(this.creators.values());
  }

  async getAllBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async getCreator(id: number): Promise<Creator | undefined> {
    return this.creators.get(id);
  }

  async createCreator(creator: InsertCreator): Promise<Creator> {
    const id = this.creatorId++;
    const newCreator: Creator = {
      ...creator,
      id,
      pastCollaborations: creator.pastCollaborations || null,
      portfolio: creator.portfolio || null,
      creatorUsp: creator.creatorUsp || null,
    };
    this.creators.set(id, newCreator);
    return newCreator;
  }

  async getBrand(id: number): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const id = this.brandId++;
    const newBrand: Brand = { ...brand, id };
    this.brands.set(id, newBrand);
    return newBrand;
  }
}

export const storage = new MemStorage();