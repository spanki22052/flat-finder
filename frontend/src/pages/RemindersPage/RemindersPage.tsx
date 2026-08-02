import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Modal, Form, Input, DatePicker, TimePicker, AutoComplete,
  Spin, Empty, App, Tooltip, Popconfirm,
} from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import {
  PlusOutlined, ClockCircleOutlined, CalendarOutlined, HomeOutlined,
  WarningOutlined, CheckOutlined, EllipsisOutlined, EnvironmentOutlined,
  BellOutlined, FireOutlined, CloseOutlined, EditOutlined, DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { theme } from '@/app/styles/theme';
import { useAuth } from '@/app/providers/AuthProvider';
import { remindersApi } from '@/shared/api/endpoints';
import type { Reminder, ReminderStatus } from '@/shared/api/types';
import { flatApi } from '@/entities/Flat/utils/api';
import type { Apartment } from '@/entities/Flat/model/types';
import {
  Shell, PageHeader, HeaderTitleGroup, HeaderEyebrow, HeaderTitle,
  HeaderLead, HeaderActions, NewButton,
  FiltersBar, SegmentedControl, SegmentedOption,
  WeekStrip, WeekDay, WeekDayLetter, WeekDayNumber, WeekDayCount, WeekDayToday,
  EmptyPanel, EmptyPanelTitle, EmptyPanelHint,
  SectionBlock, SectionHeader, SectionEyebrow, SectionTitle, SectionMeta,
  ReminderCard, ReminderCardIcon, ReminderCardBody, ReminderCardTitle,
  ReminderCardTime, ReminderCardApartmentLink, ReminderCardAssignee,
  ReminderCardActions, ReminderCardAction, OverdueBanner,
  EmptyResults,
  MobileShell, MobileTopBar, MobileBrand, MobileBrandLogo, MobileBrandCaption,
  MobileTopActions, MobileAvatar, MobileBody, MobileHeader, MobileHeaderText,
  MobileHeaderTitle, MobileHeaderCount, MobileNewButton, MobileFilterRow,
  MobileDateChip, MobileList, MobileReminderCard, MobileReminderIcon,
  MobileReminderBody, MobileReminderTitle, MobileReminderMeta, MobileReminderActions,
  MobileReminderAction, MobileEmptyPanel,
} from './styled';

type DateBucket = 'overdue' | 'today' | 'tomorrow' | 'later' | 'done';
type DateFilter = 'all' | 'today' | 'week' | 'overdue' | 'done';

const STATUS_LABELS: Record<ReminderStatus, string> = {
  PENDING: 'Ожидает',
  DONE: 'Выполнено',
  CANCELED: 'Отменено',
};

const FILTER_OPTIONS: Array<{ value: DateFilter; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'Неделя' },
  { value: 'overdue', label: 'Просрочено' },
  { value: 'done', label: 'Завершённые' },
];

const WEEK_LETTERS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function getBucket(dueAt: string, status: ReminderStatus): DateBucket {
  if (status !== 'PENDING') return 'done';
  const now = dayjs().startOf('day');
  const due = dayjs(dueAt).startOf('day');
  if (due.isBefore(now)) return 'overdue';
  if (due.isSame(now)) return 'today';
  if (due.isSame(now.add(1, 'day'))) return 'tomorrow';
  return 'later';
}

function buildWeek() {
  const start = dayjs().startOf('week');
  return Array.from({ length: 7 }, (_, i) => start.add(i, 'day'));
}

function formatTimeShort(dueAt: string) {
  const d = dayjs(dueAt);
  return d.format('HH:mm');
}

function formatRelativeDay(dueAt: string) {
  const due = dayjs(dueAt);
  const now = dayjs();
  if (due.isSame(now, 'day')) return 'Сегодня';
  if (due.isSame(now.add(1, 'day'), 'day')) return 'Завтра';
  if (due.isBefore(now, 'day')) return `Просрочено · ${due.fromNow()}`;
  if (due.isBefore(now.add(7, 'day'))) return due.format('dddd'); // понедельник
  return due.format('D MMM');
}

function formatFullDate(dueAt: string) {
  return dayjs(dueAt).format('D MMM, HH:mm');
}

function isCurrentWeek(dueAt: string) {
  const start = dayjs().startOf('week');
  const end = dayjs().endOf('week');
  const due = dayjs(dueAt);
  return due.isAfter(start) && due.isBefore(end);
}

function matchesFilter(dueAt: string, status: ReminderStatus, filter: DateFilter): boolean {
  if (filter === 'all') return true;
  const bucket = getBucket(dueAt, status);
  if (filter === 'overdue') return bucket === 'overdue';
  if (filter === 'today') return bucket === 'today' || bucket === 'overdue';
  if (filter === 'week') return isCurrentWeek(dueAt);
  if (filter === 'done') return status !== 'PENDING';
  return true;
}

export function RemindersPage() {
  const { user } = useAuth();
  const { message } = App.useApp();
  const [data, setData] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DateFilter>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Reminder | null>(null);
  const [activeDay, setActiveDay] = useState<string | null>(null); // ISO date string of selected day
  const [form] = Form.useForm();
  const [apartments, setApartments] = useState<Apartment[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await remindersApi.list();
      setData(res.data.data);
    } catch {
      message.error('Не удалось загрузить напоминания');
    } finally {
      setLoading(false);
    }
  }, [message]);

  const fetchApartments = useCallback(async () => {
    try {
      const res = await flatApi.getList({ pageSize: 100 });
      setApartments(res.data);
    } catch {
      // тихо — список квартир не критичен
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { if (modalOpen) fetchApartments(); }, [modalOpen, fetchApartments]);

  // ─── Computed groupings ────────────────────────────────────────────────
  const week = useMemo(() => buildWeek(), []);
  const todayIso = dayjs().startOf('day').toISOString();

  const pending = useMemo(() => data.filter((r) => r.status === 'PENDING'), [data]);
  const completed = useMemo(() => data.filter((r) => r.status !== 'PENDING'), [data]);

  const countsByDay = useMemo(() => {
    const map = new Map<string, number>();
    pending.forEach((r) => {
      const key = dayjs(r.dueAt).startOf('day').toISOString();
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return map;
  }, [pending]);

  const overdueCount = pending.filter((r) => getBucket(r.dueAt, r.status) === 'overdue').length;
  const todayCount = pending.filter((r) => getBucket(r.dueAt, r.status) === 'today').length;
  const headCount = overdueCount + todayCount;

  // Distance from today, in days, for "today" reminder copy
  const distanceFor = (dueAt: string) => {
    const due = dayjs(dueAt).startOf('day');
    const today = dayjs().startOf('day');
    return due.diff(today, 'day');
  };

  const visiblePending = useMemo(
    () => pending.filter((r) => {
      if (activeDay) {
        const key = dayjs(r.dueAt).startOf('day').toISOString();
        return key === activeDay;
      }
      return matchesFilter(r.dueAt, r.status, filter);
    }),
    [pending, filter, activeDay],
  );

  const visibleCompleted = useMemo(
    () => completed.filter((r) => matchesFilter(r.dueAt, r.status, filter)),
    [completed, filter],
  );

  const grouped = useMemo(() => {
    const overdue: Reminder[] = [];
    const today: Reminder[] = [];
    const tomorrow: Reminder[] = [];
    const later: Reminder[] = [];
    visiblePending.forEach((r) => {
      const bucket = getBucket(r.dueAt, r.status);
      if (bucket === 'overdue') overdue.push(r);
      else if (bucket === 'today') today.push(r);
      else if (bucket === 'tomorrow') tomorrow.push(r);
      else later.push(r);
    });
    later.sort((a, b) => dayjs(a.dueAt).valueOf() - dayjs(b.dueAt).valueOf());
    return { overdue, today, tomorrow, later };
  }, [visiblePending]);

  // ─── Mutations ─────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ dueTime: dayjs().hour(9).minute(0) });
    setModalOpen(true);
  };

  const openEdit = (reminder: Reminder) => {
    setEditing(reminder);
    form.setFieldsValue({
      title: reminder.title,
      apartmentId: reminder.apartmentId,
      dueDate: dayjs(reminder.dueAt),
      dueTime: dayjs(reminder.dueAt),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const vals = await form.validateFields();
      const dueDate = vals.dueDate as dayjs.Dayjs;
      const dueTime = (vals.dueTime as dayjs.Dayjs | undefined) ?? dayjs().hour(9).minute(0);
      const dueAt = dueDate
        .hour(dueTime.hour())
        .minute(dueTime.minute())
        .second(0)
        .millisecond(0)
        .toISOString();
      const payload = {
        title: vals.title,
        dueAt,
        apartmentId: vals.apartmentId || undefined,
      };
      if (editing) {
        await remindersApi.update(editing.id, payload);
        message.success('Напоминание обновлено');
      } else {
        await remindersApi.create(payload);
        message.success('Напоминание создано');
      }
      setModalOpen(false);
      fetchData();
    } catch {
      // поля провалидированы antd
    }
  };

  const handleStatus = async (reminder: Reminder, status: ReminderStatus) => {
    try {
      await remindersApi.update(reminder.id, { status });
      message.success(STATUS_LABELS[status]);
      fetchData();
    } catch {
      message.error('Не удалось обновить');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remindersApi.delete(id);
      message.success('Удалено');
      fetchData();
    } catch {
      message.error('Не удалось удалить');
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <>
      <DesktopView
        week={week}
        todayIso={todayIso}
        countsByDay={countsByDay}
        overdueCount={overdueCount}
        todayCount={todayCount}
        headCount={headCount}
        pending={pending}
        completed={completed}
        grouped={grouped}
        visibleCompleted={visibleCompleted}
        filter={filter}
        activeDay={activeDay}
        onFilterChange={setFilter}
        onDayClick={setActiveDay}
        loading={loading}
        userName={user?.name}
        onCreate={openCreate}
        onEdit={openEdit}
        onStatus={handleStatus}
        onDelete={handleDelete}
        distanceFor={distanceFor}
      />

      <MobileView
        week={week}
        todayIso={todayIso}
        countsByDay={countsByDay}
        overdueCount={overdueCount}
        todayCount={todayCount}
        headCount={headCount}
        pending={pending}
        completed={completed}
        grouped={grouped}
        visibleCompleted={visibleCompleted}
        filter={filter}
        activeDay={activeDay}
        onFilterChange={setFilter}
        onDayClick={setActiveDay}
        loading={loading}
        userName={user?.name}
        onCreate={openCreate}
        onEdit={openEdit}
        onStatus={handleStatus}
        onDelete={handleDelete}
        distanceFor={distanceFor}
      />

      <Modal
        title={editing ? 'Редактировать напоминание' : 'Новое напоминание'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText={editing ? 'Сохранить' : 'Создать'}
        cancelText="Отмена"
        okButtonProps={{ style: { background: theme.gradients.accent, border: 'none' } }}
        destroyOnClose
        width={520}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label="Что сделать"
            rules={[{ required: true, message: 'Кратко опишите задачу' }]}
          >
            <Input placeholder="Позвонить по объявлению на Тверской" autoFocus />
          </Form.Item>
          <Form.Item name="apartmentId" label="Квартира">
            <ApartmentPicker apartments={apartments} />
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item
              name="dueDate"
              label="Дата"
              rules={[{ required: true, message: 'Выберите дату' }]}
              initialValue={dayjs()}
            >
              <DatePicker
                style={{ width: '100%' }}
                format="D MMM YYYY"
                suffixIcon={<CalendarOutlined />}
                disabledDate={(current) => current && current.isBefore(dayjs().startOf('day'))}
              />
            </Form.Item>
            <Form.Item
              name="dueTime"
              label="Время"
              rules={[{ required: true, message: 'Выберите время' }]}
            >
              <TimePicker
                format="HH:mm"
                minuteStep={5}
                allowClear={false}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
}

// ─── Apartment picker ─────────────────────────────────────────────────────
function ApartmentPicker({ apartments }: { apartments: Apartment[] }) {
  const options: DefaultOptionType[] = useMemo(() => {
    const seen = new Set<string>();
    const out: DefaultOptionType[] = [];
    apartments.forEach((a) => {
      if (seen.has(a.id)) return;
      seen.add(a.id);
      const sub = [a.city, a.district].filter(Boolean).join(', ');
      out.push({
        value: a.id,
        label: (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <HomeOutlined style={{ color: theme.colors.text.muted, fontSize: 13 }} />
            <span>{a.title}</span>
            {sub && (
              <span style={{ color: theme.colors.text.muted, fontSize: 12 }}>· {sub}</span>
            )}
          </span>
        ),
      });
    });
    return out;
  }, [apartments]);

  return (
    <AutoComplete
      options={options}
      placeholder="Без привязки"
      allowClear
      filterOption={(input, opt) => {
        const text = String(opt?.value ?? '');
        return text.toLowerCase().includes(input.toLowerCase());
      }}
    />
  );
}

// ─── Desktop view ─────────────────────────────────────────────────────────
type DesktopViewProps = {
  week: dayjs.Dayjs[];
  todayIso: string;
  countsByDay: Map<string, number>;
  overdueCount: number;
  todayCount: number;
  headCount: number;
  pending: Reminder[];
  completed: Reminder[];
  grouped: { overdue: Reminder[]; today: Reminder[]; tomorrow: Reminder[]; later: Reminder[] };
  visibleCompleted: Reminder[];
  filter: DateFilter;
  activeDay: string | null;
  onFilterChange: (f: DateFilter) => void;
  onDayClick: (key: string | null) => void;
  loading: boolean;
  userName?: string;
  onCreate: () => void;
  onEdit: (r: Reminder) => void;
  onStatus: (r: Reminder, s: ReminderStatus) => void;
  onDelete: (id: string) => void;
  distanceFor: (dueAt: string) => number;
};

function DesktopView(props: DesktopViewProps) {
  const {
    week, todayIso, countsByDay, overdueCount, todayCount, headCount,
    pending, completed,
    grouped, visibleCompleted, filter, activeDay, onFilterChange, onDayClick,
    loading, onCreate, onEdit, onStatus, onDelete, distanceFor,
  } = props;

  const weekTotal = week.reduce((sum, day) => sum + (countsByDay.get(day.toISOString()) ?? 0), 0);
  const allFiltered =
    grouped.overdue.length + grouped.today.length + grouped.tomorrow.length + grouped.later.length === 0;

  return (
    <Shell>
      <PageHeader>
        <HeaderTitleGroup>
          <HeaderEyebrow>Планировщик</HeaderEyebrow>
          <HeaderTitle>Напоминания</HeaderTitle>
          <HeaderLead>
            {headCount > 0
              ? `${headCount} ${pluralize(headCount, 'задача', 'задачи', 'задач')} ждут внимания сегодня`
              : 'Сегодня всё спокойно — ни одного просроченного дела'}
          </HeaderLead>
        </HeaderTitleGroup>
        <HeaderActions>
          <NewButton type="button" onClick={onCreate}>
            <PlusOutlined /> Новое напоминание
          </NewButton>
        </HeaderActions>
      </PageHeader>

      <WeekStrip role="tablist" aria-label="Неделя">
        {week.map((day, index) => {
          const key = day.toISOString();
          const count = countsByDay.get(key) ?? 0;
          const isToday = day.isSame(dayjs(todayIso), 'day');
          const isActive = activeDay === key;
          return (
            <WeekDay
              key={key}
              role="tab"
              aria-selected={isActive}
              $active={isActive}
              onClick={() => onDayClick(isActive ? null : key)}
            >
              <WeekDayLetter>{WEEK_LETTERS[index]}</WeekDayLetter>
              <WeekDayNumber $today={isToday}>{day.date()}</WeekDayNumber>
              {isToday ? <WeekDayToday>сегодня</WeekDayToday> : <span style={{ height: 16 }} />}
              <WeekDayCount $today={isToday} $hasCount={count > 0}>
                {count > 0 ? count : '·'}
              </WeekDayCount>
            </WeekDay>
          );
        })}
      </WeekStrip>

      <FiltersBar>
        <SegmentedControl
          value={filter}
          onChange={(v) => { onFilterChange(v as DateFilter); onDayClick(null); }}
          options={FILTER_OPTIONS.map((opt) => ({
            value: opt.value,
            label: (
              <SegmentedOption $active={filter === opt.value}>
                {opt.label}
                {opt.value === 'overdue' && overdueCount > 0 && (
                  <span style={{ marginLeft: 6, color: theme.colors.error, fontWeight: 700 }}>
                    {overdueCount}
                  </span>
                )}
                {opt.value === 'today' && todayCount > 0 && (
                  <span style={{ marginLeft: 6, color: theme.colors.primary, fontWeight: 700 }}>
                    {todayCount}
                  </span>
                )}
              </SegmentedOption>
            ),
          }))}
        />
        <span style={{ marginLeft: 'auto', color: theme.colors.text.muted, fontSize: 13 }}>
          {pending.length + completed.length} всего · {weekTotal} на неделе
        </span>
      </FiltersBar>

      {loading && (
        <EmptyPanel>
          <Spin />
        </EmptyPanel>
      )}

      {!loading && allFiltered && visibleCompleted.length === 0 && (
        <EmptyResults>
          <EmptyPanelTitle>Ничего не ждёт</EmptyPanelTitle>
          <EmptyPanelHint>
            {filter === 'today'
              ? 'На сегодня напоминаний нет. Запланируйте звонок или просмотр — пустое расписание теряет смысл.'
              : 'Создайте первое напоминание, чтобы не держать всё в голове.'}
          </EmptyPanelHint>
          <NewButton type="button" onClick={onCreate}>
            <PlusOutlined /> Создать напоминание
          </NewButton>
        </EmptyResults>
      )}

      {!loading && grouped.overdue.length > 0 && (
        <SectionBlock>
          <OverdueBanner>
            <FireOutlined aria-hidden />
            <div>
              <span style={{ fontWeight: 800, fontSize: 14 }}>{grouped.overdue.length} просрочено</span>
              <span style={{ marginLeft: 8, color: theme.colors.text.secondary, fontSize: 13 }}>
                Сдвиньте дату или закройте, чтобы шум не копился
              </span>
            </div>
          </OverdueBanner>
          {grouped.overdue.map((r) => (
            <ReminderCardRow
              key={r.id}
              reminder={r}
              onEdit={onEdit}
              onStatus={onStatus}
              onDelete={onDelete}
              distanceFor={distanceFor}
            />
          ))}
        </SectionBlock>
      )}

      {!loading && grouped.today.length > 0 && (
        <SectionBlock>
          <SectionHeader>
            <SectionEyebrow>Сегодня</SectionEyebrow>
            <SectionTitle>{grouped.today.length} {pluralize(grouped.today.length, 'задача', 'задачи', 'задач')}</SectionTitle>
          </SectionHeader>
          {grouped.today.map((r) => (
            <ReminderCardRow
              key={r.id}
              reminder={r}
              onEdit={onEdit}
              onStatus={onStatus}
              onDelete={onDelete}
              distanceFor={distanceFor}
            />
          ))}
        </SectionBlock>
      )}

      {!loading && grouped.tomorrow.length > 0 && (
        <SectionBlock>
          <SectionHeader>
            <SectionEyebrow>Завтра</SectionEyebrow>
            <SectionTitle>{grouped.tomorrow.length} {pluralize(grouped.tomorrow.length, 'задача', 'задачи', 'задач')}</SectionTitle>
          </SectionHeader>
          {grouped.tomorrow.map((r) => (
            <ReminderCardRow
              key={r.id}
              reminder={r}
              onEdit={onEdit}
              onStatus={onStatus}
              onDelete={onDelete}
              distanceFor={distanceFor}
            />
          ))}
        </SectionBlock>
      )}

      {!loading && grouped.later.length > 0 && (
        <SectionBlock>
          <SectionHeader>
            <SectionEyebrow>Дальше</SectionEyebrow>
            <SectionTitle>{grouped.later.length} запланировано</SectionTitle>
          </SectionHeader>
          {grouped.later.map((r) => (
            <ReminderCardRow
              key={r.id}
              reminder={r}
              onEdit={onEdit}
              onStatus={onStatus}
              onDelete={onDelete}
              distanceFor={distanceFor}
            />
          ))}
        </SectionBlock>
      )}

      {!loading && visibleCompleted.length > 0 && (
        <SectionBlock>
          <SectionHeader>
            <SectionEyebrow>Архив</SectionEyebrow>
            <SectionTitle>{visibleCompleted.length} {pluralize(visibleCompleted.length, 'завершена', 'завершены', 'завершено')}</SectionTitle>
            <SectionMeta>Срок прошёл — выполнено или отменено</SectionMeta>
          </SectionHeader>
          {visibleCompleted.map((r) => (
            <ReminderCardRow
              key={r.id}
              reminder={r}
              onEdit={onEdit}
              onStatus={onStatus}
              onDelete={onDelete}
              distanceFor={distanceFor}
            />
          ))}
        </SectionBlock>
      )}
    </Shell>
  );
}

function ReminderCardRow({
  reminder, onEdit, onStatus, onDelete, distanceFor,
}: {
  reminder: Reminder;
  onEdit: (r: Reminder) => void;
  onStatus: (r: Reminder, s: ReminderStatus) => void;
  onDelete: (id: string) => void;
  distanceFor: (dueAt: string) => number;
}) {
  const isDone = reminder.status !== 'PENDING';
  const distance = distanceFor(reminder.dueAt);
  const overdue = !isDone && distance < 0;
  const future = !isDone && distance > 0;

  const timeLabel = isDone
    ? formatFullDate(reminder.dueAt)
    : formatRelativeDay(reminder.dueAt);

  return (
    <ReminderCard $done={isDone} $overdue={overdue}>
      <ReminderCardIcon
        $done={isDone}
        $overdue={overdue}
        aria-hidden
      >
        {isDone ? <CheckOutlined /> : <ClockCircleOutlined />}
      </ReminderCardIcon>
      <ReminderCardBody>
        <ReminderCardTitle $done={isDone}>{reminder.title}</ReminderCardTitle>
        <ReminderCardTime $overdue={overdue}>
          {overdue && <WarningOutlined aria-hidden />}
          <CalendarOutlined aria-hidden />
          <span>{timeLabel}</span>
          <span style={{ color: theme.colors.text.muted }}>· {formatTimeShort(reminder.dueAt)}</span>
          {future && (
            <span style={{ color: theme.colors.text.muted }}>
              · {distance === 1 ? 'завтра' : `через ${distance} дн`}
            </span>
          )}
        </ReminderCardTime>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6, alignItems: 'center' }}>
          {reminder.apartment && (
            <ReminderCardApartmentLink to={`/apartments/${reminder.apartment.id}`}>
              <HomeOutlined aria-hidden />
              <span>{reminder.apartment.title}</span>
              {reminder.apartment.city && (
                <span style={{ color: theme.colors.text.muted, fontSize: 12 }}>
                  <EnvironmentOutlined style={{ marginRight: 4 }} />
                  {reminder.apartment.city}
                </span>
              )}
            </ReminderCardApartmentLink>
          )}
          {reminder.assignee && (
            <ReminderCardAssignee>
              <span style={{
                width: 18, height: 18, borderRadius: 9,
                background: theme.colors.tertiaryContainer,
                color: theme.colors.onPrimaryFixed,
                fontSize: 10, fontWeight: 800,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {initials(reminder.assignee.name)}
              </span>
              <span>{reminder.assignee.name}</span>
            </ReminderCardAssignee>
          )}
        </div>
      </ReminderCardBody>
      <ReminderCardActions>
        {!isDone && (
          <Tooltip title="Выполнено">
            <ReminderCardAction
              type="button"
              aria-label="Отметить выполненным"
              onClick={() => onStatus(reminder, 'DONE')}
              $tone="done"
            >
              <CheckOutlined />
            </ReminderCardAction>
          </Tooltip>
        )}
        {!isDone && (
          <Popconfirm
            title="Отменить напоминание?"
            onConfirm={() => onStatus(reminder, 'CANCELED')}
            okText="Отменить"
            cancelText="Нет"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Отменить">
              <ReminderCardAction type="button" aria-label="Отменить" $tone="cancel">
                <CloseOutlined />
              </ReminderCardAction>
            </Tooltip>
          </Popconfirm>
        )}
        <Tooltip title="Изменить">
          <ReminderCardAction type="button" aria-label="Изменить" onClick={() => onEdit(reminder)}>
            <EditOutlined />
          </ReminderCardAction>
        </Tooltip>
        <Popconfirm
          title="Удалить напоминание?"
          description="Действие нельзя отменить"
          onConfirm={() => onDelete(reminder.id)}
          okText="Удалить"
          cancelText="Нет"
          okButtonProps={{ danger: true }}
        >
          <Tooltip title="Удалить">
            <ReminderCardAction type="button" aria-label="Удалить" $tone="delete">
              <DeleteOutlined />
            </ReminderCardAction>
          </Tooltip>
        </Popconfirm>
      </ReminderCardActions>
    </ReminderCard>
  );
}

// ─── Mobile view ──────────────────────────────────────────────────────────
type MobileViewProps = DesktopViewProps;

function MobileView(props: MobileViewProps) {
  const {
    week, todayIso, countsByDay, overdueCount, todayCount, pending, completed,
    grouped, visibleCompleted, filter, activeDay, onFilterChange, onDayClick,
    loading, userName, onCreate, onEdit, onStatus, onDelete, distanceFor,
  } = props;

  const allFiltered =
    grouped.overdue.length + grouped.today.length + grouped.tomorrow.length + grouped.later.length === 0;

  return (
    <MobileShell>
      <MobileTopBar>
        <MobileBrand>
          <MobileBrandLogo><BellOutlined /></MobileBrandLogo>
          <div>
            <div>Напоминания</div>
            <MobileBrandCaption>Планировщик</MobileBrandCaption>
          </div>
        </MobileBrand>
        <MobileTopActions>
          {userName && <MobileAvatar>{initials(userName)}</MobileAvatar>}
        </MobileTopActions>
      </MobileTopBar>

      <MobileBody>
        <MobileHeader>
          <MobileHeaderText>
            <MobileHeaderTitle>
              {overdueCount > 0
                ? `${overdueCount} ${pluralize(overdueCount, 'просрочено', 'просрочено', 'просрочено')}`
                : todayCount > 0
                  ? `Сегодня: ${todayCount}`
                  : 'Сегодня спокойно'}
            </MobileHeaderTitle>
            <MobileHeaderCount>
              {pending.length} активных · {completed.length} в архиве
            </MobileHeaderCount>
          </MobileHeaderText>
          <MobileNewButton type="button" onClick={onCreate}>
            <PlusOutlined /> Новое
          </MobileNewButton>
        </MobileHeader>

        <MobileFilterRow>
          {week.map((day, index) => {
            const key = day.toISOString();
            const count = countsByDay.get(key) ?? 0;
            const isToday = day.isSame(dayjs(todayIso), 'day');
            const isActive = activeDay === key;
            return (
              <MobileDateChip
                key={key}
                type="button"
                $active={isActive}
                $today={isToday}
                onClick={() => onDayClick(isActive ? null : key)}
                aria-pressed={isActive}
                aria-label={`${day.format('D MMMM')} — ${count} напоминаний`}
              >
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {WEEK_LETTERS[index]}
                </span>
                <span style={{ fontSize: 18, fontWeight: 800, lineHeight: 1, marginTop: 2 }}>
                  {day.date()}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: count > 0 ? (isToday ? '#fff' : theme.colors.primary) : theme.colors.text.muted,
                }}>
                  {count > 0 ? count : '—'}
                </span>
              </MobileDateChip>
            );
          })}
        </MobileFilterRow>

        <MobileFilterRow>
          {FILTER_OPTIONS.map((opt) => (
            <MobileDateChip
              key={opt.value}
              type="button"
              $active={filter === opt.value}
              onClick={() => { onFilterChange(opt.value); onDayClick(null); }}
              aria-pressed={filter === opt.value}
            >
              <span style={{ fontSize: 13, fontWeight: 700 }}>
                {opt.label}
                {opt.value === 'overdue' && overdueCount > 0 && (
                  <span style={{ marginLeft: 4, color: theme.colors.error }}>·{overdueCount}</span>
                )}
                {opt.value === 'today' && todayCount > 0 && (
                  <span style={{ marginLeft: 4, color: theme.colors.primary }}>·{todayCount}</span>
                )}
              </span>
            </MobileDateChip>
          ))}
        </MobileFilterRow>

        {loading ? (
          <MobileEmptyPanel><Spin /></MobileEmptyPanel>
        ) : allFiltered && visibleCompleted.length === 0 ? (
          <MobileEmptyPanel>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                filter === 'today'
                  ? 'На сегодня напоминаний нет'
                  : 'Создайте первое напоминание'
              }
            />
          </MobileEmptyPanel>
        ) : (
          <MobileList>
            {grouped.overdue.map((r) => (
              <MobileReminderRow
                key={r.id}
                reminder={r}
                onEdit={onEdit}
                onStatus={onStatus}
                onDelete={onDelete}
              />
            ))}
            {grouped.today.map((r) => (
              <MobileReminderRow
                key={r.id}
                reminder={r}
                onEdit={onEdit}
                onStatus={onStatus}
                onDelete={onDelete}
              />
            ))}
            {grouped.tomorrow.map((r) => (
              <MobileReminderRow
                key={r.id}
                reminder={r}
                onEdit={onEdit}
                onStatus={onStatus}
                onDelete={onDelete}
              />
            ))}
            {grouped.later.map((r) => (
              <MobileReminderRow
                key={r.id}
                reminder={r}
                onEdit={onEdit}
                onStatus={onStatus}
                onDelete={onDelete}
              />
            ))}
            {visibleCompleted.map((r) => (
              <MobileReminderRow
                key={r.id}
                reminder={r}
                onEdit={onEdit}
                onStatus={onStatus}
                onDelete={onDelete}
              />
            ))}
          </MobileList>
        )}
      </MobileBody>
    </MobileShell>
  );
}

function MobileReminderRow({
  reminder, onEdit, onStatus, onDelete,
}: {
  reminder: Reminder;
  onEdit: (r: Reminder) => void;
  onStatus: (r: Reminder, s: ReminderStatus) => void;
  onDelete: (id: string) => void;
}) {
  const isDone = reminder.status !== 'PENDING';
  const overdue = !isDone && dayjs(reminder.dueAt).isBefore(dayjs(), 'day');
  const timeLabel = isDone ? formatFullDate(reminder.dueAt) : formatRelativeDay(reminder.dueAt);

  return (
    <MobileReminderCard $done={isDone} $overdue={overdue}>
      <MobileReminderIcon $done={isDone} $overdue={overdue} aria-hidden>
        {isDone ? <CheckOutlined /> : <ClockCircleOutlined />}
      </MobileReminderIcon>
      <MobileReminderBody>
        <MobileReminderTitle $done={isDone}>{reminder.title}</MobileReminderTitle>
        <MobileReminderMeta>
          <span style={{ color: overdue ? theme.colors.error : 'inherit', fontWeight: 600 }}>
            {overdue && <WarningOutlined />} {timeLabel} · {formatTimeShort(reminder.dueAt)}
          </span>
          {reminder.apartment && (
            <Link
              to={`/apartments/${reminder.apartment.id}`}
              style={{ color: theme.colors.text.secondary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <HomeOutlined /> {reminder.apartment.title}
            </Link>
          )}
        </MobileReminderMeta>
      </MobileReminderBody>
      <MobileReminderActions>
        {!isDone && (
          <MobileReminderAction
            type="button"
            aria-label="Выполнено"
            onClick={() => onStatus(reminder, 'DONE')}
            $tone="done"
          >
            <CheckOutlined />
          </MobileReminderAction>
        )}
        <MobileReminderAction
          type="button"
          aria-label="Изменить"
          onClick={() => onEdit(reminder)}
        >
          <EllipsisOutlined />
        </MobileReminderAction>
        <Popconfirm
          title="Удалить?"
          onConfirm={() => onDelete(reminder.id)}
          okText="Удалить"
          cancelText="Нет"
          okButtonProps={{ danger: true }}
        >
          <MobileReminderAction type="button" aria-label="Удалить" $tone="delete">
            <DeleteOutlined />
          </MobileReminderAction>
        </Popconfirm>
      </MobileReminderActions>
    </MobileReminderCard>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function pluralize(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
