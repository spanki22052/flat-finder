import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { flatApi } from '@/entities/Flat/utils/api';
import { decodeImportHash } from '@/entities/Flat/utils/importHash';
import type { ParsedApartment } from '@/entities/Flat/model/types';
import { getApiError } from '@/shared/api/client';
import type { ImportStatus } from '../model/types';

export interface UseImportPageReturn {
  status: ImportStatus;
  errorText: string;
  source: string | null;
}

export function useImportPage(): UseImportPageReturn {
  const navigate = useNavigate();
  const [status, setStatus] = useState<ImportStatus>('loading');
  const [errorText, setErrorText] = useState('');
  const [source, setSource] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const payload = decodeImportHash(window.location.hash);
    if (!payload) {
      setStatus('error');
      setErrorText('Не удалось прочитать данные из расширения. Ссылка повреждена или устарела.');
      return;
    }

    setSource(payload.source);

    flatApi.parseHtml({
      source: payload.source,
      html: payload.html,
      ...(payload.sourceUrl ? { sourceUrl: payload.sourceUrl } : {}),
    })
      .then((parsed: ParsedApartment) => {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        setStatus('done');
        navigate('/apartments', { replace: true, state: { prefill: parsed } });
      })
      .catch((err) => {
        setStatus('error');
        setErrorText(getApiError(err).message || 'Не удалось разобрать данные объявления');
      });
  }, [navigate]);

  return { status, errorText, source };
}