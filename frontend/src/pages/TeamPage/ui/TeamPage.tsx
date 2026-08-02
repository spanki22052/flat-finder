import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Skeleton, Empty, App } from 'antd';
import {
  EditOutlined, DeleteOutlined, MailOutlined,
  SearchOutlined, CopyOutlined, ClockCircleOutlined,
  SettingOutlined, UserAddOutlined, HomeOutlined, FilterOutlined,
  CrownOutlined, IdcardOutlined, TeamOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useTeamData, TeamDataProvider } from '../useTeamData';
import type { RoomMember } from '@/entities/Room/model/types';
import { AVATAR_TONES } from '../model/types';
import type {
  EditFormValues, EditProfileModalProps, MemberActionsProps,
} from '../model/types';
import { avatarTone, initialsOf, pluralPeople } from '../lib/utils';
import * as Styled from './TeamPage.styled';

function EditProfileModal({ open, onCancel, user }: EditProfileModalProps) {
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
    <Styled.EditModal
      open={open}
      onCancel={onCancel}
      footer={null}
      title="Редактировать профиль"
      destroyOnClose
    >
      <Styled.EditModalFormShell>
        <Form form={form} layout="vertical" preserve={false} onFinish={onFinish}>
          <Styled.EditRow>
            <Styled.EditLabel htmlFor="team-edit-name">Имя</Styled.EditLabel>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Введите имя' }, { min: 2, message: 'Минимум 2 символа' }]}
              noStyle
            >
              <Styled.EditInput id="team-edit-name" placeholder="Ваше имя" autoFocus />
            </Form.Item>
          </Styled.EditRow>
          <Styled.EditRow>
            <Styled.EditLabel htmlFor="team-edit-email">Email</Styled.EditLabel>
            <Form.Item
              name="email"
              rules={[{ type: 'email', message: 'Не похоже на email' }]}
              noStyle
            >
              <Styled.EditInput id="team-edit-email" placeholder="email@example.com" />
            </Form.Item>
          </Styled.EditRow>
          <Styled.EditModalFooter>
            <Styled.HeroBtn type="button" onClick={onCancel}>Отмена</Styled.HeroBtn>
            <Styled.EditModalPrimaryBtn type="submit">Сохранить</Styled.EditModalPrimaryBtn>
          </Styled.EditModalFooter>
        </Form>
      </Styled.EditModalFormShell>
    </Styled.EditModal>
  );
}

function MemberActions({ isOwner, isSelf, isMemberOwner, m, navigate, onEdit, onKick, onLeave }: MemberActionsProps) {
  return (
    <Styled.ActionCell>
      {isSelf ? (
        <Styled.IconAction type="button" $variant="primary" onClick={onEdit} aria-label="Редактировать профиль">
          <EditOutlined /> <span>Изменить</span>
        </Styled.IconAction>
      ) : (
        <Styled.IconAction type="button" onClick={() => navigate(`/users/${m.id}`)} aria-label="Открыть профиль">
          <IdcardOutlined />
        </Styled.IconAction>
      )}
      {isOwner && !isMemberOwner && !isSelf && (
        <Styled.IconActionDanger type="button" onClick={onKick} aria-label="Удалить">
          <DeleteOutlined />
        </Styled.IconActionDanger>
      )}
      {!isOwner && isSelf && !isMemberOwner && (
        <Styled.IconActionDanger type="button" onClick={onLeave} aria-label="Покинуть">
          <DeleteOutlined />
        </Styled.IconActionDanger>
      )}
    </Styled.ActionCell>
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
      <Styled.Shell>
        <Styled.EmptyState>
          <TeamOutlined className="icon" />
          <div className="title">Комната не выбрана</div>
          <div className="hint">Выберите или создайте комнату, чтобы увидеть команду</div>
          <Styled.HeroBtn onClick={() => navigate('/rooms')} style={{ marginTop: 12 }}>
            <HomeOutlined /> К комнатам
          </Styled.HeroBtn>
        </Styled.EmptyState>
      </Styled.Shell>
    );
  }

  return (
    <Styled.Shell initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Styled.HeroCard initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Styled.HeroRow>
          <div>
            <Styled.HeroLabel>Команда</Styled.HeroLabel>
            <Styled.HeroTitle>{currentRoom.name}</Styled.HeroTitle>
            <Styled.HeroLead>
              {members.length === 0
                ? 'Здесь пока никого нет — пригласите соратников по коду'
                : `${members.length} ${pluralPeople(members.length)} в подборке`}
            </Styled.HeroLead>
          </div>
          <Styled.HeroActions>
            <Styled.HeroBtn $variant="ghost" onClick={copyInvite}>
              <CopyOutlined />
              <span className="btn-label-sm">Код</span>
              <span className="btn-code">{currentRoom.inviteCode}</span>
            </Styled.HeroBtn>
            {isOwner && (
              <Styled.HeroBtn onClick={handleRegenerate} disabled={regeneratePending}>
                <UserAddOutlined />
                <span>Новый код</span>
              </Styled.HeroBtn>
            )}
            <Styled.HeroBtn onClick={() => navigate('/rooms/manage')}>
              <SettingOutlined />
              <span>Управление</span>
            </Styled.HeroBtn>
          </Styled.HeroActions>
        </Styled.HeroRow>

        <Styled.HeroMetaRow>
          <Styled.MetaPill>
            <span className="value">{members.length}</span>
            <span className="label">в команде</span>
          </Styled.MetaPill>
          <Styled.MetaPill>
            <span className="value">{ownerCount}</span>
            <span className="label">{ownerCount === 1 ? 'владелец' : 'владельца'}</span>
          </Styled.MetaPill>
          <Styled.MetaPill>
            <span className="value">{teamTotals.apartments || '—'}</span>
            <span className="label">объявлений</span>
          </Styled.MetaPill>
          <Styled.MetaPill>
            <span className="value">{teamTotals.callbacks || '—'}</span>
            <span className="label">перезвонов</span>
          </Styled.MetaPill>
        </Styled.HeroMetaRow>
      </Styled.HeroCard>

      <Styled.RosterCard initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Styled.RosterToolbar>
          <Styled.SearchField>
            <SearchOutlined className="icon" />
            <input
              placeholder="Найти по имени или email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Поиск участников"
            />
          </Styled.SearchField>
          <Styled.ChipsRow>
            <Styled.FilterChip type="button" $active={roleFilter === 'all'} onClick={() => setRoleFilter('all')}>
              Все · {members.length}
            </Styled.FilterChip>
            <Styled.FilterChip type="button" $active={roleFilter === 'owner'} onClick={() => setRoleFilter('owner')}>
              <CrownOutlined /> Владельцы · {ownerCount}
            </Styled.FilterChip>
            <Styled.FilterChip type="button" $active={roleFilter === 'member'} onClick={() => setRoleFilter('member')}>
              Участники · {memberCount}
            </Styled.FilterChip>
          </Styled.ChipsRow>
        </Styled.RosterToolbar>

        {isOwner && (
          <Styled.OwnerHint>
            <FilterOutlined />
            <span>
              Вы владелец — можете удалять участников и обновлять код приглашения.
              {' '}Код меняется автоматически, прежний перестаёт работать.
            </span>
          </Styled.OwnerHint>
        )}

        {membersLoading ? (
          <div style={{ padding: 16 }}>
            {[0, 1, 2].map((i) => (
              <Styled.SkeletonRow key={i}>
                <Skeleton.Avatar active size={48} shape="circle" />
                <div style={{ flex: 1 }}>
                  <Skeleton active paragraph={{ rows: 1, width: ['60%'] }} title={false} />
                  <Skeleton active paragraph={{ rows: 1, width: ['40%'] }} title={false} />
                </div>
                <Skeleton.Button active size="large" style={{ width: 80 }} />
              </Styled.SkeletonRow>
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
              <Styled.HeroBtn onClick={copyInvite}>
                <CopyOutlined /> Скопировать код приглашения
              </Styled.HeroBtn>
            )}
          </Empty>
        ) : (
          <Styled.RosterList>
            {filtered.map((m, idx) => {
              const isSelf = m.id === user?.id;
              const isMemberOwner = m.role === 'OWNER';
              const memberStats = m.stats;
              const tone = AVATAR_TONES[avatarTone(m.id)];
              return (
                <Styled.RosterRow
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  $owner={isMemberOwner}
                >
                  <Styled.RosterRail $owner={isMemberOwner}>
                    <div className="avatar" style={{ background: `linear-gradient(135deg, ${tone.from}, ${tone.to})` }}>
                      {initialsOf(m.name)}
                    </div>
                    <Styled.RailName>{m.name.split(' ')[0]}</Styled.RailName>
                    {isMemberOwner ? (
                      <Styled.RailTag $owner><CrownOutlined /> owner</Styled.RailTag>
                    ) : (
                      <Styled.RailTag>member</Styled.RailTag>
                    )}
                  </Styled.RosterRail>

                  <Styled.RosterBody>
                    <Styled.Identity>
                      <Styled.NameLine>
                        <Styled.NameText>{m.name}</Styled.NameText>
                      </Styled.NameLine>
                      <Styled.BadgeRow>
                        {isMemberOwner && <Styled.RoleBadge $owner><CrownOutlined /> Владелец</Styled.RoleBadge>}
                        {!isMemberOwner && <Styled.RoleBadge>Участник</Styled.RoleBadge>}
                        {isSelf && <Styled.SelfBadge>это вы</Styled.SelfBadge>}
                      </Styled.BadgeRow>
                      {m.email && (
                        <Styled.ContactLine>
                          <MailOutlined /> {m.email}
                        </Styled.ContactLine>
                      )}
                      <Styled.JoinedLine>
                        <ClockCircleOutlined /> в команде с {dayjs(m.joinedAt).format('DD MMM YYYY')}
                      </Styled.JoinedLine>
                    </Styled.Identity>

                    <Styled.ActivityCell>
                      {memberStats ? (
                        <>
                          <Styled.ActivityHead>В работе</Styled.ActivityHead>
                          <Styled.ActivityValue>{memberStats.apartments}</Styled.ActivityValue>
                          <Styled.ActivityLabel>объявлений</Styled.ActivityLabel>
                        </>
                      ) : <Styled.Pulse>считаем</Styled.Pulse>}
                    </Styled.ActivityCell>

                    <Styled.ActivityCell>
                      {memberStats ? (
                        <>
                          <Styled.ActivityHead>Перезвоны</Styled.ActivityHead>
                          <Styled.ActivityValue>{memberStats.callbacks}</Styled.ActivityValue>
                          <Styled.ActivityLabel>ждут ответа</Styled.ActivityLabel>
                        </>
                      ) : <Styled.Pulse>…</Styled.Pulse>}
                    </Styled.ActivityCell>

                    <Styled.ActivityCell>
                      {memberStats ? (
                        <>
                          <Styled.ActivityHead>Просмотры</Styled.ActivityHead>
                          <Styled.ActivityValue>{memberStats.viewings}</Styled.ActivityValue>
                          <Styled.ActivityLabel>назначены</Styled.ActivityLabel>
                        </>
                      ) : <Styled.Pulse>…</Styled.Pulse>}
                    </Styled.ActivityCell>

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
                  </Styled.RosterBody>
                </Styled.RosterRow>
              );
            })}
          </Styled.RosterList>
        )}
      </Styled.RosterCard>

      <Styled.BottomCallout>
        <div>
          <Styled.CalloutLabel>Код приглашения</Styled.CalloutLabel>
          <Styled.CalloutCode>{currentRoom.inviteCode}</Styled.CalloutCode>
        </div>
        <Styled.CalloutAction type="button" onClick={copyInvite}>
          <CopyOutlined /> <span>Скопировать</span>
        </Styled.CalloutAction>
      </Styled.BottomCallout>

      <EditProfileModal open={editOpen} onCancel={() => setEditOpen(false)} user={user} />
    </Styled.Shell>
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
      <Styled.MobileShell>
        <Styled.MobileTopBar>
          <Styled.MobileBrand>
            <Styled.MobileBrandLogo><HomeOutlined /></Styled.MobileBrandLogo>
            <Styled.MobileBrandText>
              <div>FlatFinder</div>
              <Styled.MobileBrandCaption>Совместный поиск</Styled.MobileBrandCaption>
            </Styled.MobileBrandText>
          </Styled.MobileBrand>
          <Styled.MobileTopActions>
            <Styled.MobileAvatar size={36}>{user ? initialsOf(user.name) : 'FF'}</Styled.MobileAvatar>
          </Styled.MobileTopActions>
        </Styled.MobileTopBar>
        <Styled.MobileBody>
          <Styled.MobileEmpty>
            <TeamOutlined style={{ fontSize: 32 }} />
            <div style={{ fontWeight: 700, color: '#1e1b18' }}>Комната не выбрана</div>
            <div style={{ fontSize: 13 }}>Выберите или создайте комнату, чтобы увидеть команду</div>
            <Styled.HeroBtn type="button" onClick={() => navigate('/rooms')} style={{ marginTop: 8 }}>
              <HomeOutlined /> К комнатам
            </Styled.HeroBtn>
          </Styled.MobileEmpty>
        </Styled.MobileBody>
      </Styled.MobileShell>
    );
  }

  return (
    <Styled.MobileShell>
      <Styled.MobileTopBar>
        <Styled.MobileBrand>
          <Styled.MobileBrandLogo><HomeOutlined /></Styled.MobileBrandLogo>
          <Styled.MobileBrandText>
            <div>FlatFinder</div>
            <Styled.MobileBrandCaption>{currentRoom.name}</Styled.MobileBrandCaption>
          </Styled.MobileBrandText>
        </Styled.MobileBrand>
        <Styled.MobileTopActions>
          <Styled.MobileAvatar size={36}>{user ? initialsOf(user.name) : 'FF'}</Styled.MobileAvatar>
        </Styled.MobileTopActions>
      </Styled.MobileTopBar>

      <Styled.MobileBody>
        <Styled.MobileHeading>
          Команда <span>{members.length} · {ownerCount} владельцев</span>
        </Styled.MobileHeading>
        <Styled.MobileSub>
          {members.length === 0
            ? 'Здесь пока никого'
            : 'Поделитесь кодом ниже, чтобы добавить соратников'}
        </Styled.MobileSub>

        <Styled.MobileChips>
          <Styled.MobileChip type="button" $active={roleFilter === 'all'} onClick={() => setRoleFilter('all')}>
            Все · {members.length}
          </Styled.MobileChip>
          <Styled.MobileChip type="button" $active={roleFilter === 'owner'} onClick={() => setRoleFilter('owner')}>
            Владельцы · {ownerCount}
          </Styled.MobileChip>
          <Styled.MobileChip type="button" $active={roleFilter === 'member'} onClick={() => setRoleFilter('member')}>
            Участники · {memberCount}
          </Styled.MobileChip>
        </Styled.MobileChips>

        <Styled.MobileSearchWrap>
          <SearchOutlined className="icon" />
          <Styled.MobileSearch
            placeholder="Поиск по имени или email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Styled.MobileSearchWrap>

        {isOwner && (
          <Styled.MobileOwnerHint>
            <FilterOutlined />
            <span>Вы владелец — можете удалять и обновлять код.</span>
          </Styled.MobileOwnerHint>
        )}

        <Styled.MobileRoster>
          {membersLoading ? (
            <Styled.MobileEmpty>Загружаем команду…</Styled.MobileEmpty>
          ) : filtered.length === 0 ? (
            <Styled.MobileEmpty>
              {members.length === 0 ? 'В команде пока никого' : 'Никого не нашли'}
            </Styled.MobileEmpty>
          ) : (
            filtered.map((m) => {
              const isSelf = m.id === user?.id;
              const isMemberOwner = m.role === 'OWNER';
              const tone = AVATAR_TONES[avatarTone(m.id)];
              const memberStats = m.stats;
              return (
                <Styled.MobileRosterCard key={m.id} $owner={isMemberOwner}>
                  <Styled.MobileRail $owner={isMemberOwner}>
                    <div className="avatar" style={{ background: `linear-gradient(135deg, ${tone.from}, ${tone.to})` }}>
                      {initialsOf(m.name)}
                    </div>
                  </Styled.MobileRail>
                  <Styled.MobileIdentity>
                    <Styled.MobileName>{m.name}</Styled.MobileName>
                    <Styled.MobileBadgeRow>
                      {isMemberOwner && <Styled.MobileRole $owner><CrownOutlined /> владелец</Styled.MobileRole>}
                      {!isMemberOwner && <Styled.MobileRole>участник</Styled.MobileRole>}
                      {isSelf && <Styled.MobileSelfBadge>вы</Styled.MobileSelfBadge>}
                    </Styled.MobileBadgeRow>
                    {m.email && (
                      <Styled.MobileMetaLine>
                        <MailOutlined /> {m.email}
                      </Styled.MobileMetaLine>
                    )}
                    <Styled.MobileMetaLine>
                      <ClockCircleOutlined /> с {dayjs(m.joinedAt).format('DD MMM YYYY')}
                    </Styled.MobileMetaLine>
                  </Styled.MobileIdentity>
                  <Styled.MobileStats>
                    {memberStats ? (
                      <>
                        <Styled.MobileStat>
                          <Styled.MobileStatValue>{memberStats.apartments}</Styled.MobileStatValue>
                          <Styled.MobileStatLabel>объявлений</Styled.MobileStatLabel>
                        </Styled.MobileStat>
                        <Styled.MobileStat>
                          <Styled.MobileStatValue>{memberStats.callbacks}</Styled.MobileStatValue>
                          <Styled.MobileStatLabel>перезвонов</Styled.MobileStatLabel>
                        </Styled.MobileStat>
                        <Styled.MobileStat>
                          <Styled.MobileStatValue>{memberStats.viewings}</Styled.MobileStatValue>
                          <Styled.MobileStatLabel>просмотров</Styled.MobileStatLabel>
                        </Styled.MobileStat>
                      </>
                    ) : (
                      <Styled.MobileStat>
                        <Styled.MobileStatValue>…</Styled.MobileStatValue>
                        <Styled.MobileStatLabel>считаем</Styled.MobileStatLabel>
                      </Styled.MobileStat>
                    )}
                  </Styled.MobileStats>
                  <Styled.MobileActions>
                    {isSelf ? (
                      <Styled.MobileActionBtn type="button" onClick={() => setEditOpen(true)} aria-label="Редактировать профиль">
                        <EditOutlined /> Изменить
                      </Styled.MobileActionBtn>
                    ) : (
                      <Styled.MobileActionBtn type="button" onClick={() => navigate(`/users/${m.id}`)} aria-label="Открыть профиль">
                        <IdcardOutlined /> Профиль
                      </Styled.MobileActionBtn>
                    )}
                    {isOwner && !isMemberOwner && !isSelf && (
                      <Styled.MobileActionDanger type="button" onClick={() => kick(m)} aria-label="Удалить">
                        <DeleteOutlined />
                      </Styled.MobileActionDanger>
                    )}
                    {!isOwner && isSelf && !isMemberOwner && (
                      <Styled.MobileActionDanger type="button" aria-label="Покинуть" onClick={leave}>
                        <DeleteOutlined />
                      </Styled.MobileActionDanger>
                    )}
                  </Styled.MobileActions>
                </Styled.MobileRosterCard>
              );
            })
          )}
        </Styled.MobileRoster>

        <Styled.MobileCallout>
          <div>
            <Styled.MobileCalloutLabel>Код приглашения</Styled.MobileCalloutLabel>
            <Styled.MobileCalloutCode>{currentRoom.inviteCode}</Styled.MobileCalloutCode>
          </div>
          <Styled.MobileCalloutCopy type="button" onClick={copyInvite}>
            <CopyOutlined /> Скопировать
          </Styled.MobileCalloutCopy>
        </Styled.MobileCallout>

        {isOwner && (
          <Styled.MobileOwnerHint>
            <UserAddOutlined />
            <span>
              <strong>Новый код</strong> — старый перестаёт работать сразу после выдачи.
            </span>
            <Styled.HeroBtn
              type="button"
              onClick={handleRegenerate}
              disabled={regeneratePending}
              style={{ marginLeft: 'auto', height: 36, padding: '0 14px', fontSize: 13 }}
            >
              <UserAddOutlined /> Сгенерировать
            </Styled.HeroBtn>
          </Styled.MobileOwnerHint>
        )}
      </Styled.MobileBody>

      <EditProfileModal open={editOpen} onCancel={() => setEditOpen(false)} user={user} />
    </Styled.MobileShell>
  );
}

export function TeamPage() {
  return (
    <Styled.Page>
      <TeamDataProvider>
        <DesktopTeamView />
        <MobileTeamView />
      </TeamDataProvider>
    </Styled.Page>
  );
}