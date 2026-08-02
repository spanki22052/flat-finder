import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Spin, Tag, Button, Descriptions, Divider,
  Card, Popconfirm, Modal, Form, Input, DatePicker, Tooltip, Image,
} from 'antd';
import {
  EnvironmentOutlined, HomeOutlined, BorderOutlined, BankOutlined,
  CalendarOutlined, PlusOutlined, ClockCircleOutlined, CloseOutlined, LinkOutlined, PhoneOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { theme } from '@/app/styles/theme';
import { getEffectiveMoveInCost } from '@/entities/Flat/utils/price';
import { formatPhone } from '../lib/utils';
import { COLLAPSE_LINES, PHOTO_LIMIT, STATUS_LABELS } from '../model/types';
import {
  cancelMeeting, saveMeeting, useApartmentDetail,
} from '../hooks/useApartmentDetail';
import * as Styled from './ApartmentDetailPage.styled';

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
    <Styled.ExpandableWrap>
      <Styled.DescriptionText
        ref={textRef}
        $expanded={expanded}
        $collapsedLines={COLLAPSE_LINES}
      >
        {text}
      </Styled.DescriptionText>
      {needsClamp && (
        <Styled.ExpandBtn type="button" onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Свернуть' : 'Развернуть'}
        </Styled.ExpandBtn>
      )}
    </Styled.ExpandableWrap>
  );
}

export function ApartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { apt, loading, nextReminder, setNextReminder, refetchNextReminder } = useApartmentDetail(id);
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [meetingForm] = Form.useForm();
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0);

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
      await saveMeeting(apt, nextReminder, values as { title: string; dueAt: dayjs.Dayjs });
      setMeetingModalOpen(false);
      meetingForm.resetFields();
      refetchNextReminder();
    } catch { /* validation fail */ }
  };

  const handleCancelMeeting = async () => {
    await cancelMeeting(nextReminder);
    setNextReminder(null);
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spin size="large" /></div>;
  if (!apt) return null;

  const statusColor = theme.colors.status[apt.status];

  return (
    <Styled.PageWrap>
      <Styled.BackBtn to="/apartments">← Квартиры</Styled.BackBtn>

      {nextReminder && (
        <Styled.ScheduledCard>
          <Styled.ScheduledAccent aria-hidden />
          <Styled.ScheduledDayTile aria-hidden>
            <Styled.ScheduledDayNumber>{dayjs(nextReminder.dueAt).format('D')}</Styled.ScheduledDayNumber>
            <Styled.ScheduledDayMonth>{dayjs(nextReminder.dueAt).format('MMM').replace('.', '')}</Styled.ScheduledDayMonth>
          </Styled.ScheduledDayTile>
          <Styled.ScheduledBody>
            <Styled.ScheduledEyebrow>
              <CalendarOutlined /> Запланирована
            </Styled.ScheduledEyebrow>
            <Styled.ScheduledTime>
              {dayjs(nextReminder.dueAt).format('HH:mm')}
              <Styled.ScheduledRelative>({dayjs(nextReminder.dueAt).fromNow()})</Styled.ScheduledRelative>
            </Styled.ScheduledTime>
            {nextReminder.title && (
              <Styled.ScheduledTitle>{nextReminder.title}</Styled.ScheduledTitle>
            )}
            <Styled.ScheduledActions>
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
            </Styled.ScheduledActions>
          </Styled.ScheduledBody>
        </Styled.ScheduledCard>
      )}

      <Styled.HeroCard>
        <Styled.HeroInner>
          <Styled.HeroMain>
            <Styled.HeroStatusRow>
              <Tag color={statusColor} style={{ border: 'none', fontWeight: 600 }}>
                {STATUS_LABELS[apt.status]}
              </Tag>
              {apt.tags.map((t) => (
                <Tag key={t} style={{ background: theme.colors.primaryFixed, border: 'none', color: theme.colors.onPrimaryFixedVariant }}>
                  {t}
                </Tag>
              ))}
            </Styled.HeroStatusRow>
            <Styled.HeroTitleRow>
              <Styled.HeroTitle>{apt.title}</Styled.HeroTitle>
              {apt.sourceUrl && (
                <Tooltip title={`Открыть источник: ${apt.sourceUrl}`}>
                  <Styled.SourceLinkIcon
                    type="button"
                    aria-label="Открыть источник"
                    onClick={() => window.open(apt.sourceUrl!, '_blank', 'noopener,noreferrer')}
                  >
                    <LinkOutlined />
                  </Styled.SourceLinkIcon>
                </Tooltip>
              )}
            </Styled.HeroTitleRow>
            <Styled.HeroMeta>
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
            </Styled.HeroMeta>

            <Styled.PriceDisplay>
              {apt.price.toLocaleString('ru-RU')} <span>{apt.currency}</span>
            </Styled.PriceDisplay>
            {(() => {
              const effectiveCost = getEffectiveMoveInCost(apt);
              if (effectiveCost === undefined) return null;
              return (
                <Styled.PriceMeta>
                  Действительная стоимость (с залогом{apt.agentCommissionPercent !== undefined ? ' и комиссией риелтору' : ''}): {effectiveCost.toLocaleString('ru-RU')} {apt.currency}
                </Styled.PriceMeta>
              );
            })()}

            {(apt.phones?.length || 0) > 0 ? (
              <Styled.CallRow>
                <Styled.CallBtn href={`tel:${apt.phones![0]}`}>
                  <PhoneOutlined /> {formatPhone(apt.phones![0])}
                </Styled.CallBtn>
                {apt.phones!.slice(1).map((phone) => (
                  <Styled.CallChip key={phone} href={`tel:${phone}`}>
                    <PhoneOutlined /> {formatPhone(phone)}
                  </Styled.CallChip>
                ))}
                {!nextReminder && (
                  <Styled.PlanCta type="button" onClick={openMeetingModal}>
                    <PlusOutlined /> Запланировать встречу
                  </Styled.PlanCta>
                )}
              </Styled.CallRow>
            ) : (
              !nextReminder && (
                <Styled.PlanCta type="button" onClick={openMeetingModal}>
                  <PlusOutlined /> Запланировать встречу
                </Styled.PlanCta>
              )
            )}
          </Styled.HeroMain>
        </Styled.HeroInner>
      </Styled.HeroCard>

      {apt.photos && apt.photos.length > 0 && (() => {
        const total = apt.photos.length;
        const visible = apt.photos.slice(0, PHOTO_LIMIT);
        const overflow = total - PHOTO_LIMIT;
        return (
          <Styled.SectionCard>
            <Styled.SectionTitle>Фото ({total})</Styled.SectionTitle>
            <Image.PreviewGroup
              preview={{
                visible: photoViewerOpen,
                current: photoViewerIndex,
                onVisibleChange: (open: boolean) => setPhotoViewerOpen(open),
                onChange: (current: number) => setPhotoViewerIndex(current),
              }}
            >
              <Styled.GalleryGrid>
                {visible.map((src, idx) => {
                  const isLast = idx === PHOTO_LIMIT - 1;
                  const showOverlay = isLast && overflow > 0;
                  return (
                    <Styled.GalleryImage
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
                      <img src={src} alt={`Фото ${idx + 1}`} loading="lazy" />
                      {showOverlay && (
                        <Styled.GalleryMore aria-hidden>
                          +{overflow}
                          <span>Показать все</span>
                        </Styled.GalleryMore>
                      )}
                    </Styled.GalleryImage>
                  );
                })}
              </Styled.GalleryGrid>
              <div style={{ display: 'none' }}>
                {apt.photos.map((src, idx) => (
                  <Image key={`full-${src}`} src={src} alt={`Фото ${idx + 1}`} />
                ))}
              </div>
            </Image.PreviewGroup>
            {overflow > 0 && (
              <Styled.GalleryMoreLink
                type="button"
                onClick={() => { setPhotoViewerIndex(PHOTO_LIMIT); setPhotoViewerOpen(true); }}
              >
                Показать все фото ({total})
              </Styled.GalleryMoreLink>
            )}
          </Styled.SectionCard>
        );
      })()}

      <Styled.SectionCard>
        <Styled.SectionTitle>Информация</Styled.SectionTitle>
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
      </Styled.SectionCard>

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
    </Styled.PageWrap>
  );
}