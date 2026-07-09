import {
  DashboardOutlined, HomeOutlined, BellOutlined, UserOutlined,
} from '@ant-design/icons';
import { BottomBar, BottomItem, BottomLabel } from '../styled';

const NAV_ITEMS = [
  { key: '/dashboard', label: 'Дашборд', icon: <DashboardOutlined /> },
  { key: '/apartments', label: 'Квартиры', icon: <HomeOutlined /> },
  { key: '/reminders', label: 'Напоминания', icon: <BellOutlined /> },
  { key: '/profile', label: 'Профиль', icon: <UserOutlined /> },
];

export function BottomNav() {
  return (
    <BottomBar role="navigation" aria-label="Главная навигация">
      {NAV_ITEMS.map(({ key, label, icon }) => (
        <BottomItem
          key={key}
          to={key}
          end={key === '/'}
          aria-label={label}
        >
          <span className="bottom-icon">{icon}</span>
          <BottomLabel>{label}</BottomLabel>
        </BottomItem>
      ))}
    </BottomBar>
  );
}