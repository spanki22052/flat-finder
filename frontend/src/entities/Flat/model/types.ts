export type ApartmentSource = 'MANUAL' | 'LINK';
export type ApartmentStatus = 'NEW' | 'ACTIVE' | 'CALLBACK' | 'VIEWING' | 'REJECTED' | 'DONE';
export type Currency = 'EUR' | 'USD' | 'RUB' | 'PLN';

export interface Apartment {
  id: string;
  title: string;
  source: ApartmentSource;
  sourceUrl?: string;
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
  phones?: string[];
  status: ApartmentStatus;
  tags: string[];
  contactId?: string;
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
  contact?: { id: string; name: string; phone?: string };
  assignee?: { id: string; name: string };
}

export interface CreateApartmentPayload {
  title: string;
  source?: ApartmentSource;
  sourceUrl?: string;
  price: number;
  currency?: Currency;
  city: string;
  district?: string;
  address?: string;
  rooms?: number;
  area?: number;
  floor?: number;
  totalFloors?: number;
  description?: string;
  photos?: string[];
  phones?: string[];
  status?: ApartmentStatus;
  contactId?: string;
  tags?: string[];
}

export interface UpdateApartmentPayload extends Partial<CreateApartmentPayload> {}

export interface GetApartmentsParams {
  page?: number;
  pageSize?: number;
  status?: ApartmentStatus;
  search?: string;
}

export interface ApartmentsMeta {
  page: number;
  pageSize: number;
  total: number;
}

export interface ApartmentsResponse {
  data: Apartment[];
  meta: ApartmentsMeta;
}

export interface ParsedApartment {
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
  phones?: string[];
}