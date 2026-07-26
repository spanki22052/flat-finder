import { useEffect, useMemo, useState } from 'react';
import { Avatar, Empty, Spin } from 'antd';
import {
  BellOutlined,
  CalendarOutlined,
  HomeOutlined,
  PlusOutlined,
  RightOutlined,
  StarFilled,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { flatApi } from '@/entities/Flat/utils/api';
import type { Apartment, ApartmentStatus } from '@/entities/Flat/model/types';
import { remindersApi } from '@/shared/api/endpoints';
import type { Reminder } from '@/shared/api/types';
import {
  ActivityAvatar,
  ActivityContent,
  ActivityFeed,
  ActivityItem,
  ActivityText,
  ActivityTime,
  AddListingButton,
  ApartmentCard,
  ApartmentCardImage,
  ApartmentCardInfo,
  ApartmentCardLocation,
  ApartmentCardPrice,
  ApartmentCardTitle,
  ApartmentsRail,
  AvatarInitials,
  CenterSpin,
  ConsensusBadge,
  ConsensusCard,
  ConsensusContent,
  ConsensusIcon,
  ConsensusText,
  DashboardDesktop,
  DashboardMobile,
  DesktopGrid,
  DesktopPanel,
  DesktopStat,
  EmptyPanel,
  HeaderAvatar,
  HeaderBrand,
  HeaderGreeting,
  HeaderLogo,
  HeaderNotification,
  MobileHeader,
  MobilePage,
  ProgressBar,
  ProgressBarFill,
  ProgressCard,
  ProgressCopy,
  ProgressEyebrow,
  ProgressHeader,
  ProgressMeta,
  ProgressTitle,
  SectionHeader,
  SectionTitle,
  SeeAll,
  StatsGrid,
  StatCard,
  StatIcon,
  StatLabel,
  StatValue,
} from './styled';

const STATUS_LABELS: Record<ApartmentStatus, string> = {
  NEW: 'Новая',
  ACTIVE: 'В работе',
  CALLBACK: 'Перезвон',
  VIEWING: 'Просмотр',
  REJECTED: 'Отклонена',
  DONE: 'Готова',
};

const ACTIVITY_COLORS = ['#e77c43', '#8d735b', '#69825b', '#af8a47'];

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function formatPrice(apartment: Apartment) {
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: apartment.currency,
  }).format(apartment.price);
}

function formatDueAt(dueAt: string) {
  const date = new Date(dueAt);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return `Сегодня, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return `Завтра, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function ApartmentRailCard({ apartment }: { apartment: Apartment }) {
  const location = [apartment.city, apartment.district].filter(Boolean).join(', ');
  const photo = apartment.photos?.[0];

  return (
    <ApartmentCard to={`/apartments/${apartment.id}`}>
      <ApartmentCardImage $src={photo}>
        {!photo && <HomeOutlined aria-hidden />}
        <ConsensusBadge>{STATUS_LABELS[apartment.status]}</ConsensusBadge>
      </ApartmentCardImage>
      <ApartmentCardInfo>
        <ApartmentCardTitle>{apartment.title}</ApartmentCardTitle>
        <ApartmentCardLocation>{location || 'Адрес не указан'}</ApartmentCardLocation>
        <ApartmentCardPrice>{formatPrice(apartment)}</ApartmentCardPrice>
      </ApartmentCardInfo>
    </ApartmentCard>
  );
}

function ReminderActivity({ reminder, index }: { reminder: Reminder; index: number }) {
  const name = reminder.assignee?.name ?? 'Вы';
  return (
    <ActivityItem>
      <ActivityAvatar $color={ACTIVITY_COLORS[index % ACTIVITY_COLORS.length]}>
        <AvatarInitials>{initials(name)}</AvatarInitials>
      </ActivityAvatar>
      <ActivityContent>
        <ActivityText>
          <strong>{name}</strong> запланировал(а) <span>{reminder.title}</span>
        </ActivityText>
        <ActivityTime>{formatDueAt(reminder.dueAt)}</ActivityTime>
      </ActivityContent>
    </ActivityItem>
  );
}

function MobileDashboard({ apartments, reminders, total }: {
  apartments: Apartment[];
  reminders: Reminder[];
  total: number;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const activeCount = apartments.filter((apartment) =>
    ['ACTIVE', 'CALLBACK', 'VIEWING'].includes(apartment.status),
  ).length;
  const progress = Math.min(100, Math.max(8, total * 8));
  const priorityApartments = apartments.filter((apartment) => apartment.status !== 'REJECTED').slice(0, 5);

  return (
    <DashboardMobile>
      <MobileHeader>
        <HeaderBrand>
          <HeaderLogo><HomeOutlined /></HeaderLogo>
          <div>
            <div>FlatFinder</div>
            <HeaderGreeting>Совместный поиск</HeaderGreeting>
          </div>
        </HeaderBrand>
        <div>
          <HeaderNotification type="button" aria-label="Уведомления">
            <BellOutlined />
          </HeaderNotification>
          <HeaderAvatar size={38}>{user ? initials(user.name) : <AvatarInitials>FF</AvatarInitials>}</HeaderAvatar>
        </div>
      </MobileHeader>

      <MobilePage>
        <ProgressCard>
          <ProgressHeader>
            <div>
              <ProgressEyebrow>Текущий поиск</ProgressEyebrow>
              <ProgressTitle>{apartments[0]?.city || 'Квартиры'}</ProgressTitle>
            </div>
            <ProgressMeta>{total} объявлений</ProgressMeta>
          </ProgressHeader>
          <ProgressBar aria-label={`Найдено ${total} квартир`}>
            <ProgressBarFill style={{ width: `${progress}%` }} />
          </ProgressBar>
          <ProgressCopy>
            {total > 0
              ? `В вашей подборке уже ${total} ${total === 1 ? 'квартира' : 'квартир'}. Продолжайте сравнивать варианты.`
              : 'Добавьте первую квартиру в подборку, чтобы начать поиск.'}
          </ProgressCopy>
        </ProgressCard>

        <StatsGrid>
          <StatCard>
            <StatIcon $tone="coral"><HomeOutlined /></StatIcon>
            <div><StatValue>{total}</StatValue><StatLabel>Добавлено</StatLabel></div>
          </StatCard>
          <StatCard>
            <StatIcon $tone="sage"><CalendarOutlined /></StatIcon>
            <div><StatValue>{activeCount}</StatValue><StatLabel>В работе</StatLabel></div>
          </StatCard>
        </StatsGrid>

        <ConsensusCard to="/apartments">
          <ConsensusIcon><StarFilled /></ConsensusIcon>
          <ConsensusContent>
            <ConsensusText>{priorityApartments.length || 0} вариантов в приоритете</ConsensusText>
            <span>Просмотрите актуальную подборку</span>
          </ConsensusContent>
          <RightOutlined aria-hidden />
        </ConsensusCard>

        <SectionHeader>
          <SectionTitle>Приоритетные варианты</SectionTitle>
          <SeeAll to="/apartments">Все</SeeAll>
        </SectionHeader>
        {priorityApartments.length ? (
          <ApartmentsRail>{priorityApartments.map((apartment) => <ApartmentRailCard key={apartment.id} apartment={apartment} />)}</ApartmentsRail>
        ) : (
          <EmptyPanel><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Пока нет квартир" /></EmptyPanel>
        )}

        <SectionHeader>
          <SectionTitle>Ближайшие действия</SectionTitle>
          <SeeAll to="/reminders">Все</SeeAll>
        </SectionHeader>
        {reminders.length ? (
          <ActivityFeed>{reminders.slice(0, 4).map((reminder, index) => <ReminderActivity key={reminder.id} reminder={reminder} index={index} />)}</ActivityFeed>
        ) : (
          <EmptyPanel><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет активных напоминаний" /></EmptyPanel>
        )}

        <AddListingButton type="button" onClick={() => navigate('/apartments')}>
          <PlusOutlined /> Добавить квартиру
        </AddListingButton>
      </MobilePage>
    </DashboardMobile>
  );
}

function DesktopDashboard({ apartments, reminders, total }: {
  apartments: Apartment[];
  reminders: Reminder[];
  total: number;
}) {
  return (
    <DashboardDesktop>
      <h1>Дашборд</h1>
      <p>Обзор текущей подборки квартир</p>
      <DesktopGrid>
        <DesktopStat><HomeOutlined /><strong>{total}</strong><span>Всего квартир</span></DesktopStat>
        <DesktopStat><CalendarOutlined /><strong>{reminders.length}</strong><span>Напоминаний</span></DesktopStat>
        <DesktopPanel>
          <SectionHeader><SectionTitle>Последние квартиры</SectionTitle><SeeAll to="/apartments">Все</SeeAll></SectionHeader>
          {apartments.length ? <ApartmentsRail>{apartments.map((apartment) => <ApartmentRailCard key={apartment.id} apartment={apartment} />)}</ApartmentsRail> : <Empty description="Нет квартир" />}
        </DesktopPanel>
      </DesktopGrid>
    </DashboardDesktop>
  );
}

export function DashboardPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [total, setTotal] = useState(0);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      flatApi.getList({ pageSize: 12 }),
      remindersApi.list({ status: 'PENDING' }),
    ])
      .then(([apartmentsResponse, remindersResponse]) => {
        setApartments(apartmentsResponse.data);
        setTotal(apartmentsResponse.meta.total);
        setReminders(remindersResponse.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sortedApartments = useMemo(
    () => [...apartments].sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()),
    [apartments],
  );

  if (loading) {
    return <CenterSpin><Spin size="large" /></CenterSpin>;
  }

  return (
    <>
      <MobileDashboard apartments={sortedApartments} reminders={reminders} total={total} />
      <DesktopDashboard apartments={sortedApartments.slice(0, 5)} reminders={reminders} total={total} />
    </>
  );
}
