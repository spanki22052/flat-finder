import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, message, Skeleton } from 'antd';
import { HomeOutlined, PlusOutlined, KeyOutlined } from '@ant-design/icons';
import { useAuth } from '../../app/providers/AuthProvider';
import { useRoom } from '../../app/providers/RoomProvider';
import { useCreateRoom, useJoinRoom } from '../../entities/Room/hooks/useRooms';
import { getApiError } from '../../shared/api/client';
import {
  Page, Card, LogoArea, LogoIcon, Title, Subtitle,
  RoomList, RoomItem, RoomItemInfo, RoomItemName, RoomItemMeta, RoleTag,
  Divider, TabsRow, TabBtn, FormStyled, SubmitBtn, FooterText, EmptyHint,
} from './styled';

type Mode = 'create' | 'join';

export function RoomsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { rooms, isLoading, selectRoom } = useRoom();
  const createRoom = useCreateRoom();
  const joinRoom = useJoinRoom();
  const [mode, setMode] = useState<Mode>('create');
  const [createForm] = Form.useForm();
  const [joinForm] = Form.useForm();

  const goToDestination = () => {
    const from = (location.state as { from?: { pathname: string } } | null)?.from;
    navigate(from?.pathname ?? '/dashboard', { replace: true });
  };

  const handlePick = (roomId: string) => {
    selectRoom(roomId);
    goToDestination();
  };

  const handleCreate = async (values: unknown) => {
    const v = values as { name: string };
    try {
      const room = await createRoom.mutateAsync({ name: v.name });
      selectRoom(room.id);
      goToDestination();
    } catch (err) {
      message.error(getApiError(err).message);
    }
  };

  const handleJoin = async (values: unknown) => {
    const v = values as { inviteCode: string };
    try {
      const room = await joinRoom.mutateAsync({ inviteCode: v.inviteCode.trim().toUpperCase() });
      selectRoom(room.id);
      goToDestination();
    } catch (err) {
      message.error(getApiError(err).message);
    }
  };

  return (
    <Page>
      <Card initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <LogoArea>
          <LogoIcon>FF</LogoIcon>
          <Title>Выберите комнату</Title>
          <Subtitle>Комната объединяет квартиры, контакты и напоминания вашей команды</Subtitle>
        </LogoArea>

        {isLoading ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : rooms.length > 0 ? (
          <>
            <RoomList>
              {rooms.map((room) => (
                <RoomItem key={room.id} type="button" onClick={() => handlePick(room.id)}>
                  <RoomItemInfo>
                    <RoomItemName>{room.name}</RoomItemName>
                    <RoomItemMeta>
                      {room.membersCount} {room.membersCount === 1 ? 'участник' : 'участников'}
                    </RoomItemMeta>
                  </RoomItemInfo>
                  <RoleTag $owner={room.role === 'OWNER'}>
                    {room.role === 'OWNER' ? 'Владелец' : 'Участник'}
                  </RoleTag>
                </RoomItem>
              ))}
            </RoomList>
            <Divider>или</Divider>
          </>
        ) : (
          <EmptyHint>
            <HomeOutlined style={{ fontSize: 28, display: 'block', margin: '0 auto 12px' }} />
            У вас пока нет комнат. Создайте новую или присоединитесь по коду.
          </EmptyHint>
        )}

        <TabsRow>
          <TabBtn type="button" $active={mode === 'create'} onClick={() => setMode('create')}>
            <PlusOutlined /> Создать
          </TabBtn>
          <TabBtn type="button" $active={mode === 'join'} onClick={() => setMode('join')}>
            <KeyOutlined /> Присоединиться
          </TabBtn>
        </TabsRow>

        {mode === 'create' ? (
          <FormStyled layout="vertical" form={createForm} onFinish={handleCreate} requiredMark={false}>
            <Form.Item
              name="name"
              rules={[
                { required: true, message: 'Введите название комнаты' },
                { min: 1, max: 100, message: 'От 1 до 100 символов' },
              ]}
            >
              <Input placeholder="Например, «Поиск квартиры в Берлине»" size="large" />
            </Form.Item>
            <SubmitBtn type="primary" htmlType="submit" loading={createRoom.isPending}>
              Создать комнату
            </SubmitBtn>
          </FormStyled>
        ) : (
          <FormStyled layout="vertical" form={joinForm} onFinish={handleJoin} requiredMark={false}>
            <Form.Item
              name="inviteCode"
              rules={[{ required: true, message: 'Введите код приглашения' }]}
            >
              <Input placeholder="Код приглашения" size="large" style={{ textTransform: 'uppercase' }} />
            </Form.Item>
            <SubmitBtn type="primary" htmlType="submit" loading={joinRoom.isPending}>
              Присоединиться
            </SubmitBtn>
          </FormStyled>
        )}

        <FooterText>
          <Button type="link" onClick={logout}>
            Выйти из аккаунта
          </Button>
        </FooterText>
      </Card>
    </Page>
  );
}
