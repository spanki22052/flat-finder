import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Spin, Tag, Button, Space, message, Descriptions, Divider,
  Card, Popconfirm, Modal, Form, Input, Select, InputNumber, Image, DatePicker, Tooltip,
} from 'antd';
import {
  EnvironmentOutlined, HomeOutlined, BorderOutlined, BankOutlined,
  CalendarOutlined, PlusOutlined, ClockCircleOutlined, CloseOutlined, LinkOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';
import { theme } from '../../app/styles/theme';
import { remindersApi } from '../../shared/api/endpoints';
import { flatApi } from '../../entities/Flat/utils/api';
import type { ApartmentStatus } from '../../entities/Flat/model/types';
import type { Reminder } from '../../shared/api/types';
import {
  PageWrap, HeroCard, HeroInner, HeroMain, HeroTitle, HeroTitleRow, SourceLinkIcon, HeroMeta, PriceDisplay, TagPills,
  SectionCard, SectionTitle, BackBtn,
  GalleryGrid, GalleryImage, MeetingBlock, MeetingLabel, MeetingTime, MeetingEmpty, MeetingActions,
  MeetingTitle, ExpandableWrap, DescriptionText, ExpandBtn,
} from './styled';

dayjs.extend(relativeTime);
dayjs.locale('ru');

const COLLAPSE_LINES = 6;

function ExpandableDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 24;
    setNeedsClamp(el.scrollHeight > lineHeight * COLLAPSE_LINES + 1);
  }, [text]);

  return (
    <ExpandableWrap>
      <DescriptionText
        ref={textRef}
        $expanded={expanded}
        $collapsedLines={COLLAPSE_LINES}
      >
        {text}
      </DescriptionText>
      {needsClamp && (
        <ExpandBtn type="button" onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Свернуть' : 'Развернуть'}
        </ExpandBtn>
      )}
    </ExpandableWrap>
  );
}

const STATUS_COLORS: Record<ApartmentStatus, string> = {
  NEW: '#9FA1FF', ACTIVE: '#34d399', CALLBACK: '#C1EBE9',
  VIEWING: '#D9F9DF', REJECTED: '#fb7185', DONE: '#6b7280',
};
const STATUS_LABELS: Record<ApartmentStatus, string> = {
  NEW: 'Новая', ACTIVE: 'Активная', CALLBACK: 'Перезвон',
  VIEWING: 'Просмотр', REJECTED: 'Отклонена', DONE: 'Готова',
};

export function ApartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [apt, setApt] = useState<import('../../entities/Flat/model/types').Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextReminder, setNextReminder] = useState<Reminder | null>(null);
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [meetingForm] = Form.useForm();

  useEffect(() => {
    if (!id) return;
    Promise.all([
      flatApi.getOne(id),
      flatApi.getNextReminder(id).catch(() => null),
    ])
      .then(([aptData, reminder]) => {
        setApt(aptData);
        setNextReminder(reminder);
      })
      .catch(() => { message.error('Не загружено'); navigate('/apartments'); })
      .finally(() => setLoading(false));
  }, [id]);

  const refetchNextReminder = () => {
    if (!id) return;
    flatApi.getNextReminder(id).then(setNextReminder).catch(() => setNextReminder(null));
  };

  const openMeetingModal = () => {
    if (nextReminder) {
      meetingForm.setFieldsValue({
        title: nextReminder.title,
        dueAt: dayjs(nextReminder.dueAt),
      });
    } else {
      meetingForm.resetFields();
    }
    setMeetingModalOpen(true);
  };

  const handleSaveMeeting = async () => {
    if (!apt) return;
    try {
      const values = await meetingForm.validateFields();
      const dueAt = (values.dueAt as dayjs.Dayjs).toISOString();
      if (nextReminder) {
        await remindersApi.update(nextReminder.id, { title: values.title, dueAt });
        message.success('Встреча обновлена');
      } else {
        await remindersApi.create({ title: values.title, dueAt, apartmentId: apt.id });
        message.success('Встреча запланирована');
      }
      setMeetingModalOpen(false);
      meetingForm.resetFields();
      refetchNextReminder();
    } catch (e) { /* validation fail */ }
  };

  const handleCancelMeeting = async () => {
    if (!nextReminder) return;
    try {
      await remindersApi.delete(nextReminder.id);
      message.success('Встреча отменена');
      setNextReminder(null);
    } catch { message.error('Ошибка'); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spin size="large" /></div>;
  if (!apt) return null;

  return (
    <PageWrap>
      <BackBtn to="/apartments">← Квартиры</BackBtn>

      <HeroCard>
        <HeroInner>
          <HeroMain>
            <HeroTitleRow>
              <HeroTitle>{apt.title}</HeroTitle>
              {apt.sourceUrl && (
                <Tooltip title={`Открыть источник: ${apt.sourceUrl}`}>
                  <SourceLinkIcon
                    type="button"
                    aria-label="Открыть источник"
                    onClick={() => window.open(apt.sourceUrl!, '_blank', 'noopener,noreferrer')}
                  >
                    <LinkOutlined />
                  </SourceLinkIcon>
                </Tooltip>
              )}
            </HeroTitleRow>
            <HeroMeta>
              <span>
                <EnvironmentOutlined style={{ marginRight: 6, color: theme.colors.accent.primary }} />
                {apt.city}{apt.district ? `, ${apt.district}` : ''}
              </span>
              {apt.rooms !== undefined && (
                <span>
                  <HomeOutlined style={{ marginRight: 6, color: theme.colors.accent.primary }} />
                  {apt.rooms === 0 ? 'Студия' : `${apt.rooms} ком.`}
                </span>
              )}
              {apt.area && (
                <span>
                  <BorderOutlined style={{ marginRight: 6, color: theme.colors.accent.primary }} />
                  {apt.area} м²
                </span>
              )}
              {apt.floor && (
                <span>
                  <BankOutlined style={{ marginRight: 6, color: theme.colors.accent.primary }} />
                  эт. {apt.floor}/{apt.totalFloors ?? '?'}
                </span>
              )}
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
          </HeroMain>

          <MeetingBlock>
            <MeetingLabel>
              <CalendarOutlined style={{ marginRight: 6 }} />
              Встреча с владельцем
            </MeetingLabel>
            {nextReminder ? (
              <>
                <MeetingTime>
                  {dayjs(nextReminder.dueAt).format('D MMM, HH:mm')}
                  <span style={{ color: theme.colors.text.muted, fontSize: 12, marginLeft: 8 }}>
                    ({dayjs(nextReminder.dueAt).fromNow()})
                  </span>
                </MeetingTime>
                {nextReminder.title && (
                  <MeetingTitle>{nextReminder.title}</MeetingTitle>
                )}
                <MeetingActions>
                  <Button
                    size="small"
                    icon={<ClockCircleOutlined />}
                    onClick={openMeetingModal}
                  >
                    Изменить
                  </Button>
                  <Popconfirm
                    title="Отменить встречу?"
                    onConfirm={handleCancelMeeting}
                    okText="Да"
                    cancelText="Нет"
                  >
                    <Button size="small" danger icon={<CloseOutlined />}>
                      Отменить
                    </Button>
                  </Popconfirm>
                </MeetingActions>
              </>
            ) : (
              <>
                <MeetingEmpty>Не запланирована</MeetingEmpty>
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={openMeetingModal}
                  style={{ marginTop: 12, background: theme.gradients.accent, border: 'none' }}
                  block
                >
                  Запланировать
                </Button>
              </>
            )}
          </MeetingBlock>
        </HeroInner>
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
          contentStyle={{ color: theme.colors.text.secondary, fontSize: 14 }}
        >
          <Descriptions.Item label="Источник">
            {apt.source === 'LINK' ? <a href={apt.sourceUrl}>{apt.sourceUrl}</a> : 'Вручную'}
          </Descriptions.Item>
          <Descriptions.Item label="Добавлена">{new Date(apt.createdAt).toLocaleDateString('ru-RU')}</Descriptions.Item>
          {apt.address && <Descriptions.Item label="Адрес">{apt.address}</Descriptions.Item>}
          {apt.assignee && <Descriptions.Item label="Ответственный">{apt.assignee.name}</Descriptions.Item>}
          {apt.contact && <Descriptions.Item label="Контакт">{apt.contact.name} {apt.contact.phone}</Descriptions.Item>}
        </Descriptions>
        {apt.description && (
          <>
            <Divider style={{ borderColor: theme.colors.bg.glassBorder }} />
            <ExpandableDescription text={apt.description} />
          </>
        )}
      </SectionCard>

      <Modal
        title={nextReminder ? 'Изменить встречу' : 'Запланировать встречу'}
        open={meetingModalOpen}
        onCancel={() => setMeetingModalOpen(false)}
        onOk={handleSaveMeeting}
        okText="Сохранить"
        cancelText="Отмена"
        styles={{ body: { background: theme.colors.bg.base } }}
      >
        <Form form={meetingForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label="Описание"
            rules={[{ required: true, message: 'Опишите встречу' }]}
          >
            <Input placeholder="Просмотр квартиры с владельцем" />
          </Form.Item>
          <Form.Item
            name="dueAt"
            label="Дата и время"
            rules={[{ required: true, message: 'Выберите дату' }]}
          >
            <DatePicker
              showTime
              format="D MMM YYYY, HH:mm"
              style={{ width: '100%' }}
              disabledDate={(d) => d && d.isBefore(dayjs().startOf('day'))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageWrap>
  );
}
