import { Spin } from 'antd';
import {
  HomeOutlined, ExclamationCircleOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { SOURCE_LABELS } from '../model/types';
import { useImportPage } from '../hooks/useImportPage';
import * as Styled from './ImportPage.styled';

export function ImportPage() {
  const { status, errorText, source } = useImportPage();
  const navigate = useNavigate();

  return (
    <Styled.Page>
      <Styled.Wrap>
        <Styled.Card>
          {status === 'loading' && (
            <>
              <Styled.StatusIcon $tone="loading"><Spin size="large" /></Styled.StatusIcon>
              <Styled.StatusTitle>Читаем объявление…</Styled.StatusTitle>
              <Styled.StatusText>
                {source ? <Styled.SourceBadge>{SOURCE_LABELS[source] ?? source}</Styled.SourceBadge> : null}
              </Styled.StatusText>
              <Styled.StatusText>Разбираем данные, присланные расширением. Это займёт секунду.</Styled.StatusText>
            </>
          )}
          {status === 'error' && (
            <>
              <Styled.StatusIcon $tone="error"><ExclamationCircleOutlined /></Styled.StatusIcon>
              <Styled.StatusTitle>Не получилось импортировать</Styled.StatusTitle>
              <Styled.StatusText>{errorText}</Styled.StatusText>
              <Styled.ActionRow>
                <Styled.PrimaryBtn icon={<HomeOutlined />} onClick={() => navigate('/apartments')}>
                  К списку квартир
                </Styled.PrimaryBtn>
                <Styled.SecondaryBtn onClick={() => window.location.reload()}>
                  Попробовать снова
                </Styled.SecondaryBtn>
              </Styled.ActionRow>
            </>
          )}
          {status === 'done' && (
            <>
              <Styled.StatusIcon $tone="success"><CheckCircleOutlined /></Styled.StatusIcon>
              <Styled.StatusTitle>Готово</Styled.StatusTitle>
              <Styled.StatusText>Переносим в форму для проверки…</Styled.StatusText>
            </>
          )}
        </Styled.Card>
      </Styled.Wrap>
    </Styled.Page>
  );
}