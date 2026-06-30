import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, Tag, Button, Space, Input, Select, Modal, Form,
  message, Popconfirm, DatePicker,
} from 'antd';
import type { TableColumnType } from 'antd';
import { PhoneOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { theme } from '../../app/styles/theme';
import { callsApi } from '../../shared/api/endpoints';
import type { Call, CreateCallPayload, CallOutcome } from '../../shared/api/types';
import {
  PageHeader, PageTitle, FiltersRow, SearchInput, GlassCard,
  CallCard, CallIcon, CallInfo, CallTitle, CallMeta, DurationBadge,
} from './styled';

const OUTCOME_COLORS: Record<CallOutcome, string> = {
  REACHED: '#34d399', NO_ANSWER: '#fb7185', VOICEMAIL: '#D9F9DF', BUSY: '#f97316', CALLBACK: '#9FA1FF',
};
const OUTCOME_LABELS: Record<CallOutcome, string> = {
  REACHED: 'Дозвонился', NO_ANSWER: 'Нет ответа', VOICEMAIL: 'Голосовая', BUSY: 'Занято', CALLBACK: 'Перезвонить',
};

export function CallsPage() {
  const [data, setData] = useState<Call[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await callsApi.list({ page, pageSize });
      setData(res.data.data);
      setTotal(res.data.meta.total);
    } catch { message.error('Ошибка загрузки'); }
    finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    try { await callsApi.delete(id); message.success('Удалён'); fetchData(); }
    catch { message.error('Ошибка'); }
  };

  const handleCreate = async () => {
    try {
      const vals = await form.validateFields();
      await callsApi.create(vals as CreateCallPayload);
      message.success('Звонок записан');
      setCallModalOpen(false);
      form.resetFields();
      fetchData();
    } catch {}
  };

  const formatDuration = (sec?: number) => {
    if (!sec) return '—';
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  };

  const columns: TableColumnType<Call>[] = [
    {
      title: 'Квартира', key: 'apt',
      render: (_: unknown, call: Call) => (
        <CallCard>
          <CallIcon>🏠</CallIcon>
          <CallInfo>
            <CallTitle>{call.apartment?.title ?? call.apartmentId}</CallTitle>
            <CallMeta>{call.apartment?.city}</CallMeta>
          </CallInfo>
        </CallCard>
      ),
    },
    {
      title: 'Когда', key: 'calledAt', width: 160,
      render: (_: unknown, call: Call) => (
        <div style={{ fontSize: 13, color: theme.colors.text.secondary }}>
          {dayjs(call.calledAt).format('DD MMM YYYY, HH:mm')}
        </div>
      ),
    },
    {
      title: 'Результат', key: 'outcome', width: 140,
      render: (_: unknown, call: Call) => (
        <Tag color={OUTCOME_COLORS[call.outcome]} style={{ border: 'none', fontWeight: 600 }}>
          {OUTCOME_LABELS[call.outcome]}
        </Tag>
      ),
    },
    {
      title: 'Длительность', key: 'duration', width: 120,
      render: (_: unknown, call: Call) => <DurationBadge>{formatDuration(call.durationSec)}</DurationBadge>,
    },
    {
      title: 'Заметки', key: 'notes',
      render: (_: unknown, call: Call) => (
        <div style={{ fontSize: 13, color: theme.colors.text.secondary, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {call.notes ?? '—'}
        </div>
      ),
    },
    {
      title: '', key: 'actions', width: 60,
      render: (_: unknown, call: Call) => (
        <Popconfirm title="Удалить?" onConfirm={() => handleDelete(call.id)} okText="Да" cancelText="Нет">
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <PageHeader>
        <PageTitle>Журнал звонков</PageTitle>
        <Button
          type="primary" icon={<PlusOutlined />} onClick={() => setCallModalOpen(true)} size="large"
          style={{ background: theme.gradients.accent, border: 'none', height: 44, paddingInline: 24 }}
        >
          Записать звонок
        </Button>
      </PageHeader>

      <GlassCard>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{ current: page, pageSize, total, showSizeChanger: true, showTotal: (t) => `Всего ${t}`, onChange: (p, ps) => { setPage(p); setPageSize(ps); } }}
          scroll={{ x: 600 }}
        />
      </GlassCard>

      <Modal
        title="Записать звонок"
        open={callModalOpen}
        onCancel={() => setCallModalOpen(false)}
        onOk={handleCreate}
        okText="Сохранить"
        styles={{ body: { background: theme.colors.bg.base } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="apartmentId" label="ID квартиры" rules={[{ required: true, message: 'Введите ID квартиры' }]}>
            <Input placeholder="uuid квартиры" />
          </Form.Item>
          <Form.Item name="outcome" label="Результат" rules={[{ required: true }]}>
            <Select options={Object.entries(OUTCOME_LABELS).map(([k, v]) => ({ value: k, label: v }))} />
          </Form.Item>
          <Form.Item name="durationSec" label="Длительность (сек)">
            <Input style={{ width: '100%' }} type="number" min={0} />
          </Form.Item>
          <Form.Item name="notes" label="Заметки">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
