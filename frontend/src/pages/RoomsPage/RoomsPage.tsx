import React, { useState, useMemo } from 'react';
import { Form, Skeleton } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusOutlined, KeyOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../../app/providers/AuthProvider';
import { useRoom } from '../../app/providers/RoomProvider';
import { useCreateRoom, useJoinRoom } from '../../entities/Room/hooks/useRooms';
import { getApiError } from '../../shared/api/client';
import { formatInviteCode } from '../../entities/Room/utils/inviteCode';
import { theme } from '../../app/styles/theme';
import {
  Shell, Dossier, DossierHeader, DossierStamp, HeroBlock, Eyebrow, Headline, Lede,
  Ledger, LedgerHeader, LedgerList, LedgerEmpty, LedgerRow, LedgerNum, LedgerName,
  LedgerRole, LedgerCount, DossierFooter,
  Work, WorkTopBar, TabSwitch, Tab, Folio, FormFrame, FormTitle, FormSubtitle,
  FormStyled, FieldInput, HelperText, GreenDot, SubmitBtn, SignOutBtn, WorkFooter,
  ErrorBanner, QuickRow, QuickChip,
} from './styled';

type Mode = 'create' | 'join';

export function RoomsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { rooms, isLoading, selectRoom } = useRoom();
  const createRoom = useCreateRoom();
  const joinRoom = useJoinRoom();
  const [mode, setMode] = useState<Mode>('create');
  const [createForm] = Form.useForm();
  const [joinForm] = Form.useForm();
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
    setError(null);
    try {
      const room = await createRoom.mutateAsync({ name: v.name.trim() });
      selectRoom(room.id);
      goToDestination();
    } catch (err) {
      setError(getApiError(err).message);
    }
  };

  const handleJoin = async (values: unknown) => {
    const v = values as { inviteCode: string };
    setError(null);
    try {
      const room = await joinRoom.mutateAsync({ inviteCode: v.inviteCode.trim().toUpperCase() });
      selectRoom(room.id);
      goToDestination();
    } catch (err) {
      setError(getApiError(err).message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  const folio = useMemo(() => {
    if (mode === 'create') return { num: '01', label: 'новая комната' };
    return { num: '02', label: 'по коду приглашения' };
  }, [mode]);

  const totalRooms = rooms.length;
  const totalOwners = rooms.filter((r) => r.role === 'OWNER').length;
  const totalPeople = rooms.reduce((sum, r) => sum + (r.membersCount ?? 0), 0);

  return (
    <Shell>
      <Dossier>
        <DossierHeader>
          <span>FF · реестр комнат · {user?.name ?? user?.username ?? 'гость'}</span>
          <DossierStamp>выбор комнаты</DossierStamp>
        </DossierHeader>

        <HeroBlock>
          <Eyebrow>шаг 02 — рабочая комната</Eyebrow>
          <Headline
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
          >
            Заселись <span>в комнату.</span>
          </Headline>
          <Lede>
            Комната — это общий реестр квартир, контактов и напоминаний. Одна команда, одна комната.
            Создай новую или присоединись по коду, который прислала команда.
          </Lede>
        </HeroBlock>

        <Ledger>
          <LedgerHeader>
            <span>№</span>
            <span>Название</span>
            <span>Роль</span>
            <span>Участн.</span>
          </LedgerHeader>

          {isLoading ? (
            <LedgerEmpty>
              <span>загрузка</span>
              <Skeleton active paragraph={{ rows: 2 }} />
            </LedgerEmpty>
          ) : totalRooms === 0 ? (
            <LedgerEmpty>
              <span>комнат пока нет</span>
              <div>Создай первую или присоединись по коду — оба варианта справа.</div>
            </LedgerEmpty>
          ) : (
            <LedgerList>
              {rooms.map((room, idx) => (
                <LedgerRow
                  key={room.id}
                  $active={hoveredId === room.id}
                  onMouseEnter={() => setHoveredId(room.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handlePick(room.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePick(room.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Открыть комнату ${room.name}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.05, duration: 0.35 }}
                >
                  <LedgerNum>{String(idx + 1).padStart(2, '0')}</LedgerNum>
                  <LedgerName>{room.name}</LedgerName>
                  <LedgerRole $owner={room.role === 'OWNER'}>
                    {room.role === 'OWNER' ? 'владелец' : 'участник'}
                  </LedgerRole>
                  <LedgerCount>{room.membersCount}</LedgerCount>
                </LedgerRow>
              ))}
            </LedgerList>
          )}
        </Ledger>

        <DossierFooter>
          <span>FF · комнат: {totalRooms} · людей: {totalPeople}</span>
          <span>моих: {totalOwners}</span>
        </DossierFooter>
      </Dossier>

      <Work>
        <WorkTopBar>
          <span>комната · шаг 02 из 02</span>
          <TabSwitch role="tablist">
            <Tab
              type="button"
              role="tab"
              aria-selected={mode === 'create'}
              $active={mode === 'create'}
              onClick={() => switchMode('create')}
            >
              <PlusOutlined /> Создать
            </Tab>
            <Tab
              type="button"
              role="tab"
              aria-selected={mode === 'join'}
              $active={mode === 'join'}
              onClick={() => switchMode('join')}
            >
              <KeyOutlined /> Код
            </Tab>
          </TabSwitch>
        </WorkTopBar>

        <Folio>
          <span>{folio.num}</span>
          <em style={{ fontStyle: 'normal' }}>{folio.label}</em>
        </Folio>

        <FormFrame
          key={mode}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1], delay: 0.1 }}
        >
          <div>
            {mode === 'create' ? (
              <>
                <FormTitle>Откроем <span>новую комнату.</span></FormTitle>
                <FormSubtitle style={{ marginTop: 10 }}>
                  Назови её так, чтобы коллеги сразу поняли — <em>«поиск в Берлине»</em>,
                  <em> «для мамы»</em>, <em>«офис в Москве»</em>.
                </FormSubtitle>
              </>
            ) : (
              <>
                <FormTitle>Войди <span>по коду.</span></FormTitle>
                <FormSubtitle style={{ marginTop: 10 }}>
                  Код прислал владелец комнаты — вставь его целиком, регистр не важен.
                </FormSubtitle>
              </>
            )}
          </div>

          {error && <ErrorBanner role="alert">{error}</ErrorBanner>}

          {mode === 'create' ? (
            <FormStyled layout="vertical" form={createForm} onFinish={handleCreate} requiredMark={false}>
              <Form.Item
                label="Название комнаты"
                name="name"
                rules={[
                  { required: true, message: 'Введите название комнаты' },
                  { min: 1, max: 100, message: 'От 1 до 100 символов' },
                  { whitespace: true, message: 'Название не может быть пустым' },
                ]}
              >
                <FieldInput
                  placeholder="Поиск квартиры в Берлине"
                  size="large"
                  autoComplete="off"
                  maxLength={100}
                />
              </Form.Item>
              <HelperText>
                <GreenDot /> Имя увидит вся команда · переименовать можно в разделе «Управление»
              </HelperText>
              <SubmitBtn type="primary" htmlType="submit" loading={createRoom.isPending}>
                {createRoom.isPending ? 'Создаём комнату…' : 'Открыть комнату'}
              </SubmitBtn>
              <QuickRow>
                <QuickChip>теги · статусы · напоминания</QuickChip>
                <QuickChip>парсер ссылок</QuickChip>
                <QuickChip>журнал звонков</QuickChip>
              </QuickRow>
            </FormStyled>
          ) : (
            <FormStyled layout="vertical" form={joinForm} onFinish={handleJoin} requiredMark={false}>
              <Form.Item
                label="Код приглашения"
                name="inviteCode"
                rules={[
                  { required: true, message: 'Введите код приглашения' },
                  { min: 4, max: 32, message: 'Код выглядит короче или длиннее' },
                ]}
                getValueFromEvent={(e) => formatInviteCode((e.target as HTMLInputElement).value)}
              >
                <FieldInput
                  placeholder="ABCD-1234"
                  size="large"
                  autoComplete="off"
                  autoCapitalize="characters"
                  style={{ fontFamily: theme.fonts.mono }}
                />
              </Form.Item>
              <HelperText>
                <GreenDot /> Обычно 8–12 символов · буквы и цифры · тире необязательны
              </HelperText>
              <SubmitBtn type="primary" htmlType="submit" loading={joinRoom.isPending}>
                {joinRoom.isPending ? 'Проверяем код…' : 'Войти в комнату'}
              </SubmitBtn>
              <QuickRow>
                <QuickChip>код выдал владелец</QuickChip>
                <QuickChip>после входа — сразу к реестру</QuickChip>
              </QuickRow>
            </FormStyled>
          )}

          <SignOutBtn type="link" onClick={handleLogout} icon={<LogoutOutlined />}>
            выйти из аккаунта
          </SignOutBtn>
        </FormFrame>

        <WorkFooter>
          <span>FF · secure session · {user?.email ?? 'login only'}</span>
          <span>© 2026</span>
        </WorkFooter>
      </Work>
    </Shell>
  );
}
