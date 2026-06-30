import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Tag, Spin } from 'antd';
import {
  HomeOutlined, ClockCircleOutlined, PhoneOutlined,
  ArrowUpOutlined, ArrowDownOutlined,
} from '@ant-design/icons';
import { theme } from '../../app/styles/theme';
import { callsApi, remindersApi } from '../../shared/api/endpoints';
import { flatApi } from '../../entities/Flat/utils/api';
import type { ApartmentStatus } from '../../entities/Flat/model/types';
import type { Call, Reminder } from '../../shared/api/types';
import {
  PageWrap, PageTitle, PageSubtitle, BentoGrid,
  StatCard, StatCardIcon, StatValue, StatLabel, StatTrend, CardTitle,
  AptCard, AptThumb, AptInfo, AptTitle, AptMeta, AptPrice, ArrowIcon,
  AptList, ReminderItem, ReminderDot, ReminderInfo, ReminderTitle, ReminderTime,
  SectionHeader, SeeAllLink, CenterSpin,
} from './styled';

const STATUS_COLORS: Record<ApartmentStatus, string> = {
  NEW: '#9FA1FF',
  ACTIVE: '#34d399',
  CALLBACK: '#C1EBE9',
  VIEWING: '#D9F9DF',
  REJECTED: '#fb7185',
  DONE: '#6b7280',
};

const STATUS_LABELS: Record<ApartmentStatus, string> = {
  NEW: 'Новые',
  ACTIVE: 'Активные',
  CALLBACK: 'Перезвон',
  VIEWING: 'Просмотр',
  REJECTED: 'Отклонены',
  DONE: 'Готовы',
};

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return count;
}

function StatCardWidget({
  icon, value, label, trend, accent, gradient, delay,
}: {
  icon: React.ReactNode; value: number; label: string;
  trend?: { up: boolean; text: string }; accent?: string; gradient?: string; delay?: number;
}) {
  const counted = useCountUp(value);
  return (
    <StatCard
      $accent={accent}
      $gradient={gradient}
      style={{ animationDelay: `${delay ?? 0}s` }}
    >
      <StatCardIcon $color={accent ?? '#9FA1FF'}>{icon}</StatCardIcon>
      <StatValue>{counted.toLocaleString('ru-RU')}</StatValue>
      <StatLabel>{label}</StatLabel>
      {trend && (
        <StatTrend $up={trend.up}>
          {trend.up ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {trend.text}
        </StatTrend>
      )}
    </StatCard>
  );
}

export function DashboardPage() {
  const [apartments, setApartments] = useState<import('../../entities/Flat/model/types').Apartment[]>([]);
  const [total, setTotal] = useState(0);
  const [calls, setCalls] = useState<Call[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      flatApi.getList({ pageSize: 5 }),
      callsApi.list({ pageSize: 5 }),
      remindersApi.list({ status: 'PENDING' }),
    ])
      .then(([aptRes, callsRes, remRes]) => {
        setApartments(aptRes.data);
        setTotal(aptRes.meta.total);
        setCalls(callsRes.data.data);
        setReminders(remRes.data.data.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const byStatus = apartments.reduce<Record<ApartmentStatus, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1;
    return acc;
  }, {} as Record<ApartmentStatus, number>);

  const activeCount = total > 0 ? (byStatus['ACTIVE'] ?? 0) + (byStatus['CALLBACK'] ?? 0) + (byStatus['VIEWING'] ?? 0) : 0;

  if (loading) {
    return (
      <CenterSpin>
        <Spin size="large" />
      </CenterSpin>
    );
  }

  return (
    <PageWrap>
      <PageTitle>Дашборд</PageTitle>
      <PageSubtitle>Обзор ваших квартир и активности</PageSubtitle>

      {/* Bento Stats */}
      <BentoGrid>
        <StatCardWidget
          icon={<HomeOutlined />}
          value={total}
          label="Всего квартир"
          accent="#9FA1FF"
          gradient={theme.colors.bg.card}
          delay={0.05}
        />
        <StatCardWidget
          icon={<Badge status="processing" />}
          value={activeCount}
          label="В работе"
          accent="#34d399"
          trend={{ up: true, text: '+3 за неделю' }}
          delay={0.1}
        />
        <StatCardWidget
          icon={<PhoneOutlined />}
          value={calls.length}
          label="Звонков"
          accent="#C1EBE9"
          delay={0.15}
        />
        <StatCardWidget
          icon={<ClockCircleOutlined />}
          value={reminders.length}
          label="Активных напоминаний"
          accent="#D9F9DF"
          delay={0.2}
        />

        {/* Recent apartments */}
        <StatCard $span={2} style={{ animationDelay: '0.25s' }}>
          <SectionHeader>
            <CardTitle>Последние квартиры</CardTitle>
            <SeeAllLink to="/apartments">Все →</SeeAllLink>
          </SectionHeader>
          {apartments.length === 0 ? (
            <div style={{ color: theme.colors.text.muted, fontSize: 14 }}>Нет квартир</div>
          ) : (
            <AptList>
              {apartments.slice(0, 4).map((a) => (
                <AptCard key={a.id} to={`/apartments/${a.id}`}>
                  <AptThumb $color={STATUS_COLORS[a.status]}>🏠</AptThumb>
                  <AptInfo>
                    <AptTitle>{a.title}</AptTitle>
                    <AptMeta>{a.city}{a.district ? ` · ${a.district}` : ''}</AptMeta>
                  </AptInfo>
                  <div style={{ textAlign: 'right' }}>
                    <AptPrice>{a.price.toLocaleString('ru-RU')} {a.currency}</AptPrice>
                    <Tag
                      color={STATUS_COLORS[a.status]}
                      style={{ fontSize: 10, marginTop: 4, border: 'none' }}
                    >
                      {STATUS_LABELS[a.status]}
                    </Tag>
                  </div>
                  <ArrowIcon />
                </AptCard>
              ))}
            </AptList>
          )}
        </StatCard>

        {/* Pending reminders */}
        <StatCard $span={2} style={{ animationDelay: '0.3s' }}>
          <SectionHeader>
            <CardTitle>Напоминания</CardTitle>
            <SeeAllLink to="/reminders">Все →</SeeAllLink>
          </SectionHeader>
          {reminders.length === 0 ? (
            <div style={{ color: theme.colors.text.muted, fontSize: 14 }}>Нет активных напоминаний</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {reminders.map((r) => {
                const overdue = new Date(r.dueAt) < new Date();
                return (
                  <ReminderItem key={r.id}>
                    <ReminderDot $color={overdue ? '#fb7185' : '#9FA1FF'} />
                    <ReminderInfo>
                      <ReminderTitle>{r.title}</ReminderTitle>
                      <ReminderTime>
                        {new Date(r.dueAt).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </ReminderTime>
                    </ReminderInfo>
                  </ReminderItem>
                );
              })}
            </div>
          )}
        </StatCard>
      </BentoGrid>
    </PageWrap>
  );
}
