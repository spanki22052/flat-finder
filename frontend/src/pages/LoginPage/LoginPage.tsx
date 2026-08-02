import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../app/providers/AuthProvider';
import { ManifestoPane } from '../Auth/ManifestoPane';
import { useDraft, formatSavedAt } from '../Auth/useDraft';
import { getApiError } from '../../shared/api/client';
import {
  Shell, Work, WorkTopBar, TabSwitch, Tab, FormFrame, FormTitle,
  FormSubtitle, FormStyled, FieldInput, PasswordFieldInput, SubmitBtn,
  SwitchLink, SavedChip, WorkFooter, ErrorBanner,
} from '../Auth/shared';

type LoginValues = { login: string; password: string };
const EMPTY: LoginValues = { login: '', password: '' };

export function LoginPage() {
  const { login: loginFn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm<LoginValues>();
  const draft = useDraft<LoginValues>('login', EMPTY);

  useEffect(() => {
    form.setFieldsValue(draft.values);
  }, [form, draft.values]);

  const onValuesChange = (_: Partial<unknown>, all: unknown) => {
    draft.setValues(all as LoginValues);
  };

  const onFinish = async (values: unknown) => {
    setLoading(true);
    setError(null);
    try {
      const v = values as LoginValues;
      await loginFn(v.login, v.password);
      draft.clear();
      const to = (location.state as { from?: string } | null)?.from ?? '/dashboard';
      navigate(to, { replace: true });
    } catch (err) {
      const { message } = getApiError(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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

          {error && <ErrorBanner role="alert">{error}</ErrorBanner>}

          <FormStyled
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={onValuesChange}
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

            <SubmitBtn
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              {loading ? 'Открываем комнату…' : 'Войти в реестр'}
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