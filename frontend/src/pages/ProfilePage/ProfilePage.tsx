import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, Button, Skeleton, message, App } from 'antd';
import {
  UserOutlined, MailOutlined, CalendarOutlined,
  LogoutOutlined, ReloadOutlined, HomeOutlined, BellOutlined,
  IdcardOutlined, CrownOutlined, TeamOutlined,
  ArrowLeftOutlined, CopyOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { authApi, remindersApi, usersApi } from '../../shared/api/endpoints';
import type { User } from '../../shared/api/types';
import { flatApi } from '../../entities/Flat/utils/api';
import { useAuth } from '../../app/providers/AuthProvider';
import { useRoom } from '../../app/providers/RoomProvider';
import {
  PageHeader, PageTitle, PageEyebrow, PageLead,
  Actions,
  SelfShell, SelfHero, SelfHeroRow, SelfHeroLeft,
  SelfAvatarTile, SelfIdentity, SelfLabel, SelfName, SelfHandle,
  SelfHeroActions, SelfMetaRow, SelfMetaPill,
  SelfAccountCard, SelfAccountList, SelfAccountRow,
  SelfAccountLabel, SelfAccountValue, SelfAccountCopy,
  DangerZone, DangerLabel,
  DesktopOnly,
  MobileShell, MobileTopBar, MobileBrand, MobileBrandLogo,
  MobileBrandCaption, MobileBellBtn, MobileBody, MobileHeroCard,
  MobileHeroAvatarWrap, MobileHeroName, MobileHeroRole,
  MobileStatsGrid, MobileStatCard,
  MobileStatValue, MobileStatLabel,
  MobileSectionTitle, MobileAccountCard, MobileAccountRow, MobileAccountLabel,
  MobileAccountValue, MobileActionsCol, MobileRefreshBtn, MobileLogoutBtn,
  TeammateHero, HeroTile, HeroTopo, HeroMonogram, HeroRoleMark,
  HeroHeaderRow, HeroIdentity, HeroName, HeroHandle, HeroTagRow,
  HeroTag, HeroBackBtn, HeroDivider, HeroStatsRow, HeroStat,
  HeroStatValue, HeroStatLabel, TeammateMeta, MetaBlock, MetaKey,
  MetaValue, TeammateActions, BackLinkBtn,
  TeamEntry, TeamEntryAccent, TeamEntryBody, TeamEntryEyebrow,
  TeamEntryTitle, TeamEntryCaption, TeamEntryArrow,
} from './styled';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function avatarTone(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 17) | 0;
  return Math.abs(h % 4);
}

function daysSince(iso: string): number {
  const d = new Date(iso);
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - d.getTime()) / 86_400_000));
}

interface MemberStats {
  apartments: number;
  callbacks: number;
  viewings: number;
  done: number;
}

async function fetchMemberStats(userId: string): Promise<MemberStats> {
  try {
    const { apiClient } = await import('../../shared/api/client');
    const allForMember = await apiClient
      .get<{ data: Array<{ status: string }>; meta: { total: number } }>(
        `/apartments`,
        { params: { assigneeId: userId, pageSize: 100 } },
      )
      .then((r) => ({
        total: r.data.meta?.total ?? 0,
        items: r.data.data ?? [],
      }));
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

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    message.success('Скопировано');
    return true;
  } catch {
    message.error('Не удалось скопировать');
    return false;
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

  const handleReload = async () => {
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
  };

  const handleLogout = () => {
    modal.confirm({
      title: 'Выйти из аккаунта?',
      content: 'Текущая сессия завершится, и нужно будет войти снова.',
      okText: 'Выйти',
      okButtonProps: { danger: true },
      cancelText: 'Отмена',
      onOk: () => logout(),
    });
  };

  return (
    <SelfView
      user={user}
      loading={loading}
      apartmentsTotal={apartmentsTotal}
      remindersTotal={remindersTotal}
      onReload={handleReload}
      onLogout={handleLogout}
      onOpenTeam={() => navigate('/team')}
    />
  );
}

// ─── Self view ────────────────────────────────────────────────────────────────

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
        <SelfShell
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {loading || !user ? (
            <Skeleton active avatar paragraph={{ rows: 5 }} />
          ) : (
            <>
              <SelfHero>
                <SelfHeroRow>
                  <SelfHeroLeft>
                    <SelfAvatarTile $tone={avatarTone(user.id)}>
                      {initials(user.name)}
                    </SelfAvatarTile>
                    <SelfIdentity>
                      <SelfLabel>{user.role === 'ADMIN' ? 'Администратор' : 'Профиль'}</SelfLabel>
                      <SelfName>{user.name}</SelfName>
                      <SelfHandle>@{user.username}</SelfHandle>
                    </SelfIdentity>
                  </SelfHeroLeft>
                  <SelfHeroActions>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={onReload}
                      loading={loading}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        borderColor: 'rgba(255,255,255,0.18)',
                        color: '#fff8f5',
                        fontWeight: 700,
                      }}
                    >
                      Обновить
                    </Button>
                    <Button
                      danger
                      icon={<LogoutOutlined />}
                      onClick={onLogout}
                      style={{ fontWeight: 700 }}
                    >
                      Выйти
                    </Button>
                  </SelfHeroActions>
                </SelfHeroRow>

                <SelfMetaRow>
                  <SelfMetaPill>
                    <span className="value">{apartmentsTotal}</span>
                    <span className="label">квартир</span>
                  </SelfMetaPill>
                  <SelfMetaPill>
                    <span className="value">{remindersTotal}</span>
                    <span className="label">напоминаний</span>
                  </SelfMetaPill>
                  <SelfMetaPill>
                    <span className="value">{daysSince(user.createdAt)}</span>
                    <span className="label">дней в команде</span>
                  </SelfMetaPill>
                  <SelfMetaPill>
                    <span className="value">{user.role === 'ADMIN' ? 'A' : 'U'}</span>
                    <span className="label">{user.role === 'ADMIN' ? 'администратор' : 'пользователь'}</span>
                  </SelfMetaPill>
                </SelfMetaRow>
              </SelfHero>

              <PageHeader>
                <div>
                  <PageEyebrow>Аккаунт</PageEyebrow>
                  <PageTitle>Детали</PageTitle>
                  <PageLead>
                    Всё, что мы храним о вас. ID нужен для поддержки, остальное — для удобства.
                  </PageLead>
                </div>
              </PageHeader>

              <SelfAccountCard>
                <SelfAccountList>
                  <SelfAccountRow>
                    <SelfAccountLabel><UserOutlined /> Имя</SelfAccountLabel>
                    <SelfAccountValue>{user.name}</SelfAccountValue>
                    <SelfAccountCopy type="button" onClick={() => { void copyText(user.name); }}>
                      <CopyOutlined /> Копировать
                    </SelfAccountCopy>
                  </SelfAccountRow>
                  <SelfAccountRow>
                    <SelfAccountLabel><IdcardOutlined /> Username</SelfAccountLabel>
                    <SelfAccountValue $mono>{user.username}</SelfAccountValue>
                    <SelfAccountCopy type="button" onClick={() => { void copyText(user.username); }}>
                      <CopyOutlined /> Копировать
                    </SelfAccountCopy>
                  </SelfAccountRow>
                  <SelfAccountRow>
                    <SelfAccountLabel><MailOutlined /> Email</SelfAccountLabel>
                    <SelfAccountValue>{user.email ?? 'не указан'}</SelfAccountValue>
                    {user.email && (
                      <SelfAccountCopy type="button" onClick={() => { void copyText(user.email!); }}>
                        <CopyOutlined /> Копировать
                      </SelfAccountCopy>
                    )}
                  </SelfAccountRow>
                  <SelfAccountRow>
                    <SelfAccountLabel><CalendarOutlined /> С нами с</SelfAccountLabel>
                    <SelfAccountValue>
                      {dayjs(user.createdAt).format('DD MMMM YYYY')} · {daysSince(user.createdAt)} дней
                    </SelfAccountValue>
                  </SelfAccountRow>
                  <SelfAccountRow>
                    <SelfAccountLabel><IdcardOutlined /> User ID</SelfAccountLabel>
                    <SelfAccountValue $mono>{user.id}</SelfAccountValue>
                    <SelfAccountCopy type="button" onClick={() => { void copyText(user.id); }}>
                      <CopyOutlined /> Копировать
                    </SelfAccountCopy>
                  </SelfAccountRow>
                </SelfAccountList>
              </SelfAccountCard>

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

              <DangerZone>
                <DangerLabel>
                  <span className="title">Завершить сессию</span>
                  <span className="hint">Выйдите, если работаете с чужого устройства. Токен очистится из браузера.</span>
                </DangerLabel>
                <Button danger icon={<LogoutOutlined />} onClick={onLogout}>
                  Выйти из аккаунта
                </Button>
              </DangerZone>
            </>
          )}
        </SelfShell>
      </DesktopOnly>

      <MobileShell>
        <MobileTopBar>
          <MobileBrand>
            <MobileBrandLogo><HomeOutlined /></MobileBrandLogo>
            <div>
              <div>FlatFinder</div>
              <MobileBrandCaption>Мой профиль</MobileBrandCaption>
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
                    size={64}
                    style={{
                      background: 'rgba(255,255,255,0.22)',
                      color: '#fff',
                      fontSize: 22,
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
                  <MobileStatValue>{apartmentsTotal}</MobileStatValue>
                  <MobileStatLabel>Квартир</MobileStatLabel>
                </MobileStatCard>
                <MobileStatCard>
                  <MobileStatValue>{remindersTotal}</MobileStatValue>
                  <MobileStatLabel>Напоминаний</MobileStatLabel>
                </MobileStatCard>
                <MobileStatCard>
                  <MobileStatValue>{daysSince(user.createdAt)}</MobileStatValue>
                  <MobileStatLabel>Дней с нами</MobileStatLabel>
                </MobileStatCard>
              </MobileStatsGrid>

              <MobileSectionTitle>Аккаунт</MobileSectionTitle>
              <MobileAccountCard>
                <MobileAccountRow>
                  <MobileAccountLabel><UserOutlined /> Имя</MobileAccountLabel>
                  <MobileAccountValue>{user.name}</MobileAccountValue>
                </MobileAccountRow>
                <MobileAccountRow>
                  <MobileAccountLabel><IdcardOutlined /> Логин</MobileAccountLabel>
                  <MobileAccountValue $mono>{user.username}</MobileAccountValue>
                </MobileAccountRow>
                <MobileAccountRow>
                  <MobileAccountLabel><MailOutlined /> Email</MobileAccountLabel>
                  <MobileAccountValue>{user.email ?? '—'}</MobileAccountValue>
                </MobileAccountRow>
                <MobileAccountRow>
                  <MobileAccountLabel><CalendarOutlined /> С нами с</MobileAccountLabel>
                  <MobileAccountValue>{dayjs(user.createdAt).format('DD.MM.YYYY')}</MobileAccountValue>
                </MobileAccountRow>
                <MobileAccountRow>
                  <MobileAccountLabel><IdcardOutlined /> ID</MobileAccountLabel>
                  <MobileAccountValue $mono>{user.id}</MobileAccountValue>
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
          <div>
            <PageEyebrow>Участник</PageEyebrow>
            <PageTitle>Карточка</PageTitle>
          </div>
          <Actions>
            <BackLinkBtn type="button" onClick={onBack}>
              <ArrowLeftOutlined /> Назад
            </BackLinkBtn>
          </Actions>
        </PageHeader>

        {loading || !user ? (
          <Skeleton active avatar paragraph={{ rows: 4 }} />
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
                      <span style={{ fontFamily: themeMono() }}>{user.id.slice(0, 8)}</span>
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

            <PageHeader style={{ marginTop: 24 }}>
              <div>
                <PageEyebrow>Аккаунт</PageEyebrow>
                <PageTitle>Детали</PageTitle>
              </div>
            </PageHeader>

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
                    size={64}
                    style={{
                      background: 'rgba(255,255,255,0.22)',
                      color: '#fff',
                      fontSize: 22,
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
                  <MobileStatValue>{stats?.apartments ?? '—'}</MobileStatValue>
                  <MobileStatLabel>Квартир</MobileStatLabel>
                </MobileStatCard>
                <MobileStatCard>
                  <MobileStatValue>{(stats?.callbacks ?? 0) + (stats?.viewings ?? 0)}</MobileStatValue>
                  <MobileStatLabel>В работе</MobileStatLabel>
                </MobileStatCard>
                <MobileStatCard>
                  <MobileStatValue>{stats?.done ?? '—'}</MobileStatValue>
                  <MobileStatLabel>Завершено</MobileStatLabel>
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
                  <MobileAccountValue $mono>{user.id}</MobileAccountValue>
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

// Tiny helper — inline mono font reference inside JSX without re-importing the whole theme.
function themeMono(): string {
  return "'JetBrains Mono', 'Fira Code', monospace";
}