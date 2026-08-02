import { useEffect, useState } from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { getApiError } from '@/shared/api/client';
import { useDraft } from '@/pages/Auth/useDraft';
import type { RegisterPageState, RegisterValues } from '../model/types';
import { EMPTY_REGISTER } from '../model/types';

export interface UseRegisterPageReturn {
  state: RegisterPageState;
  form: FormInstance<RegisterValues>;
  draft: ReturnType<typeof useDraft<RegisterValues>>;
  onValuesChange: (_: Partial<unknown>, all: RegisterValues) => void;
  onFinish: (values: RegisterValues) => Promise<void>;
}

export function useRegisterPage(): UseRegisterPageReturn {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm<RegisterValues>();
  const draft = useDraft<RegisterValues>('register', EMPTY_REGISTER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    form.setFieldsValue(draft.values);
  }, [form, draft.values]);

  const onValuesChange = (_: Partial<unknown>, all: RegisterValues) => {
    draft.setValues(all);
  };

  const onFinish = async (values: RegisterValues) => {
    setLoading(true);
    setError(null);
    try {
      await register(values.username, values.password, values.name, values.email || undefined);
      draft.clear();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const { message } = getApiError(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { state: { loading, error }, form, draft, onValuesChange, onFinish };
}