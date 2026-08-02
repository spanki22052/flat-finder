import { useEffect, useMemo, useState } from 'react';
import { Empty, Spin } from 'antd';
import {
  BellOutlined,
  CalendarOutlined,
  HomeOutlined,
  PlusOutlined,
  RightOutlined,
  StarFilled,
  TeamOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { flatApi } from '@/entities/Flat/utils/api';
import type { Apartment, ApartmentStatus } from '@/entities/Flat/model/types';
import { remindersApi } from '@/shared/api/endpoints';
import type { Reminder } from '@/shared/api/types';
import {
  CenterSpin,
  DesktopOnly,
  Shell,
  Hero, HeroRow, HeroIdentity, HeroEyebrow, HeroTitle, HeroLead,
  HeroActions, HeroActionBtn, HeroMetaRow, HeroMetaPill,
  DesktopGrid, MainColumn, SideColumn,
  SectionCard, SectionHeader, SectionTitle, SeeAll,
  ApartmentsGrid, ApartmentTile, ApartmentTileImage, ApartmentStatusBadge,
  ApartmentTileBody, ApartmentTileTitle, ApartmentTileLocation, ApartmentTilePrice,
  RemindersList, ReminderRow, ReminderIconWrap, ReminderRowBody,
  ReminderRowTitle, ReminderRowMeta, ReminderDueBadge,
  EmptyBlock,
  QuickLinksRow, QuickLinkCard, QuickLinkIcon, QuickLinkBody,
  MobileShell, MobileTopBar, MobileBrand, MobileBrandLogo, MobileBrandCaption,
  MobileTopActions, MobileBellBtn, MobileAvatar, MobileBody,
  ProgressCard, ProgressHeader, ProgressEyebrow, ProgressTitle, ProgressMeta,
  ProgressBar, ProgressBarFill, ProgressCopy,
  StatsGrid, StatCard, StatIcon, StatValue, StatLabel,
  ConsensusCard, ConsensusIcon, ConsensusContent, ConsensusText, ConsensusBadge,
  MobileSectionHeader, MobileSectionTitle, MobileSeeAll,
  ApartmentsRail, ApartmentCard, ApartmentCardImage, ApartmentCardInfo,
  ApartmentCardTitle, ApartmentCardLocation, ApartmentCardPrice,
  ActivityFeed, ActivityItem, ActivityAvatar, AvatarInitials, ActivityContent,
  ActivityText, ActivityTime, EmptyPanel, AddListingButton,
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

function greetingForHour(hour: number) {
  if (hour < 5) return 'Доброй ночи';
  if (hour < 12) return 'Доброе утро';
  if (hour < 18) return 'Добрый день';
  return 'Добрый вечер';
}

function firstName(name: string) {
  return name.split(' ')[0] || name;
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

// ─── Mobile ──────────────────────────────────────────────────────────────────

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
          <MobileBellBtn type="button" aria-label="Уведомления">
            <BellOutlined />
          </MobileBellBtn>
          <MobileAvatar size={38}>{user ? initials(user.name) : <AvatarInitials>FF</AvatarInitials>}</MobileAvatar>
        </MobileTopActions>
      </MobileTopBar>

      <MobileBody>
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

        <MobileSectionHeader>
          <MobileSectionTitle>Приоритетные варианты</MobileSectionTitle>
          <MobileSeeAll to="/apartments">Все</MobileSeeAll>
        </MobileSectionHeader>
        {priorityApartments.length ? (
          <ApartmentsRail>{priorityApartments.map((apartment) => <ApartmentRailCard key={apartment.id} apartment={apartment} />)}</ApartmentsRail>
        ) : (
          <EmptyPanel><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Пока нет квартир" /></EmptyPanel>
        )}

        <MobileSectionHeader>
          <MobileSectionTitle>Ближайшие действия</MobileSectionTitle>
          <MobileSeeAll to="/reminders">Все</MobileSeeAll>
        </MobileSectionHeader>
        {reminders.length ? (
          <ActivityFeed>{reminders.slice(0, 4).map((reminder, index) => <ReminderActivity key={reminder.id} reminder={reminder} index={index} />)}</ActivityFeed>
        ) : (
          <EmptyPanel><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет активных напоминаний" /></EmptyPanel>
        )}

        <AddListingButton type="button" onClick={() => navigate('/apartments')}>
          <PlusOutlined /> Добавить квартиру
        </AddListingButton>
      </MobileBody>
    </MobileShell>
  );
}

// ─── Desktop ─────────────────────────────────────────────────────────────────

function DesktopDashboard({ apartments, reminders, total }: {
  apartments: Apartment[];
  reminders: Reminder[];
  total: number;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const activeCount = apartments.filter((apartment) =>
    ['ACTIVE', 'CALLBACK', 'VIEWING'].includes(apartment.status),
  ).length;
  const callbackCount = apartments.filter((apartment) => apartment.status === 'CALLBACK').length;
  const pendingReminders = reminders.filter((r) => r.status === 'PENDING');
  const greeting = greetingForHour(new Date().getHours());

  return (
    <DesktopOnly>
      <Shell initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <Hero>
          <HeroRow>
            <HeroIdentity>
              <HeroEyebrow>Дашборд</HeroEyebrow>
              <HeroTitle>{greeting}{user ? `, ${firstName(user.name)}` : ''}</HeroTitle>
              <HeroLead>
                {total > 0
                  ? `${total} ${total === 1 ? 'квартира' : 'квартир'} в подборке, ${pendingReminders.length ? `${pendingReminders.length} напоминаний ждёт действия` : 'все напоминания закрыты'}.`
                  : 'Подборка пока пуста — добавьте первую квартиру, чтобы начать поиск.'}
              </HeroLead>
            </HeroIdentity>
            <HeroActions>
              <HeroActionBtn $variant="ghost" onClick={() => navigate('/team')}>
                <TeamOutlined /> Команда
              </HeroActionBtn>
              <HeroActionBtn onClick={() => navigate('/apartments')}>
                <PlusOutlined /> Добавить квартиру
              </HeroActionBtn>
            </HeroActions>
          </HeroRow>

          <HeroMetaRow>
            <HeroMetaPill to="/apartments">
              <span className="value">{total}</span>
              <span className="label">всего квартир</span>
            </HeroMetaPill>
            <HeroMetaPill to="/apartments?status=ACTIVE">
              <span className="value">{activeCount}</span>
              <span className="label">в работе</span>
            </HeroMetaPill>
            <HeroMetaPill to="/apartments?status=CALLBACK">
              <span className="value">{callbackCount}</span>
              <span className="label">перезвонов</span>
            </HeroMetaPill>
            <HeroMetaPill to="/reminders">
              <span className="value">{pendingReminders.length}</span>
              <span className="label">напоминаний</span>
            </HeroMetaPill>
          </HeroMetaRow>
        </Hero>

        <DesktopGrid>
          <MainColumn>
            <SectionCard>
              <SectionHeader>
                <SectionTitle>Последние квартиры</SectionTitle>
                <SeeAll to="/apartments">Все квартиры <RightOutlined /></SeeAll>
              </SectionHeader>
              {apartments.length ? (
                <ApartmentsGrid>
                  {apartments.map((apartment) => {
                    const location = [apartment.city, apartment.district].filter(Boolean).join(', ');
                    const photo = apartment.photos?.[0];
                    return (
                      <ApartmentTile key={apartment.id} to={`/apartments/${apartment.id}`}>
                        <ApartmentTileImage $src={photo}>
                          {!photo && <HomeOutlined aria-hidden />}
                          <ApartmentStatusBadge>{STATUS_LABELS[apartment.status]}</ApartmentStatusBadge>
                        </ApartmentTileImage>
                        <ApartmentTileBody>
                          <ApartmentTileTitle>{apartment.title}</ApartmentTileTitle>
                          <ApartmentTileLocation>{location || 'Адрес не указан'}</ApartmentTileLocation>
                          <ApartmentTilePrice>{formatPrice(apartment)}</ApartmentTilePrice>
                        </ApartmentTileBody>
                      </ApartmentTile>
                    );
                  })}
                </ApartmentsGrid>
              ) : (
                <EmptyBlock>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Пока нет квартир в подборке" />
                </EmptyBlock>
              )}
            </SectionCard>

            <QuickLinksRow>
              <QuickLinkCard to="/apartments">
                <QuickLinkIcon $tone="coral"><HomeOutlined /></QuickLinkIcon>
                <QuickLinkBody>
                  <span className="title">Квартиры</span>
                  <span className="caption">Список и импорт по ссылке</span>
                </QuickLinkBody>
              </QuickLinkCard>
              <QuickLinkCard to="/reminders">
                <QuickLinkIcon $tone="amber"><BellOutlined /></QuickLinkIcon>
                <QuickLinkBody>
                  <span className="title">Напоминания</span>
                  <span className="caption">Звонки и просмотры</span>
                </QuickLinkBody>
              </QuickLinkCard>
              <QuickLinkCard to="/team">
                <QuickLinkIcon $tone="sage"><TeamOutlined /></QuickLinkIcon>
                <QuickLinkBody>
                  <span className="title">Команда</span>
                  <span className="caption">Кто чем занимается</span>
                </QuickLinkBody>
              </QuickLinkCard>
            </QuickLinksRow>
          </MainColumn>

          <SideColumn>
            <SectionCard>
              <SectionHeader>
                <SectionTitle>Ближайшие действия</SectionTitle>
                <SeeAll to="/reminders">Все</SeeAll>
              </SectionHeader>
              {pendingReminders.length ? (
                <RemindersList>
                  {pendingReminders.slice(0, 6).map((reminder) => {
                    const overdue = new Date(reminder.dueAt) < new Date();
                    return (
                      <ReminderRow
                        key={reminder.id}
                        to={reminder.apartment ? `/apartments/${reminder.apartment.id}` : '/reminders'}
                      >
                        <ReminderIconWrap $overdue={overdue}>
                          {overdue ? <WarningOutlined /> : <ClockCircleOutlined />}
                        </ReminderIconWrap>
                        <ReminderRowBody>
                          <ReminderRowTitle>{reminder.title}</ReminderRowTitle>
                          <ReminderRowMeta>
                            <ReminderDueBadge $overdue={overdue}>
                              {overdue ? 'Просрочено' : formatDueAt(reminder.dueAt)}
                            </ReminderDueBadge>
                            {reminder.apartment && (
                              <span>· {reminder.apartment.title}</span>
                            )}
                          </ReminderRowMeta>
                        </ReminderRowBody>
                      </ReminderRow>
                    );
                  })}
                </RemindersList>
              ) : (
                <EmptyBlock>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет активных напоминаний" />
                </EmptyBlock>
              )}
            </SectionCard>

            <SectionCard>
              <SectionHeader>
                <SectionTitle>Импорт по ссылке</SectionTitle>
              </SectionHeader>
              <QuickLinkCard to="/apartments" style={{ padding: '14px 16px' }}>
                <QuickLinkIcon $tone="coral"><LinkOutlined /></QuickLinkIcon>
                <QuickLinkBody>
                  <span className="title">Импортировать объявление</span>
                  <span className="caption">Вставьте ссылку на Avito, Cian, DomClick или Яндекс</span>
                </QuickLinkBody>
              </QuickLinkCard>
            </SectionCard>
          </SideColumn>
        </DesktopGrid>
      </Shell>
    </DesktopOnly>
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
