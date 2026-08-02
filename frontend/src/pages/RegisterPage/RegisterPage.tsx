import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { useAuth } from '../../app/providers/AuthProvider';
import { ManifestoPane } from '../Auth/ManifestoPane';
import { useDraft, formatSavedAt } from '../Auth/useDraft';
import { getApiError } from '../../shared/api/client';
import {
  Shell, Work, WorkTopBar, TabSwitch, Tab, FormFrame, FormTitle,
  FormSubtitle, FormStyled, FieldInput, PasswordFieldInput, SubmitBtn,
  SwitchLink, SavedChip, WorkFooter, ErrorBanner,
} from '../Auth/shared';

type RegisterValues = { name: string; username: string; email?: string; password: string };
const EMPTY: RegisterValues = { name: '', username: '', email: '', password: '' };

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm<RegisterValues>();
  const draft = useDraft<RegisterValues>('register', EMPTY);

  useEffect(() => {
    form.setFieldsValue(draft.values);
  }, [form, draft.values]);

  const onValuesChange = (_: Partial<unknown>, all: unknown) => {
    draft.setValues(all as RegisterValues);
  };

  const onFinish = async (values: unknown) => {
    setLoading(true);
    setError(null);
    try {
      const v = values as RegisterValues;
      await register(v.username, v.password, v.name, v.email || undefined);
      draft.clear();
      navigate('/dashboard', { replace: true });
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

          {error && <ErrorBanner role="alert">{error}</ErrorBanner>}

          <FormStyled
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={onValuesChange}
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
              <FieldInput
                prefix={<UserOutlined />}
                placeholder="Анна Петрова"
                autoComplete="name"
                size="large"
              />
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
              <FieldInput
                prefix={<IdcardOutlined />}
                placeholder="anna_p"
                autoComplete="username"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Email · опционально"
              name="email"
              rules={[{ type: 'email', message: 'Некорректный email' }]}
            >
              <FieldInput
                prefix={<MailOutlined />}
                placeholder="anna@example.com"
                autoComplete="email"
                size="large"
              />
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
              <PasswordFieldInput
                prefix={<LockOutlined />}
                placeholder="придумай пароль"
                autoComplete="new-password"
                size="large"
              />
            </Form.Item>

            <SubmitBtn
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              {loading ? 'Создаём комнату…' : 'Открыть комнату'}
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

function themeFontsMono() {
  return "'JetBrains Mono', monospace";
}