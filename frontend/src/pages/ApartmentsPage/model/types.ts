import type { ApartmentStatus, CreateApartmentPayload, HtmlParseSource, ParsedApartment } from '@/entities/Flat/model/types';

export const STATUS_LABELS: Record<ApartmentStatus, string> = {
  NEW: 'Новая',
  ACTIVE: 'Активная',
  CALLBACK: 'Перезвон',
  VIEWING: 'Просмотр',
  REJECTED: 'Отклонена',
  DONE: 'Готова',
};

export const CURRENCIES = ['EUR', 'USD', 'RUB', 'PLN'];

export const STATUS_CHIPS: Array<{ value: ApartmentStatus | ''; label: string }> = [
  { value: '', label: 'Все' },
  { value: 'NEW', label: 'Новая' },
  { value: 'ACTIVE', label: 'Активная' },
  { value: 'CALLBACK', label: 'Перезвон' },
  { value: 'VIEWING', label: 'Просмотр' },
  { value: 'REJECTED', label: 'Отклонена' },
  { value: 'DONE', label: 'Готова' },
];

export const HTML_SOURCE_OPTIONS: Array<{ value: HtmlParseSource; label: string }> = [
  { value: 'avito', label: 'Avito' },
  { value: 'domclick', label: 'DomClick' },
  { value: 'cian', label: 'Cian' },
  { value: 'yandex', label: 'Yandex' },
];

export type DrawerMode = 'form' | 'link';

export type ApartmentFormValues = Omit<CreateApartmentPayload, 'phones'> & { phones?: string | string[] };

export interface UseApartmentsPageReturn {
  data: import('@/entities/Flat/model/types').Apartment[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  search: string;
  statusFilter: ApartmentStatus | '';
  drawerOpen: boolean;
  editing: import('@/entities/Flat/model/types').Apartment | null;
  mode: DrawerMode;
  linkUrl: string;
  parsing: boolean;
  importModalOpen: boolean;
  importUrl: string;
  importParsing: boolean;
  htmlImportModalOpen: boolean;
  htmlSource: HtmlParseSource;
  htmlContent: string;
  htmlSourceUrl: string;
  htmlParsing: boolean;
  form: import('antd').FormInstance<ApartmentFormValues>;
  fetchData: () => Promise<void>;
  setSearch: (v: string) => void;
  setStatusFilter: (v: ApartmentStatus | '') => void;
  setPage: (p: number) => void;
  setPageSize: (ps: number) => void;
  openCreate: () => void;
  openEdit: (apt: import('@/entities/Flat/model/types').Apartment) => void;
  closeDrawer: () => void;
  handleSave: () => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  setMode: (m: DrawerMode) => void;
  setLinkUrl: (v: string) => void;
  handleParseInDrawer: () => Promise<void>;
  applyParsedData: (parsed: ParsedApartment) => void;
  setImportModalOpen: (open: boolean) => void;
  setImportUrl: (v: string) => void;
  handleParseInModal: () => Promise<void>;
  setHtmlImportModalOpen: (open: boolean) => void;
  setHtmlSource: (s: HtmlParseSource) => void;
  setHtmlContent: (v: string) => void;
  setHtmlSourceUrl: (v: string) => void;
  loadHtmlFile: (file: File) => Promise<boolean | typeof import('antd').Upload.LIST_IGNORE>;
  handleParseHtml: () => Promise<void>;
}