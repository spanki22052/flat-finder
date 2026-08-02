import { Popconfirm, Skeleton, Tooltip } from 'antd';
import {
  ArrowLeftOutlined, EditOutlined, CopyOutlined, ReloadOutlined,
  LogoutOutlined, UsergroupAddOutlined, CrownOutlined, StopOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRoomManagePage } from '../hooks/useRoomManagePage';
import * as Styled from './RoomManagePage.styled';

export function RoomManagePage() {
  const ctrl = useRoomManagePage();
  const navigate = useNavigate();

  if (!ctrl.currentRoom) {
    return (
      <Styled.Page>
        <Styled.Wrap>
          <Styled.TopRow>
            <Styled.PrimaryBtn icon={<ArrowLeftOutlined />} onClick={() => navigate('/rooms')}>
              Назад
            </Styled.PrimaryBtn>
          </Styled.TopRow>
          <Styled.Card>Комната не выбрана.</Styled.Card>
        </Styled.Wrap>
      </Styled.Page>
    );
  }

  return (
    <Styled.Page>
      <Styled.Wrap>
        <Styled.TopRow>
          <Styled.SecondaryBtn icon={<ArrowLeftOutlined />} onClick={ctrl.goBack}>
            Назад
          </Styled.SecondaryBtn>
          <Styled.Heading>Управление комнатой</Styled.Heading>
        </Styled.TopRow>

        <Styled.Card initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Styled.SectionTitle>
            <EditOutlined /> Название комнаты
          </Styled.SectionTitle>
          {ctrl.isOwner ? (
            <Styled.RenameRow>
              <input
                value={ctrl.editName}
                onChange={(e) => ctrl.setEditName(e.target.value)}
                disabled={!ctrl.editing}
                maxLength={100}
                aria-label="Название комнаты"
              />
              {ctrl.editing ? (
                <>
                  <Styled.PrimaryBtn onClick={() => { void ctrl.handleRename(); }} loading={ctrl.renamePending}>
                    Сохранить
                  </Styled.PrimaryBtn>
                  <Styled.SecondaryBtn onClick={() => { ctrl.setEditing(false); ctrl.setEditName(ctrl.currentRoom!.name); }}>
                    Отмена
                  </Styled.SecondaryBtn>
                </>
              ) : (
                <Styled.SecondaryBtn icon={<EditOutlined />} onClick={() => ctrl.setEditing(true)}>
                  Изменить
                </Styled.SecondaryBtn>
              )}
            </Styled.RenameRow>
          ) : (
            <Styled.RenameRow>
              <input value={ctrl.currentRoom.name} disabled />
              <Styled.MemberRoleTag>Только владелец может переименовать</Styled.MemberRoleTag>
            </Styled.RenameRow>
          )}
        </Styled.Card>

        <Styled.Card initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Styled.SectionTitle>
            <UsergroupAddOutlined /> Код приглашения
          </Styled.SectionTitle>
          <Styled.InviteBox>
            <span className="invite-code">{ctrl.currentRoom.inviteCode}</span>
            <Tooltip title="Скопировать">
              <Styled.SecondaryBtn icon={<CopyOutlined />} onClick={() => { void ctrl.handleCopy(); }}>
                Копировать
              </Styled.SecondaryBtn>
            </Tooltip>
            {ctrl.isOwner && (
              <Popconfirm
                title="Перегенерировать код?"
                description="Старый код перестанет работать"
                okText="Да"
                cancelText="Отмена"
                onConfirm={() => { void ctrl.handleRegenerate(); }}
              >
                <Styled.SecondaryBtn icon={<ReloadOutlined />} loading={ctrl.regeneratePending}>
                  Новый код
                </Styled.SecondaryBtn>
              </Popconfirm>
            )}
          </Styled.InviteBox>
        </Styled.Card>

        <Styled.Card initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Styled.SectionTitle>
            <UsergroupAddOutlined /> Участники ({ctrl.members.length})
          </Styled.SectionTitle>
          {ctrl.membersLoading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <Styled.MemberList>
              {ctrl.members.map((m) => {
                const isMemberOwner = m.role === 'OWNER';
                return (
                  <Styled.MemberItem key={m.id}>
                    <Styled.MemberAvatar>{m.initials}</Styled.MemberAvatar>
                    <Styled.MemberInfo>
                      <Styled.MemberName>
                        {m.name}
                        {m.isSelf && ' (вы)'}
                        {isMemberOwner && (
                          <CrownOutlined style={{ marginLeft: 8, color: '#9b6a2b' }} aria-label="Владелец" />
                        )}
                      </Styled.MemberName>
                      {m.email && <Styled.MemberEmail>{m.email}</Styled.MemberEmail>}
                    </Styled.MemberInfo>
                    <Styled.MemberRoleTag $owner={isMemberOwner}>
                      {isMemberOwner ? 'Владелец' : 'Участник'}
                    </Styled.MemberRoleTag>
                    {ctrl.isOwner && !isMemberOwner && !m.isSelf && (
                      <Styled.MemberActions>
                        <Popconfirm
                          title={`Удалить ${m.name}?`}
                          description="Он потеряет доступ к квартирам этой комнаты"
                          okText="Удалить"
                          okButtonProps={{ danger: true }}
                          cancelText="Отмена"
                          onConfirm={() => { void ctrl.handleKick(m.id, m.name); }}
                        >
                          <Styled.DangerBtn danger icon={<StopOutlined />} size="middle">
                            Выгнать
                          </Styled.DangerBtn>
                        </Popconfirm>
                      </Styled.MemberActions>
                    )}
                  </Styled.MemberItem>
                );
              })}
            </Styled.MemberList>
          )}
        </Styled.Card>

        {!ctrl.isOwner && (
          <Styled.Card initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Styled.SectionTitle>
              <LogoutOutlined /> Покинуть комнату
            </Styled.SectionTitle>
            <Popconfirm
              title="Выйти из комнаты?"
              description="Вы потеряете доступ к квартирам этой комнаты"
              okText="Выйти"
              okButtonProps={{ danger: true }}
              cancelText="Отмена"
              onConfirm={() => { void ctrl.handleLeave(); }}
            >
              <Styled.DangerBtn danger icon={<LogoutOutlined />} loading={ctrl.leavePending}>
                Покинуть комнату
              </Styled.DangerBtn>
            </Popconfirm>
          </Styled.Card>
        )}
      </Styled.Wrap>
    </Styled.Page>
  );
}