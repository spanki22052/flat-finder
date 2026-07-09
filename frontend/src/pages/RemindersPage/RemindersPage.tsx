import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Button, Space, Select, Modal, Form, Input, DatePicker, TimePicker,
  message, Popconfirm, Tag,
} from 'antd';
import {
  PlusOutlined, CheckOutlined, DeleteOutlined, BellOutlined,
  ClockCircleOutlined, CalendarOutlined, HomeOutlined, WarningOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';
import { theme } from '../../app/styles/theme';
import { remindersApi } from '../../shared/api/endpoints';
import type { Reminder, CreateReminderPayload, ReminderStatus } from '../../shared/api/types';
import {
  PageHeader, PageTitle, FiltersRow, GlassCard,
  ReminderItem, ReminderIcon, ReminderInfo, ReminderTitle, ReminderMeta,
  DueBadge, EmptyState, CountBadge,
} from './styled';

dayjs.extend(relativeTime);
dayjs.locale('ru');

const STATUS_COLORS: Record<ReminderStatus, string> = {
  PENDING: '#9FA1FF', DONE: '#34d399', CANCELED: '#6b7280',
};
const STATUS_LABELS: Record<ReminderStatus, string> = {
  PENDING: 'Ожидает', DONE: 'Выполнено', CANCELED: 'Отменено',
};

export function RemindersPage() {
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
      <PageHeader>
        <PageTitle>Напоминания</PageTitle>
        <Button
          type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)} size="large"
          style={{ background: theme.gradients.accent, border: 'none', height: 44, paddingInline: 24 }}
        >
          Новое напоминание
        </Button>
      </PageHeader>

      <FiltersRow>
        <Select
          placeholder="Статус"
          allowClear
          style={{ width: 160 }}
          value={statusFilter || undefined}
          onChange={(v) => setStatusFilter(v ?? '')}
          options={Object.entries(STATUS_LABELS).map(([k, v]) => ({ value: k, label: v }))}
        />
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
                <Space>
                  <Button
                    size="small" icon={<CheckOutlined />}
                    onClick={() => handleStatus(r, 'DONE')}
                    style={{ color: '#34d399' }}
                  >
                    Выполнено
                  </Button>
                  <Popconfirm title="Отменить?" onConfirm={() => handleStatus(r, 'CANCELED')} okText="Да" cancelText="Нет">
                    <Button size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
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
              <ReminderIcon $done={true}>✓</ReminderIcon>
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
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle, rgba(159,161,255,0.18), rgba(159,161,255,0.04))',
                marginBottom: 16,
              }}
            >
              <BellOutlined style={{ fontSize: 44, color: theme.colors.accent.primary }} />
            </div>
            Нет напоминаний
          </EmptyState>
        </GlassCard>
      )}

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
