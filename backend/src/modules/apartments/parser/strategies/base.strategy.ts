import { ApartmentSource, Currency } from '@prisma/client';

export interface ParsedListing {
  source: ApartmentSource;
  sourceUrl: string;
  title: string;
  price: number;
  currency: Currency;
  city: string;
  district?: string;
  address?: string;
  rooms?: number;
  area?: number;
  floor?: number;
  totalFloors?: number;
  description?: string;
  photos?: string[];
}

export abstract class BaseListingParser {
  abstract readonly name: string;
  abstract readonly hostnamePattern: RegExp;

  matches(url: string): boolean {
    try {
      const u = new URL(url);
      return this.hostnamePattern.test(u.hostname);
    } catch {
      return false;
    }
  }

  abstract parse(url: string): Promise<ParsedListing>;
}