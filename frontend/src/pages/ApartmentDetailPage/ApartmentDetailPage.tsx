import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Spin, Tag, Button, Space, message, Descriptions, Divider,
  Card, Popconfirm, Modal, Form, Input, Select, InputNumber, Image,
} from 'antd';
import { theme } from '../../app/styles/theme';
import { callsApi } from '../../shared/api/endpoints';
import { flatApi } from '../../entities/Flat/utils/api';
import type { ApartmentStatus } from '../../entities/Flat/model/types';
import type { CreateCallPayload, CallOutcome as CallOutcomeType, Call } from '../../shared/api/types';
import {
  PageWrap, HeroCard, HeroTitle, HeroMeta, PriceDisplay, TagPills,
  SectionCard, SectionTitle, BackBtn, CallItem, CallOutcome,
  GalleryGrid, GalleryImage,
} from './styled';

const STATUS_COLORS: Record<ApartmentStatus, string> = {
  NEW: '#9FA1FF', ACTIVE: '#34d399', CALLBACK: '#C1EBE9',
  VIEWING: '#D9F9DF', REJECTED: '#fb7185', DONE: '#6b7280',
};
const STATUS_LABELS: Record<ApartmentStatus, string> = {
  NEW: 'Новая', ACTIVE: 'Активная', CALLBACK: 'Перезвон',
  VIEWING: 'Просмотр', REJECTED: 'Отклонена', DONE: 'Готова',
};
const OUTCOME_LABELS: Record<CallOutcomeType, string> = {
  REACHED: 'Дозвонился', NO_ANSWER: 'Нет ответа', VOICEMAIL: 'Голосовая',
  BUSY: 'Занято', CALLBACK: 'Перезвонить',
};

export function ApartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [apt, setApt] = useState<import('../../entities/Flat/model/types').Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [calls, setCalls] = useState<Call[]>([]);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!id) return;
    Promise.all([
      flatApi.getOne(id),
      callsApi.list({ apartmentId: id }),
    ])
      .then(([aptData, callsData]) => { setApt(aptData); setCalls(callsData.data.data); })
      .catch(() => { message.error('Не загружено'); navigate('/apartments'); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spin size="large" /></div>;
  if (!apt) return null;

  const handleLogCall = async () => {
    try {
      const values = await form.validateFields();
      await callsApi.create({ ...values, apartmentId: apt.id });
      message.success('Звонок записан');
      setCallModalOpen(false);
      form.resetFields();
      const updated = await callsApi.list({ apartmentId: apt.id });
      setCalls(updated.data.data);
    } catch (e) { /* validation fail */ }
  };

  return (
    <PageWrap>
      <BackBtn to="/apartments">← Квартиры</BackBtn>

      <HeroCard>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <HeroTitle>{apt.title}</HeroTitle>
          <HeroMeta>
            <span>📍 {apt.city}{apt.district ? `, ${apt.district}` : ''}</span>
            {apt.rooms !== undefined && <span>🏠 {apt.rooms === 0 ? 'Студия' : `${apt.rooms} ком.`}</span>}
            {apt.area && <span>📐 {apt.area} м²</span>}
            {apt.floor && <span>🏢 эт. {apt.floor}/{apt.totalFloors ?? '?'}</span>}
          </HeroMeta>

          <PriceDisplay>
            {apt.price.toLocaleString('ru-RU')} <span>{apt.currency}</span>
          </PriceDisplay>

          <Space>
            <Tag color={STATUS_COLORS[apt.status]} style={{ border: 'none', fontWeight: 600 }}>
              {STATUS_LABELS[apt.status]}
            </Tag>
            {apt.tags.map((t: string) => (
              <Tag key={t} style={{ background: 'rgba(181,186,255,0.16)', border: 'none', color: '#B5BAFF' }}>
                {t}
              </Tag>
            ))}
          </Space>
        </div>
      </HeroCard>

      {apt.photos && apt.photos.length > 0 && (
        <SectionCard>
          <SectionTitle>Фото ({apt.photos.length})</SectionTitle>
          <Image.PreviewGroup>
            <GalleryGrid>
              {apt.photos.map((src, idx) => (
                <Image
                  key={src}
                  src={src}
                  alt={`Фото ${idx + 1}`}
                  width="100%"
                  height={120}
                  style={{
                    objectFit: 'cover',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                  loading="lazy"
                  preview={{ mask: <span style={{ color: 'white' }}>Открыть</span> }}
                />
              ))}
            </GalleryGrid>
          </Image.PreviewGroup>
        </SectionCard>
      )}

      <SectionCard>
        <SectionTitle>Информация</SectionTitle>
        <Descriptions
          column={2}
          labelStyle={{ color: theme.colors.text.secondary, fontSize: 13 }}
          contentStyle={{ color: theme.colors.text.primary, fontSize: 14 }}
        >
          <Descriptions.Item label="Источник">{apt.source === 'LINK' ? <a href={apt.sourceUrl}>{apt.sourceUrl}</a> : 'Вручную'}</Descriptions.Item>
          <Descriptions.Item label="Добавлена">{new Date(apt.createdAt).toLocaleDateString('ru-RU')}</Descriptions.Item>
          {apt.address && <Descriptions.Item label="Адрес">{apt.address}</Descriptions.Item>}
          {apt.assignee && <Descriptions.Item label="Ответственный">{apt.assignee.name}</Descriptions.Item>}
          {apt.contact && <Descriptions.Item label="Контакт">{apt.contact.name} {apt.contact.phone}</Descriptions.Item>}
        </Descriptions>
        {apt.description && (
          <>
            <Divider style={{ borderColor: theme.colors.bg.glassBorder }} />
            <p style={{ color: theme.colors.text.secondary, fontSize: 14, lineHeight: 1.7 }}>{apt.description}</p>
          </>
        )}
      </SectionCard>

      <SectionCard>
        <SectionTitle>Журнал звонков</SectionTitle>
        <Button
          onClick={() => setCallModalOpen(true)}
          style={{ marginBottom: 16, background: theme.gradients.accent, border: 'none', color: 'white' }}
        >
          Записать звонок
        </Button>

        {calls.length === 0 ? (
          <div style={{ color: theme.colors.text.muted, fontSize: 14 }}>Нет записей о звонках</div>
        ) : (
          calls.map((c) => (
            <CallItem key={c.id}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text.primary }}>
                  {new Date(c.calledAt).toLocaleString('ru-RU')}
                </div>
                {c.durationSec && (
                  <div style={{ fontSize: 12, color: theme.colors.text.secondary }}>
                    {Math.floor(c.durationSec / 60)} мин {c.durationSec % 60} сек
                  </div>
                )}
              </div>
              <CallOutcome color="blue">{OUTCOME_LABELS[c.outcome]}</CallOutcome>
              {c.notes && <div style={{ fontSize: 13, color: theme.colors.text.secondary }}>{c.notes}</div>}
            </CallItem>
          ))
        )}
      </SectionCard>

      <Modal
        title="Записать звонок"
        open={callModalOpen}
        onCancel={() => setCallModalOpen(false)}
        onOk={handleLogCall}
        okText="Сохранить"
        styles={{ body: { background: theme.colors.bg.base } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="outcome" label="Результат" rules={[{ required: true }]}>
            <Select options={Object.entries(OUTCOME_LABELS).map(([k, v]) => ({ value: k, label: v }))} />
          </Form.Item>
          <Form.Item name="durationSec" label="Длительность (сек)">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="notes" label="Заметки">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </PageWrap>
  );
}
