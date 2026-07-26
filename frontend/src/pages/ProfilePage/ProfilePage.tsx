import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, Button, Descriptions, Skeleton, message, App } from 'antd';
import {
  UserOutlined, MailOutlined, CalendarOutlined,
  LogoutOutlined, ReloadOutlined, HomeOutlined, BellOutlined,
  IdcardOutlined, CrownOutlined, TeamOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { authApi, remindersApi, usersApi } from '../../shared/api/endpoints';
import type { User } from '../../shared/api/types';
import { flatApi } from '../../entities/Flat/utils/api';
import { useAuth } from '../../app/providers/AuthProvider';
import { useRoom } from '../../app/providers/RoomProvider';
import { theme } from '../../app/styles/theme';
import {
  PageHeader, PageTitle, Card, TopBlock, AvatarWrap, Name, Role,
  MetaRow, MetaItem, MetaIcon, MetaText, Actions,
  DesktopOnly, MobileShell, MobileTopBar, MobileBrand, MobileBrandLogo,
  MobileBrandCaption, MobileBellBtn, MobileBody, MobileHeroCard,
  MobileHeroAvatarWrap, MobileHeroName, MobileHeroRole, MobileStatsGrid,
  MobileStatCard, MobileStatIcon, MobileStatValue, MobileStatLabel,
  MobileSectionTitle, MobileAccountCard, MobileAccountRow, MobileAccountLabel,
  MobileAccountValue, MobileActionsCol, MobileRefreshBtn, MobileLogoutBtn,
  // New — distinct teammate view
  TeammateHero, HeroTile, HeroTopo, HeroMonogram, HeroRoleMark,
  HeroHeaderRow, HeroIdentity, HeroName, HeroHandle, HeroTagRow,
  HeroTag, HeroBackBtn, HeroDivider, HeroStatsRow, HeroStat,
  HeroStatValue, HeroStatLabel, TeammateMeta, MetaBlock, MetaKey,
  MetaValue, TeammateActions, BackLinkBtn,
  // Team entry
  TeamEntry, TeamEntryAccent, TeamEntryBody, TeamEntryEyebrow,
  TeamEntryTitle, TeamEntryCaption, TeamEntryArrow,
} from './styled';

dayjs.locale('ru');

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

interface MemberStats {
  apartments: number;
  callbacks: number;
  viewings: number;
  done: number;
}

async function fetchMemberStats(userId: string): Promise<MemberStats> {
  try {
    const [allForMember] = await Promise.all([
      import('../../shared/api/client').then(({ apiClient }) =>
        apiClient
          .get<{ data: Array<{ status: string }>; meta: { total: number } }>(
            `/apartments`,
            { params: { assigneeId: userId, pageSize: 100 } },
          )
          .then((r) => ({
            total: r.data.meta?.total ?? 0,
            items: r.data.data ?? [],
          })),
      ),
    ]);
    const items = allForMember.items;
    return {
      apartments: allForMember.total,
      callbacks: items.filter((a) => a.status === 'CALLBACK').length,
      viewings: items.filter((a) => a.status === 'VIEWING').length,
      done: items.filter((a) => a.status === 'DONE').length,
    };
  } catch {
    return { apartments: 0, callbacks: 0, viewings: 0, done: 0 };
  }
}

export function ProfilePage() {
  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const { currentRoom } = useRoom();
  const { modal } = App.useApp();

  const targetId = params.id;
  const isSelf = !targetId || targetId === authUser?.id;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [apartmentsTotal, setApartmentsTotal] = useState(0);
  const [remindersTotal, setRemindersTotal] = useState(0);
  const [memberStats, setMemberStats] = useState<MemberStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMemberStats(null);
    setApartmentsTotal(0);
    setRemindersTotal(0);

    const load = async () => {
      try {
        if (isSelf) {
          const [meResponse, apartmentsResponse, remindersResponse] = await Promise.all([
            authApi.me(),
            flatApi.getList({ pageSize: 1 }),
            remindersApi.list({ status: 'PENDING' }),
          ]);
          if (cancelled) return;
          setUser(meResponse.data.data.user);
          setApartmentsTotal(apartmentsResponse.meta.total);
          setRemindersTotal(remindersResponse.data.meta.total);
        } else {
          const [userResponse, stats] = await Promise.all([
            usersApi.get(targetId!),
            fetchMemberStats(targetId!),
          ]);
          if (cancelled) return;
          setUser(userResponse.data.data);
          setMemberStats(stats);
          setApartmentsTotal(stats.apartments);
        }
      } catch {
        if (!cancelled) {
          message.error(
            isSelf ? 'Не удалось загрузить профиль' : 'Не удалось загрузить участника',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId, isSelf]);

  if (!isSelf) {
    return (
      <TeammateView
        user={user}
        loading={loading}
        stats={memberStats}
        onBack={() => navigate(-1)}
        onOpenTeam={() => navigate('/team')}
        currentRoomName={currentRoom?.name}
      />
    );
  }

  return (
    <SelfView
      user={user}
      loading={loading}
      apartmentsTotal={apartmentsTotal}
      remindersTotal={remindersTotal}
      onReload={async () => {
        setLoading(true);
        try {
          const [meResponse, apartmentsResponse, remindersResponse] = await Promise.all([
            authApi.me(),
            flatApi.getList({ pageSize: 1 }),
            remindersApi.list({ status: 'PENDING' }),
          ]);
          setUser(meResponse.data.data.user);
          setApartmentsTotal(apartmentsResponse.meta.total);
          setRemindersTotal(remindersResponse.data.meta.total);
        } catch {
          message.error('Не удалось загрузить профиль');
        } finally {
          setLoading(false);
        }
      }}
      onLogout={() => {
        modal.confirm({
          title: 'Выйти из аккаунта?',
          okText: 'Выйти',
          okButtonProps: { danger: true },
          cancelText: 'Отмена',
          onOk: () => logout(),
        });
      }}
      onOpenTeam={() => navigate('/team')}
    />
  );
}

// ─── Self view (unchanged layout, refactored out for clarity) ────────────────

interface SelfViewProps {
  user: User | null;
  loading: boolean;
  apartmentsTotal: number;
  remindersTotal: number;
  onReload: () => void | Promise<void>;
  onLogout: () => void;
  onOpenTeam: () => void;
}

function SelfView({ user, loading, apartmentsTotal, remindersTotal, onReload, onLogout, onOpenTeam }: SelfViewProps) {
  return (
    <>
      <DesktopOnly>
        <PageHeader>
          <PageTitle>Профиль</PageTitle>
          <Actions>
            <Button icon={<ReloadOutlined />} onClick={onReload} loading={loading}>
              Обновить
            </Button>
            <Button danger icon={<LogoutOutlined />} onClick={onLogout}>
              Выйти
            </Button>
          </Actions>
        </PageHeader>

        <Card>
          {loading || !user ? (
            <Skeleton active avatar paragraph={{ rows: 4 }} />
          ) : (
            <>
              <TopBlock>
                <AvatarWrap>
                  <Avatar
                    size={88}
                    icon={<UserOutlined />}
                    style={{
                      background: theme.gradients.primaryHero,
                      color: theme.colors.text.onPrimary,
                      fontSize: 36,
                      fontWeight: 700,
                      boxShadow: theme.shadows.primary,
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </AvatarWrap>
                <div>
                  <Name>{user.name}</Name>
                  <Role>{user.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}</Role>
                </div>
              </TopBlock>

              <Descriptions
                column={1}
                size="middle"
                colon={false}
                labelStyle={{ color: theme.colors.text.muted, width: 140, fontWeight: 600 }}
                contentStyle={{ color: theme.colors.text.primary, fontWeight: 500 }}
              >
                <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
                <Descriptions.Item label="Email">{user.email ?? '—'}</Descriptions.Item>
                <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
                <Descriptions.Item label="Создан">
                  {dayjs(user.createdAt).format('DD MMMM YYYY, HH:mm')}
                </Descriptions.Item>
              </Descriptions>

              <MetaRow>
                <MetaItem>
                  <MetaIcon><UserOutlined /></MetaIcon>
                  <MetaText>{user.name}</MetaText>
                </MetaItem>
                <MetaItem>
                  <MetaIcon><MailOutlined /></MetaIcon>
                  <MetaText>{user.email ?? 'email не указан'}</MetaText>
                </MetaItem>
                <MetaItem>
                  <MetaIcon><CalendarOutlined /></MetaIcon>
                  <MetaText>
                    с {dayjs(user.createdAt).format('DD.MM.YYYY')}
                  </MetaText>
                </MetaItem>
              </MetaRow>
            </>
          )}
        </Card>

        <TeamEntry type="button" onClick={onOpenTeam} aria-label="Открыть команду">
          <TeamEntryAccent aria-hidden />
          <TeamEntryBody>
            <TeamEntryEyebrow>Команда</TeamEntryEyebrow>
            <TeamEntryTitle>Моя команда</TeamEntryTitle>
            <TeamEntryCaption>
              Участники комнаты, их роли и активность за неделю
            </TeamEntryCaption>
          </TeamEntryBody>
          <TeamEntryArrow aria-hidden>→</TeamEntryArrow>
        </TeamEntry>
      </DesktopOnly>

      <MobileShell>
        <MobileTopBar>
          <MobileBrand>
            <MobileBrandLogo><HomeOutlined /></MobileBrandLogo>
            <div>
              <div>FlatFinder</div>
              <MobileBrandCaption>Совместный поиск</MobileBrandCaption>
            </div>
          </MobileBrand>
          <MobileBellBtn type="button" aria-label="Уведомления">
            <BellOutlined />
          </MobileBellBtn>
        </MobileTopBar>

        <MobileBody>
          {loading || !user ? (
            <Skeleton active avatar paragraph={{ rows: 4 }} />
          ) : (
            <>
              <MobileHeroCard>
                <MobileHeroAvatarWrap>
                  <Avatar
                    size={72}
                    style={{
                      background: 'rgba(255,255,255,0.22)',
                      color: '#fff',
                      fontSize: 26,
                      fontWeight: 800,
                      border: '2px solid rgba(255,255,255,0.5)',
                    }}
                  >
                    {initials(user.name)}
                  </Avatar>
                </MobileHeroAvatarWrap>
                <MobileHeroName>{user.name}</MobileHeroName>
                <MobileHeroRole>
                  {user.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
                </MobileHeroRole>
              </MobileHeroCard>

              <MobileStatsGrid>
                <MobileStatCard>
                  <MobileStatIcon $tone="coral"><HomeOutlined /></MobileStatIcon>
                  <div>
                    <MobileStatValue>{apartmentsTotal}</MobileStatValue>
                    <MobileStatLabel>Квартир</MobileStatLabel>
                  </div>
                </MobileStatCard>
                <MobileStatCard>
                  <MobileStatIcon $tone="sage"><BellOutlined /></MobileStatIcon>
                  <div>
                    <MobileStatValue>{remindersTotal}</MobileStatValue>
                    <MobileStatLabel>Напоминаний</MobileStatLabel>
                  </div>
                </MobileStatCard>
              </MobileStatsGrid>

              <MobileSectionTitle>Аккаунт</MobileSectionTitle>
              <MobileAccountCard>
                <MobileAccountRow>
                  <MobileAccountLabel><UserOutlined /> Логин</MobileAccountLabel>
                  <MobileAccountValue>{user.username}</MobileAccountValue>
                </MobileAccountRow>
                <MobileAccountRow>
                  <MobileAccountLabel><MailOutlined /> Email</MobileAccountLabel>
                  <MobileAccountValue>{user.email ?? '—'}</MobileAccountValue>
                </MobileAccountRow>
                <MobileAccountRow>
                  <MobileAccountLabel><IdcardOutlined /> ID</MobileAccountLabel>
                  <MobileAccountValue>{user.id}</MobileAccountValue>
                </MobileAccountRow>
                <MobileAccountRow>
                  <MobileAccountLabel><CalendarOutlined /> Создан</MobileAccountLabel>
                  <MobileAccountValue>{dayjs(user.createdAt).format('DD.MM.YYYY')}</MobileAccountValue>
                </MobileAccountRow>
              </MobileAccountCard>

              <MobileActionsCol>
                <MobileRefreshBtn type="button" onClick={onReload} disabled={loading}>
                  <ReloadOutlined /> Обновить
                </MobileRefreshBtn>
                <MobileRefreshBtn type="button" onClick={onOpenTeam}>
                  <TeamOutlined /> Моя команда
                </MobileRefreshBtn>
                <MobileLogoutBtn type="button" onClick={onLogout}>
                  <LogoutOutlined /> Выйти
                </MobileLogoutBtn>
              </MobileActionsCol>
            </>
          )}
        </MobileBody>
      </MobileShell>
    </>
  );
}

// ─── Teammate view ───────────────────────────────────────────────────────────

interface TeammateViewProps {
  user: User | null;
  loading: boolean;
  stats: MemberStats | null;
  onBack: () => void;
  onOpenTeam: () => void;
  currentRoomName?: string;
}

function TeammateView({ user, loading, stats, onBack, onOpenTeam, currentRoomName }: TeammateViewProps) {
  return (
    <>
      <DesktopOnly>
        <PageHeader>
          <PageTitle>Участник</PageTitle>
          <Actions>
            <BackLinkBtn type="button" onClick={onBack}>
              <ArrowLeftOutlined /> Назад
            </BackLinkBtn>
          </Actions>
        </PageHeader>

        {loading || !user ? (
          <Card>
            <Skeleton active avatar paragraph={{ rows: 4 }} />
          </Card>
        ) : (
          <>
            <TeammateHero>
              <HeroTopo aria-hidden />
              <HeroTile aria-hidden>
                <HeroMonogram>{initials(user.name)}</HeroMonogram>
                <HeroRoleMark $owner={user.role === 'ADMIN'}>
                  {user.role === 'ADMIN' ? <CrownOutlined /> : <UserOutlined />}
                </HeroRoleMark>
              </HeroTile>
              <HeroHeaderRow>
                <HeroIdentity>
                  <HeroName>{user.name}</HeroName>
                  <HeroHandle>@{user.username}</HeroHandle>
                  <HeroTagRow>
                    <HeroTag>
                      <IdcardOutlined /> ID&nbsp;
                      <span style={{ fontFamily: theme.fonts.mono }}>{user.id.slice(0, 8)}</span>
                    </HeroTag>
                    {currentRoomName && (
                      <HeroTag $accent>
                        <HomeOutlined /> {currentRoomName}
                      </HeroTag>
                    )}
                  </HeroTagRow>
                </HeroIdentity>
              </HeroHeaderRow>
              <HeroDivider />
              <HeroStatsRow>
                <HeroStat>
                  <HeroStatValue>{stats?.apartments ?? '—'}</HeroStatValue>
                  <HeroStatLabel>объектов</HeroStatLabel>
                </HeroStat>
                <HeroStat>
                  <HeroStatValue>{stats?.callbacks ?? '—'}</HeroStatValue>
                  <HeroStatLabel>перезвонов</HeroStatLabel>
                </HeroStat>
                <HeroStat>
                  <HeroStatValue>{stats?.viewings ?? '—'}</HeroStatValue>
                  <HeroStatLabel>просмотров</HeroStatLabel>
                </HeroStat>
                <HeroStat>
                  <HeroStatValue>{stats?.done ?? '—'}</HeroStatValue>
                  <HeroStatLabel>завершено</HeroStatLabel>
                </HeroStat>
              </HeroStatsRow>
            </TeammateHero>

            <Card style={{ marginTop: 20 }}>
              <TeammateMeta>
                <MetaBlock>
                  <MetaKey><MailOutlined /> Email</MetaKey>
                  <MetaValue>{user.email ?? 'не указан'}</MetaValue>
                </MetaBlock>
                <MetaBlock>
                  <MetaKey><UserOutlined /> Имя</MetaKey>
                  <MetaValue>{user.name}</MetaValue>
                </MetaBlock>
                <MetaBlock>
                  <MetaKey><CalendarOutlined /> С нами с</MetaKey>
                  <MetaValue>{dayjs(user.createdAt).format('DD MMMM YYYY')}</MetaValue>
                </MetaBlock>
                <MetaBlock>
                  <MetaKey><IdcardOutlined /> Полный ID</MetaKey>
                  <MetaValue $mono>{user.id}</MetaValue>
                </MetaBlock>
              </TeammateMeta>
            </Card>

            <TeammateActions>
              <Button type="primary" icon={<TeamOutlined />} onClick={onOpenTeam}>
                Открыть команду
              </Button>
            </TeammateActions>
          </>
        )}
      </DesktopOnly>

      <MobileShell>
        <MobileTopBar>
          <MobileBrand>
            <MobileBrandLogo><HomeOutlined /></MobileBrandLogo>
            <div>
              <div>FlatFinder</div>
              <MobileBrandCaption>Участник</MobileBrandCaption>
            </div>
          </MobileBrand>
          <HeroBackBtn type="button" onClick={onBack} aria-label="Назад">
            <ArrowLeftOutlined />
          </HeroBackBtn>
        </MobileTopBar>

        <MobileBody>
          {loading || !user ? (
            <Skeleton active avatar paragraph={{ rows: 4 }} />
          ) : (
            <>
              <MobileHeroCard>
                <MobileHeroAvatarWrap>
                  <Avatar
                    size={72}
                    style={{
                      background: 'rgba(255,255,255,0.22)',
                      color: '#fff',
                      fontSize: 26,
                      fontWeight: 800,
                      border: '2px solid rgba(255,255,255,0.5)',
                    }}
                  >
                    {initials(user.name)}
                  </Avatar>
                </MobileHeroAvatarWrap>
                <MobileHeroName>{user.name}</MobileHeroName>
                <MobileHeroRole>@{user.username}</MobileHeroRole>
              </MobileHeroCard>

              <MobileStatsGrid>
                <MobileStatCard>
                  <MobileStatIcon $tone="coral"><HomeOutlined /></MobileStatIcon>
                  <div>
                    <MobileStatValue>{stats?.apartments ?? '—'}</MobileStatValue>
                    <MobileStatLabel>Квартир</MobileStatLabel>
                  </div>
                </MobileStatCard>
                <MobileStatCard>
                  <MobileStatIcon $tone="sage"><BellOutlined /></MobileStatIcon>
                  <div>
                    <MobileStatValue>{(stats?.callbacks ?? 0) + (stats?.viewings ?? 0)}</MobileStatValue>
                    <MobileStatLabel>В работе</MobileStatLabel>
                  </div>
                </MobileStatCard>
              </MobileStatsGrid>

              <MobileSectionTitle>Аккаунт</MobileSectionTitle>
              <MobileAccountCard>
                <MobileAccountRow>
                  <MobileAccountLabel><UserOutlined /> Логин</MobileAccountLabel>
                  <MobileAccountValue>{user.username}</MobileAccountValue>
                </MobileAccountRow>
                <MobileAccountRow>
                  <MobileAccountLabel><MailOutlined /> Email</MobileAccountLabel>
                  <MobileAccountValue>{user.email ?? '—'}</MobileAccountValue>
                </MobileAccountRow>
                <MobileAccountRow>
                  <MobileAccountLabel><IdcardOutlined /> ID</MobileAccountLabel>
                  <MobileAccountValue>{user.id}</MobileAccountValue>
                </MobileAccountRow>
                <MobileAccountRow>
                  <MobileAccountLabel><CalendarOutlined /> С нами с</MobileAccountLabel>
                  <MobileAccountValue>{dayjs(user.createdAt).format('DD.MM.YYYY')}</MobileAccountValue>
                </MobileAccountRow>
              </MobileAccountCard>

              <MobileActionsCol>
                <MobileRefreshBtn type="button" onClick={onOpenTeam}>
                  <TeamOutlined /> Открыть команду
                </MobileRefreshBtn>
              </MobileActionsCol>
            </>
          )}
        </MobileBody>
      </MobileShell>
    </>
  );
}