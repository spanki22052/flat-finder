import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import {
  HomeOutlined, ExclamationCircleOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { flatApi } from '../../entities/Flat/utils/api';
import { decodeImportHash } from '../../entities/Flat/utils/importHash';
import type { ParsedApartment } from '../../entities/Flat/model/types';
import { getApiError } from '../../shared/api/client';
import {
  Page, Wrap, Card, StatusIcon, StatusTitle, StatusText,
  SourceBadge, ActionRow, PrimaryBtn, SecondaryBtn,
} from './styled';

const SOURCE_LABELS: Record<string, string> = {
  avito: 'Avito', domclick: 'DomClick', cian: 'Cian', yandex: 'Yandex Realty',
};

type Status = 'loading' | 'error' | 'done';

export function ImportPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
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
        // Убираем хэш из адресной строки — данные больше не нужны в URL.
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        setStatus('done');
        navigate('/apartments', { replace: true, state: { prefill: parsed } });
      })
      .catch((err) => {
        setStatus('error');
        setErrorText(getApiError(err).message || 'Не удалось разобрать данные объявления');
      });
  }, [navigate]);

  return (
    <Page>
      <Wrap>
        <Card>
          {status === 'loading' && (
            <>
              <StatusIcon $tone="loading"><Spin size="large" /></StatusIcon>
              <StatusTitle>Читаем объявление…</StatusTitle>
              <StatusText>
                {source ? <SourceBadge>{SOURCE_LABELS[source] ?? source}</SourceBadge> : null}
              </StatusText>
              <StatusText>Разбираем данные, присланные расширением. Это займёт секунду.</StatusText>
            </>
          )}
          {status === 'error' && (
            <>
              <StatusIcon $tone="error"><ExclamationCircleOutlined /></StatusIcon>
              <StatusTitle>Не получилось импортировать</StatusTitle>
              <StatusText>{errorText}</StatusText>
              <ActionRow>
                <PrimaryBtn icon={<HomeOutlined />} onClick={() => navigate('/apartments')}>
                  К списку квартир
                </PrimaryBtn>
                <SecondaryBtn onClick={() => window.location.reload()}>
                  Попробовать снова
                </SecondaryBtn>
              </ActionRow>
            </>
          )}
          {status === 'done' && (
            <>
              <StatusIcon $tone="success"><CheckCircleOutlined /></StatusIcon>
              <StatusTitle>Готово</StatusTitle>
              <StatusText>Переносим в форму для проверки…</StatusText>
            </>
          )}
        </Card>
      </Wrap>
    </Page>
  );
}
