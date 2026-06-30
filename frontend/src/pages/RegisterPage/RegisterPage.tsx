import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, IdcardOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../../app/providers/AuthProvider';
import {
  Page, Card, LogoArea, LogoIcon, Title, Subtitle,
  FormStyled, SubmitBtn, FooterText,
} from './styled';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: unknown) => {
    const v = values as { name: string; username: string; email?: string; password: string };
    setLoading(true);
    try {
      await register(v.username, v.password, v.name, v.email);
      navigate('/dashboard');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <LogoArea>
          <LogoIcon>FF</LogoIcon>
          <Title>Создать аккаунт</Title>
          <Subtitle>Начните искать идеальную квартиру</Subtitle>
        </LogoArea>
        <FormStyled layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item name="name" rules={[{ required: true, message: 'Введите имя' }, { min: 2, message: 'Минимум 2 символа' }]}>
            <Input prefix={<UserOutlined style={{ color: '#94a3b8' }} />} placeholder="Ваше имя" size="large" />
          </Form.Item>
          <Form.Item name="username" rules={[{ required: true, message: 'Введите логин' }, { min: 3, message: 'Минимум 3 символа' }]}>
            <Input prefix={<IdcardOutlined style={{ color: '#94a3b8' }} />} placeholder="Логин" size="large" />
          </Form.Item>
          <Form.Item name="email" rules={[{ type: 'email', message: 'Некорректный email' }]}>
            <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} placeholder="Email (необязательно)" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль' }, { min: 6, message: 'Минимум 6 символов' }]}>
            <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="Пароль" size="large" />
          </Form.Item>
          <SubmitBtn type="primary" htmlType="submit" loading={loading}>
            Зарегистрироваться
          </SubmitBtn>
        </FormStyled>
        <FooterText>Уже есть аккаунт? <Link to="/login">Войти</Link></FooterText>
      </Card>
    </Page>
  );
}
