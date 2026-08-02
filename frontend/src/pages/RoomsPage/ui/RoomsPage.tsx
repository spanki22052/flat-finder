import { Form, Skeleton } from 'antd';
import { PlusOutlined, KeyOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '@/app/providers/AuthProvider';
import { useRoom } from '@/app/providers/RoomProvider';
import { formatInviteCode } from '@/entities/Room/utils/inviteCode';
import { theme } from '@/app/styles/theme';
import type { CreateRoomValues, JoinRoomValues } from '../model/types';
import { useRoomsPage } from '../hooks/useRoomsPage';
import * as Styled from './RoomsPage.styled';

export function RoomsPage() {
  const { user } = useAuth();
  const { rooms, isLoading } = useRoom();
  const ctrl = useRoomsPage();

  return (
    <Styled.Shell>
      <Styled.Dossier>
        <Styled.DossierHeader>
          <span>FF · реестр комнат · {user?.name ?? user?.username ?? 'гость'}</span>
          <Styled.DossierStamp>выбор комнаты</Styled.DossierStamp>
        </Styled.DossierHeader>

        <Styled.HeroBlock>
          <Styled.Eyebrow>шаг 02 — рабочая комната</Styled.Eyebrow>
          <Styled.Headline
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
          >
            Заселись <span>в комнату.</span>
          </Styled.Headline>
          <Styled.Lede>
            Комната — это общий реестр квартир, контактов и напоминаний. Одна команда, одна комната.
            Создай новую или присоединись по коду, который прислала команда.
          </Styled.Lede>
        </Styled.HeroBlock>

        <Styled.Ledger>
          <Styled.LedgerHeader>
            <span>№</span>
            <span>Название</span>
            <span>Роль</span>
            <span>Участн.</span>
          </Styled.LedgerHeader>

          {isLoading ? (
            <Styled.LedgerEmpty>
              <span>загрузка</span>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Styled.LedgerEmpty>
          ) : rooms.length === 0 ? (
            <Styled.LedgerEmpty>
              <span>комнат пока нет</span>
              <div>Создай первую или присоединись по коду — оба варианта справа.</div>
            </Styled.LedgerEmpty>
          ) : (
            <Styled.LedgerList>
              {rooms.map((room, idx) => (
                <Styled.LedgerRow
                  key={room.id}
                  $active={ctrl.hoveredId === room.id}
                  onMouseEnter={() => ctrl.setHoveredId(room.id)}
                  onMouseLeave={() => ctrl.setHoveredId(null)}
                  onClick={() => ctrl.handlePick(room.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      ctrl.handlePick(room.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Открыть комнату ${room.name}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.05, duration: 0.35 }}
                >
                  <Styled.LedgerNum>{String(idx + 1).padStart(2, '0')}</Styled.LedgerNum>
                  <Styled.LedgerName>{room.name}</Styled.LedgerName>
                  <Styled.LedgerRole $owner={room.role === 'OWNER'}>
                    {room.role === 'OWNER' ? 'владелец' : 'участник'}
                  </Styled.LedgerRole>
                  <Styled.LedgerCount>{room.membersCount}</Styled.LedgerCount>
                </Styled.LedgerRow>
              ))}
            </Styled.LedgerList>
          )}
        </Styled.Ledger>

        <Styled.DossierFooter>
          <span>FF · комнат: {ctrl.stats.totalRooms} · людей: {ctrl.stats.totalPeople}</span>
          <span>моих: {ctrl.stats.totalOwners}</span>
        </Styled.DossierFooter>
      </Styled.Dossier>

      <Styled.Work>
        <Styled.WorkTopBar>
          <span>комната · шаг 02 из 02</span>
          <Styled.TabSwitch role="tablist">
            <Styled.Tab
              type="button"
              role="tab"
              aria-selected={ctrl.mode === 'create'}
              $active={ctrl.mode === 'create'}
              onClick={() => ctrl.setMode('create')}
            >
              <PlusOutlined /> Создать
            </Styled.Tab>
            <Styled.Tab
              type="button"
              role="tab"
              aria-selected={ctrl.mode === 'join'}
              $active={ctrl.mode === 'join'}
              onClick={() => ctrl.setMode('join')}
            >
              <KeyOutlined /> Код
            </Styled.Tab>
          </Styled.TabSwitch>
        </Styled.WorkTopBar>

        <Styled.Folio>
          <span>{ctrl.folio.num}</span>
          <em style={{ fontStyle: 'normal' }}>{ctrl.folio.label}</em>
        </Styled.Folio>

        <Styled.FormFrame
          key={ctrl.mode}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1], delay: 0.1 }}
        >
          <div>
            {ctrl.mode === 'create' ? (
              <>
                <Styled.FormTitle>Откроем <span>новую комнату.</span></Styled.FormTitle>
                <Styled.FormSubtitle style={{ marginTop: 10 }}>
                  Назови её так, чтобы коллеги сразу поняли — <em>«поиск в Берлине»</em>,
                  <em> «для мамы»</em>, <em>«офис в Москве»</em>.
                </Styled.FormSubtitle>
              </>
            ) : (
              <>
                <Styled.FormTitle>Войди <span>по коду.</span></Styled.FormTitle>
                <Styled.FormSubtitle style={{ marginTop: 10 }}>
                  Код прислал владелец комнаты — вставь его целиком, регистр не важен.
                </Styled.FormSubtitle>
              </>
            )}
          </div>

          {ctrl.error && <Styled.ErrorBanner role="alert">{ctrl.error}</Styled.ErrorBanner>}

          {ctrl.mode === 'create' ? (
            <Styled.FormStyled
              layout="vertical"
              form={ctrl.createForm as unknown as import('antd').FormInstance}
              onFinish={(v) => { void ctrl.handleCreate(v as CreateRoomValues); }}
              requiredMark={false}
            >
              <Form.Item
                label="Название комнаты"
                name="name"
                rules={[
                  { required: true, message: 'Введите название комнаты' },
                  { min: 1, max: 100, message: 'От 1 до 100 символов' },
                  { whitespace: true, message: 'Название не может быть пустым' },
                ]}
              >
                <Styled.FieldInput placeholder="Поиск квартиры в Берлине" size="large" autoComplete="off" maxLength={100} />
              </Form.Item>
              <Styled.HelperText>
                <Styled.GreenDot /> Имя увидит вся команда · переименовать можно в разделе «Управление»
              </Styled.HelperText>
              <Styled.SubmitBtn type="primary" htmlType="submit" loading={ctrl.createPending}>
                {ctrl.createPending ? 'Создаём комнату…' : 'Открыть комнату'}
              </Styled.SubmitBtn>
              <Styled.QuickRow>
                <Styled.QuickChip>теги · статусы · напоминания</Styled.QuickChip>
                <Styled.QuickChip>парсер ссылок</Styled.QuickChip>
                <Styled.QuickChip>журнал звонков</Styled.QuickChip>
              </Styled.QuickRow>
            </Styled.FormStyled>
          ) : (
            <Styled.FormStyled
              layout="vertical"
              form={ctrl.joinForm as unknown as import('antd').FormInstance}
              onFinish={(v) => { void ctrl.handleJoin(v as JoinRoomValues); }}
              requiredMark={false}
            >
              <Form.Item
                label="Код приглашения"
                name="inviteCode"
                rules={[
                  { required: true, message: 'Введите код приглашения' },
                  { min: 4, max: 32, message: 'Код выглядит короче или длиннее' },
                ]}
                getValueFromEvent={(e) => formatInviteCode((e.target as HTMLInputElement).value)}
              >
                <Styled.FieldInput
                  placeholder="ABCD-1234"
                  size="large"
                  autoComplete="off"
                  autoCapitalize="characters"
                  style={{ fontFamily: theme.fonts.mono }}
                />
              </Form.Item>
              <Styled.HelperText>
                <Styled.GreenDot /> Обычно 8–12 символов · буквы и цифры · тире необязательны
              </Styled.HelperText>
              <Styled.SubmitBtn type="primary" htmlType="submit" loading={ctrl.joinPending}>
                {ctrl.joinPending ? 'Проверяем код…' : 'Войти в комнату'}
              </Styled.SubmitBtn>
              <Styled.QuickRow>
                <Styled.QuickChip>код выдал владелец</Styled.QuickChip>
                <Styled.QuickChip>после входа — сразу к реестру</Styled.QuickChip>
              </Styled.QuickRow>
            </Styled.FormStyled>
          )}

          <Styled.SignOutBtn type="link" onClick={ctrl.handleLogout} icon={<LogoutOutlined />}>
            выйти из аккаунта
          </Styled.SignOutBtn>
        </Styled.FormFrame>

        <Styled.WorkFooter>
          <span>FF · secure session · {user?.email ?? 'login only'}</span>
          <span>© 2026</span>
        </Styled.WorkFooter>
      </Styled.Work>
    </Styled.Shell>
  );
}