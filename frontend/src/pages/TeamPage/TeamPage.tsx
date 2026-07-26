import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Modal, Form, Skeleton, Tooltip, message, Empty, App,
} from 'antd';
import {
  EditOutlined, DeleteOutlined, MailOutlined,
  SearchOutlined, CopyOutlined, ClockCircleOutlined, TeamOutlined,
  SettingOutlined, UserAddOutlined, HomeOutlined, FilterOutlined,
  CrownOutlined, IdcardOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { useAuth } from '../../app/providers/AuthProvider';
import { useRoom } from '../../app/providers/RoomProvider';
import {
  useGetRoomMembers,
  useRemoveRoomMember,
  useLeaveRoom,
  useRegenerateInviteCode,
} from '../../entities/Room/hooks/useRooms';
import type { RoomMember } from '../../entities/Room/model/types';
import { remindersApi } from '../../shared/api/endpoints';
import { apiClient, getApiError } from '../../shared/api/client';
import {
  Page, Shell, HeroCard, HeroPattern, HeroRow, HeroHeading, HeroSubtitle,
  HeroActions, HeroBtn, StatsRow, StatTile,
  ControlsRow, SearchInput, ChipsRow, FilterChip, TableCard,
  MemberGrid, MemberRow, Avatar, Main, NameRow, NameText, RoleTag, SelfBadge,
  Meta, StatsInline, StatPill, Actions, IconBtn, EmptyState, FormRow, SkeletonRow,
  InviteCallout, Hint,
} from './styled';

dayjs.locale('ru');

type RoleFilter = 'all' | 'owner' | 'member';

interface MemberStats {
  apartments: number;
  callbacks: number;
  viewings: number;
  done: number;
}

interface TeamMember extends RoomMember {
  stats?: MemberStats;
  loadingStats?: boolean;
}

function initialsOf(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase() || 'U';
}

function hueFromId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 17) | 0;
  return Math.abs(h % 9);
}

const STATUS_LABELS: Record<keyof MemberStats, string> = {
  apartments: 'объектов',
  callbacks: 'перезвон',
  viewings: 'просмотр',
  done: 'готовых',
};

async function fetchMemberStats(userId: string): Promise<MemberStats> {
  const [allForMember, pendingReminders] = await Promise.all([
    apiClient
      .get<{ data: Array<{ status: string }>; meta: { total: number } }>(`/apartments`, {
        params: { assigneeId: userId, pageSize: 100 },
      })
      .then((r) => ({
        total: r.data.meta?.total ?? 0,
        items: r.data.data ?? [],
      })),
    remindersApi.list({ assigneeId: userId, status: 'PENDING' }).then((r) => r.data.data ?? []),
  ]);
  const items = allForMember.items;
  const callbacks = items.filter((a) => a.status === 'CALLBACK').length;
  const viewings = items.filter((a) => a.status === 'VIEWING').length;
  const done = items.filter((a) => a.status === 'DONE').length;
  void pendingReminders;
  return { apartments: allForMember.total, callbacks, viewings, done };
}

interface EditFormValues {
  name: string;
  email?: string;
}

export function TeamPage() {
  const navigate = useNavigate();
  const { user, refresh: refreshAuth } = useAuth();
  const { currentRoom, refetchRooms } = useRoom();
  const { modal } = App.useApp();

  const roomId = currentRoom?.id ?? '';
  const isOwner = currentRoom?.role === 'OWNER';

  const { data: members = [], isLoading: membersLoading } = useGetRoomMembers(roomId);
  const removeMember = useRemoveRoomMember();
  const leaveRoom = useLeaveRoom();
  const regenerateInvite = useRegenerateInviteCode();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [stats, setStats] = useState<Record<string, MemberStats>>({});
  const [loadingStatsFor, setLoadingStatsFor] = useState<Set<string>>(new Set());

  const [editOpen, setEditOpen] = useState(false);
  const [editForm] = Form.useForm<EditFormValues>();

  useEffect(() => {
    if (!editOpen && user) {
      editForm.setFieldsValue({ name: user.name, email: user.email ?? '' });
    }
  }, [editOpen, user, editForm]);

  const filtered = useMemo<TeamMember[]>(() => {
    const q = search.trim().toLowerCase();
    return members
      .filter((m) => {
        if (roleFilter === 'owner' && m.role !== 'OWNER') return false;
        if (roleFilter === 'member' && m.role !== 'MEMBER') return false;
        if (!q) return true;
        return (
          m.name.toLowerCase().includes(q) ||
          (m.email ?? '').toLowerCase().includes(q)
        );
      })
      .map((m) => ({ ...m, stats: stats[m.id], loadingStats: loadingStatsFor.has(m.id) }))
      .sort((a, b) => {
        if (a.role !== b.role) return a.role === 'OWNER' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }, [members, search, roleFilter, stats, loadingStatsFor]);

  const totalStats = useMemo(() => {
    const values = Object.values(stats);
    if (!values.length) return null;
    return values.reduce(
      (acc, s) => ({
        apartments: acc.apartments + s.apartments,
        callbacks: acc.callbacks + s.callbacks,
        viewings: acc.viewings + s.viewings,
        done: acc.done + s.done,
      }),
      { apartments: 0, callbacks: 0, viewings: 0, done: 0 },
    );
  }, [stats]);

  const ensureStats = async (m: RoomMember) => {
    if (stats[m.id] || loadingStatsFor.has(m.id)) return;
    setLoadingStatsFor((prev) => new Set(prev).add(m.id));
    try {
      const s = await fetchMemberStats(m.id);
      setStats((prev) => ({ ...prev, [m.id]: s }));
    } catch {
      setStats((prev) => ({
        ...prev,
        [m.id]: { apartments: 0, callbacks: 0, viewings: 0, done: 0 },
      }));
    } finally {
      setLoadingStatsFor((prev) => {
        const next = new Set(prev);
        next.delete(m.id);
        return next;
      });
    }
  };

  useEffect(() => {
    members.forEach((m) => { void ensureStats(m); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members.length, roomId]);

  const copyInvite = async () => {
    if (!currentRoom) return;
    try {
      await navigator.clipboard.writeText(currentRoom.inviteCode);
      message.success('Код скопирован');
    } catch {
      message.error('Не удалось скопировать');
    }
  };

  const handleRegenerate = async () => {
    if (!currentRoom) return;
    try {
      await regenerateInvite.mutateAsync(currentRoom.id);
      message.success('Новый код сгенерирован');
      refetchRooms();
    } catch (err) {
      message.error(getApiError(err).message);
    }
  };

  const handleKick = async (m: RoomMember) => {
    if (!currentRoom) return;
    try {
      await removeMember.mutateAsync({ roomId: currentRoom.id, userId: m.id });
      message.success(`${m.name} удалён(а) из команды`);
      refetchRooms();
      setStats((prev) => {
        const { [m.id]: _, ...rest } = prev;
        return rest;
      });
    } catch (err) {
      message.error(getApiError(err).message);
    }
  };

  const confirmKick = (m: RoomMember) => {
    modal.confirm({
      title: `Удалить ${m.name}?`,
      content: 'Участник потеряет доступ к квартирам и напоминаниям этой комнаты.',
      okText: 'Удалить',
      okButtonProps: { danger: true },
      cancelText: 'Отмена',
      onOk: () => handleKick(m),
    });
  };

  const handleLeave = async () => {
    if (!currentRoom) return;
    try {
      await leaveRoom.mutateAsync(currentRoom.id);
      message.success('Вы вышли из комнаты');
      navigate('/rooms');
    } catch (err) {
      message.error(getApiError(err).message);
    }
  };

  const submitEdit = async () => {
    try {
      const values = await editForm.validateFields();
      await apiClient.patch<{ data: { user: typeof user } }>(`/users/${user?.id}`, {
        name: values.name.trim(),
        email: values.email?.trim() || undefined,
      });
      message.success('Профиль обновлён');
      setEditOpen(false);
      await refreshAuth();
    } catch (err) {
      if (editForm.isFieldTouched?.('name') || editForm.isFieldTouched?.('email')) {
        message.error(getApiError(err).message);
      }
    }
  };

  if (!currentRoom) {
    return (
      <Page>
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
      </Page>
    );
  }

  const ownerCount = members.filter((m) => m.role === 'OWNER').length;

  return (
    <Page>
      <Shell initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <HeroCard initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <HeroPattern />
          <HeroRow>
            <div>
              <HeroHeading>Команда · {currentRoom.name}</HeroHeading>
              <HeroSubtitle>
                {members.length} {members.length === 1 ? 'участник' : 'участников'} · {ownerCount} {ownerCount === 1 ? 'владелец' : 'владельцев'}
              </HeroSubtitle>
            </div>
            <HeroActions>
              <HeroBtn $variant="ghost" onClick={copyInvite}>
                <CopyOutlined /> {currentRoom.inviteCode}
              </HeroBtn>
              {isOwner && (
                <HeroBtn onClick={handleRegenerate} disabled={regenerateInvite.isPending}>
                  <UserAddOutlined /> Новый код
                </HeroBtn>
              )}
              <HeroBtn onClick={() => navigate('/rooms/manage')}>
                <SettingOutlined /> Управление
              </HeroBtn>
            </HeroActions>
          </HeroRow>

          <StatsRow>
            <StatTile>
              <span className="value">{members.length}</span>
              <span className="label">В команде</span>
            </StatTile>
            <StatTile>
              <span className="value">{totalStats?.apartments ?? '—'}</span>
              <span className="label">Объектов</span>
            </StatTile>
            <StatTile>
              <span className="value">{totalStats?.callbacks ?? '—'}</span>
              <span className="label">Перезвонов</span>
            </StatTile>
            <StatTile>
              <span className="value">{totalStats?.done ?? '—'}</span>
              <span className="label">Завершено</span>
            </StatTile>
          </StatsRow>
        </HeroCard>

        <ControlsRow>
          <SearchInput>
            <span className="icon"><SearchOutlined /></span>
            <input
              placeholder="Поиск по имени или email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Поиск участников"
            />
          </SearchInput>
          <ChipsRow>
            <FilterChip $active={roleFilter === 'all'} onClick={() => setRoleFilter('all')}>
              Все ({members.length})
            </FilterChip>
            <FilterChip $active={roleFilter === 'owner'} onClick={() => setRoleFilter('owner')}>
              <CrownOutlined /> Владельцы ({ownerCount})
            </FilterChip>
            <FilterChip $active={roleFilter === 'member'} onClick={() => setRoleFilter('member')}>
              Участники ({members.length - ownerCount})
            </FilterChip>
          </ChipsRow>
        </ControlsRow>

        {isOwner && (
          <Hint>
            <FilterOutlined />
            Вы владелец комнаты — можете удалять участников и обновлять код приглашения.
          </Hint>
        )}

        <TableCard initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
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
              description={members.length === 0 ? 'В команде пока никого' : 'Ничего не найдено'}
              style={{ padding: '40px 0' }}
            >
              {members.length === 0 && (
                <HeroBtn onClick={copyInvite}>
                  <CopyOutlined /> Скопировать код
                </HeroBtn>
              )}
            </Empty>
          ) : (
            <MemberGrid>
              {filtered.map((m, idx) => {
                const isSelf = m.id === user?.id;
                const isMemberOwner = m.role === 'OWNER';
                const memberStats = m.stats;
                const initials = initialsOf(m.name);
                const hue = hueFromId(m.id);
                return (
                  <MemberRow
                    key={m.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <Avatar $hue={hue} aria-hidden>
                      {initials}
                    </Avatar>
                    <Main>
                      <NameRow>
                        <NameText>{m.name}</NameText>
                        {isMemberOwner && (
                          <RoleTag $owner>
                            <CrownOutlined /> Владелец
                          </RoleTag>
                        )}
                        {!isMemberOwner && <RoleTag>Участник</RoleTag>}
                        {isSelf && <SelfBadge>Вы</SelfBadge>}
                      </NameRow>
                      {m.email && (
                        <Meta>
                          <span><MailOutlined /> {m.email}</span>
                          <span><ClockCircleOutlined /> с {dayjs(m.joinedAt).format('DD MMM YYYY')}</span>
                        </Meta>
                      )}
                      {!m.email && (
                        <Meta>
                          <span><ClockCircleOutlined /> с {dayjs(m.joinedAt).format('DD MMM YYYY')}</span>
                        </Meta>
                      )}
                    </Main>

                    <StatsInline>
                      {memberStats ? (
                        <>
                          <Tooltip title="Объектов в работе">
                            <StatPill $tone="amber">
                              <span className="value">{memberStats.apartments}</span>
                              <span className="label">{STATUS_LABELS.apartments}</span>
                            </StatPill>
                          </Tooltip>
                          <Tooltip title="Перезвонов">
                            <StatPill $tone="muted">
                              <span className="value">{memberStats.callbacks}</span>
                              <span className="label">{STATUS_LABELS.callbacks}</span>
                            </StatPill>
                          </Tooltip>
                          <Tooltip title="Просмотров">
                            <StatPill $tone="sage">
                              <span className="value">{memberStats.viewings}</span>
                              <span className="label">{STATUS_LABELS.viewings}</span>
                            </StatPill>
                          </Tooltip>
                        </>
                      ) : (
                        <StatPill $tone="muted">
                          <span className="value">…</span>
                          <span className="label">считаем</span>
                        </StatPill>
                      )}
                    </StatsInline>

                    <Actions>
                      {isSelf ? (
                        <Tooltip title="Редактировать свой профиль">
                          <IconBtn
                            $variant="primary"
                            onClick={() => setEditOpen(true)}
                            aria-label="Редактировать профиль"
                            className="btn-with-label"
                          >
                            <EditOutlined />
                            <span className="btn-label">Изменить</span>
                          </IconBtn>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Открыть профиль">
                          <IconBtn
                            onClick={() => navigate(`/users/${m.id}`)}
                            aria-label="Открыть профиль"
                          >
                            <IdcardOutlined />
                          </IconBtn>
                        </Tooltip>
                      )}
                      {isOwner && !isMemberOwner && !isSelf && (
                        <Tooltip title="Удалить из команды">
                          <IconBtn
                            $variant="danger"
                            onClick={() => confirmKick(m)}
                            aria-label="Удалить"
                          >
                            <DeleteOutlined />
                          </IconBtn>
                        </Tooltip>
                      )}
                      {!isOwner && isSelf && !isMemberOwner && (
                        <Tooltip title="Покинуть команду">
                          <IconBtn
                            $variant="danger"
                            onClick={() => {
                              modal.confirm({
                                title: 'Выйти из команды?',
                                content: 'Вы потеряете доступ к квартирам этой комнаты.',
                                okText: 'Выйти',
                                okButtonProps: { danger: true },
                                cancelText: 'Отмена',
                                onOk: handleLeave,
                              });
                            }}
                            aria-label="Покинуть"
                          >
                            <DeleteOutlined />
                          </IconBtn>
                        </Tooltip>
                      )}
                    </Actions>
                  </MemberRow>
                );
              })}
            </MemberGrid>
          )}
        </TableCard>

        <InviteCallout>
          <div>
            <div className="label">Код приглашения</div>
            <div className="code">{currentRoom.inviteCode}</div>
          </div>
          <HeroBtn onClick={copyInvite} style={{ marginLeft: 'auto' }}>
            <CopyOutlined /> Скопировать
          </HeroBtn>
        </InviteCallout>
      </Shell>

      <Modal
        title="Редактировать профиль"
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={submitEdit}
        okText="Сохранить"
        cancelText="Отмена"
        destroyOnClose
        okButtonProps={{ autoFocus: true }}
      >
        <Form form={editForm} layout="vertical" preserve={false}>
          <FormRow>
            <label htmlFor="team-edit-name">Имя</label>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Введите имя' }, { min: 2, message: 'Минимум 2 символа' }]}
              noStyle
            >
              <input id="team-edit-name" placeholder="Ваше имя" />
            </Form.Item>
          </FormRow>
          <FormRow>
            <label htmlFor="team-edit-email">Email</label>
            <Form.Item
              name="email"
              rules={[{ type: 'email', message: 'Не похоже на email' }]}
              noStyle
            >
              <input id="team-edit-email" placeholder="email@example.com" />
            </Form.Item>
          </FormRow>
        </Form>
      </Modal>
    </Page>
  );
}
