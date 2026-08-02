import {
  Modal, Form, Input, DatePicker, TimePicker, AutoComplete,
  Spin, Empty, Tooltip, Popconfirm, App,
} from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import {
  PlusOutlined, ClockCircleOutlined, CalendarOutlined, HomeOutlined,
  WarningOutlined, CheckOutlined, EllipsisOutlined, EnvironmentOutlined,
  BellOutlined, FireOutlined, CloseOutlined, EditOutlined, DeleteOutlined,
} from '@ant-design/icons';
import { theme } from '@/app/styles/theme';
import { useAuth } from '@/app/providers/AuthProvider';
import type { Reminder, ReminderStatus } from '@/shared/api/types';
import type { Apartment } from '@/entities/Flat/model/types';
import {
  FILTER_OPTIONS, WEEK_LETTERS,
} from '../model/types';
import type {
  ApartmentPickerProps, MobileReminderRowProps, ReminderCardRowProps, ViewProps,
} from '../model/types';
import {
  distanceFor as computeDistance, formatFullDate, formatRelativeDay,
  formatTimeShort, initials, pluralize,
} from '../lib/utils';
import { useRemindersPage } from '../hooks/useRemindersPage';
import * as Styled from './RemindersPage.styled';

// ─── Apartment picker ─────────────────────────────────────────────────────

function ApartmentPicker({ apartments }: ApartmentPickerProps) {
  const options: DefaultOptionType[] = (() => {
    const seen = new Set<string>();
    const out: DefaultOptionType[] = [];
    apartments.forEach((a: Apartment) => {
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
  })();

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

// ─── Reminder card row (desktop) ───────────────────────────────────────────

function ReminderCardRow({
  reminder, onEdit, onStatus, onDelete, distanceFor,
}: ReminderCardRowProps) {
  const isDone = reminder.status !== 'PENDING';
  const distance = distanceFor(reminder.dueAt);
  const overdue = !isDone && distance < 0;
  const future = !isDone && distance > 0;

  const timeLabel = isDone
    ? formatFullDate(reminder.dueAt)
    : formatRelativeDay(reminder.dueAt);

  return (
    <Styled.ReminderCard $done={isDone} $overdue={overdue}>
      <Styled.ReminderCardIcon $done={isDone} $overdue={overdue} aria-hidden>
        {isDone ? <CheckOutlined /> : <ClockCircleOutlined />}
      </Styled.ReminderCardIcon>
      <Styled.ReminderCardBody>
        <Styled.ReminderCardTitle $done={isDone}>{reminder.title}</Styled.ReminderCardTitle>
        <Styled.ReminderCardTime $overdue={overdue}>
          {overdue && <WarningOutlined aria-hidden />}
          <CalendarOutlined aria-hidden />
          <span>{timeLabel}</span>
          <span style={{ color: theme.colors.text.muted }}>· {formatTimeShort(reminder.dueAt)}</span>
          {future && (
            <span style={{ color: theme.colors.text.muted }}>
              · {distance === 1 ? 'завтра' : `через ${distance} дн`}
            </span>
          )}
        </Styled.ReminderCardTime>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6, alignItems: 'center' }}>
          {reminder.apartment && (
            <Styled.ReminderCardApartmentLink to={`/apartments/${reminder.apartment.id}`}>
              <HomeOutlined aria-hidden />
              <span>{reminder.apartment.title}</span>
              {reminder.apartment.city && (
                <span style={{ color: theme.colors.text.muted, fontSize: 12 }}>
                  <EnvironmentOutlined style={{ marginRight: 4 }} />
                  {reminder.apartment.city}
                </span>
              )}
            </Styled.ReminderCardApartmentLink>
          )}
          {reminder.assignee && (
            <Styled.ReminderCardAssignee>
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
            </Styled.ReminderCardAssignee>
          )}
        </div>
      </Styled.ReminderCardBody>
      <Styled.ReminderCardActions>
        {!isDone && (
          <Tooltip title="Выполнено">
            <Styled.ReminderCardAction
              type="button"
              aria-label="Отметить выполненным"
              onClick={() => { void onStatus(reminder, 'DONE'); }}
              $tone="done"
            >
              <CheckOutlined />
            </Styled.ReminderCardAction>
          </Tooltip>
        )}
        {!isDone && (
          <Popconfirm
            title="Отменить напоминание?"
            onConfirm={() => { void onStatus(reminder, 'CANCELED'); }}
            okText="Отменить"
            cancelText="Нет"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Отменить">
              <Styled.ReminderCardAction type="button" aria-label="Отменить" $tone="cancel">
                <CloseOutlined />
              </Styled.ReminderCardAction>
            </Tooltip>
          </Popconfirm>
        )}
        <Tooltip title="Изменить">
          <Styled.ReminderCardAction type="button" aria-label="Изменить" onClick={() => onEdit(reminder)}>
            <EditOutlined />
          </Styled.ReminderCardAction>
        </Tooltip>
        <Popconfirm
          title="Удалить напоминание?"
          description="Действие нельзя отменить"
          onConfirm={() => { void onDelete(reminder.id); }}
          okText="Удалить"
          cancelText="Нет"
          okButtonProps={{ danger: true }}
        >
          <Tooltip title="Удалить">
            <Styled.ReminderCardAction type="button" aria-label="Удалить" $tone="delete">
              <DeleteOutlined />
            </Styled.ReminderCardAction>
          </Tooltip>
        </Popconfirm>
      </Styled.ReminderCardActions>
    </Styled.ReminderCard>
  );
}

// ─── Mobile reminder row ───────────────────────────────────────────────────

function MobileReminderRow({
  reminder, onEdit, onStatus, onDelete,
}: MobileReminderRowProps) {
  const isDone = reminder.status !== 'PENDING';
  const overdue = !isDone && dayjs(reminder.dueAt).isBefore(dayjs(), 'day');
  const timeLabel = isDone ? formatFullDate(reminder.dueAt) : formatRelativeDay(reminder.dueAt);

  return (
    <Styled.MobileReminderCard $done={isDone} $overdue={overdue}>
      <Styled.MobileReminderIcon $done={isDone} $overdue={overdue} aria-hidden>
        {isDone ? <CheckOutlined /> : <ClockCircleOutlined />}
      </Styled.MobileReminderIcon>
      <Styled.MobileReminderBody>
        <Styled.MobileReminderTitle $done={isDone}>{reminder.title}</Styled.MobileReminderTitle>
        <Styled.MobileReminderMeta>
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
        </Styled.MobileReminderMeta>
      </Styled.MobileReminderBody>
      <Styled.MobileReminderActions>
        {!isDone && (
          <Styled.MobileReminderAction
            type="button"
            aria-label="Выполнено"
            onClick={() => { void onStatus(reminder, 'DONE'); }}
            $tone="done"
          >
            <CheckOutlined />
          </Styled.MobileReminderAction>
        )}
        <Styled.MobileReminderAction
          type="button"
          aria-label="Изменить"
          onClick={() => onEdit(reminder)}
        >
          <EllipsisOutlined />
        </Styled.MobileReminderAction>
        <Popconfirm
          title="Удалить?"
          onConfirm={() => { void onDelete(reminder.id); }}
          okText="Удалить"
          cancelText="Нет"
          okButtonProps={{ danger: true }}
        >
          <Styled.MobileReminderAction type="button" aria-label="Удалить" $tone="delete">
            <DeleteOutlined />
          </Styled.MobileReminderAction>
        </Popconfirm>
      </Styled.MobileReminderActions>
    </Styled.MobileReminderCard>
  );
}

// ─── Desktop view ─────────────────────────────────────────────────────────

function DesktopView(props: ViewProps) {
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
    <Styled.Shell>
      <Styled.PageHeader>
        <Styled.HeaderTitleGroup>
          <Styled.HeaderEyebrow>Планировщик</Styled.HeaderEyebrow>
          <Styled.HeaderTitle>Напоминания</Styled.HeaderTitle>
          <Styled.HeaderLead>
            {headCount > 0
              ? `${headCount} ${pluralize(headCount, 'задача', 'задачи', 'задач')} ждут внимания сегодня`
              : 'Сегодня всё спокойно — ни одного просроченного дела'}
          </Styled.HeaderLead>
        </Styled.HeaderTitleGroup>
        <Styled.HeaderActions>
          <Styled.NewButton type="button" onClick={onCreate}>
            <PlusOutlined /> Новое напоминание
          </Styled.NewButton>
        </Styled.HeaderActions>
      </Styled.PageHeader>

      <Styled.WeekStrip role="tablist" aria-label="Неделя">
        {week.map((day, index) => {
          const key = day.toISOString();
          const count = countsByDay.get(key) ?? 0;
          const isToday = day.isSame(dayjs(todayIso), 'day');
          const isActive = activeDay === key;
          return (
            <Styled.WeekDay
              key={key}
              role="tab"
              aria-selected={isActive}
              $active={isActive}
              onClick={() => onDayClick(isActive ? null : key)}
            >
              <Styled.WeekDayLetter>{WEEK_LETTERS[index]}</Styled.WeekDayLetter>
              <Styled.WeekDayNumber $today={isToday}>{day.date()}</Styled.WeekDayNumber>
              {isToday ? <Styled.WeekDayToday>сегодня</Styled.WeekDayToday> : <span style={{ height: 16 }} />}
              <Styled.WeekDayCount $today={isToday} $hasCount={count > 0}>
                {count > 0 ? count : '·'}
              </Styled.WeekDayCount>
            </Styled.WeekDay>
          );
        })}
      </Styled.WeekStrip>

      <Styled.FiltersBar>
        <Styled.SegmentedControl
          value={filter}
          onChange={(v) => { onFilterChange(v as typeof filter); onDayClick(null); }}
          options={FILTER_OPTIONS.map((opt) => ({
            value: opt.value,
            label: (
              <Styled.SegmentedOption $active={filter === opt.value}>
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
              </Styled.SegmentedOption>
            ),
          }))}
        />
        <span style={{ marginLeft: 'auto', color: theme.colors.text.muted, fontSize: 13 }}>
          {pending.length + completed.length} всего · {weekTotal} на неделе
        </span>
      </Styled.FiltersBar>

      {loading && (
        <Styled.EmptyPanel>
          <Spin />
        </Styled.EmptyPanel>
      )}

      {!loading && allFiltered && visibleCompleted.length === 0 && (
        <Styled.EmptyResults>
          <Styled.EmptyPanelTitle>Ничего не ждёт</Styled.EmptyPanelTitle>
          <Styled.EmptyPanelHint>
            {filter === 'today'
              ? 'На сегодня напоминаний нет. Запланируйте звонок или просмотр — пустое расписание теряет смысл.'
              : 'Создайте первое напоминание, чтобы не держать всё в голове.'}
          </Styled.EmptyPanelHint>
          <Styled.NewButton type="button" onClick={onCreate}>
            <PlusOutlined /> Создать напоминание
          </Styled.NewButton>
        </Styled.EmptyResults>
      )}

      {!loading && grouped.overdue.length > 0 && (
        <Styled.SectionBlock>
          <Styled.OverdueBanner>
            <FireOutlined aria-hidden />
            <div>
              <span style={{ fontWeight: 800, fontSize: 14 }}>{grouped.overdue.length} просрочено</span>
              <span style={{ marginLeft: 8, color: theme.colors.text.secondary, fontSize: 13 }}>
                Сдвиньте дату или закройте, чтобы шум не копился
              </span>
            </div>
          </Styled.OverdueBanner>
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
        </Styled.SectionBlock>
      )}

      {!loading && grouped.today.length > 0 && (
        <Styled.SectionBlock>
          <Styled.SectionHeader>
            <Styled.SectionEyebrow>Сегодня</Styled.SectionEyebrow>
            <Styled.SectionTitle>{grouped.today.length} {pluralize(grouped.today.length, 'задача', 'задачи', 'задач')}</Styled.SectionTitle>
          </Styled.SectionHeader>
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
        </Styled.SectionBlock>
      )}

      {!loading && grouped.tomorrow.length > 0 && (
        <Styled.SectionBlock>
          <Styled.SectionHeader>
            <Styled.SectionEyebrow>Завтра</Styled.SectionEyebrow>
            <Styled.SectionTitle>{grouped.tomorrow.length} {pluralize(grouped.tomorrow.length, 'задача', 'задачи', 'задач')}</Styled.SectionTitle>
          </Styled.SectionHeader>
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
        </Styled.SectionBlock>
      )}

      {!loading && grouped.later.length > 0 && (
        <Styled.SectionBlock>
          <Styled.SectionHeader>
            <Styled.SectionEyebrow>Дальше</Styled.SectionEyebrow>
            <Styled.SectionTitle>{grouped.later.length} запланировано</Styled.SectionTitle>
          </Styled.SectionHeader>
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
        </Styled.SectionBlock>
      )}

      {!loading && visibleCompleted.length > 0 && (
        <Styled.SectionBlock>
          <Styled.SectionHeader>
            <Styled.SectionEyebrow>Архив</Styled.SectionEyebrow>
            <Styled.SectionTitle>{visibleCompleted.length} {pluralize(visibleCompleted.length, 'завершена', 'завершены', 'завершено')}</Styled.SectionTitle>
            <Styled.SectionMeta>Срок прошёл — выполнено или отменено</Styled.SectionMeta>
          </Styled.SectionHeader>
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
        </Styled.SectionBlock>
      )}
    </Styled.Shell>
  );
}

// ─── Mobile view ──────────────────────────────────────────────────────────

function MobileView(props: ViewProps) {
  const {
    week, todayIso, countsByDay, overdueCount, todayCount, pending, completed,
    grouped, visibleCompleted, filter, activeDay, onFilterChange, onDayClick,
    loading, userName, onCreate, onEdit, onStatus, onDelete,
  } = props;

  const allFiltered =
    grouped.overdue.length + grouped.today.length + grouped.tomorrow.length + grouped.later.length === 0;

  return (
    <Styled.MobileShell>
      <Styled.MobileTopBar>
        <Styled.MobileBrand>
          <Styled.MobileBrandLogo><BellOutlined /></Styled.MobileBrandLogo>
          <div>
            <div>Напоминания</div>
            <Styled.MobileBrandCaption>Планировщик</Styled.MobileBrandCaption>
          </div>
        </Styled.MobileBrand>
        <Styled.MobileTopActions>
          {userName && <Styled.MobileAvatar>{initials(userName)}</Styled.MobileAvatar>}
        </Styled.MobileTopActions>
      </Styled.MobileTopBar>

      <Styled.MobileBody>
        <Styled.MobileHeader>
          <Styled.MobileHeaderText>
            <Styled.MobileHeaderTitle>
              {overdueCount > 0
                ? `${overdueCount} ${pluralize(overdueCount, 'просрочено', 'просрочено', 'просрочено')}`
                : todayCount > 0
                  ? `Сегодня: ${todayCount}`
                  : 'Сегодня спокойно'}
            </Styled.MobileHeaderTitle>
            <Styled.MobileHeaderCount>
              {pending.length} активных · {completed.length} в архиве
            </Styled.MobileHeaderCount>
          </Styled.MobileHeaderText>
          <Styled.MobileNewButton type="button" onClick={onCreate}>
            <PlusOutlined /> Новое
          </Styled.MobileNewButton>
        </Styled.MobileHeader>

        <Styled.MobileFilterRow>
          {week.map((day, index) => {
            const key = day.toISOString();
            const count = countsByDay.get(key) ?? 0;
            const isToday = day.isSame(dayjs(todayIso), 'day');
            const isActive = activeDay === key;
            return (
              <Styled.MobileDateChip
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
              </Styled.MobileDateChip>
            );
          })}
        </Styled.MobileFilterRow>

        <Styled.MobileFilterRow>
          {FILTER_OPTIONS.map((opt) => (
            <Styled.MobileDateChip
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
            </Styled.MobileDateChip>
          ))}
        </Styled.MobileFilterRow>

        {loading ? (
          <Styled.MobileEmptyPanel><Spin /></Styled.MobileEmptyPanel>
        ) : allFiltered && visibleCompleted.length === 0 ? (
          <Styled.MobileEmptyPanel>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                filter === 'today'
                  ? 'На сегодня напоминаний нет'
                  : 'Создайте первое напоминание'
              }
            />
          </Styled.MobileEmptyPanel>
        ) : (
          <Styled.MobileList>
            {grouped.overdue.map((r) => (
              <MobileReminderRow key={r.id} reminder={r} onEdit={onEdit} onStatus={onStatus} onDelete={onDelete} />
            ))}
            {grouped.today.map((r) => (
              <MobileReminderRow key={r.id} reminder={r} onEdit={onEdit} onStatus={onStatus} onDelete={onDelete} />
            ))}
            {grouped.tomorrow.map((r) => (
              <MobileReminderRow key={r.id} reminder={r} onEdit={onEdit} onStatus={onStatus} onDelete={onDelete} />
            ))}
            {grouped.later.map((r) => (
              <MobileReminderRow key={r.id} reminder={r} onEdit={onEdit} onStatus={onStatus} onDelete={onDelete} />
            ))}
            {visibleCompleted.map((r) => (
              <MobileReminderRow key={r.id} reminder={r} onEdit={onEdit} onStatus={onStatus} onDelete={onDelete} />
            ))}
          </Styled.MobileList>
        )}
      </Styled.MobileBody>
    </Styled.MobileShell>
  );
}

// ─── Exported page ────────────────────────────────────────────────────────

export function RemindersPage() {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const ctrl = useRemindersPage();

  const viewProps: ViewProps = {
    week: ctrl.week,
    todayIso: ctrl.todayIso,
    countsByDay: ctrl.countsByDay,
    overdueCount: ctrl.overdueCount,
    todayCount: ctrl.todayCount,
    headCount: ctrl.headCount,
    pending: ctrl.pending,
    completed: ctrl.completed,
    grouped: ctrl.grouped,
    visibleCompleted: ctrl.visibleCompleted,
    filter: ctrl.state.filter,
    activeDay: ctrl.state.activeDay,
    onFilterChange: ctrl.setFilter,
    onDayClick: ctrl.setActiveDay,
    loading: ctrl.state.loading,
    userName: user?.name,
    onCreate: ctrl.openCreate,
    onEdit: ctrl.openEdit,
    onStatus: ctrl.handleStatus,
    onDelete: ctrl.handleDelete,
    distanceFor: ctrl.distanceFor,
  };

  return (
    <>
      <DesktopView {...viewProps} />
      <MobileView {...viewProps} />

      <Modal
        title={ctrl.state.editing ? 'Редактировать напоминание' : 'Новое напоминание'}
        open={ctrl.state.modalOpen}
        onCancel={ctrl.closeModal}
        onOk={ctrl.handleSave}
        okText={ctrl.state.editing ? 'Сохранить' : 'Создать'}
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
            <ApartmentPicker apartments={ctrl.state.apartments} />
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