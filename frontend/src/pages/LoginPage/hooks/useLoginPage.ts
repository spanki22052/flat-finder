import { useEffect, useState } from 'react';
import { Form } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { getApiError } from '@/shared/api/client';
import { useDraft } from '@/pages/Auth/useDraft';
import type { FormInstance } from 'antd';
import type { LoginPageState, LoginValues } from '../model/types';
import { EMPTY_LOGIN } from '../model/types';

export interface UseLoginPageReturn {
  state: LoginPageState;
  form: FormInstance<LoginValues>;
  draft: ReturnType<typeof useDraft<LoginValues>>;
  onValuesChange: (_: Partial<unknown>, all: LoginValues) => void;
  onFinish: (values: LoginValues) => Promise<void>;
}

export function useLoginPage(): UseLoginPageReturn {
  const { login: loginFn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm<LoginValues>();
  const draft = useDraft<LoginValues>('login', EMPTY_LOGIN);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    form.setFieldsValue(draft.values);
  }, [form, draft.values]);

  const onValuesChange = (_: Partial<unknown>, all: LoginValues) => {
    draft.setValues(all);
  };

  const onFinish = async (values: LoginValues) => {
    setLoading(true);
    setError(null);
    try {
      await loginFn(values.login, values.password);
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

  return {
    state: { loading, error },
    form,
    draft,
    onValuesChange,
    onFinish,
  };
}