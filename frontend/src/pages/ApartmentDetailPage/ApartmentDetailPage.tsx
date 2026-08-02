import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Spin, Tag, Button, message, Descriptions, Divider,
  Card, Popconfirm, Modal, Form, Input, Select, InputNumber, Image, DatePicker, Tooltip,
} from 'antd';
import {
  EnvironmentOutlined, HomeOutlined, BorderOutlined, BankOutlined,
  CalendarOutlined, PlusOutlined, ClockCircleOutlined, CloseOutlined, LinkOutlined, PhoneOutlined,
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
  GalleryGrid, GalleryImage, DescriptionText, ExpandableWrap, ExpandBtn,
  PlanCta, ScheduledCard, ScheduledAccent, ScheduledDayTile,
  ScheduledDayNumber, ScheduledDayMonth, ScheduledBody, ScheduledEyebrow,
  ScheduledTime, ScheduledRelative, ScheduledTitle, ScheduledActions,
  GalleryMore, GalleryMoreLink, CallRow, CallBtn, CallChip,
  HeroStatusRow,
} from './styled';

/** "+79829114120" → "+7 982 911-41-20" — читаемый вид без потери tel:-совместимости. */
function formatPhone(phone: string): string {
  const m = /^\+7(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(phone);
  if (!m) return phone;
  return `+7 ${m[1]} ${m[2]}-${m[3]}-${m[4]}`;
}

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

const STATUS_COLORS: Record<ApartmentStatus, string> = theme.colors.status;
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
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0);

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
        <HeroInner $hasSidebar={!!nextReminder}>
          <HeroMain>
            <HeroStatusRow>
              <Tag color={STATUS_COLORS[apt.status]} style={{ border: 'none', fontWeight: 600 }}>
                {STATUS_LABELS[apt.status]}
              </Tag>
              {apt.tags.map((t: string) => (
                <Tag key={t} style={{ background: theme.colors.primaryFixed, border: 'none', color: theme.colors.onPrimaryFixedVariant }}>
                  {t}
                </Tag>
              ))}
            </HeroStatusRow>
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

            {(apt.phones?.length || 0) > 0 ? (
              <CallRow>
                <CallBtn href={`tel:${apt.phones![0]}`}>
                  <PhoneOutlined /> {formatPhone(apt.phones![0])}
                </CallBtn>
                {apt.phones!.slice(1).map((phone) => (
                  <CallChip key={phone} href={`tel:${phone}`}>
                    <PhoneOutlined /> {formatPhone(phone)}
                  </CallChip>
                ))}
                {!nextReminder && (
                  <PlanCta type="button" onClick={openMeetingModal}>
                    <PlusOutlined /> Запланировать встречу
                  </PlanCta>
                )}
              </CallRow>
            ) : (
              !nextReminder && (
                <PlanCta type="button" onClick={openMeetingModal}>
                  <PlusOutlined /> Запланировать встречу
                </PlanCta>
              )
            )}
          </HeroMain>

          {nextReminder && (
            <ScheduledCard>
              <ScheduledAccent aria-hidden />
              <ScheduledDayTile aria-hidden>
                <ScheduledDayNumber>{dayjs(nextReminder.dueAt).format('D')}</ScheduledDayNumber>
                <ScheduledDayMonth>{dayjs(nextReminder.dueAt).format('MMM').replace('.', '')}</ScheduledDayMonth>
              </ScheduledDayTile>
              <ScheduledBody>
                <ScheduledEyebrow>
                  <CalendarOutlined /> Запланирована
                </ScheduledEyebrow>
                <ScheduledTime>
                  {dayjs(nextReminder.dueAt).format('HH:mm')}
                  <ScheduledRelative>({dayjs(nextReminder.dueAt).fromNow()})</ScheduledRelative>
                </ScheduledTime>
                {nextReminder.title && (
                  <ScheduledTitle>{nextReminder.title}</ScheduledTitle>
                )}
                <ScheduledActions>
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
              </ScheduledActions>
            </ScheduledBody>
          </ScheduledCard>
          )}
        </HeroInner>
      </HeroCard>

      {apt.photos && apt.photos.length > 0 && (() => {
        const PHOTO_LIMIT = 4;
        const total = apt.photos.length;
        const visible = apt.photos.slice(0, PHOTO_LIMIT);
        const overflow = total - PHOTO_LIMIT;
        return (
          <SectionCard>
            <SectionTitle>Фото ({total})</SectionTitle>
            <Image.PreviewGroup
              preview={{
                visible: photoViewerOpen,
                current: photoViewerIndex,
                onVisibleChange: (open: boolean) => setPhotoViewerOpen(open),
                onChange: (current: number) => setPhotoViewerIndex(current),
              }}
            >
              <GalleryGrid>
                {visible.map((src, idx) => {
                  const isLast = idx === PHOTO_LIMIT - 1;
                  const showOverlay = isLast && overflow > 0;
                  return (
                    <GalleryImage
                      key={src}
                      as="div"
                      role="button"
                      tabIndex={0}
                      onClick={() => { setPhotoViewerIndex(idx); setPhotoViewerOpen(true); }}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setPhotoViewerIndex(idx);
                          setPhotoViewerOpen(true);
                        }
                      }}
                      aria-label={`Фото ${idx + 1}${showOverlay ? `, показать все` : ''}`}
                    >
                      <img
                        src={src}
                        alt={`Фото ${idx + 1}`}
                        loading="lazy"
                      />
                      {showOverlay && (
                        <GalleryMore aria-hidden>
                          +{overflow}
                          <span>Показать все</span>
                        </GalleryMore>
                      )}
                    </GalleryImage>
                  );
                })}
              </GalleryGrid>
              {/* Hidden full set: feeds the preview group with all images */}
              <div style={{ display: 'none' }}>
                {apt.photos.map((src, idx) => (
                  <Image
                    key={`full-${src}`}
                    src={src}
                    alt={`Фото ${idx + 1}`}
                  />
                ))}
              </div>
            </Image.PreviewGroup>
            {overflow > 0 && (
              <GalleryMoreLink
                type="button"
                onClick={() => { setPhotoViewerIndex(PHOTO_LIMIT); setPhotoViewerOpen(true); }}
              >
                Показать все фото ({total})
              </GalleryMoreLink>
            )}
          </SectionCard>
        );
      })()}

      <SectionCard>
        <SectionTitle>Информация</SectionTitle>
        <Descriptions
          column={2}
          labelStyle={{ color: theme.colors.text.secondary, fontSize: 13 }}
          contentStyle={{ color: theme.colors.text.secondary, fontSize: 14 }}
        >
          <Descriptions.Item label="Источник">
            {apt.source === 'LINK' && apt.sourceUrl ? (
              <a
                href={apt.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={apt.sourceUrl}
                style={{
                  display: 'inline-block',
                  maxWidth: 280,
                  verticalAlign: 'bottom',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {apt.sourceUrl.length > 30
                  ? `${apt.sourceUrl.slice(0, 30)}…`
                  : apt.sourceUrl}
              </a>
            ) : 'Вручную'}
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
