import { InsertCreator, Creator, InsertBrand, Brand } from "@shared/schema";

export interface IStorage {
  getCreator(id: number): Promise<Creator | undefined>;
  createCreator(creator: InsertCreator): Promise<Creator>;
  getBrand(id: number): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
}

export class MemStorage implements IStorage {
  private creators: Map<number, Creator>;
  private brands: Map<number, Brand>;
  private creatorId: number;
  private brandId: number;

  constructor() {
    this.creators = new Map();
    this.brands = new Map();
    this.creatorId = 1;
    this.brandId = 1;
  }

  async getCreator(id: number): Promise<Creator | undefined> {
    return this.creators.get(id);
  }

  async createCreator(creator: InsertCreator): Promise<Creator> {
    const id = this.creatorId++;
    const newCreator = { ...creator, id };
    this.creators.set(id, newCreator);
    return newCreator;
  }

  async getBrand(id: number): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const id = this.brandId++;
    const newBrand = { ...brand, id };
    this.brands.set(id, newBrand);
    return newBrand;
  }
}

export const storage = new MemStorage();
