import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Popconfirm, Skeleton, Tooltip, message,
} from 'antd';
import {
  ArrowLeftOutlined, EditOutlined, CopyOutlined, ReloadOutlined,
  LogoutOutlined, UsergroupAddOutlined, CrownOutlined, StopOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../app/providers/AuthProvider';
import { useRoom } from '../../app/providers/RoomProvider';
import {
  useGetRoomMembers,
  useUpdateRoom,
  useRegenerateInviteCode,
  useRemoveRoomMember,
  useLeaveRoom,
} from '../../entities/Room/hooks/useRooms';
import { getApiError } from '../../shared/api/client';
import {
  Page, Wrap, TopRow, Heading, Card, SectionTitle,
  RenameRow, PrimaryBtn, SecondaryBtn, DangerBtn,
  InviteBox, MemberList, MemberItem, MemberAvatar, MemberInfo,
  MemberName, MemberEmail, MemberRoleTag, MemberActions,
} from './styled';

export function RoomManagePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentRoom, clearRoom, refetchRooms } = useRoom();

  const roomId = currentRoom?.id;
  const isOwner = currentRoom?.role === 'OWNER';

  const { data: members = [], isLoading: membersLoading } = useGetRoomMembers(roomId ?? '');
  const updateRoom = useUpdateRoom();
  const regenerateInvite = useRegenerateInviteCode();
  const removeMember = useRemoveRoomMember();
  const leaveRoom = useLeaveRoom();

  const [editName, setEditName] = useState(currentRoom?.name ?? '');
  const [editing, setEditing] = useState(false);

  React.useEffect(() => {
    if (currentRoom && !editing) setEditName(currentRoom.name);
  }, [currentRoom, editing]);

  if (!currentRoom) {
    return (
      <Page>
        <Wrap>
          <TopRow>
            <PrimaryBtn icon={<ArrowLeftOutlined />} onClick={() => navigate('/rooms')}>
              Назад
            </PrimaryBtn>
          </TopRow>
          <Card>Комната не выбрана.</Card>
        </Wrap>
      </Page>
    );
  }

  const handleRename = async () => {
    if (editName.trim() === currentRoom.name || !editName.trim()) {
      setEditing(false);
      return;
    }
    try {
      await updateRoom.mutateAsync({ id: currentRoom.id, name: editName.trim() });
      message.success('Название обновлено');
      setEditing(false);
      refetchRooms();
    } catch (err) {
      message.error(getApiError(err).message);
    }
  };

  const handleRegenerate = async () => {
    try {
      await regenerateInvite.mutateAsync(currentRoom.id);
      message.success('Код приглашения обновлён');
      refetchRooms();
    } catch (err) {
      message.error(getApiError(err).message);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentRoom.inviteCode);
      message.success('Код скопирован');
    } catch {
      message.error('Не удалось скопировать');
    }
  };

  const handleKick = async (memberId: string, memberName: string) => {
    try {
      await removeMember.mutateAsync({ roomId: currentRoom.id, userId: memberId });
      message.success(`${memberName} удалён(а) из комнаты`);
      refetchRooms();
    } catch (err) {
      message.error(getApiError(err).message);
    }
  };

  const handleLeave = async () => {
    try {
      await leaveRoom.mutateAsync(currentRoom.id);
      message.success('Вы вышли из комнаты');
      clearRoom();
      navigate('/rooms');
    } catch (err) {
      message.error(getApiError(err).message);
    }
  };

  return (
    <Page>
      <Wrap>
        <TopRow>
          <SecondaryBtn icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Назад
          </SecondaryBtn>
          <Heading>Управление комнатой</Heading>
        </TopRow>

        <Card initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <SectionTitle>
            <EditOutlined /> Название комнаты
          </SectionTitle>
          {isOwner ? (
            <RenameRow>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                disabled={!editing}
                maxLength={100}
                aria-label="Название комнаты"
              />
              {editing ? (
                <>
                  <PrimaryBtn onClick={handleRename} loading={updateRoom.isPending}>
                    Сохранить
                  </PrimaryBtn>
                  <SecondaryBtn onClick={() => { setEditing(false); setEditName(currentRoom.name); }}>
                    Отмена
                  </SecondaryBtn>
                </>
              ) : (
                <SecondaryBtn icon={<EditOutlined />} onClick={() => setEditing(true)}>
                  Изменить
                </SecondaryBtn>
              )}
            </RenameRow>
          ) : (
            <RenameRow>
              <input value={currentRoom.name} disabled />
              <MemberRoleTag>Только владелец может переименовать</MemberRoleTag>
            </RenameRow>
          )}
        </Card>

        <Card initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <SectionTitle>
            <UsergroupAddOutlined /> Код приглашения
          </SectionTitle>
          <InviteBox>
            <span className="invite-code">{currentRoom.inviteCode}</span>
            <Tooltip title="Скопировать">
              <SecondaryBtn icon={<CopyOutlined />} onClick={handleCopy}>
                Копировать
              </SecondaryBtn>
            </Tooltip>
            {isOwner && (
              <Popconfirm
                title="Перегенерировать код?"
                description="Старый код перестанет работать"
                okText="Да"
                cancelText="Отмена"
                onConfirm={handleRegenerate}
              >
                <SecondaryBtn icon={<ReloadOutlined />} loading={regenerateInvite.isPending}>
                  Новый код
                </SecondaryBtn>
              </Popconfirm>
            )}
          </InviteBox>
        </Card>

        <Card initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SectionTitle>
            <UsergroupAddOutlined /> Участники ({members.length})
          </SectionTitle>
          {membersLoading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <MemberList>
              {members.map((m) => {
                const isMemberOwner = m.role === 'OWNER';
                const isSelf = m.id === user?.id;
                const initials = m.name
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((p) => p[0])
                  .join('')
                  .toUpperCase();
                return (
                  <MemberItem key={m.id}>
                    <MemberAvatar>{initials || 'U'}</MemberAvatar>
                    <MemberInfo>
                      <MemberName>
                        {m.name}
                        {isSelf && ' (вы)'}
                        {isMemberOwner && (
                          <CrownOutlined style={{ marginLeft: 8, color: '#9b6a2b' }} aria-label="Владелец" />
                        )}
                      </MemberName>
                      {m.email && <MemberEmail>{m.email}</MemberEmail>}
                    </MemberInfo>
                    <MemberRoleTag $owner={isMemberOwner}>
                      {isMemberOwner ? 'Владелец' : 'Участник'}
                    </MemberRoleTag>
                    {isOwner && !isMemberOwner && !isSelf && (
                      <MemberActions>
                        <Popconfirm
                          title={`Удалить ${m.name}?`}
                          description="Он потеряет доступ к квартирам этой комнаты"
                          okText="Удалить"
                          okButtonProps={{ danger: true }}
                          cancelText="Отмена"
                          onConfirm={() => handleKick(m.id, m.name)}
                        >
                          <DangerBtn danger icon={<StopOutlined />} size="middle">
                            Выгнать
                          </DangerBtn>
                        </Popconfirm>
                      </MemberActions>
                    )}
                  </MemberItem>
                );
              })}
            </MemberList>
          )}
        </Card>

        {!isOwner && (
          <Card initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <SectionTitle>
              <LogoutOutlined /> Покинуть комнату
            </SectionTitle>
            <Popconfirm
              title="Выйти из комнаты?"
              description="Вы потеряете доступ к квартирам этой комнаты"
              okText="Выйти"
              okButtonProps={{ danger: true }}
              cancelText="Отмена"
              onConfirm={handleLeave}
            >
              <DangerBtn danger icon={<LogoutOutlined />} loading={leaveRoom.isPending}>
                Покинуть комнату
              </DangerBtn>
            </Popconfirm>
          </Card>
        )}
      </Wrap>
    </Page>
  );
}