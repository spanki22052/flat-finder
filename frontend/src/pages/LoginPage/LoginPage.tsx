import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../../app/providers/AuthProvider';
import {
  Page, Card, LogoArea, LogoIcon, Title, Subtitle,
  FormStyled, SubmitBtn, FooterText,
} from './styled';

export function LoginPage() {
  const { login: loginFn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: unknown) => {
    const v = values as { login: string; password: string };
    setLoading(true);
    try {
      await loginFn(v.login, v.password);
      navigate('/dashboard');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <LogoArea>
          <LogoIcon>FF</LogoIcon>
          <Title>С возвращением</Title>
          <Subtitle>Войдите в свой аккаунт Flat Finder</Subtitle>
        </LogoArea>

        <FormStyled layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="login"
            rules={[{ required: true, message: 'Введите логин или email' }]}
          >
            <Input prefix={<UserOutlined style={{ color: '#94a3b8' }} />} placeholder="Логин или Email" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль' }]}>
            <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="Пароль" size="large" />
          </Form.Item>
          <SubmitBtn type="primary" htmlType="submit" loading={loading}>
            Войти
          </SubmitBtn>
        </FormStyled>

        <FooterText>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </FooterText>
      </Card>
    </Page>
  );
}
