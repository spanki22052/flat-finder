import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, Button, Skeleton, App } from 'antd';
import {
  UserOutlined, MailOutlined, CalendarOutlined,
  LogoutOutlined, ReloadOutlined, HomeOutlined, BellOutlined,
  IdcardOutlined, CrownOutlined, TeamOutlined,
  ArrowLeftOutlined, CopyOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '@/app/providers/AuthProvider';
import { useRoom } from '@/app/providers/RoomProvider';
import { useProfilePage } from '../hooks/useProfilePage';
import { initials, avatarTone, daysSince, themeMono, copyText } from '../lib/utils';
import type { SelfViewProps, TeammateViewProps } from '../model/types';
import * as Styled from './ProfilePage.styled';

function SelfView({ user, loading, apartmentsTotal, remindersTotal, onReload, onLogout, onOpenTeam }: SelfViewProps) {
  return (
    <>
      <Styled.DesktopOnly>
        <Styled.SelfShell
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {loading || !user ? (
            <Skeleton active avatar paragraph={{ rows: 5 }} />
          ) : (
            <>
              <Styled.SelfHero>
                <Styled.SelfHeroRow>
                  <Styled.SelfHeroLeft>
                    <Styled.SelfAvatarTile $tone={avatarTone(user.id)}>
                      {initials(user.name)}
                    </Styled.SelfAvatarTile>
                    <Styled.SelfIdentity>
                      <Styled.SelfLabel>{user.role === 'ADMIN' ? 'Администратор' : 'Профиль'}</Styled.SelfLabel>
                      <Styled.SelfName>{user.name}</Styled.SelfName>
                      <Styled.SelfHandle>@{user.username}</Styled.SelfHandle>
                    </Styled.SelfIdentity>
                  </Styled.SelfHeroLeft>
                  <Styled.SelfHeroActions>
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
                  </Styled.SelfHeroActions>
                </Styled.SelfHeroRow>

                <Styled.SelfMetaRow>
                  <Styled.SelfMetaPill>
                    <span className="value">{apartmentsTotal}</span>
                    <span className="label">квартир</span>
                  </Styled.SelfMetaPill>
                  <Styled.SelfMetaPill>
                    <span className="value">{remindersTotal}</span>
                    <span className="label">напоминаний</span>
                  </Styled.SelfMetaPill>
                  <Styled.SelfMetaPill>
                    <span className="value">{daysSince(user.createdAt)}</span>
                    <span className="label">дней в команде</span>
                  </Styled.SelfMetaPill>
                  <Styled.SelfMetaPill>
                    <span className="value">{user.role === 'ADMIN' ? 'A' : 'U'}</span>
                    <span className="label">{user.role === 'ADMIN' ? 'администратор' : 'пользователь'}</span>
                  </Styled.SelfMetaPill>
                </Styled.SelfMetaRow>
              </Styled.SelfHero>

              <Styled.PageHeader>
                <div>
                  <Styled.PageEyebrow>Аккаунт</Styled.PageEyebrow>
                  <Styled.PageTitle>Детали</Styled.PageTitle>
                  <Styled.PageLead>
                    Всё, что мы храним о вас. ID нужен для поддержки, остальное — для удобства.
                  </Styled.PageLead>
                </div>
              </Styled.PageHeader>

              <Styled.SelfAccountCard>
                <Styled.SelfAccountList>
                  <Styled.SelfAccountRow>
                    <Styled.SelfAccountLabel><UserOutlined /> Имя</Styled.SelfAccountLabel>
                    <Styled.SelfAccountValue>{user.name}</Styled.SelfAccountValue>
                    <Styled.SelfAccountCopy type="button" onClick={() => { void copyText(user.name); }}>
                      <CopyOutlined /> Копировать
                    </Styled.SelfAccountCopy>
                  </Styled.SelfAccountRow>
                  <Styled.SelfAccountRow>
                    <Styled.SelfAccountLabel><IdcardOutlined /> Username</Styled.SelfAccountLabel>
                    <Styled.SelfAccountValue $mono>{user.username}</Styled.SelfAccountValue>
                    <Styled.SelfAccountCopy type="button" onClick={() => { void copyText(user.username); }}>
                      <CopyOutlined /> Копировать
                    </Styled.SelfAccountCopy>
                  </Styled.SelfAccountRow>
                  <Styled.SelfAccountRow>
                    <Styled.SelfAccountLabel><MailOutlined /> Email</Styled.SelfAccountLabel>
                    <Styled.SelfAccountValue>{user.email ?? 'не указан'}</Styled.SelfAccountValue>
                    {user.email && (
                      <Styled.SelfAccountCopy type="button" onClick={() => { void copyText(user.email!); }}>
                        <CopyOutlined /> Копировать
                      </Styled.SelfAccountCopy>
                    )}
                  </Styled.SelfAccountRow>
                  <Styled.SelfAccountRow>
                    <Styled.SelfAccountLabel><CalendarOutlined /> С нами с</Styled.SelfAccountLabel>
                    <Styled.SelfAccountValue>
                      {dayjs(user.createdAt).format('DD MMMM YYYY')} · {daysSince(user.createdAt)} дней
                    </Styled.SelfAccountValue>
                  </Styled.SelfAccountRow>
                  <Styled.SelfAccountRow>
                    <Styled.SelfAccountLabel><IdcardOutlined /> User ID</Styled.SelfAccountLabel>
                    <Styled.SelfAccountValue $mono>{user.id}</Styled.SelfAccountValue>
                    <Styled.SelfAccountCopy type="button" onClick={() => { void copyText(user.id); }}>
                      <CopyOutlined /> Копировать
                    </Styled.SelfAccountCopy>
                  </Styled.SelfAccountRow>
                </Styled.SelfAccountList>
              </Styled.SelfAccountCard>

              <Styled.TeamEntry type="button" onClick={onOpenTeam} aria-label="Открыть команду">
                <Styled.TeamEntryAccent aria-hidden />
                <Styled.TeamEntryBody>
                  <Styled.TeamEntryEyebrow>Команда</Styled.TeamEntryEyebrow>
                  <Styled.TeamEntryTitle>Моя команда</Styled.TeamEntryTitle>
                  <Styled.TeamEntryCaption>
                    Участники комнаты, их роли и активность за неделю
                  </Styled.TeamEntryCaption>
                </Styled.TeamEntryBody>
                <Styled.TeamEntryArrow aria-hidden>→</Styled.TeamEntryArrow>
              </Styled.TeamEntry>

              <Styled.DangerZone>
                <Styled.DangerLabel>
                  <span className="title">Завершить сессию</span>
                  <span className="hint">Выйдите, если работаете с чужого устройства. Токен очистится из браузера.</span>
                </Styled.DangerLabel>
                <Button danger icon={<LogoutOutlined />} onClick={onLogout}>
                  Выйти из аккаунта
                </Button>
              </Styled.DangerZone>
            </>
          )}
        </Styled.SelfShell>
      </Styled.DesktopOnly>

      <Styled.MobileShell>
        <Styled.MobileTopBar>
          <Styled.MobileBrand>
            <Styled.MobileBrandLogo><HomeOutlined /></Styled.MobileBrandLogo>
            <div>
              <div>FlatFinder</div>
              <Styled.MobileBrandCaption>Мой профиль</Styled.MobileBrandCaption>
            </div>
          </Styled.MobileBrand>
          <Styled.MobileBellBtn type="button" aria-label="Уведомления">
            <BellOutlined />
          </Styled.MobileBellBtn>
        </Styled.MobileTopBar>

        <Styled.MobileBody>
          {loading || !user ? (
            <Skeleton active avatar paragraph={{ rows: 4 }} />
          ) : (
            <>
              <Styled.MobileHeroCard>
                <Styled.MobileHeroAvatarWrap>
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
                </Styled.MobileHeroAvatarWrap>
                <Styled.MobileHeroName>{user.name}</Styled.MobileHeroName>
                <Styled.MobileHeroRole>@{user.username}</Styled.MobileHeroRole>
              </Styled.MobileHeroCard>

              <Styled.MobileStatsGrid>
                <Styled.MobileStatCard>
                  <Styled.MobileStatValue>{apartmentsTotal}</Styled.MobileStatValue>
                  <Styled.MobileStatLabel>Квартир</Styled.MobileStatLabel>
                </Styled.MobileStatCard>
                <Styled.MobileStatCard>
                  <Styled.MobileStatValue>{remindersTotal}</Styled.MobileStatValue>
                  <Styled.MobileStatLabel>Напоминаний</Styled.MobileStatLabel>
                </Styled.MobileStatCard>
                <Styled.MobileStatCard>
                  <Styled.MobileStatValue>{daysSince(user.createdAt)}</Styled.MobileStatValue>
                  <Styled.MobileStatLabel>Дней с нами</Styled.MobileStatLabel>
                </Styled.MobileStatCard>
              </Styled.MobileStatsGrid>

              <Styled.MobileSectionTitle>Аккаунт</Styled.MobileSectionTitle>
              <Styled.MobileAccountCard>
                <Styled.MobileAccountRow>
                  <Styled.MobileAccountLabel><UserOutlined /> Имя</Styled.MobileAccountLabel>
                  <Styled.MobileAccountValue>{user.name}</Styled.MobileAccountValue>
                </Styled.MobileAccountRow>
                <Styled.MobileAccountRow>
                  <Styled.MobileAccountLabel><IdcardOutlined /> Логин</Styled.MobileAccountLabel>
                  <Styled.MobileAccountValue $mono>{user.username}</Styled.MobileAccountValue>
                </Styled.MobileAccountRow>
                <Styled.MobileAccountRow>
                  <Styled.MobileAccountLabel><MailOutlined /> Email</Styled.MobileAccountLabel>
                  <Styled.MobileAccountValue>{user.email ?? '—'}</Styled.MobileAccountValue>
                </Styled.MobileAccountRow>
                <Styled.MobileAccountRow>
                  <Styled.MobileAccountLabel><CalendarOutlined /> С нами с</Styled.MobileAccountLabel>
                  <Styled.MobileAccountValue>{dayjs(user.createdAt).format('DD.MM.YYYY')}</Styled.MobileAccountValue>
                </Styled.MobileAccountRow>
                <Styled.MobileAccountRow>
                  <Styled.MobileAccountLabel><IdcardOutlined /> ID</Styled.MobileAccountLabel>
                  <Styled.MobileAccountValue $mono>{user.id}</Styled.MobileAccountValue>
                </Styled.MobileAccountRow>
              </Styled.MobileAccountCard>

              <Styled.MobileActionsCol>
                <Styled.MobileRefreshBtn type="button" onClick={onReload} disabled={loading}>
                  <ReloadOutlined /> Обновить
                </Styled.MobileRefreshBtn>
                <Styled.MobileRefreshBtn type="button" onClick={onOpenTeam}>
                  <TeamOutlined /> Моя команда
                </Styled.MobileRefreshBtn>
                <Styled.MobileLogoutBtn type="button" onClick={onLogout}>
                  <LogoutOutlined /> Выйти
                </Styled.MobileLogoutBtn>
              </Styled.MobileActionsCol>
            </>
          )}
        </Styled.MobileBody>
      </Styled.MobileShell>
    </>
  );
}

// ─── Teammate view ───────────────────────────────────────────────────────────

function TeammateView({ user, loading, stats, onBack, onOpenTeam, currentRoomName }: TeammateViewProps) {
  return (
    <>
      <Styled.DesktopOnly>
        <Styled.PageHeader>
          <div>
            <Styled.PageEyebrow>Участник</Styled.PageEyebrow>
            <Styled.PageTitle>Карточка</Styled.PageTitle>
          </div>
          <Styled.Actions>
            <Styled.BackLinkBtn type="button" onClick={onBack}>
              <ArrowLeftOutlined /> Назад
            </Styled.BackLinkBtn>
          </Styled.Actions>
        </Styled.PageHeader>

        {loading || !user ? (
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        ) : (
          <>
            <Styled.TeammateHero>
              <Styled.HeroTopo aria-hidden />
              <Styled.HeroTile aria-hidden>
                <Styled.HeroMonogram>{initials(user.name)}</Styled.HeroMonogram>
                <Styled.HeroRoleMark $owner={user.role === 'ADMIN'}>
                  {user.role === 'ADMIN' ? <CrownOutlined /> : <UserOutlined />}
                </Styled.HeroRoleMark>
              </Styled.HeroTile>
              <Styled.HeroHeaderRow>
                <Styled.HeroIdentity>
                  <Styled.HeroName>{user.name}</Styled.HeroName>
                  <Styled.HeroHandle>@{user.username}</Styled.HeroHandle>
                  <Styled.HeroTagRow>
                    <Styled.HeroTag>
                      <IdcardOutlined /> ID&nbsp;
                      <span style={{ fontFamily: themeMono() }}>{user.id.slice(0, 8)}</span>
                    </Styled.HeroTag>
                    {currentRoomName && (
                      <Styled.HeroTag $accent>
                        <HomeOutlined /> {currentRoomName}
                      </Styled.HeroTag>
                    )}
                  </Styled.HeroTagRow>
                </Styled.HeroIdentity>
              </Styled.HeroHeaderRow>
              <Styled.HeroDivider />
              <Styled.HeroStatsRow>
                <Styled.HeroStat>
                  <Styled.HeroStatValue>{stats?.apartments ?? '—'}</Styled.HeroStatValue>
                  <Styled.HeroStatLabel>объектов</Styled.HeroStatLabel>
                </Styled.HeroStat>
                <Styled.HeroStat>
                  <Styled.HeroStatValue>{stats?.callbacks ?? '—'}</Styled.HeroStatValue>
                  <Styled.HeroStatLabel>перезвонов</Styled.HeroStatLabel>
                </Styled.HeroStat>
                <Styled.HeroStat>
                  <Styled.HeroStatValue>{stats?.viewings ?? '—'}</Styled.HeroStatValue>
                  <Styled.HeroStatLabel>просмотров</Styled.HeroStatLabel>
                </Styled.HeroStat>
                <Styled.HeroStat>
                  <Styled.HeroStatValue>{stats?.done ?? '—'}</Styled.HeroStatValue>
                  <Styled.HeroStatLabel>завершено</Styled.HeroStatLabel>
                </Styled.HeroStat>
              </Styled.HeroStatsRow>
            </Styled.TeammateHero>

            <Styled.PageHeader style={{ marginTop: 24 }}>
              <div>
                <Styled.PageEyebrow>Аккаунт</Styled.PageEyebrow>
                <Styled.PageTitle>Детали</Styled.PageTitle>
              </div>
            </Styled.PageHeader>

            <Styled.TeammateMeta>
              <Styled.MetaBlock>
                <Styled.MetaKey><MailOutlined /> Email</Styled.MetaKey>
                <Styled.MetaValue>{user.email ?? 'не указан'}</Styled.MetaValue>
              </Styled.MetaBlock>
              <Styled.MetaBlock>
                <Styled.MetaKey><UserOutlined /> Имя</Styled.MetaKey>
                <Styled.MetaValue>{user.name}</Styled.MetaValue>
              </Styled.MetaBlock>
              <Styled.MetaBlock>
                <Styled.MetaKey><CalendarOutlined /> С нами с</Styled.MetaKey>
                <Styled.MetaValue>{dayjs(user.createdAt).format('DD MMMM YYYY')}</Styled.MetaValue>
              </Styled.MetaBlock>
              <Styled.MetaBlock>
                <Styled.MetaKey><IdcardOutlined /> Полный ID</Styled.MetaKey>
                <Styled.MetaValue $mono>{user.id}</Styled.MetaValue>
              </Styled.MetaBlock>
            </Styled.TeammateMeta>

            <Styled.TeammateActions>
              <Button type="primary" icon={<TeamOutlined />} onClick={onOpenTeam}>
                Открыть команду
              </Button>
            </Styled.TeammateActions>
          </>
        )}
      </Styled.DesktopOnly>

      <Styled.MobileShell>
        <Styled.MobileTopBar>
          <Styled.MobileBrand>
            <Styled.MobileBrandLogo><HomeOutlined /></Styled.MobileBrandLogo>
            <div>
              <div>FlatFinder</div>
              <Styled.MobileBrandCaption>Участник</Styled.MobileBrandCaption>
            </div>
          </Styled.MobileBrand>
          <Styled.HeroBackBtn type="button" onClick={onBack} aria-label="Назад">
            <ArrowLeftOutlined />
          </Styled.HeroBackBtn>
        </Styled.MobileTopBar>

        <Styled.MobileBody>
          {loading || !user ? (
            <Skeleton active avatar paragraph={{ rows: 4 }} />
          ) : (
            <>
              <Styled.MobileHeroCard>
                <Styled.MobileHeroAvatarWrap>
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
                </Styled.MobileHeroAvatarWrap>
                <Styled.MobileHeroName>{user.name}</Styled.MobileHeroName>
                <Styled.MobileHeroRole>@{user.username}</Styled.MobileHeroRole>
              </Styled.MobileHeroCard>

              <Styled.MobileStatsGrid>
                <Styled.MobileStatCard>
                  <Styled.MobileStatValue>{stats?.apartments ?? '—'}</Styled.MobileStatValue>
                  <Styled.MobileStatLabel>Квартир</Styled.MobileStatLabel>
                </Styled.MobileStatCard>
                <Styled.MobileStatCard>
                  <Styled.MobileStatValue>{(stats?.callbacks ?? 0) + (stats?.viewings ?? 0)}</Styled.MobileStatValue>
                  <Styled.MobileStatLabel>В работе</Styled.MobileStatLabel>
                </Styled.MobileStatCard>
                <Styled.MobileStatCard>
                  <Styled.MobileStatValue>{stats?.done ?? '—'}</Styled.MobileStatValue>
                  <Styled.MobileStatLabel>Завершено</Styled.MobileStatLabel>
                </Styled.MobileStatCard>
              </Styled.MobileStatsGrid>

              <Styled.MobileSectionTitle>Аккаунт</Styled.MobileSectionTitle>
              <Styled.MobileAccountCard>
                <Styled.MobileAccountRow>
                  <Styled.MobileAccountLabel><UserOutlined /> Логин</Styled.MobileAccountLabel>
                  <Styled.MobileAccountValue>{user.username}</Styled.MobileAccountValue>
                </Styled.MobileAccountRow>
                <Styled.MobileAccountRow>
                  <Styled.MobileAccountLabel><MailOutlined /> Email</Styled.MobileAccountLabel>
                  <Styled.MobileAccountValue>{user.email ?? '—'}</Styled.MobileAccountValue>
                </Styled.MobileAccountRow>
                <Styled.MobileAccountRow>
                  <Styled.MobileAccountLabel><IdcardOutlined /> ID</Styled.MobileAccountLabel>
                  <Styled.MobileAccountValue $mono>{user.id}</Styled.MobileAccountValue>
                </Styled.MobileAccountRow>
                <Styled.MobileAccountRow>
                  <Styled.MobileAccountLabel><CalendarOutlined /> С нами с</Styled.MobileAccountLabel>
                  <Styled.MobileAccountValue>{dayjs(user.createdAt).format('DD.MM.YYYY')}</Styled.MobileAccountValue>
                </Styled.MobileAccountRow>
              </Styled.MobileAccountCard>

              <Styled.MobileActionsCol>
                <Styled.MobileRefreshBtn type="button" onClick={onOpenTeam}>
                  <TeamOutlined /> Открыть команду
                </Styled.MobileRefreshBtn>
              </Styled.MobileActionsCol>
            </>
          )}
        </Styled.MobileBody>
      </Styled.MobileShell>
    </>
  );
}

export function ProfilePage() {
  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const { currentRoom } = useRoom();
  const { modal } = App.useApp();

  const targetId = params.id;
  const isSelf = !targetId || targetId === authUser?.id;

  const { user, loading, apartmentsTotal, remindersTotal, memberStats, reloadSelf } =
    useProfilePage(targetId, isSelf);

  const handleOpenTeam = () => navigate('/team');

  if (!isSelf) {
    return (
      <TeammateView
        user={user}
        loading={loading}
        stats={memberStats}
        onBack={() => navigate(-1)}
        onOpenTeam={handleOpenTeam}
        currentRoomName={currentRoom?.name}
      />
    );
  }

  const handleReload = () => reloadSelf();

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
      onOpenTeam={handleOpenTeam}
    />
  );
}
