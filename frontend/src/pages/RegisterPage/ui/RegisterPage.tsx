import { Link } from 'react-router-dom';
import { Form } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { ManifestoPane } from '@/pages/Auth/ManifestoPane';
import {
  Shell, Work, WorkTopBar, TabSwitch, Tab, FormFrame, FormTitle,
  FormSubtitle, FormStyled, FieldInput, PasswordFieldInput, SubmitBtn,
  SwitchLink, SavedChip, WorkFooter, ErrorBanner,
} from '@/pages/Auth/shared';
import { formatSavedAt } from '@/pages/Auth/useDraft';
import { themeFontsMono } from '../lib/utils';
import { useRegisterPage } from '../hooks/useRegisterPage';
import type { RegisterValues } from '../model/types';

export function RegisterPage() {
  const { state, form, draft, onValuesChange, onFinish } = useRegisterPage();

  return (
    <Shell>
      <ManifestoPane
        eyebrow="Новая рабочая комната · 4 поля"
        headlinePrefix="Заведи"
        headlineItalic="комнату."
        headlineTail="Лови листинг."
        lede="Один аккаунт — одна комната поиска. Приглашай команду, кидай ссылки с Cian и Domclick, ставь теги. Покажем квартиру раньше, чем её снимут."
        stampLabel="свежий аккаунт"
        ticker="комнат создано сегодня · вход по логину или email"
        footerLeft="FF · onboarding"
        footerRight="шаг 1 из 1"
      />

      <Work>
        <WorkTopBar>
          <span>регистрация · шаг 1 из 1</span>
          <TabSwitch>
            <Tab href="/login" $active={false}>Вход</Tab>
            <Tab href="/register" $active>Регистрация</Tab>
          </TabSwitch>
        </WorkTopBar>

        <FormFrame
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1], delay: 0.1 }}
        >
          <div>
            <FormTitle>Откроем <span>новую комнату.</span></FormTitle>
            <FormSubtitle style={{ marginTop: 10 }}>
              Заполни четыре поля — комната появится сразу после входа.
            </FormSubtitle>
          </div>

          {state.error && <ErrorBanner role="alert">{state.error}</ErrorBanner>}

          <FormStyled
            layout="vertical"
            onFinish={(v) => { void onFinish(v as RegisterValues); }}
            onValuesChange={(_, all) => onValuesChange(_, all as RegisterValues)}
            requiredMark={false}
            autoComplete="on"
          >
            <Form.Item
              label="Имя"
              name="name"
              rules={[
                { required: true, message: 'Введите имя' },
                { min: 2, message: 'Минимум 2 символа' },
              ]}
            >
              <FieldInput prefix={<UserOutlined />} placeholder="Анна Петрова" autoComplete="name" size="large" />
            </Form.Item>

            <Form.Item
              label="Логин"
              name="username"
              rules={[
                { required: true, message: 'Введите логин' },
                { min: 3, message: 'Минимум 3 символа' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: 'Только буквы, цифры и _' },
              ]}
            >
              <FieldInput prefix={<IdcardOutlined />} placeholder="anna_p" autoComplete="username" size="large" />
            </Form.Item>

            <Form.Item
              label="Email · опционально"
              name="email"
              rules={[{ type: 'email', message: 'Некорректный email' }]}
            >
              <FieldInput prefix={<MailOutlined />} placeholder="anna@example.com" autoComplete="email" size="large" />
            </Form.Item>

            <Form.Item
              label="Пароль"
              name="password"
              rules={[
                { required: true, message: 'Введите пароль' },
                { min: 6, message: 'Минимум 6 символов' },
              ]}
              extra={<span style={{ fontFamily: themeFontsMono(), fontSize: 11, color: 'rgba(244,239,230,0.45)', letterSpacing: '0.06em' }}>6+ символов · только ты его увидишь</span>}
            >
              <PasswordFieldInput prefix={<LockOutlined />} placeholder="придумай пароль" autoComplete="new-password" size="large" />
            </Form.Item>

            <SubmitBtn type="primary" htmlType="submit" loading={state.loading}>
              {state.loading ? 'Создаём комнату…' : 'Открыть комнату'}
            </SubmitBtn>
          </FormStyled>

          <SwitchLink>
            Уже есть аккаунт? <Link to="/login">Войти в реестр</Link>
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