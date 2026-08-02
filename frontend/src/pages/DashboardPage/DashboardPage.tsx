import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Button, Empty, Spin } from 'antd';
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
  StatusOverview, StatusOverviewHeader, StatusOverviewLead, StatusOverviewTotal,
  StatusFlow, StatusStageLink, StatusStageTop, StatusStageDot, StatusStageCount,
  StatusStageLabel, StatusStageHint, StatusArchive, StatusArchiveLink,
  DashboardError,
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

const STATUS_ORDER: ApartmentStatus[] = ['NEW', 'ACTIVE', 'CALLBACK', 'VIEWING', 'DONE', 'REJECTED'];
const STATUS_TONES: Record<ApartmentStatus, string> = {
  NEW: '#964325',
  ACTIVE: '#4f7a52',
  CALLBACK: '#9b6a2b',
  VIEWING: '#3d6b8a',
  DONE: '#88726b',
  REJECTED: '#ba1a1a',
};

type StatusCounts = Record<ApartmentStatus, number>;

const EMPTY_STATUS_COUNTS: StatusCounts = {
  NEW: 0,
  ACTIVE: 0,
  CALLBACK: 0,
  VIEWING: 0,
  REJECTED: 0,
  DONE: 0,
};

const FLOW_STATUSES: ApartmentStatus[] = ['NEW', 'ACTIVE', 'CALLBACK', 'VIEWING'];
const ARCHIVE_STATUSES: ApartmentStatus[] = ['DONE', 'REJECTED'];

function StatusSummary({ statusCounts, total }: { statusCounts: StatusCounts; total: number }) {
  return (
    <StatusOverview>
      <StatusOverviewHeader>
        <StatusOverviewLead>
          <span>Ход подбора</span>
          <strong>От нового варианта до просмотра</strong>
        </StatusOverviewLead>
        <StatusOverviewTotal>{total} вариантов</StatusOverviewTotal>
      </StatusOverviewHeader>

      <StatusFlow aria-label="Этапы подбора квартиры">
        {FLOW_STATUSES.map((status) => {
          const count = statusCounts[status];
          return (
            <StatusStageLink
              key={status}
              to={`/apartments?status=${status}`}
              $tone={STATUS_TONES[status]}
              aria-label={`${STATUS_LABELS[status]}: ${count}`}
            >
              <StatusStageTop>
                <StatusStageDot $tone={STATUS_TONES[status]} />
                <StatusStageCount>{count}</StatusStageCount>
              </StatusStageTop>
              <StatusStageLabel className="stage-label">{STATUS_LABELS[status]}</StatusStageLabel>
              <StatusStageHint>
                {status === 'NEW' && 'Нужно разобрать'}
                {status === 'ACTIVE' && 'Сравниваете'}
                {status === 'CALLBACK' && 'Ждут звонка'}
                {status === 'VIEWING' && 'Запланированы'}
              </StatusStageHint>
            </StatusStageLink>
          );
        })}
      </StatusFlow>

      <StatusArchive>
        <span>Завершённые</span>
        {ARCHIVE_STATUSES.map((status) => (
          <StatusArchiveLink key={status} to={`/apartments?status=${status}`}>
            <span className="archive-dot" style={{ background: STATUS_TONES[status] }} />
            {STATUS_LABELS[status]} <strong>{statusCounts[status]}</strong>
          </StatusArchiveLink>
        ))}
      </StatusArchive>
    </StatusOverview>
  );
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

function MobileDashboard({ apartments, reminders, total, statusCounts }: {
  apartments: Apartment[];
  reminders: Reminder[];
  total: number;
  statusCounts: StatusCounts;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const activeCount = statusCounts.ACTIVE + statusCounts.CALLBACK + statusCounts.VIEWING;
  const progress = total ? Math.round((activeCount / total) * 100) : 0;
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
          <MobileBellBtn type="button" aria-label="Открыть напоминания" onClick={() => navigate('/reminders')}>
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
          <ProgressBar aria-label={`${progress}% квартир в работе`}>
            <ProgressBarFill style={{ width: `${progress}%` }} />
          </ProgressBar>
          <ProgressCopy>
            {total > 0
              ? `${progress}% подборки сейчас в работе — ${activeCount} ${activeCount === 1 ? 'вариант' : 'вариантов'} требуют внимания.`
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
          <StatCard>
            <StatIcon $tone="coral"><ClockCircleOutlined /></StatIcon>
            <div><StatValue>{statusCounts.CALLBACK}</StatValue><StatLabel>Перезвонить</StatLabel></div>
          </StatCard>
          <StatCard>
            <StatIcon $tone="sage"><BellOutlined /></StatIcon>
            <div><StatValue>{reminders.length}</StatValue><StatLabel>Напоминаний</StatLabel></div>
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

function DesktopDashboard({ apartments, reminders, total, statusCounts }: {
  apartments: Apartment[];
  reminders: Reminder[];
  total: number;
  statusCounts: StatusCounts;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const activeCount = statusCounts.ACTIVE + statusCounts.CALLBACK + statusCounts.VIEWING;
  const callbackCount = statusCounts.CALLBACK;
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

        <StatusSummary statusCounts={statusCounts} total={total} />

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
  const [statusCounts, setStatusCounts] = useState<StatusCounts>(EMPTY_STATUS_COUNTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [apartmentsResponse, remindersResponse, ...statusResponses] = await Promise.all([
        flatApi.getList({ pageSize: 100 }),
        remindersApi.list({ status: 'PENDING' }),
        ...STATUS_ORDER.map((status) => flatApi.getList({ status, pageSize: 1 })),
      ]);
      setApartments(apartmentsResponse.data);
      setTotal(apartmentsResponse.meta.total);
      setReminders(remindersResponse.data.data);
      setStatusCounts(STATUS_ORDER.reduce<StatusCounts>((counts, status, index) => {
        counts[status] = statusResponses[index].meta.total;
        return counts;
      }, { ...EMPTY_STATUS_COUNTS }));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const sortedApartments = useMemo(
    () => [...apartments].sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()),
    [apartments],
  );

  if (loading) {
    return <CenterSpin><Spin size="large" /></CenterSpin>;
  }

  if (error) {
    return (
      <DashboardError>
        <Alert
          type="error"
          showIcon
          message="Не удалось загрузить дашборд"
          description="Проверьте соединение и попробуйте обновить данные."
          action={<Button type="primary" onClick={() => void loadDashboard()}>Повторить</Button>}
        />
      </DashboardError>
    );
  }

  return (
    <>
      <MobileDashboard apartments={sortedApartments} reminders={reminders} total={total} statusCounts={statusCounts} />
      <DesktopDashboard apartments={sortedApartments.slice(0, 5)} reminders={reminders} total={total} statusCounts={statusCounts} />
    </>
  );
}
