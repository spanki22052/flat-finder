import { Link } from 'react-router-dom';
import { Form } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { ManifestoPane } from '@/pages/Auth/ManifestoPane';
import {
  Shell, Work, WorkTopBar, TabSwitch, Tab, FormFrame, FormTitle,
  FormSubtitle, FormStyled, FieldInput, PasswordFieldInput, SubmitBtn,
  SwitchLink, SavedChip, WorkFooter, ErrorBanner,
} from '@/pages/Auth/shared';
import { formatSavedAt } from '@/pages/Auth/useDraft';
import { useLoginPage } from '../hooks/useLoginPage';
import type { LoginValues } from '../model/types';

export function LoginPage() {
  const { state, form, draft, onValuesChange, onFinish } = useLoginPage();

  return (
    <Shell>
      <ManifestoPane
        eyebrow="Реестр квартир · команда · поиск"
        headlinePrefix="Вернись"
        headlineItalic="к списку."
        headlineTail="Без потерь."
        lede="Каждое объявление, каждый звонок и каждое напоминание ждут тебя там, где ты их оставил. Войди — и продолжай с того места, на котором остановился."
        stampLabel="доступ открыт"
        ticker="комнат онлайн · черновики синхронизируются"
        footerLeft="FF · 2026"
        footerRight="версия 0.4.1"
      />

      <Work>
        <WorkTopBar>
          <span>авторизация · шаг 1 из 1</span>
          <TabSwitch>
            <Tab href="/login" $active>Вход</Tab>
            <Tab href="/register" $active={false}>Регистрация</Tab>
          </TabSwitch>
        </WorkTopBar>

        <FormFrame
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1], delay: 0.1 }}
        >
          <div>
            <FormTitle>С возвращением <span>в реестр.</span></FormTitle>
            <FormSubtitle style={{ marginTop: 10 }}>
              Введи логин или email — и мы откроем твою рабочую комнату.
            </FormSubtitle>
          </div>

          {state.error && <ErrorBanner role="alert">{state.error}</ErrorBanner>}

          <FormStyled
            layout="vertical"
            onFinish={(v) => { void onFinish(v as LoginValues); }}
            onValuesChange={(_, all) => onValuesChange(_, all as LoginValues)}
            requiredMark={false}
            autoComplete="on"
          >
            <Form.Item
              label="Логин или email"
              name="login"
              rules={[{ required: true, message: 'Введите логин или email' }]}
            >
              <FieldInput
                prefix={<UserOutlined />}
                placeholder="agent_07 или you@example.com"
                autoComplete="username"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Пароль"
              name="password"
              rules={[{ required: true, message: 'Введите пароль' }]}
            >
              <PasswordFieldInput
                prefix={<LockOutlined />}
                placeholder="минимум 6 символов"
                autoComplete="current-password"
                size="large"
              />
            </Form.Item>

            <SubmitBtn type="primary" htmlType="submit" loading={state.loading}>
              {state.loading ? 'Открываем комнату…' : 'Войти в реестр'}
            </SubmitBtn>
          </FormStyled>

          <SwitchLink>
            Первый раз здесь? <Link to="/register">Завести рабочую комнату</Link>
          </SwitchLink>

          <SavedChip>
            <span />
            <span>{formatSavedAt(draft.savedAt)}</span>
          </SavedChip>
        </FormFrame>

        <WorkFooter>
          <span>FF · secure session</span>
          <span>© 2026</span>
        </WorkFooter>
      </Work>
    </Shell>
  );
}