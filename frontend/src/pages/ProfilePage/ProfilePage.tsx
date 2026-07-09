import React, { useEffect, useState } from 'react';
import { Avatar, Button, Descriptions, Skeleton, message } from 'antd';
import {
  UserOutlined, MailOutlined, CalendarOutlined,
  LogoutOutlined, ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { authApi } from '../../shared/api/endpoints';
import type { User } from '../../shared/api/types';
import { useAuth } from '../../app/providers/AuthProvider';
import { theme } from '../../app/styles/theme';
import {
  PageHeader, PageTitle, Card, TopBlock, AvatarWrap, Name, Role,
  MetaRow, MetaItem, MetaIcon, MetaText, Actions,
} from './styled';

dayjs.locale('ru');

export function ProfilePage() {
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      message.error('Не удалось загрузить профиль');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <PageHeader>
        <PageTitle>Профиль</PageTitle>
        <Actions>
          <Button
            icon={<ReloadOutlined />}
            onClick={load}
            loading={loading}
          >
            Обновить
          </Button>
          <Button
            danger
            icon={<LogoutOutlined />}
            onClick={logout}
          >
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
                    background: theme.colors.bg.cardHover,
                    color: theme.colors.text.inverse,
                    fontSize: 36,
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
              labelStyle={{ color: theme.colors.text.muted, width: 140 }}
              contentStyle={{ color: theme.colors.text.inverse }}
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
    </>
  );
}