import { useMemo } from 'react';
import { Alert, Button, Empty, Spin } from 'antd';
import {
  BellOutlined, CalendarOutlined, HomeOutlined, PlusOutlined, RightOutlined,
  StarFilled, TeamOutlined, ClockCircleOutlined, LinkOutlined, WarningOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import type { Apartment } from '@/entities/Flat/model/types';
import type { Reminder } from '@/shared/api/types';
import {
  ACTIVITY_COLORS, ARCHIVE_STATUSES, FLOW_STATUSES,
  STATUS_LABELS, STATUS_TONES,
} from '../model/types';
import type { StatusCounts } from '../model/types';
import {
  firstName, formatDueAt, formatPrice, greetingForHour, initials,
} from '../lib/utils';
import { useDashboard } from '../hooks/useDashboard';
import * as Styled from './DashboardPage.styled';

function StatusSummary({ statusCounts, total }: { statusCounts: StatusCounts; total: number }) {
  return (
    <Styled.StatusOverview>
      <Styled.StatusOverviewHeader>
        <Styled.StatusOverviewLead>
          <span>Ход подбора</span>
          <strong>От нового варианта до просмотра</strong>
        </Styled.StatusOverviewLead>
        <Styled.StatusOverviewTotal>{total} вариантов</Styled.StatusOverviewTotal>
      </Styled.StatusOverviewHeader>

      <Styled.StatusFlow aria-label="Этапы подбора квартиры">
        {FLOW_STATUSES.map((status) => {
          const count = statusCounts[status];
          return (
            <Styled.StatusStageLink
              key={status}
              to={`/apartments?status=${status}`}
              $tone={STATUS_TONES[status]}
              aria-label={`${STATUS_LABELS[status]}: ${count}`}
            >
              <Styled.StatusStageTop>
                <Styled.StatusStageDot $tone={STATUS_TONES[status]} />
                <Styled.StatusStageCount>{count}</Styled.StatusStageCount>
              </Styled.StatusStageTop>
              <Styled.StatusStageLabel className="stage-label">{STATUS_LABELS[status]}</Styled.StatusStageLabel>
              <Styled.StatusStageHint>
                {status === 'NEW' && 'Нужно разобрать'}
                {status === 'ACTIVE' && 'Сравниваете'}
                {status === 'CALLBACK' && 'Ждут звонка'}
                {status === 'VIEWING' && 'Запланированы'}
              </Styled.StatusStageHint>
            </Styled.StatusStageLink>
          );
        })}
      </Styled.StatusFlow>

      <Styled.StatusArchive>
        <span>Завершённые</span>
        {ARCHIVE_STATUSES.map((status) => (
          <Styled.StatusArchiveLink key={status} to={`/apartments?status=${status}`}>
            <span className="archive-dot" style={{ background: STATUS_TONES[status] }} />
            {STATUS_LABELS[status]} <strong>{statusCounts[status]}</strong>
          </Styled.StatusArchiveLink>
        ))}
      </Styled.StatusArchive>
    </Styled.StatusOverview>
  );
}

function ApartmentRailCard({ apartment }: { apartment: Apartment }) {
  const location = [apartment.city, apartment.district].filter(Boolean).join(', ');
  const photo = apartment.photos?.[0];

  return (
    <Styled.ApartmentCard to={`/apartments/${apartment.id}`}>
      <Styled.ApartmentCardImage $src={photo}>
        {!photo && <HomeOutlined aria-hidden />}
        <Styled.ConsensusBadge>{STATUS_LABELS[apartment.status]}</Styled.ConsensusBadge>
      </Styled.ApartmentCardImage>
      <Styled.ApartmentCardInfo>
        <Styled.ApartmentCardTitle>{apartment.title}</Styled.ApartmentCardTitle>
        <Styled.ApartmentCardLocation>{location || 'Адрес не указан'}</Styled.ApartmentCardLocation>
        <Styled.ApartmentCardPrice>{formatPrice(apartment)}</Styled.ApartmentCardPrice>
      </Styled.ApartmentCardInfo>
    </Styled.ApartmentCard>
  );
}

function ReminderActivity({ reminder, index }: { reminder: Reminder; index: number }) {
  const name = reminder.assignee?.name ?? 'Вы';
  return (
    <Styled.ActivityItem>
      <Styled.ActivityAvatar $color={ACTIVITY_COLORS[index % ACTIVITY_COLORS.length]}>
        <Styled.AvatarInitials>{initials(name)}</Styled.AvatarInitials>
      </Styled.ActivityAvatar>
      <Styled.ActivityContent>
        <Styled.ActivityText>
          <strong>{name}</strong> запланировал(а) <span>{reminder.title}</span>
        </Styled.ActivityText>
        <Styled.ActivityTime>{formatDueAt(reminder.dueAt)}</Styled.ActivityTime>
      </Styled.ActivityContent>
    </Styled.ActivityItem>
  );
}

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
    <Styled.MobileShell>
      <Styled.MobileTopBar>
        <Styled.MobileBrand>
          <Styled.MobileBrandLogo><HomeOutlined /></Styled.MobileBrandLogo>
          <div>
            <div>FlatFinder</div>
            <Styled.MobileBrandCaption>Совместный поиск</Styled.MobileBrandCaption>
          </div>
        </Styled.MobileBrand>
        <Styled.MobileTopActions>
          <Styled.MobileBellBtn type="button" aria-label="Открыть напоминания" onClick={() => navigate('/reminders')}>
            <BellOutlined />
          </Styled.MobileBellBtn>
          <Styled.MobileAvatar size={38}>{user ? initials(user.name) : <Styled.AvatarInitials>FF</Styled.AvatarInitials>}</Styled.MobileAvatar>
        </Styled.MobileTopActions>
      </Styled.MobileTopBar>

      <Styled.MobileBody>
        <Styled.ProgressCard>
          <Styled.ProgressHeader>
            <div>
              <Styled.ProgressEyebrow>Текущий поиск</Styled.ProgressEyebrow>
              <Styled.ProgressTitle>{apartments[0]?.city || 'Квартиры'}</Styled.ProgressTitle>
            </div>
            <Styled.ProgressMeta>{total} объявлений</Styled.ProgressMeta>
          </Styled.ProgressHeader>
          <Styled.ProgressBar aria-label={`${progress}% квартир в работе`}>
            <Styled.ProgressBarFill style={{ width: `${progress}%` }} />
          </Styled.ProgressBar>
          <Styled.ProgressCopy>
            {total > 0
              ? `${progress}% подборки сейчас в работе — ${activeCount} ${activeCount === 1 ? 'вариант' : 'вариантов'} требуют внимания.`
              : 'Добавьте первую квартиру в подборку, чтобы начать поиск.'}
          </Styled.ProgressCopy>
        </Styled.ProgressCard>

        <Styled.StatsGrid>
          <Styled.StatCard>
            <Styled.StatIcon $tone="coral"><HomeOutlined /></Styled.StatIcon>
            <div><Styled.StatValue>{total}</Styled.StatValue><Styled.StatLabel>Добавлено</Styled.StatLabel></div>
          </Styled.StatCard>
          <Styled.StatCard>
            <Styled.StatIcon $tone="sage"><CalendarOutlined /></Styled.StatIcon>
            <div><Styled.StatValue>{activeCount}</Styled.StatValue><Styled.StatLabel>В работе</Styled.StatLabel></div>
          </Styled.StatCard>
          <Styled.StatCard>
            <Styled.StatIcon $tone="coral"><ClockCircleOutlined /></Styled.StatIcon>
            <div><Styled.StatValue>{statusCounts.CALLBACK}</Styled.StatValue><Styled.StatLabel>Перезвонить</Styled.StatLabel></div>
          </Styled.StatCard>
          <Styled.StatCard>
            <Styled.StatIcon $tone="sage"><BellOutlined /></Styled.StatIcon>
            <div><Styled.StatValue>{reminders.length}</Styled.StatValue><Styled.StatLabel>Напоминаний</Styled.StatLabel></div>
          </Styled.StatCard>
        </Styled.StatsGrid>

        <Styled.ConsensusCard to="/apartments">
          <Styled.ConsensusIcon><StarFilled /></Styled.ConsensusIcon>
          <Styled.ConsensusContent>
            <Styled.ConsensusText>{priorityApartments.length || 0} вариантов в приоритете</Styled.ConsensusText>
            <span>Просмотрите актуальную подборку</span>
          </Styled.ConsensusContent>
          <RightOutlined aria-hidden />
        </Styled.ConsensusCard>

        <Styled.MobileSectionHeader>
          <Styled.MobileSectionTitle>Приоритетные варианты</Styled.MobileSectionTitle>
          <Styled.MobileSeeAll to="/apartments">Все</Styled.MobileSeeAll>
        </Styled.MobileSectionHeader>
        {priorityApartments.length ? (
          <Styled.ApartmentsRail>{priorityApartments.map((apartment) => <ApartmentRailCard key={apartment.id} apartment={apartment} />)}</Styled.ApartmentsRail>
        ) : (
          <Styled.EmptyPanel><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Пока нет квартир" /></Styled.EmptyPanel>
        )}

        <Styled.MobileSectionHeader>
          <Styled.MobileSectionTitle>Ближайшие действия</Styled.MobileSectionTitle>
          <Styled.MobileSeeAll to="/reminders">Все</Styled.MobileSeeAll>
        </Styled.MobileSectionHeader>
        {reminders.length ? (
          <Styled.ActivityFeed>{reminders.slice(0, 4).map((reminder, index) => <ReminderActivity key={reminder.id} reminder={reminder} index={index} />)}</Styled.ActivityFeed>
        ) : (
          <Styled.EmptyPanel><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет активных напоминаний" /></Styled.EmptyPanel>
        )}

        <Styled.AddListingButton type="button" onClick={() => navigate('/apartments')}>
          <PlusOutlined /> Добавить квартиру
        </Styled.AddListingButton>
      </Styled.MobileBody>
    </Styled.MobileShell>
  );
}

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
    <Styled.DesktopOnly>
      <Styled.Shell initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <Styled.Hero>
          <Styled.HeroRow>
            <Styled.HeroIdentity>
              <Styled.HeroEyebrow>Дашборд</Styled.HeroEyebrow>
              <Styled.HeroTitle>{greeting}{user ? `, ${firstName(user.name)}` : ''}</Styled.HeroTitle>
              <Styled.HeroLead>
                {total > 0
                  ? `${total} ${total === 1 ? 'квартира' : 'квартир'} в подборке, ${pendingReminders.length ? `${pendingReminders.length} напоминаний ждёт действия` : 'все напоминания закрыты'}.`
                  : 'Подборка пока пуста — добавьте первую квартиру, чтобы начать поиск.'}
              </Styled.HeroLead>
            </Styled.HeroIdentity>
            <Styled.HeroActions>
              <Styled.HeroActionBtn $variant="ghost" onClick={() => navigate('/team')}>
                <TeamOutlined /> Команда
              </Styled.HeroActionBtn>
              <Styled.HeroActionBtn onClick={() => navigate('/apartments')}>
                <PlusOutlined /> Добавить квартиру
              </Styled.HeroActionBtn>
            </Styled.HeroActions>
          </Styled.HeroRow>

          <Styled.HeroMetaRow>
            <Styled.HeroMetaPill to="/apartments">
              <span className="value">{total}</span>
              <span className="label">всего квартир</span>
            </Styled.HeroMetaPill>
            <Styled.HeroMetaPill to="/apartments?status=ACTIVE">
              <span className="value">{activeCount}</span>
              <span className="label">в работе</span>
            </Styled.HeroMetaPill>
            <Styled.HeroMetaPill to="/apartments?status=CALLBACK">
              <span className="value">{callbackCount}</span>
              <span className="label">перезвонов</span>
            </Styled.HeroMetaPill>
            <Styled.HeroMetaPill to="/reminders">
              <span className="value">{pendingReminders.length}</span>
              <span className="label">напоминаний</span>
            </Styled.HeroMetaPill>
          </Styled.HeroMetaRow>
        </Styled.Hero>

        <StatusSummary statusCounts={statusCounts} total={total} />

        <Styled.DesktopGrid>
          <Styled.MainColumn>
            <Styled.SectionCard>
              <Styled.SectionHeader>
                <Styled.SectionTitle>Последние квартиры</Styled.SectionTitle>
                <Styled.SeeAll to="/apartments">Все квартиры <RightOutlined /></Styled.SeeAll>
              </Styled.SectionHeader>
              {apartments.length ? (
                <Styled.ApartmentsGrid>
                  {apartments.map((apartment) => {
                    const location = [apartment.city, apartment.district].filter(Boolean).join(', ');
                    const photo = apartment.photos?.[0];
                    return (
                      <Styled.ApartmentTile key={apartment.id} to={`/apartments/${apartment.id}`}>
                        <Styled.ApartmentTileImage $src={photo}>
                          {!photo && <HomeOutlined aria-hidden />}
                          <Styled.ApartmentStatusBadge>{STATUS_LABELS[apartment.status]}</Styled.ApartmentStatusBadge>
                        </Styled.ApartmentTileImage>
                        <Styled.ApartmentTileBody>
                          <Styled.ApartmentTileTitle>{apartment.title}</Styled.ApartmentTileTitle>
                          <Styled.ApartmentTileLocation>{location || 'Адрес не указан'}</Styled.ApartmentTileLocation>
                          <Styled.ApartmentTilePrice>{formatPrice(apartment)}</Styled.ApartmentTilePrice>
                        </Styled.ApartmentTileBody>
                      </Styled.ApartmentTile>
                    );
                  })}
                </Styled.ApartmentsGrid>
              ) : (
                <Styled.EmptyBlock>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Пока нет квартир в подборке" />
                </Styled.EmptyBlock>
              )}
            </Styled.SectionCard>

            <Styled.QuickLinksRow>
              <Styled.QuickLinkCard to="/apartments">
                <Styled.QuickLinkIcon $tone="coral"><HomeOutlined /></Styled.QuickLinkIcon>
                <Styled.QuickLinkBody>
                  <span className="title">Квартиры</span>
                  <span className="caption">Список и импорт по ссылке</span>
                </Styled.QuickLinkBody>
              </Styled.QuickLinkCard>
              <Styled.QuickLinkCard to="/reminders">
                <Styled.QuickLinkIcon $tone="amber"><BellOutlined /></Styled.QuickLinkIcon>
                <Styled.QuickLinkBody>
                  <span className="title">Напоминания</span>
                  <span className="caption">Звонки и просмотры</span>
                </Styled.QuickLinkBody>
              </Styled.QuickLinkCard>
              <Styled.QuickLinkCard to="/team">
                <Styled.QuickLinkIcon $tone="sage"><TeamOutlined /></Styled.QuickLinkIcon>
                <Styled.QuickLinkBody>
                  <span className="title">Команда</span>
                  <span className="caption">Кто чем занимается</span>
                </Styled.QuickLinkBody>
              </Styled.QuickLinkCard>
            </Styled.QuickLinksRow>
          </Styled.MainColumn>

          <Styled.SideColumn>
            <Styled.SectionCard>
              <Styled.SectionHeader>
                <Styled.SectionTitle>Ближайшие действия</Styled.SectionTitle>
                <Styled.SeeAll to="/reminders">Все</Styled.SeeAll>
              </Styled.SectionHeader>
              {pendingReminders.length ? (
                <Styled.RemindersList>
                  {pendingReminders.slice(0, 6).map((reminder) => {
                    const overdue = new Date(reminder.dueAt) < new Date();
                    return (
                      <Styled.ReminderRow
                        key={reminder.id}
                        to={reminder.apartment ? `/apartments/${reminder.apartment.id}` : '/reminders'}
                      >
                        <Styled.ReminderIconWrap $overdue={overdue}>
                          {overdue ? <WarningOutlined /> : <ClockCircleOutlined />}
                        </Styled.ReminderIconWrap>
                        <Styled.ReminderRowBody>
                          <Styled.ReminderRowTitle>{reminder.title}</Styled.ReminderRowTitle>
                          <Styled.ReminderRowMeta>
                            <Styled.ReminderDueBadge $overdue={overdue}>
                              {overdue ? 'Просрочено' : formatDueAt(reminder.dueAt)}
                            </Styled.ReminderDueBadge>
                            {reminder.apartment && (
                              <span>· {reminder.apartment.title}</span>
                            )}
                          </Styled.ReminderRowMeta>
                        </Styled.ReminderRowBody>
                      </Styled.ReminderRow>
                    );
                  })}
                </Styled.RemindersList>
              ) : (
                <Styled.EmptyBlock>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет активных напоминаний" />
                </Styled.EmptyBlock>
              )}
            </Styled.SectionCard>

            <Styled.SectionCard>
              <Styled.SectionHeader>
                <Styled.SectionTitle>Импорт по ссылке</Styled.SectionTitle>
              </Styled.SectionHeader>
              <Styled.QuickLinkCard to="/apartments" style={{ padding: '14px 16px' }}>
                <Styled.QuickLinkIcon $tone="coral"><LinkOutlined /></Styled.QuickLinkIcon>
                <Styled.QuickLinkBody>
                  <span className="title">Импортировать объявление</span>
                  <span className="caption">Вставьте ссылку на Avito, Cian, DomClick или Яндекс</span>
                </Styled.QuickLinkBody>
              </Styled.QuickLinkCard>
            </Styled.SectionCard>
          </Styled.SideColumn>
        </Styled.DesktopGrid>
      </Styled.Shell>
    </Styled.DesktopOnly>
  );
}

export function DashboardPage() {
  const ctrl = useDashboard();

  const sortedApartments = useMemo(
    () => [...ctrl.apartments].sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()),
    [ctrl.apartments],
  );

  if (ctrl.loading) {
    return <Styled.CenterSpin><Spin size="large" /></Styled.CenterSpin>;
  }

  if (ctrl.error) {
    return (
      <Styled.DashboardError>
        <Alert
          type="error"
          showIcon
          message="Не удалось загрузить дашборд"
          description="Проверьте соединение и попробуйте обновить данные."
          action={<Button type="primary" onClick={() => void ctrl.loadDashboard()}>Повторить</Button>}
        />
      </Styled.DashboardError>
    );
  }

  return (
    <>
      <MobileDashboard apartments={sortedApartments} reminders={ctrl.reminders} total={ctrl.total} statusCounts={ctrl.statusCounts} />
      <DesktopDashboard apartments={sortedApartments.slice(0, 5)} reminders={ctrl.reminders} total={ctrl.total} statusCounts={ctrl.statusCounts} />
    </>
  );
}