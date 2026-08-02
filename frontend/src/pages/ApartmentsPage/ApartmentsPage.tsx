import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Table, Tag, Button, Space, Input, Select, Drawer, Form, Modal,
  message, Popconfirm, Tooltip, Row, Col, Segmented, Image, Upload, Pagination,
} from 'antd';
import type { TableProps, TableColumnType } from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  EyeOutlined, EnvironmentOutlined, LinkOutlined, PhoneOutlined,
  CameraOutlined, CodeOutlined, HomeOutlined, BellOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { theme } from '../../app/styles/theme';
import { useAuth } from '../../app/providers/AuthProvider';
import { flatApi } from '../../entities/Flat/utils/api';
import {
  isSupportedParseUrl,
  PARSE_LINK_HINT,
  PARSE_LINK_PLACEHOLDER,
} from '../../entities/Flat/utils/parseLink';
import { getEffectiveMoveInCost } from '../../entities/Flat/utils/price';
import type {
  Apartment, ApartmentStatus, CreateApartmentPayload, HtmlParseSource, ParsedApartment,
} from '../../entities/Flat/model/types';
import {
  PageHeader, PageHeaderTitleGroup, PageTitle, PageSubtitle, FiltersRow, SearchInput,
  ResultsBadge, GlassCard,
  ApartmentRow, AptThumb, AptInfo, AptTitle, AptMeta, PriceTag, PriceTagMeta, TagPills, RowActions,
  DrawerStyled, FormSection, SectionTitle, EmptyState, EmptyIconWrap,
  ModeSwitchWrapper, LinkModeHint, ImportButton, AddApartmentButton,
  PhotoGrid, PhotoTile, PhotoRemoveBtn, PhotoAddRow, PhotoCounter,
  TitleButton, SourceLinkButton, DesktopList, MobileList, MobileApartmentCard,
  MobileApartmentImage, MobileCardBody, MobileCardHeader, MobileApartmentTitle,
  MobilePrice, MobilePriceMeta, MobileMeta, MobileTagRow, MobileCardActions, MobileEmptyState,
  HeaderActions,
  MobileShell, MobileTopBar, MobileBrand, MobileBrandLogo, MobileBrandCaption,
  MobileTopActions, MobileBellBtn, MobileAvatar, MobileBody, MobileToolbar,
  MobileHeading, MobileAddBtn, MobileImportRow, MobileImportBtn, MobileSearch,
  MobileChips, MobileChip, MobileStatusBadge, MobilePhotoCount, MobilePagination,
} from './styled';

const STATUS_COLORS: Record<ApartmentStatus, string> = theme.colors.status;

function HouseIcon() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 64 64"
      fill="none"
      stroke={theme.colors.accent.primary}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <defs>
        <linearGradient id="house-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={theme.colors.accent.primary} stopOpacity="0.18" />
          <stop offset="100%" stopColor={theme.colors.accent.primary} stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <path d="M32 6 6 26v32h18V42h16v16h18V26L32 6Z" fill="url(#house-grad)" />
      <path d="M32 6 6 26v32h18V42h16v16h18V26L32 6Z" />
      <path d="M28 58v-6h8v6" />
    </svg>
  );
}
const STATUS_LABELS: Record<ApartmentStatus, string> = {
  NEW: 'Новая', ACTIVE: 'Активная', CALLBACK: 'Перезвон',
  VIEWING: 'Просмотр', REJECTED: 'Отклонена', DONE: 'Готова',
};

const CURRENCIES = ['EUR', 'USD', 'RUB', 'PLN'];

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

const STATUS_CHIPS: Array<{ value: ApartmentStatus | ''; label: string }> = [
  { value: '', label: 'Все' },
  { value: 'NEW', label: 'Новая' },
  { value: 'ACTIVE', label: 'Активная' },
  { value: 'CALLBACK', label: 'Перезвон' },
  { value: 'VIEWING', label: 'Просмотр' },
  { value: 'REJECTED', label: 'Отклонена' },
  { value: 'DONE', label: 'Готова' },
];

type DrawerMode = 'form' | 'link';

function PhotoEditor() {
  const form = Form.useFormInstance();
  const photos: string[] = Form.useWatch('photos', form) ?? [];
  const [newUrl, setNewUrl] = useState('');

  const update = (next: string[]) => form.setFieldValue('photos', next);

  const add = () => {
    const url = newUrl.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      message.error('Ссылка должна начинаться с http(s)://');
      return;
    }
    if (photos.includes(url)) {
      message.warning('Такая ссылка уже добавлена');
      return;
    }
    update([...photos, url]);
    setNewUrl('');
  };

  const remove = (idx: number) => update(photos.filter((_, i) => i !== idx));

  return (
    <div>
      {photos.length === 0 ? (
        <div style={{ fontSize: 13, color: theme.colors.text.muted, marginBottom: 4 }}>
          Фото не загружены. Импортируйте ссылку на объявление или добавьте ссылки вручную.
        </div>
      ) : (
        <>
          <PhotoGrid>
            {photos.map((src, idx) => (
              <PhotoTile key={`${src}-${idx}`}>
                <Image
                  src={src}
                  alt={`Фото ${idx + 1}`}
                  loading="lazy"
                  preview={{ mask: <span style={{ fontSize: 12, padding: '0 8px' }}>Увеличить</span> }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <PhotoRemoveBtn
                  type="button"
                  aria-label="Удалить фото"
                  onClick={(e) => { e.stopPropagation(); remove(idx); }}
                >
                  ×
                </PhotoRemoveBtn>
              </PhotoTile>
            ))}
          </PhotoGrid>
          <PhotoCounter>{photos.length} фото · будут сохранены вместе с квартирой</PhotoCounter>
        </>
      )}
      <PhotoAddRow>
        <Input
          placeholder="https://example.com/photo.jpg"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onPressEnter={add}
          style={{ flex: 1 }}
        />
        <Button icon={<PlusOutlined />} onClick={add}>Добавить</Button>
      </PhotoAddRow>
    </div>
  );
}

export function ApartmentsPage() {
  const [data, setData] = useState<Apartment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApartmentStatus | ''>('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Apartment | null>(null);
  const [mode, setMode] = useState<DrawerMode>('form');
  const [linkUrl, setLinkUrl] = useState('');
  const [parsing, setParsing] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importParsing, setImportParsing] = useState(false);
  const [htmlImportModalOpen, setHtmlImportModalOpen] = useState(false);
  const [htmlSource, setHtmlSource] = useState<HtmlParseSource>('avito');
  const [htmlContent, setHtmlContent] = useState('');
  const [htmlSourceUrl, setHtmlSourceUrl] = useState('');
  const [htmlParsing, setHtmlParsing] = useState(false);
  type ApartmentFormValues = Omit<CreateApartmentPayload, 'phones'> & { phones?: string | string[] };

const [form] = Form.useForm<ApartmentFormValues>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, pageSize };
      if (search) params.q = search;
      if (statusFilter) params.status = statusFilter;
      const res = await flatApi.getList(params);
      setData(res.data);
      setTotal(res.meta.total);
    } catch (e: unknown) {
      message.error('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Открываем форму с превью, если сюда пришли со страницы /import (расширение Chrome).
  useEffect(() => {
    const prefill = (location.state as { prefill?: ParsedApartment } | null)?.prefill;
    if (!prefill) return;
    setEditing(null);
    form.resetFields();
    applyParsedData(prefill);
    setDrawerOpen(true);
    navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setMode('form');
    setLinkUrl('');
    setDrawerOpen(true);
  };

  const openEdit = (apt: Apartment) => {
    setEditing(apt);
    form.setFieldsValue({
      ...apt,
      tags: apt.tags,
      phones: apt.phones && apt.phones.length > 0 ? apt.phones.join('\n') : '',
    });
    setMode('form');
    setLinkUrl('');
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const phonesRaw = values.phones;
      const phones = Array.isArray(phonesRaw)
        ? phonesRaw
        : typeof phonesRaw === 'string'
          ? phonesRaw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
          : undefined;
      const payload = { ...values, phones };
      if (editing) {
        await flatApi.update(editing.id, payload);
        message.success('Квартира обновлена');
      } else {
        await flatApi.create(payload);
        message.success('Квартира добавлена');
      }
      setDrawerOpen(false);
      fetchData();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errorFields' in err) return;
      message.error('Ошибка сохранения');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await flatApi.delete(id);
      message.success('Удалена');
      fetchData();
    } catch { message.error('Ошибка удаления'); }
  };

  const applyParsedData = (parsed: ParsedApartment) => {
    form.setFieldsValue({
      title: parsed.title,
      source: parsed.source,
      sourceUrl: parsed.sourceUrl,
      price: parsed.price,
      deposit: parsed.deposit,
      agentCommissionPercent: parsed.agentCommissionPercent,
      currency: parsed.currency,
      city: parsed.city,
      district: parsed.district,
      address: parsed.address,
      rooms: parsed.rooms,
      area: parsed.area,
      floor: parsed.floor,
      totalFloors: parsed.totalFloors,
      description: parsed.description,
      photos: parsed.photos,
      phones: parsed.phones,
    });
    setMode('form');
  };

  const handleParseInDrawer = async () => {
    if (!linkUrl.trim()) {
      message.warning('Введите ссылку');
      return;
    }
    if (!isSupportedParseUrl(linkUrl)) {
      message.error('Этот источник пока не поддерживается');
      return;
    }
    setParsing(true);
    try {
      const parsed = await flatApi.parseLink(linkUrl.trim());
      applyParsedData(parsed);
      message.success('Данные подставлены — проверьте и сохраните');
    } catch (err: unknown) {
      handleParseError(err);
    } finally {
      setParsing(false);
    }
  };

  const handleParseInModal = async () => {
    if (!importUrl.trim()) {
      message.warning('Введите ссылку');
      return;
    }
    if (!isSupportedParseUrl(importUrl)) {
      message.error('Этот источник пока не поддерживается');
      return;
    }
    setImportParsing(true);
    try {
      const parsed = await flatApi.parseLink(importUrl.trim());
      // Открываем Drawer в режиме формы с заполненными данными
      setEditing(null);
      form.resetFields();
      applyParsedData(parsed);
      setDrawerOpen(true);
      setImportModalOpen(false);
      setImportUrl('');
      message.success('Данные подставлены — проверьте и сохраните');
    } catch (err: unknown) {
      handleParseError(err);
    } finally {
      setImportParsing(false);
    }
  };

  const loadHtmlFile = async (file: File) => {
    if (file.size > 2_000_000) {
      message.error('HTML-файл не должен превышать 2 MB');
      return Upload.LIST_IGNORE;
    }
    setHtmlContent(await file.text());
    return false;
  };

  const handleParseHtml = async () => {
    if (!htmlContent.trim()) {
      message.warning('Вставьте HTML страницы объявления');
      return;
    }
    setHtmlParsing(true);
    try {
      const parsed = await flatApi.parseHtml({
        source: htmlSource,
        html: htmlContent,
        ...(htmlSourceUrl.trim() ? { sourceUrl: htmlSourceUrl.trim() } : {}),
      });
      setEditing(null);
      form.resetFields();
      applyParsedData(parsed);
      setDrawerOpen(true);
      setHtmlImportModalOpen(false);
      setHtmlContent('');
      setHtmlSourceUrl('');
      message.success('Данные из HTML подставлены — проверьте и сохраните');
    } catch (err: unknown) {
      handleParseError(err);
    } finally {
      setHtmlParsing(false);
    }
  };

  const handleParseError = (err: unknown) => {
    // axios-ошибка: error.response.data.error.code
    const data = (err as { response?: { data?: { error?: { code?: string; message?: string } } } })?.response?.data;
    const code = data?.error?.code;
    const errMessage = data?.error?.message;
    if (code === 'PARSER_BLOCKED') {
      message.error('Сайт нас заблокировал. Заполните вручную.');
      setMode('form');
    } else if (code === 'PARSER_UNSUPPORTED_SOURCE') {
      message.error(errMessage ?? 'Этот источник пока не поддерживается');
    } else if (code === 'PARSER_INVALID_PAGE' || code === 'PARSER_TIMEOUT') {
      message.error(errMessage ?? 'Не удалось разобрать страницу');
    } else {
      message.error(errMessage ?? 'Не удалось получить данные по ссылке');
    }
  };

  const columns: TableColumnType<Apartment>[] = [
    {
      title: 'Квартира', dataIndex: 'title', key: 'title', width: 300,
      render: (title: string, apt) => (
        <ApartmentRow>
          <AptThumb $status={apt.status}>
            {apt.photos && apt.photos[0] ? (
              <img src={apt.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} loading="lazy" />
            ) : (
              <HomeOutlined />
            )}
          </AptThumb>
          <AptInfo>
            <AptTitle>
              {apt.sourceUrl && (
                <Tooltip title={`Открыть источник: ${apt.sourceUrl}`}>
                  <SourceLinkButton
                    type="button"
                    aria-label="Открыть источник"
                    onClick={(e) => { e.stopPropagation(); window.open(apt.sourceUrl, '_blank', 'noopener,noreferrer'); }}
                  >
                    <LinkOutlined />
                  </SourceLinkButton>
                </Tooltip>
              )}
              <TitleButton type="button" onClick={() => navigate(`/apartments/${apt.id}`)} title="Открыть квартиру">
                {title}
              </TitleButton>
            </AptTitle>
            <AptMeta>
              <span><EnvironmentOutlined style={{ marginRight: 3 }} />{apt.city}{apt.district ? `, ${apt.district}` : ''}</span>
              {apt.rooms !== undefined && <span>{apt.rooms === 0 ? 'Студия' : `${apt.rooms} ком.`}</span>}
              {apt.area && <span>{apt.area} м²</span>}
              {apt.floor && <span>эт. {apt.floor}/{apt.totalFloors ?? '?'}</span>}
              {apt.phones && apt.phones.length > 0 && (
                <span>
                  <PhoneOutlined style={{ marginRight: 3 }} />
                  {apt.phones.join(', ')}
                </span>
              )}
              {apt.photos && apt.photos.length > 1 && (
                <Tooltip title={`Фото: ${apt.photos.length}`}>
                  <span style={{ fontSize: 11, color: theme.colors.primary }}><CameraOutlined /> {apt.photos.length}</span>
                </Tooltip>
              )}
            </AptMeta>
          </AptInfo>
        </ApartmentRow>
      ),
    },
    {
      title: 'Цена', dataIndex: 'price', key: 'price', width: 120,
      render: (price, apt) => {
        const effectiveCost = getEffectiveMoveInCost(apt);
        return (
          <div>
            <PriceTag>{price.toLocaleString('ru-RU')} {apt.currency}</PriceTag>
            {effectiveCost !== undefined && (
              <PriceTagMeta>с учётом всего: {effectiveCost.toLocaleString('ru-RU')} {apt.currency}</PriceTagMeta>
            )}
          </div>
        );
      },
    },
    {
      title: 'Статус', dataIndex: 'status', key: 'status', width: 130,
      render: (s: ApartmentStatus) => (
        <Tag color={STATUS_COLORS[s]} style={{ border: 'none', fontWeight: 600, fontSize: 12 }}>
          {STATUS_LABELS[s]}
        </Tag>
      ),
    },
    {
      title: 'Теги', dataIndex: 'tags', key: 'tags', width: 200,
      render: (tags: string[]) => (
        <TagPills>
          {tags.slice(0, 2).map((t) => (
            <Tag key={t} style={{ background: theme.colors.primaryFixed, border: 'none', color: theme.colors.onPrimaryFixedVariant, fontSize: 11 }}>
              {t}
            </Tag>
          ))}
          {tags.length > 2 && <Tag style={{ background: 'transparent', border: 'none', color: theme.colors.text.muted, fontSize: 11 }}>+{tags.length - 2}</Tag>}
        </TagPills>
      ),
    },
    {
      title: '', key: 'actions', width: 120, fixed: 'right',
      render: (_: unknown, apt: Apartment) => (
        <RowActions>
          <Tooltip title="Просмотр">
            <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/apartments/${apt.id}`)} />
          </Tooltip>
          <Tooltip title="Редактировать">
            <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(apt)} />
          </Tooltip>
          <Popconfirm title="Удалить?" onConfirm={() => handleDelete(apt.id)} okText="Да" cancelText="Нет">
            <Tooltip title="Удалить">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </RowActions>
      ),
    },
  ];

  return (
    <div>
      <DesktopList>
        <PageHeader>
          <PageHeaderTitleGroup>
            <PageTitle>Квартиры</PageTitle>
            <PageSubtitle>
              {total > 0 ? `${total} ${total === 1 ? 'объявление' : 'объявлений'} в подборке` : 'Пока нет объявлений'}
            </PageSubtitle>
          </PageHeaderTitleGroup>
          <HeaderActions>
            <ImportButton type="button" onClick={() => setImportModalOpen(true)}>
              <LinkOutlined /> Импорт по ссылке
            </ImportButton>
            <ImportButton type="button" onClick={() => setHtmlImportModalOpen(true)}>
              <CodeOutlined /> Добавить HTML
            </ImportButton>
            <AddApartmentButton type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              Добавить квартиру
            </AddApartmentButton>
          </HeaderActions>
        </PageHeader>

        <FiltersRow>
          <SearchInput
            placeholder="Поиск по названию, городу..."
            prefix={<SearchOutlined style={{ color: theme.colors.text.muted }} />}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            allowClear
          />
          <Select
            placeholder="Статус"
            allowClear
            style={{ width: 170 }}
            suffixIcon={<FilterOutlined style={{ color: theme.colors.text.muted }} />}
            value={statusFilter || undefined}
            onChange={(v) => { setStatusFilter(v ?? ''); setPage(1); }}
            options={Object.entries(STATUS_LABELS).map(([k, v]) => ({ value: k, label: v }))}
          />
          <ResultsBadge>
            <HomeOutlined /> {total} {total === 1 ? 'квартира' : 'квартир'}
          </ResultsBadge>
        </FiltersRow>

        <GlassCard>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: true,
              showTotal: (t, range) => `${range[0]}–${range[1]} из ${t}`,
              onChange: (p, ps) => { setPage(p); setPageSize(ps); },
            }}
            scroll={{ x: 700 }}
            locale={{
              emptyText: (
                <EmptyState>
                  <EmptyIconWrap><HouseIcon /></EmptyIconWrap>
                  Квартиры не найдены
                </EmptyState>
              ),
            }}
          />
        </GlassCard>
      </DesktopList>

      <MobileShell>
        <MobileTopBar>
          <MobileBrand>
            <MobileBrandLogo><HomeOutlined /></MobileBrandLogo>
            <div>
              <div>FlatFinder</div>
              <MobileBrandCaption>Совместный поиск</MobileBrandCaption>
            </div>
          </MobileBrand>
          <MobileTopActions>
            <MobileBellBtn type="button" aria-label="Уведомления">
              <BellOutlined />
            </MobileBellBtn>
            <MobileAvatar size={38}>{user ? initials(user.name) : 'FF'}</MobileAvatar>
          </MobileTopActions>
        </MobileTopBar>

        <MobileBody>
          <MobileToolbar>
            <MobileHeading>
              Квартиры
              <span>{total} {total === 1 ? 'объявление' : 'объявлений'}</span>
            </MobileHeading>
            <MobileAddBtn type="button" onClick={openCreate}>
              <PlusOutlined /> Добавить
            </MobileAddBtn>
          </MobileToolbar>

          <MobileImportRow>
            <MobileImportBtn type="button" onClick={() => setImportModalOpen(true)}>
              <LinkOutlined /> Импорт по ссылке
            </MobileImportBtn>
            <MobileImportBtn type="button" onClick={() => setHtmlImportModalOpen(true)}>
              <CodeOutlined /> Добавить HTML
            </MobileImportBtn>
          </MobileImportRow>

          <MobileSearch
            placeholder="Поиск по названию, городу..."
            prefix={<SearchOutlined style={{ color: theme.colors.text.muted }} />}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            allowClear
          />

          <MobileChips>
            {STATUS_CHIPS.map((chip) => (
              <MobileChip
                key={chip.value || 'all'}
                type="button"
                $active={statusFilter === chip.value}
                onClick={() => { setStatusFilter(chip.value); setPage(1); }}
              >
                {chip.label}
              </MobileChip>
            ))}
          </MobileChips>

          <MobileList aria-label="Список квартир">
            {loading ? (
              <MobileEmptyState>Загружаем квартиры…</MobileEmptyState>
            ) : data.length === 0 ? (
              <MobileEmptyState><HouseIcon />Квартиры не найдены</MobileEmptyState>
            ) : (
              data.map((apt) => (
                <MobileApartmentCard key={apt.id}>
                  <MobileApartmentImage $status={STATUS_COLORS[apt.status]}>
                    {apt.photos?.[0] ? (
                      <img src={apt.photos[0]} alt="" loading="lazy" />
                    ) : (
                      <HomeOutlined />
                    )}
                    <MobileStatusBadge $color={STATUS_COLORS[apt.status]}>{STATUS_LABELS[apt.status]}</MobileStatusBadge>
                    {apt.photos && apt.photos.length > 1 && (
                      <MobilePhotoCount><CameraOutlined /> {apt.photos.length}</MobilePhotoCount>
                    )}
                  </MobileApartmentImage>
                  <MobileCardBody>
                    <MobileCardHeader>
                      <MobileApartmentTitle type="button" onClick={() => navigate(`/apartments/${apt.id}`)}>
                        {apt.title}
                      </MobileApartmentTitle>
                      <div>
                        <MobilePrice>{apt.price.toLocaleString('ru-RU')} {apt.currency}</MobilePrice>
                        {getEffectiveMoveInCost(apt) !== undefined && (
                          <MobilePriceMeta>
                            с учётом всего: {getEffectiveMoveInCost(apt)!.toLocaleString('ru-RU')} {apt.currency}
                          </MobilePriceMeta>
                        )}
                      </div>
                    </MobileCardHeader>
                    <MobileMeta>
                      <span><EnvironmentOutlined /> {apt.city}{apt.district ? `, ${apt.district}` : ''}</span>
                      <span>{apt.rooms === 0 ? 'Студия' : apt.rooms !== undefined ? `${apt.rooms} ком.` : 'Комнаты не указаны'}</span>
                      {apt.area && <span>{apt.area} м²</span>}
                      {apt.floor && <span>эт. {apt.floor}/{apt.totalFloors ?? '?'}</span>}
                      {apt.phones && apt.phones.length > 0 && (
                        <span><PhoneOutlined /> {apt.phones[0]}</span>
                      )}
                    </MobileMeta>
                    {apt.tags.length > 0 && (
                      <MobileTagRow>
                        {apt.tags.slice(0, 3).map((tag) => <Tag key={tag}>{tag}</Tag>)}
                        {apt.tags.length > 3 && <Tag>+{apt.tags.length - 3}</Tag>}
                      </MobileTagRow>
                    )}
                    <MobileCardActions>
                      {apt.sourceUrl && (
                        <Tooltip title="Открыть источник">
                          <Button icon={<LinkOutlined />} aria-label="Открыть источник" onClick={() => window.open(apt.sourceUrl, '_blank', 'noopener,noreferrer')} />
                        </Tooltip>
                      )}
                      <Button icon={<EyeOutlined />} aria-label="Просмотр квартиры" onClick={() => navigate(`/apartments/${apt.id}`)} />
                      <Button icon={<EditOutlined />} aria-label="Редактировать квартиру" onClick={() => openEdit(apt)} />
                      <Popconfirm title="Удалить?" onConfirm={() => handleDelete(apt.id)} okText="Да" cancelText="Нет">
                        <Button danger icon={<DeleteOutlined />} aria-label="Удалить квартиру" />
                      </Popconfirm>
                    </MobileCardActions>
                  </MobileCardBody>
                </MobileApartmentCard>
              ))
            )}
          </MobileList>

          {!loading && total > pageSize && (
            <MobilePagination>
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                simple
                onChange={(p) => setPage(p)}
              />
            </MobilePagination>
          )}
        </MobileBody>
      </MobileShell>

      <DrawerStyled
        title={editing ? 'Редактировать квартиру' : 'Новая квартира'}
        placement="right"
        width={480}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        extra={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>Отмена</Button>
            <Button type="primary" onClick={handleSave} disabled={mode === 'link'}
              style={{ background: theme.gradients.accent, border: 'none' }}>
              {editing ? 'Сохранить' : 'Создать'}
            </Button>
          </Space>
        }
      >
        <ModeSwitchWrapper>
          <Segmented
            value={mode}
            onChange={(v) => setMode(v as DrawerMode)}
            options={[
              { value: 'form', label: 'Форма' },
              { value: 'link', label: 'Ссылка' },
            ]}
            block
          />
        </ModeSwitchWrapper>

        {mode === 'link' ? (
          <div>
            <Form.Item label="Ссылка на объявление">
              <Input
                placeholder={PARSE_LINK_PLACEHOLDER}
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onPressEnter={handleParseInDrawer}
                autoFocus
              />
            </Form.Item>
            <Button
              type="primary"
              icon={<LinkOutlined />}
              loading={parsing}
              onClick={handleParseInDrawer}
              block
              size="large"
              style={{ background: theme.gradients.accent, border: 'none' }}
            >
              Импортировать
            </Button>
            <LinkModeHint>
              {PARSE_LINK_HINT}
              {' '}Данные подставятся в форму — вы сможете их отредактировать перед сохранением.
            </LinkModeHint>
          </div>
        ) : (
          <Form form={form} layout="vertical">
            <FormSection>
              <SectionTitle>Основное</SectionTitle>
              <Form.Item name="title" label="Название" rules={[{ required: true, message: 'Обязательно' }]}>
                <Input placeholder="Уютная 2-комната в центре" />
              </Form.Item>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="city" label="Город" rules={[{ required: true }]}>
                    <Input placeholder="Москва" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="district" label="Район">
                    <Input placeholder="Тверской" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="address" label="Адрес">
                <Input placeholder="ул. Пушкина, д. 10" />
              </Form.Item>
            </FormSection>

            <FormSection>
              <SectionTitle>Параметры</SectionTitle>
              <Row gutter={12}>
                <Col span={8}>
                  <Form.Item name="price" label="Цена" rules={[{ required: true }]}>
                    <Input type="number" placeholder="85000" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="currency" label="Валюта" initialValue="RUB">
                    <Select options={CURRENCIES.map((c) => ({ value: c, label: c }))} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="rooms" label="Комнат">
                    <Input type="number" placeholder="2" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="deposit" label="Залог">
                    <Input type="number" placeholder="85000" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="agentCommissionPercent" label="Комиссия риелтору, %">
                    <Input type="number" placeholder="50" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={8}>
                  <Form.Item name="area" label="Площадь м²">
                    <Input type="number" placeholder="54" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="floor" label="Этаж">
                    <Input type="number" placeholder="5" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="totalFloors" label="Всего этажей">
                    <Input type="number" placeholder="9" />
                  </Form.Item>
                </Col>
              </Row>
            </FormSection>

            <FormSection>
              <SectionTitle>Статус и теги</SectionTitle>
              <Form.Item name="status" label="Статус" initialValue="NEW">
                <Select options={Object.entries(STATUS_LABELS).map(([k, v]) => ({ value: k, label: v }))} />
              </Form.Item>
              <Form.Item name="tags" label="Теги (через запятую)">
                <Input placeholder="центр, новый дом, с ремонтом"
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                    form.setFieldValue('tags', tags);
                  }}
                />
              </Form.Item>
            </FormSection>

            <FormSection>
              <SectionTitle>Описание</SectionTitle>
              <Form.Item name="description" label="Описание">
                <Input.TextArea rows={3} placeholder="Светлая квартира с хорошим ремонтом..." />
              </Form.Item>
            </FormSection>

            <FormSection>
              <SectionTitle>Фото</SectionTitle>
              <Form.Item name="photos" valuePropName="value" trigger="onChange" noStyle>
                <span />
              </Form.Item>
              <PhotoEditor />
            </FormSection>

            <FormSection>
              <SectionTitle>Контакты</SectionTitle>
              <Form.Item name="phones" label="Телефоны (по одному на строку)">
                <Input.TextArea
                  rows={2}
                  placeholder={"+79991234567\n+79997654321"}
                  onChange={(e) => {
                    const phones = e.target.value
                      .split(/\r?\n/)
                      .map((s) => s.trim())
                      .filter(Boolean);
                    form.setFieldValue('phones', phones);
                  }}
                />
              </Form.Item>
            </FormSection>

            <Form.Item name="source" hidden><Input /></Form.Item>
            <Form.Item name="sourceUrl" hidden><Input /></Form.Item>
          </Form>
        )}
      </DrawerStyled>

      <Modal
        title={<><CodeOutlined /> Импорт квартиры из HTML</>}
        open={htmlImportModalOpen}
        onCancel={() => {
          setHtmlImportModalOpen(false);
          setHtmlContent('');
          setHtmlSourceUrl('');
        }}
        onOk={handleParseHtml}
        okText="Разобрать HTML"
        cancelText="Отмена"
        confirmLoading={htmlParsing}
        okButtonProps={{
          disabled: !htmlContent.trim(),
          style: { background: theme.gradients.accent, border: 'none', color: '#fff' },
        }}
        width={720}
        destroyOnClose
      >
        <p style={{ color: theme.colors.text.secondary, marginBottom: 12 }}>
          Выберите площадку и вставьте HTML сохранённой страницы объявления. Разбор выполняется на сервере.
        </p>
        <Segmented
          value={htmlSource}
          onChange={(value) => setHtmlSource(value as HtmlParseSource)}
          options={[
            { value: 'avito', label: 'Avito' },
            { value: 'domclick', label: 'DomClick' },
            { value: 'cian', label: 'Cian' },
            { value: 'yandex', label: 'Yandex' },
          ]}
          block
          style={{ marginBottom: 12 }}
        />
        <Input
          placeholder="Исходная ссылка (необязательно)"
          value={htmlSourceUrl}
          onChange={(event) => setHtmlSourceUrl(event.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Upload
          accept=".html,.htm,text/html"
          beforeUpload={loadHtmlFile}
          showUploadList={false}
          maxCount={1}
        >
          <Button icon={<CodeOutlined />}>Загрузить HTML-файл</Button>
        </Upload>
      </Modal>

      <Modal
        title={<><LinkOutlined /> Импорт квартиры по ссылке</>}
        open={importModalOpen}
        onCancel={() => { setImportModalOpen(false); setImportUrl(''); }}
        onOk={handleParseInModal}
        okText="Импортировать"
        cancelText="Отмена"
        confirmLoading={importParsing}
        okButtonProps={{
          disabled: !importUrl.trim(),
          style: { background: theme.gradients.accent, border: 'none', color: '#fff' },
        }}
        destroyOnClose
      >
        <p style={{ color: theme.colors.text.secondary, marginBottom: 12 }}>
          Вставьте ссылку на объявление. {PARSE_LINK_HINT}
        </p>
        <Input
          placeholder={PARSE_LINK_PLACEHOLDER}
          value={importUrl}
          onChange={(e) => setImportUrl(e.target.value)}
          onPressEnter={handleParseInModal}
          autoFocus
        />
      </Modal>
    </div>
  );
}