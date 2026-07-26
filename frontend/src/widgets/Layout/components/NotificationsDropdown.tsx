import { useNavigate } from 'react-router-dom';
import { Empty, Tooltip, message } from 'antd';
import {
  CheckOutlined, ClockCircleOutlined, WarningOutlined, HomeOutlined, ArrowRightOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';
import { remindersApi } from '../../../shared/api/endpoints';
import type { Reminder } from '../../../shared/api/types';
import {
  Panel, PanelHeader, PanelTitle, PanelCount, PanelList, PanelItem, ItemBody,
  ItemTitle, ItemMeta, ItemTime, ItemApt, ItemActions, MarkDone, PanelFooter, FooterLink,
} from './NotificationsDropdown/styled';

dayjs.extend(relativeTime);
dayjs.locale('ru');

interface Props {
  items: Reminder[];
  total: number;
  onChanged: () => void;
}

export function NotificationsDropdown({ items, total, onChanged }: Props) {
  const navigate = useNavigate();

  const markDone = async (id: string) => {
    try {
      await remindersApi.update(id, { status: 'DONE' });
      message.success('Выполнено');
      onChanged();
    } catch {
      message.error('Не удалось обновить');
    }
  };

  const go = (path: string) => {
    navigate(path);
  };

  return (
    <Panel role="dialog" aria-label="Уведомления">
      <PanelHeader>
        <PanelTitle>Активные напоминания</PanelTitle>
        <PanelCount>{total}</PanelCount>
      </PanelHeader>

      <PanelList>
        {items.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Нет активных напоминаний"
            styles={{ image: { height: 48 } }}
          />
        ) : (
          items.map((r) => {
            const overdue = new Date(r.dueAt) < new Date();
            return (
              <PanelItem key={r.id} $overdue={overdue}>
                <ItemBody>
                  <ItemTitle>{r.title}</ItemTitle>
                  <ItemMeta>
                    <ItemTime $overdue={overdue}>
                      {overdue ? <WarningOutlined /> : <ClockCircleOutlined />}
                      <span>{dayjs(r.dueAt).format('D MMM, HH:mm')}</span>
                    </ItemTime>
                    {r.apartment && (
                      <ItemApt
                        role="button"
                        tabIndex={0}
                        onClick={() => go(`/apartments/${r.apartment!.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') go(`/apartments/${r.apartment!.id}`);
                        }}
                      >
                        <HomeOutlined /> {r.apartment.title}
                      </ItemApt>
                    )}
                  </ItemMeta>
                </ItemBody>
                <ItemActions>
                  <Tooltip title="Отметить выполненным">
                    <MarkDone
                      type="button"
                      aria-label={`Отметить «${r.title}» выполненным`}
                      onClick={() => markDone(r.id)}
                    >
                      <CheckOutlined />
                    </MarkDone>
                  </Tooltip>
                </ItemActions>
              </PanelItem>
            );
          })
        )}
      </PanelList>

      <PanelFooter>
        <FooterLink type="button" onClick={() => go('/reminders')}>
          Все напоминания
          <ArrowRightOutlined />
        </FooterLink>
      </PanelFooter>
    </Panel>
  );
}
