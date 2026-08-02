  import type dayjs from 'dayjs';
  import type { Reminder, ReminderStatus } from '@/shared/api/types';
  import type { Apartment } from '@/entities/Flat/model/types';

  export type DateBucket = 'overdue' | 'today' | 'tomorrow' | 'later' | 'done';
  export type DateFilter = 'all' | 'today' | 'week' | 'overdue' | 'done';

  export const STATUS_LABELS: Record<ReminderStatus, string> = {
    PENDING: 'Ожидает',
    DONE: 'Выполнено',
    CANCELED: 'Отменено',
  };

  export const FILTER_OPTIONS: Array<{ value: DateFilter; label: string }> = [
    { value: 'all', label: 'Все' },
    { value: 'today', label: 'Сегодня' },
    { value: 'week', label: 'Неделя' },
    { value: 'overdue', label: 'Просрочено' },
    { value: 'done', label: 'Завершённые' },
  ];

  export const WEEK_LETTERS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

  export interface GroupedReminders {
    overdue: Reminder[];
    today: Reminder[];
    tomorrow: Reminder[];
    later: Reminder[];
  }

  export interface RemindersPageState {
    data: Reminder[];
    loading: boolean;
    filter: DateFilter;
    modalOpen: boolean;
    editing: Reminder | null;
    activeDay: string | null;
    apartments: Apartment[];
  }

  export interface UseRemindersPageReturn {
    state: RemindersPageState;
    week: dayjs.Dayjs[];
    todayIso: string;
    pending: Reminder[];
    completed: Reminder[];
    countsByDay: Map<string, number>;
    overdueCount: number;
    todayCount: number;
    headCount: number;
    grouped: GroupedReminders;
    visibleCompleted: Reminder[];
    visiblePending: Reminder[];
    setFilter: (f: DateFilter) => void;
    setActiveDay: (key: string | null) => void;
    openCreate: () => void;
    openEdit: (reminder: Reminder) => void;
    closeModal: () => void;
    handleSave: () => Promise<void>;
    handleStatus: (reminder: Reminder, status: ReminderStatus) => Promise<void>;
    handleDelete: (id: string) => Promise<void>;
    distanceFor: (dueAt: string) => number;
  }

  export interface ViewProps {
    week: dayjs.Dayjs[];
    todayIso: string;
    countsByDay: Map<string, number>;
    overdueCount: number;
    todayCount: number;
    headCount: number;
    pending: Reminder[];
    completed: Reminder[];
    grouped: GroupedReminders;
    visibleCompleted: Reminder[];
    filter: DateFilter;
    activeDay: string | null;
    onFilterChange: (f: DateFilter) => void;
    onDayClick: (key: string | null) => void;
    loading: boolean;
    userName?: string;
    onCreate: () => void;
    onEdit: (r: Reminder) => void;
    onStatus: (r: Reminder, s: ReminderStatus) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    distanceFor: (dueAt: string) => number;
  }

  export interface ReminderCardRowProps {
    reminder: Reminder;
    onEdit: (r: Reminder) => void;
    onStatus: (r: Reminder, s: ReminderStatus) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    distanceFor: (dueAt: string) => number;
  }

  export interface MobileReminderRowProps {
    reminder: Reminder;
    onEdit: (r: Reminder) => void;
    onStatus: (r: Reminder, s: ReminderStatus) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
  }

  export interface ApartmentPickerProps {
    apartments: Apartment[];
  }