import {
  DashboardOutlined, HomeOutlined, BellOutlined, UserOutlined, TeamOutlined,
} from '@ant-design/icons';
import { Badge } from 'antd';
import { BottomBar, BottomItem, BottomLabel, BottomIconWrap } from '../styled';
import { usePendingReminders } from '../hooks/usePendingReminders';

const NAV_ITEMS = [
  { key: '/dashboard', label: 'Дашборд', icon: <DashboardOutlined /> },
  { key: '/apartments', label: 'Квартиры', icon: <HomeOutlined /> },
  { key: '/team', label: 'Команда', icon: <TeamOutlined /> },
  { key: '/reminders', label: 'Напомин.', icon: <BellOutlined /> },
  { key: '/profile', label: 'Профиль', icon: <UserOutlined /> },
];

export function BottomNav() {
  const { pendingCount } = usePendingReminders();

  return (
    <BottomBar role="navigation" aria-label="Главная навигация">
      {NAV_ITEMS.map(({ key, label, icon }) => {
        const isReminders = key === '/reminders';
        return (
          <BottomItem key={key} to={key} aria-label={label}>
            <BottomIconWrap>
              {isReminders ? (
                <Badge
                  count={pendingCount}
                  overflowCount={99}
                  color="#964325"
                  offset={[-6, 4]}
                  title={`${pendingCount} активных напоминаний`}
                >
                  <span className="bottom-icon">{icon}</span>
                </Badge>
              ) : (
                <span className="bottom-icon">{icon}</span>
              )}
            </BottomIconWrap>
            <BottomLabel>{label}</BottomLabel>
          </BottomItem>
        );
      })}
    </BottomBar>
  );
}
