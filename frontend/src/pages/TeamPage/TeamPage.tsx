import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Skeleton, Tooltip, Empty, App } from 'antd';
import {
  EditOutlined, DeleteOutlined, MailOutlined,
  SearchOutlined, CopyOutlined, ClockCircleOutlined,
  SettingOutlined, UserAddOutlined, HomeOutlined, FilterOutlined,
  CrownOutlined, IdcardOutlined, TeamOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { useTeamData, TeamDataProvider } from './useTeamData';
import type { RoomMember } from '../../entities/Room/model/types';
import {
  Page, Shell,
  HeroCard, HeroRow, HeroLabel, HeroTitle, HeroLead,
  HeroActions, HeroBtn, HeroMetaRow, MetaPill,
  RosterCard, RosterToolbar, SearchField, ChipsRow, FilterChip,
  RosterList, RosterRow, RosterRail, RailName, RailTag,
  RosterBody, Identity, NameLine, NameText, BadgeRow, RoleBadge, SelfBadge,
  ContactLine, JoinedLine,
  Pulse, ActivityCell, ActivityHead, ActivityValue, ActivityLabel,
  ActionCell, IconAction, IconActionDanger,
  EmptyState, SkeletonRow,
  BottomCallout, CalloutLabel, CalloutCode, CalloutAction,
  OwnerHint,
  EditModal, EditModalFormShell, EditRow, EditLabel, EditInput,
  EditModalFooter, EditModalPrimaryBtn,
  MobileShell, MobileTopBar, MobileBrand, MobileBrandLogo, MobileBrandText,
  MobileBrandCaption, MobileTopActions, MobileAvatar, MobileBody,
  MobileHeading, MobileSub, MobileSearch, MobileSearchWrap, MobileChips, MobileChip,
  MobileRoster, MobileRosterCard, MobileRail, MobileIdentity,
  MobileName, MobileBadgeRow, MobileRole, MobileSelfBadge, MobileMetaLine,
  MobileStats, MobileStat, MobileStatValue, MobileStatLabel,
  MobileActions, MobileActionBtn, MobileActionDanger, MobileCallout,
  MobileCalloutLabel, MobileCalloutCode, MobileCalloutCopy, MobileEmpty,
  MobileOwnerHint,
} from './styled';

dayjs.locale('ru');

function initialsOf(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase() || 'U';
}

function avatarTone(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 17) | 0;
  return Math.abs(h % 6);
}

const AVATAR_TONES = [
  { from: '#b55b3b', to: '#7a2f12' },
  { from: '#9b6a2b', to: '#5c3a14' },
  { from: '#4f7a52', to: '#2c4630' },
  { from: '#3d6b8a', to: '#1f3f55' },
  { from: '#8a4d3d', to: '#5c2c20' },
  { from: '#645e4f', to: '#3b3729' },
];

interface EditFormValues {
  name: string;
  email?: string;
}

function EditProfileModal({
  open, onCancel, user,
}: {
  open: boolean;
  onCancel: () => void;
  user?: { name: string; email?: string } | null;
}) {
  const { submitEdit } = useTeamData();
  const [form] = Form.useForm<EditFormValues>();

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({ name: user.name, email: user.email ?? '' });
    }
  }, [open, user, form]);

  const onFinish = async (values: EditFormValues) => {
    try {
      await submitEdit(values);
    } catch {
      // toast already shown
    }
  };

  return (
    <EditModal
      open={open}
      onCancel={onCancel}
      footer={null}
      title="Редактировать профиль"
      destroyOnClose
    >
      <EditModalFormShell>
        <Form
          form={form}
          layout="vertical"
          preserve={false}
          onFinish={onFinish}
        >
          <EditRow>
            <EditLabel htmlFor="team-edit-name">Имя</EditLabel>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Введите имя' }, { min: 2, message: 'Минимум 2 символа' }]}
              noStyle
            >
              <EditInput id="team-edit-name" placeholder="Ваше имя" autoFocus />
            </Form.Item>
          </EditRow>
          <EditRow>
            <EditLabel htmlFor="team-edit-email">Email</EditLabel>
            <Form.Item
              name="email"
              rules={[{ type: 'email', message: 'Не похоже на email' }]}
              noStyle
            >
              <EditInput id="team-edit-email" placeholder="email@example.com" />
            </Form.Item>
          </EditRow>
          <EditModalFooter>
            <HeroBtn type="button" onClick={onCancel}>
              Отмена
            </HeroBtn>
            <EditModalPrimaryBtn type="submit">
              Сохранить
            </EditModalPrimaryBtn>
          </EditModalFooter>
        </Form>
      </EditModalFormShell>
    </EditModal>
  );
}

interface ActionsArgs {
  isOwner: boolean;
  isSelf: boolean;
  isMemberOwner: boolean;
  m: RoomMember;
  navigate: (path: string) => void;
  onEdit: () => void;
  onKick: () => void;
  onLeave: () => void;
}

function MemberActions({ isOwner, isSelf, isMemberOwner, m, navigate, onEdit, onKick, onLeave }: ActionsArgs) {
  return (
    <ActionCell>
      {isSelf ? (
        <Tooltip title="Редактировать свой профиль">
          <IconAction
            type="button"
            $variant="primary"
            onClick={onEdit}
            aria-label="Редактировать профиль"
          >
            <EditOutlined /> <span>Изменить</span>
          </IconAction>
        </Tooltip>
      ) : (
        <Tooltip title="Открыть профиль">
          <IconAction
            type="button"
            onClick={() => navigate(`/users/${m.id}`)}
            aria-label="Открыть профиль"
          >
            <IdcardOutlined />
          </IconAction>
        </Tooltip>
      )}
      {isOwner && !isMemberOwner && !isSelf && (
        <Tooltip title="Удалить из команды">
          <IconActionDanger type="button" onClick={onKick} aria-label="Удалить">
            <DeleteOutlined />
          </IconActionDanger>
        </Tooltip>
      )}
      {!isOwner && isSelf && !isMemberOwner && (
        <Tooltip title="Покинуть команду">
          <IconActionDanger type="button" onClick={onLeave} aria-label="Покинуть">
            <DeleteOutlined />
          </IconActionDanger>
        </Tooltip>
      )}
    </ActionCell>
  );
}

function DesktopTeamView() {
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const {
    user, currentRoom, isOwner,
    members, membersLoading, filtered, teamTotals,
    ownerCount, memberCount,
    search, setSearch, roleFilter, setRoleFilter,
    copyInvite, handleRegenerate, regeneratePending,
    handleKick, handleLeave, editOpen, setEditOpen,
  } = useTeamData();

  const kick = (m: RoomMember) => {
    modal.confirm({
      title: `Удалить ${m.name}?`,
      content: 'Участник потеряет доступ к квартирам и напоминаниям этой комнаты.',
      okText: 'Удалить',
      okButtonProps: { danger: true },
      cancelText: 'Отмена',
      onOk: () => { void handleKick(m); },
    });
  };

  const leave = () => {
    modal.confirm({
      title: 'Выйти из команды?',
      content: 'Вы потеряете доступ к квартирам этой комнаты.',
      okText: 'Выйти',
      okButtonProps: { danger: true },
      cancelText: 'Отмена',
      onOk: async () => {
        await handleLeave();
        navigate('/rooms');
      },
    });
  };

  if (!currentRoom) {
    return (
      <Shell>
        <EmptyState>
          <TeamOutlined className="icon" />
          <div className="title">Комната не выбрана</div>
          <div className="hint">Выберите или создайте комнату, чтобы увидеть команду</div>
          <HeroBtn onClick={() => navigate('/rooms')} style={{ marginTop: 12 }}>
            <HomeOutlined /> К комнатам
          </HeroBtn>
        </EmptyState>
      </Shell>
    );
  }

  return (
    <Shell initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <HeroCard initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <HeroRow>
          <div>
            <HeroLabel>Команда</HeroLabel>
            <HeroTitle>{currentRoom.name}</HeroTitle>
            <HeroLead>
              {members.length === 0
                ? 'Здесь пока никого нет — пригласите соратников по коду'
                : `${members.length} ${members.length === 1 ? 'человек' : members.length < 5 ? 'человека' : 'человек'} в подборке`}
            </HeroLead>
          </div>
          <HeroActions>
            <HeroBtn $variant="ghost" onClick={copyInvite}>
              <CopyOutlined />
              <span className="btn-label-sm">Код</span>
              <span className="btn-code">{currentRoom.inviteCode}</span>
            </HeroBtn>
            {isOwner && (
              <HeroBtn onClick={handleRegenerate} disabled={regeneratePending}>
                <UserAddOutlined />
                <span>Новый код</span>
              </HeroBtn>
            )}
            <HeroBtn onClick={() => navigate('/rooms/manage')}>
              <SettingOutlined />
              <span>Управление</span>
            </HeroBtn>
          </HeroActions>
        </HeroRow>

        <HeroMetaRow>
          <MetaPill>
            <span className="value">{members.length}</span>
            <span className="label">в команде</span>
          </MetaPill>
          <MetaPill>
            <span className="value">{ownerCount}</span>
            <span className="label">{ownerCount === 1 ? 'владелец' : 'владельца'}</span>
          </MetaPill>
          <MetaPill>
            <span className="value">{teamTotals.apartments || '—'}</span>
            <span className="label">объявлений</span>
          </MetaPill>
          <MetaPill>
            <span className="value">{teamTotals.callbacks || '—'}</span>
            <span className="label">перезвонов</span>
          </MetaPill>
        </HeroMetaRow>
      </HeroCard>

      <RosterCard initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <RosterToolbar>
          <SearchField>
            <SearchOutlined className="icon" />
            <input
              placeholder="Найти по имени или email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Поиск участников"
            />
          </SearchField>
          <ChipsRow>
            <FilterChip
              type="button"
              $active={roleFilter === 'all'}
              onClick={() => setRoleFilter('all')}
            >
              Все · {members.length}
            </FilterChip>
            <FilterChip
              type="button"
              $active={roleFilter === 'owner'}
              onClick={() => setRoleFilter('owner')}
            >
              <CrownOutlined /> Владельцы · {ownerCount}
            </FilterChip>
            <FilterChip
              type="button"
              $active={roleFilter === 'member'}
              onClick={() => setRoleFilter('member')}
            >
              Участники · {memberCount}
            </FilterChip>
          </ChipsRow>
        </RosterToolbar>

        {isOwner && (
          <OwnerHint>
            <FilterOutlined />
            <span>
              Вы владелец — можете удалять участников и обновлять код приглашения.
              {' '}
              Код меняется автоматически, прежний перестаёт работать.
            </span>
          </OwnerHint>
        )}

        {membersLoading ? (
          <div style={{ padding: 16 }}>
            {[0, 1, 2].map((i) => (
              <SkeletonRow key={i}>
                <Skeleton.Avatar active size={48} shape="circle" />
                <div style={{ flex: 1 }}>
                  <Skeleton active paragraph={{ rows: 1, width: ['60%'] }} title={false} />
                  <Skeleton active paragraph={{ rows: 1, width: ['40%'] }} title={false} />
                </div>
                <Skeleton.Button active size="large" style={{ width: 80 }} />
              </SkeletonRow>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              members.length === 0
                ? 'В команде пока никого'
                : 'Никого не нашли — попробуйте другой фильтр'
            }
            style={{ padding: '48px 0' }}
          >
            {members.length === 0 && (
              <HeroBtn onClick={copyInvite}>
                <CopyOutlined /> Скопировать код приглашения
              </HeroBtn>
            )}
          </Empty>
        ) : (
          <RosterList>
            {filtered.map((m, idx) => {
              const isSelf = m.id === user?.id;
              const isMemberOwner = m.role === 'OWNER';
              const memberStats = m.stats;
              const initials = initialsOf(m.name);
              const tone = AVATAR_TONES[avatarTone(m.id)];
              return (
                <RosterRow
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  $owner={isMemberOwner}
                >
                  <RosterRail $owner={isMemberOwner}>
                    <div
                      className="avatar"
                      style={{ background: `linear-gradient(135deg, ${tone.from}, ${tone.to})` }}
                    >
                      {initials}
                    </div>
                    <RailName>{m.name.split(' ')[0]}</RailName>
                    {isMemberOwner ? (
                      <RailTag $owner><CrownOutlined /> owner</RailTag>
                    ) : (
                      <RailTag>member</RailTag>
                    )}
                  </RosterRail>

                  <RosterBody>
                    <Identity>
                      <NameLine>
                        <NameText>{m.name}</NameText>
                      </NameLine>
                      <BadgeRow>
                        {isMemberOwner && <RoleBadge $owner><CrownOutlined /> Владелец</RoleBadge>}
                        {!isMemberOwner && <RoleBadge>Участник</RoleBadge>}
                        {isSelf && <SelfBadge>это вы</SelfBadge>}
                      </BadgeRow>
                      {m.email && (
                        <ContactLine>
                          <MailOutlined /> {m.email}
                        </ContactLine>
                      )}
                      <JoinedLine>
                        <ClockCircleOutlined /> в команде с {dayjs(m.joinedAt).format('DD MMM YYYY')}
                      </JoinedLine>
                    </Identity>

                    <ActivityCell>
                      {memberStats ? (
                        <>
                          <ActivityHead>В работе</ActivityHead>
                          <ActivityValue>{memberStats.apartments}</ActivityValue>
                          <ActivityLabel>объявлений</ActivityLabel>
                        </>
                      ) : (
                        <Pulse>считаем</Pulse>
                      )}
                    </ActivityCell>

                    <ActivityCell>
                      {memberStats ? (
                        <>
                          <ActivityHead>Перезвоны</ActivityHead>
                          <ActivityValue>{memberStats.callbacks}</ActivityValue>
                          <ActivityLabel>ждут ответа</ActivityLabel>
                        </>
                      ) : (
                        <Pulse>…</Pulse>
                      )}
                    </ActivityCell>

                    <ActivityCell>
                      {memberStats ? (
                        <>
                          <ActivityHead>Просмотры</ActivityHead>
                          <ActivityValue>{memberStats.viewings}</ActivityValue>
                          <ActivityLabel>назначены</ActivityLabel>
                        </>
                      ) : (
                        <Pulse>…</Pulse>
                      )}
                    </ActivityCell>

                    <MemberActions
                      isOwner={isOwner}
                      isSelf={isSelf}
                      isMemberOwner={isMemberOwner}
                      m={m}
                      navigate={navigate}
                      onEdit={() => setEditOpen(true)}
                      onKick={() => kick(m)}
                      onLeave={leave}
                    />
                  </RosterBody>
                </RosterRow>
              );
            })}
          </RosterList>
        )}
      </RosterCard>

      <BottomCallout>
        <div>
          <CalloutLabel>Код приглашения</CalloutLabel>
          <CalloutCode>{currentRoom.inviteCode}</CalloutCode>
        </div>
        <CalloutAction type="button" onClick={copyInvite}>
          <CopyOutlined /> <span>Скопировать</span>
        </CalloutAction>
      </BottomCallout>

      <EditProfileModal open={editOpen} onCancel={() => setEditOpen(false)} user={user} />
    </Shell>
  );
}

function MobileTeamView() {
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const {
    user, currentRoom, isOwner,
    members, membersLoading, filtered,
    ownerCount, memberCount,
    search, setSearch, roleFilter, setRoleFilter,
    copyInvite, handleRegenerate, regeneratePending,
    handleKick, handleLeave, editOpen, setEditOpen,
  } = useTeamData();

  const kick = (m: RoomMember) => {
    modal.confirm({
      title: `Удалить ${m.name}?`,
      content: 'Участник потеряет доступ к квартирам и напоминаниям этой комнаты.',
      okText: 'Удалить',
      okButtonProps: { danger: true },
      cancelText: 'Отмена',
      onOk: () => { void handleKick(m); },
    });
  };

  const leave = () => {
    modal.confirm({
      title: 'Выйти из команды?',
      content: 'Вы потеряете доступ к квартирам этой комнаты.',
      okText: 'Выйти',
      okButtonProps: { danger: true },
      cancelText: 'Отмена',
      onOk: async () => {
        await handleLeave();
        navigate('/rooms');
      },
    });
  };

  if (!currentRoom) {
    return (
      <MobileShell>
        <MobileTopBar>
          <MobileBrand>
            <MobileBrandLogo><HomeOutlined /></MobileBrandLogo>
            <MobileBrandText>
              <div>FlatFinder</div>
              <MobileBrandCaption>Совместный поиск</MobileBrandCaption>
            </MobileBrandText>
          </MobileBrand>
          <MobileTopActions>
            <MobileAvatar size={36}>{user ? initialsOf(user.name) : 'FF'}</MobileAvatar>
          </MobileTopActions>
        </MobileTopBar>
        <MobileBody>
          <MobileEmpty>
            <TeamOutlined style={{ fontSize: 32 }} />
            <div style={{ fontWeight: 700, color: '#1e1b18' }}>Комната не выбрана</div>
            <div style={{ fontSize: 13 }}>Выберите или создайте комнату, чтобы увидеть команду</div>
            <HeroBtn type="button" onClick={() => navigate('/rooms')} style={{ marginTop: 8 }}>
              <HomeOutlined /> К комнатам
            </HeroBtn>
          </MobileEmpty>
        </MobileBody>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <MobileTopBar>
        <MobileBrand>
          <MobileBrandLogo><HomeOutlined /></MobileBrandLogo>
          <MobileBrandText>
            <div>FlatFinder</div>
            <MobileBrandCaption>{currentRoom.name}</MobileBrandCaption>
          </MobileBrandText>
        </MobileBrand>
        <MobileTopActions>
          <MobileAvatar size={36}>{user ? initialsOf(user.name) : 'FF'}</MobileAvatar>
        </MobileTopActions>
      </MobileTopBar>

      <MobileBody>
        <MobileHeading>
          Команда <span>{members.length} · {ownerCount} владельцев</span>
        </MobileHeading>
        <MobileSub>
          {members.length === 0
            ? 'Здесь пока никого'
            : 'Поделитесь кодом ниже, чтобы добавить соратников'}
        </MobileSub>

        <MobileChips>
          <MobileChip
            type="button"
            $active={roleFilter === 'all'}
            onClick={() => setRoleFilter('all')}
          >
            Все · {members.length}
          </MobileChip>
          <MobileChip
            type="button"
            $active={roleFilter === 'owner'}
            onClick={() => setRoleFilter('owner')}
          >
            Владельцы · {ownerCount}
          </MobileChip>
          <MobileChip
            type="button"
            $active={roleFilter === 'member'}
            onClick={() => setRoleFilter('member')}
          >
            Участники · {memberCount}
          </MobileChip>
        </MobileChips>

        <MobileSearchWrap>
          <SearchOutlined className="icon" />
          <MobileSearch
            placeholder="Поиск по имени или email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </MobileSearchWrap>

        {isOwner && (
          <MobileOwnerHint>
            <FilterOutlined />
            <span>Вы владелец — можете удалять и обновлять код.</span>
          </MobileOwnerHint>
        )}

        <MobileRoster>
          {membersLoading ? (
            <MobileEmpty>Загружаем команду…</MobileEmpty>
          ) : filtered.length === 0 ? (
            <MobileEmpty>
              {members.length === 0
                ? 'В команде пока никого'
                : 'Никого не нашли'}
            </MobileEmpty>
          ) : (
            filtered.map((m) => {
              const isSelf = m.id === user?.id;
              const isMemberOwner = m.role === 'OWNER';
              const initials = initialsOf(m.name);
              const tone = AVATAR_TONES[avatarTone(m.id)];
              const memberStats = m.stats;
              return (
                <MobileRosterCard key={m.id} $owner={isMemberOwner}>
                  <MobileRail $owner={isMemberOwner}>
                    <div
                      className="avatar"
                      style={{ background: `linear-gradient(135deg, ${tone.from}, ${tone.to})` }}
                    >
                      {initials}
                    </div>
                  </MobileRail>
                  <MobileIdentity>
                    <MobileName>{m.name}</MobileName>
                    <MobileBadgeRow>
                      {isMemberOwner && (
                        <MobileRole $owner>
                          <CrownOutlined /> владелец
                        </MobileRole>
                      )}
                      {!isMemberOwner && <MobileRole>участник</MobileRole>}
                      {isSelf && <MobileSelfBadge>вы</MobileSelfBadge>}
                    </MobileBadgeRow>
                    {m.email && (
                      <MobileMetaLine>
                        <MailOutlined /> {m.email}
                      </MobileMetaLine>
                    )}
                    <MobileMetaLine>
                      <ClockCircleOutlined /> с {dayjs(m.joinedAt).format('DD MMM YYYY')}
                    </MobileMetaLine>
                  </MobileIdentity>
                  <MobileStats>
                    {memberStats ? (
                      <>
                        <MobileStat>
                          <MobileStatValue>{memberStats.apartments}</MobileStatValue>
                          <MobileStatLabel>объявлений</MobileStatLabel>
                        </MobileStat>
                        <MobileStat>
                          <MobileStatValue>{memberStats.callbacks}</MobileStatValue>
                          <MobileStatLabel>перезвонов</MobileStatLabel>
                        </MobileStat>
                        <MobileStat>
                          <MobileStatValue>{memberStats.viewings}</MobileStatValue>
                          <MobileStatLabel>просмотров</MobileStatLabel>
                        </MobileStat>
                      </>
                    ) : (
                      <MobileStat>
                        <MobileStatValue>…</MobileStatValue>
                        <MobileStatLabel>считаем</MobileStatLabel>
                      </MobileStat>
                    )}
                  </MobileStats>
                  <MobileActions>
                    {isSelf ? (
                      <MobileActionBtn
                        type="button"
                        onClick={() => setEditOpen(true)}
                        aria-label="Редактировать профиль"
                      >
                        <EditOutlined /> Изменить
                      </MobileActionBtn>
                    ) : (
                      <MobileActionBtn
                        type="button"
                        onClick={() => navigate(`/users/${m.id}`)}
                        aria-label="Открыть профиль"
                      >
                        <IdcardOutlined /> Профиль
                      </MobileActionBtn>
                    )}
                    {isOwner && !isMemberOwner && !isSelf && (
                      <MobileActionDanger
                        type="button"
                        onClick={() => kick(m)}
                        aria-label="Удалить"
                      >
                        <DeleteOutlined />
                      </MobileActionDanger>
                    )}
                    {!isOwner && isSelf && !isMemberOwner && (
                      <MobileActionDanger
                        type="button"
                        aria-label="Покинуть"
                        onClick={leave}
                      >
                        <DeleteOutlined />
                      </MobileActionDanger>
                    )}
                  </MobileActions>
                </MobileRosterCard>
              );
            })
          )}
        </MobileRoster>

        <MobileCallout>
          <div>
            <MobileCalloutLabel>Код приглашения</MobileCalloutLabel>
            <MobileCalloutCode>{currentRoom.inviteCode}</MobileCalloutCode>
          </div>
          <MobileCalloutCopy type="button" onClick={copyInvite}>
            <CopyOutlined /> Скопировать
          </MobileCalloutCopy>
        </MobileCallout>

        {isOwner && (
          <MobileOwnerHint>
            <UserAddOutlined />
            <span>
              <strong>Новый код</strong> — старый перестаёт работать сразу после выдачи.
            </span>
            <HeroBtn
              type="button"
              onClick={handleRegenerate}
              disabled={regeneratePending}
              style={{ marginLeft: 'auto', height: 36, padding: '0 14px', fontSize: 13 }}
            >
              <UserAddOutlined /> Сгенерировать
            </HeroBtn>
          </MobileOwnerHint>
        )}
      </MobileBody>

      <EditProfileModal open={editOpen} onCancel={() => setEditOpen(false)} user={user} />
    </MobileShell>
  );
}

export function TeamPage() {
  return (
    <Page>
      <TeamDataProvider>
        <DesktopTeamView />
        <MobileTeamView />
      </TeamDataProvider>
    </Page>
  );
}