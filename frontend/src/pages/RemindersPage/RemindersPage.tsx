import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Button, Select, Modal, Form, Input, DatePicker, TimePicker,
  message, Popconfirm, Tag,
} from 'antd';
import {
  PlusOutlined, CheckOutlined, DeleteOutlined, BellOutlined,
  ClockCircleOutlined, CalendarOutlined, HomeOutlined, WarningOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';
import { theme } from '../../app/styles/theme';
import { useAuth } from '../../app/providers/AuthProvider';
import { remindersApi } from '../../shared/api/endpoints';
import type { Reminder, CreateReminderPayload, ReminderStatus } from '../../shared/api/types';
import {
  PageHeader, PageHeaderTitleGroup, PageTitle, PageSubtitle, FiltersRow,
  ResultsBadge, DesktopList, GlassCard,
  ReminderItem, ReminderIcon, ReminderInfo, ReminderTitle, ReminderMeta, RowActions,
  DueBadge, EmptyState, EmptyIconWrap, CountBadge,
  MobileShell, MobileTopBar, MobileBrand, MobileBrandLogo, MobileBrandCaption,
  MobileTopActions, MobileAvatar, MobileBody, MobileToolbar, MobileHeading,
  MobileAddBtn, MobileChips, MobileChip, MobileSectionLabel, MobileList,
  MobileReminderCard, MobileReminderIcon, MobileReminderInfo, MobileReminderTitle,
  MobileReminderMeta, MobileReminderActions, MobileEmptyState,
} from './styled';

dayjs.extend(relativeTime);
dayjs.locale('ru');

const STATUS_COLORS: Record<ReminderStatus, string> = {
  PENDING: theme.colors.primary,
  DONE: theme.colors.status.ACTIVE,
  CANCELED: theme.colors.status.DONE,
};
const STATUS_LABELS: Record<ReminderStatus, string> = {
  PENDING: 'Ожидает', DONE: 'Выполнено', CANCELED: 'Отменено',
};

const STATUS_CHIPS: Array<{ value: ReminderStatus | ''; label: string }> = [
  { value: '', label: 'Все' },
  { value: 'PENDING', label: 'Ожидает' },
  { value: 'DONE', label: 'Выполнено' },
  { value: 'CANCELED', label: 'Отменено' },
];

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function RemindersPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ReminderStatus | ''>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      const res = await remindersApi.list(params);
      setData(res.data.data);
    } catch { message.error('Ошибка загрузки'); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async () => {
    try {
      const vals = await form.validateFields();
      const { dueDate, dueTime, ...rest } = vals as {
        dueDate?: dayjs.Dayjs;
        dueTime?: dayjs.Dayjs;
      } & Omit<CreateReminderPayload, 'dueAt'>;
      const time = dueTime ?? dayjs().hour(9).minute(0);
      const dueAt = (dueDate ?? dayjs())
        .hour(time.hour())
        .minute(time.minute())
        .second(0)
        .millisecond(0)
        .toISOString();
      await remindersApi.create({
        ...rest,
        dueAt,
      });
      message.success('Напоминание создано');
      setModalOpen(false);
      form.resetFields();
      fetchData();
    } catch {}
  };

  const handleStatus = async (reminder: Reminder, status: ReminderStatus) => {
    try {
      await remindersApi.update(reminder.id, { status });
      message.success(STATUS_LABELS[status]);
      fetchData();
    } catch { message.error('Ошибка'); }
  };

  const handleDelete = async (id: string) => {
    try { await remindersApi.delete(id); message.success('Удалено'); fetchData(); }
    catch { message.error('Ошибка'); }
  };

  const pending = data.filter((r) => r.status === 'PENDING');
  const completed = data.filter((r) => r.status !== 'PENDING');

  return (
    <div>
      <DesktopList>
        <PageHeader>
          <PageHeaderTitleGroup>
            <PageTitle>Напоминания</PageTitle>
            <PageSubtitle>
              {pending.length > 0 ? `${pending.length} активных, ждут действия` : 'Все напоминания закрыты'}
            </PageSubtitle>
          </PageHeaderTitleGroup>
          <Button
            type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)} size="large"
            style={{ background: theme.gradients.accent, border: 'none', height: 44, paddingInline: 24, borderRadius: 12, fontWeight: 600 }}
          >
            Новое напоминание
          </Button>
        </PageHeader>

        <FiltersRow>
          <Select
            placeholder="Статус"
            allowClear
            style={{ width: 170 }}
            suffixIcon={<FilterOutlined style={{ color: theme.colors.text.muted }} />}
            value={statusFilter || undefined}
            onChange={(v) => setStatusFilter(v ?? '')}
            options={Object.entries(STATUS_LABELS).map(([k, v]) => ({ value: k, label: v }))}
          />
          <ResultsBadge>
            <BellOutlined /> {data.length} {data.length === 1 ? 'напоминание' : 'напоминаний'}
          </ResultsBadge>
        </FiltersRow>

        {pending.length > 0 && (
          <GlassCard>
            <CountBadge>Активные — {pending.length}</CountBadge>
            {pending.map((r) => {
              const overdue = new Date(r.dueAt) < new Date();
              return (
                <ReminderItem key={r.id} $done={false}>
                  <ReminderIcon $done={false}><ClockCircleOutlined /></ReminderIcon>
                  <ReminderInfo>
                    <ReminderTitle $done={false}>{r.title}</ReminderTitle>
                    <ReminderMeta>
                      <DueBadge $overdue={overdue}>
                        {overdue
                          ? <><WarningOutlined /> Просрочено</>
                          : <><CalendarOutlined /> {dayjs(r.dueAt).format('D MMM YYYY, HH:mm')}</>}
                      </DueBadge>
                      {r.apartment && (
                        <Link to={`/apartments/${r.apartment.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          <HomeOutlined /> {r.apartment.title}
                        </Link>
                      )}
                    </ReminderMeta>
                  </ReminderInfo>
                  <RowActions>
                    <Button
                      size="small"
                      shape="circle"
                      icon={<CheckOutlined />}
                      onClick={() => handleStatus(r, 'DONE')}
                      style={{
                        borderColor: theme.colors.status.ACTIVE,
                        color: '#fff',
                        background: theme.colors.status.ACTIVE,
                      }}
                      aria-label="Выполнено"
                    />
                    <Popconfirm title="Отменить?" onConfirm={() => handleStatus(r, 'CANCELED')} okText="Да" cancelText="Нет">
                      <Button size="small" danger icon={<DeleteOutlined />} aria-label="Отменить" />
                    </Popconfirm>
                  </RowActions>
                </ReminderItem>
              );
            })}
          </GlassCard>
        )}

        {completed.length > 0 && (
          <GlassCard style={{ marginTop: 16 }}>
            <CountBadge>Завершённые — {completed.length}</CountBadge>
            {completed.map((r) => (
              <ReminderItem key={r.id} $done={true}>
                <ReminderIcon $done={true}><CheckOutlined /></ReminderIcon>
                <ReminderInfo>
                  <ReminderTitle $done={true}>{r.title}</ReminderTitle>
                  <ReminderMeta>
                    <Tag color={STATUS_COLORS[r.status]} style={{ border: 'none', fontSize: 11 }}>{STATUS_LABELS[r.status]}</Tag>
                    <span>{dayjs(r.dueAt).format('D MMM YYYY')}</span>
                  </ReminderMeta>
                </ReminderInfo>
                <Popconfirm title="Удалить?" onConfirm={() => handleDelete(r.id)} okText="Да" cancelText="Нет">
                  <Button size="small" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </ReminderItem>
            ))}
          </GlassCard>
        )}

        {!loading && data.length === 0 && (
          <GlassCard>
            <EmptyState>
              <EmptyIconWrap>
                <BellOutlined style={{ fontSize: 44, color: theme.colors.accent.primary }} />
              </EmptyIconWrap>
              Нет напоминаний
            </EmptyState>
          </GlassCard>
        )}
      </DesktopList>

      <MobileShell>
        <MobileTopBar>
          <MobileBrand>
            <MobileBrandLogo><HomeOutlined /></MobileBrandLogo>
            <div>
              <div>FlatFinder</div>
              <MobileBrandCaption>Совместный поиск</MobileBrandCaption>
            </div>
          </MobileBrand>
          <MobileTopActions>
            <MobileAvatar size={38}>{user ? initials(user.name) : 'FF'}</MobileAvatar>
          </MobileTopActions>
        </MobileTopBar>

        <MobileBody>
          <MobileToolbar>
            <MobileHeading>
              Напоминания
              <span>{data.length} {data.length === 1 ? 'напоминание' : 'напоминаний'}</span>
            </MobileHeading>
            <MobileAddBtn type="button" onClick={() => setModalOpen(true)}>
              <PlusOutlined /> Новое
            </MobileAddBtn>
          </MobileToolbar>

          <MobileChips>
            {STATUS_CHIPS.map((chip) => (
              <MobileChip
                key={chip.value || 'all'}
                type="button"
                $active={statusFilter === chip.value}
                onClick={() => setStatusFilter(chip.value)}
              >
                {chip.label}
              </MobileChip>
            ))}
          </MobileChips>

          {loading ? (
            <MobileEmptyState>Загружаем напоминания…</MobileEmptyState>
          ) : data.length === 0 ? (
            <MobileEmptyState><BellOutlined style={{ fontSize: 32 }} />Нет напоминаний</MobileEmptyState>
          ) : (
            <>
              {pending.length > 0 && (
                <>
                  <MobileSectionLabel>Активные — {pending.length}</MobileSectionLabel>
                  <MobileList>
                    {pending.map((r) => {
                      const overdue = new Date(r.dueAt) < new Date();
                      return (
                        <MobileReminderCard key={r.id}>
                          <MobileReminderIcon><ClockCircleOutlined /></MobileReminderIcon>
                          <MobileReminderInfo>
                            <MobileReminderTitle>{r.title}</MobileReminderTitle>
                            <MobileReminderMeta>
                              <DueBadge $overdue={overdue}>
                                {overdue
                                  ? <><WarningOutlined /> Просрочено</>
                                  : <><CalendarOutlined /> {dayjs(r.dueAt).format('D MMM, HH:mm')}</>}
                              </DueBadge>
                              {r.apartment && (
                                <Link to={`/apartments/${r.apartment.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                  <HomeOutlined /> {r.apartment.title}
                                </Link>
                              )}
                            </MobileReminderMeta>
                          </MobileReminderInfo>
                          <MobileReminderActions>
                            <Button
                              size="small"
                              shape="circle"
                              icon={<CheckOutlined />}
                              aria-label="Выполнено"
                              onClick={() => handleStatus(r, 'DONE')}
                              style={{
                                borderColor: theme.colors.status.ACTIVE,
                                color: '#fff',
                                background: theme.colors.status.ACTIVE,
                              }}
                            />
                            <Popconfirm title="Отменить?" onConfirm={() => handleStatus(r, 'CANCELED')} okText="Да" cancelText="Нет">
                              <Button size="small" danger icon={<DeleteOutlined />} aria-label="Отменить" />
                            </Popconfirm>
                          </MobileReminderActions>
                        </MobileReminderCard>
                      );
                    })}
                  </MobileList>
                </>
              )}

              {completed.length > 0 && (
                <>
                  <MobileSectionLabel>Завершённые — {completed.length}</MobileSectionLabel>
                  <MobileList>
                    {completed.map((r) => (
                      <MobileReminderCard key={r.id} $done>
                        <MobileReminderIcon $done><CheckOutlined /></MobileReminderIcon>
                        <MobileReminderInfo>
                          <MobileReminderTitle $done>{r.title}</MobileReminderTitle>
                          <MobileReminderMeta>
                            <Tag color={STATUS_COLORS[r.status]} style={{ border: 'none', fontSize: 11 }}>{STATUS_LABELS[r.status]}</Tag>
                            <span>{dayjs(r.dueAt).format('D MMM YYYY')}</span>
                          </MobileReminderMeta>
                        </MobileReminderInfo>
                        <Popconfirm title="Удалить?" onConfirm={() => handleDelete(r.id)} okText="Да" cancelText="Нет">
                          <Button size="small" danger icon={<DeleteOutlined />} aria-label="Удалить" />
                        </Popconfirm>
                      </MobileReminderCard>
                    ))}
                  </MobileList>
                </>
              )}
            </>
          )}
        </MobileBody>
      </MobileShell>

      <Modal
        title="Новое напоминание"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleCreate}
        okText="Создать"
        styles={{ body: { background: theme.colors.bg.base } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="title" label="Что сделать" rules={[{ required: true, message: 'Введите название' }]}>
            <Input placeholder="Позвонить по квартире на Тверской" />
          </Form.Item>
          <Form.Item name="dueDate" label="Дата" rules={[{ required: true, message: 'Выберите дату' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="dueTime"
            label="Время"
            initialValue={dayjs().hour(9).minute(0)}
            rules={[{ required: true, message: 'Выберите время' }]}
          >
            <TimePicker
              format="HH:mm"
              minuteStep={5}
              allowClear={false}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item name="apartmentId" label="Квартира (опционально)">
            <Input placeholder="uuid квартиры" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
