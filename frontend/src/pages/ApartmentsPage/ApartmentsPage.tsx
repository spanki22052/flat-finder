import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, Tag, Button, Space, Input, Select, Drawer, Form, Modal,
  message, Popconfirm, Tooltip, Row, Col, Segmented,
} from 'antd';
import type { TableProps, TableColumnType } from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  EyeOutlined, EnvironmentOutlined, LinkOutlined,
} from '@ant-design/icons';
import { theme } from '../../app/styles/theme';
import { flatApi } from '../../entities/Flat/utils/api';
import type {
  Apartment, ApartmentStatus, CreateApartmentPayload, ParsedApartment,
} from '../../entities/Flat/model/types';
import {
  PageHeader, PageTitle, FiltersRow, SearchInput, GlassCard,
  ApartmentRow, AptThumb, AptInfo, AptTitle, AptMeta, PriceTag, TagPills,
  DrawerStyled, FormSection, SectionTitle, EmptyState,
  ModeSwitchWrapper, LinkModeHint, ImportButton,
  PhotoGrid, PhotoTile, PhotoRemoveBtn, PhotoAddRow, PhotoCounter,
} from './styled';

const STATUS_COLORS: Record<ApartmentStatus, string> = {
  NEW: '#9FA1FF', ACTIVE: '#34d399', CALLBACK: '#C1EBE9',
  VIEWING: '#D9F9DF', REJECTED: '#fb7185', DONE: '#6b7280',
};
const STATUS_LABELS: Record<ApartmentStatus, string> = {
  NEW: 'Новая', ACTIVE: 'Активная', CALLBACK: 'Перезвон',
  VIEWING: 'Просмотр', REJECTED: 'Отклонена', DONE: 'Готова',
};

const CURRENCIES = ['EUR', 'USD', 'RUB', 'PLN'];

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
                <img
                  src={src}
                  alt={`Фото ${idx + 1}`}
                  loading="lazy"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2'; }}
                />
                <PhotoRemoveBtn
                  type="button"
                  aria-label="Удалить фото"
                  onClick={() => remove(idx)}
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
  const [form] = Form.useForm<CreateApartmentPayload>();
  const navigate = useNavigate();

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

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setMode('form');
    setLinkUrl('');
    setDrawerOpen(true);
  };

  const openEdit = (apt: Apartment) => {
    setEditing(apt);
    form.setFieldsValue({ ...apt, tags: apt.tags });
    setMode('form');
    setLinkUrl('');
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await flatApi.update(editing.id, values);
        message.success('Квартира обновлена');
      } else {
        await flatApi.create(values);
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
    });
    setMode('form');
  };

  const handleParseInDrawer = async () => {
    if (!linkUrl.trim()) {
      message.warning('Введите ссылку');
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
      title: 'Квартира', dataIndex: 'title', key: 'title', width: '40%',
      render: (title: string, apt) => (
        <ApartmentRow>
          <AptThumb $status={apt.status}>
            {apt.photos && apt.photos[0] ? (
              <img src={apt.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} loading="lazy" />
            ) : (
              '🏠'
            )}
          </AptThumb>
          <AptInfo>
            <AptTitle>{title}</AptTitle>
            <AptMeta>
              <span><EnvironmentOutlined style={{ marginRight: 3 }} />{apt.city}{apt.district ? `, ${apt.district}` : ''}</span>
              {apt.rooms !== undefined && <span>{apt.rooms === 0 ? 'Студия' : `${apt.rooms} ком.`}</span>}
              {apt.area && <span>{apt.area} м²</span>}
              {apt.floor && <span>эт. {apt.floor}/{apt.totalFloors ?? '?'}</span>}
              {apt.source === 'LINK' && apt.sourceUrl && (
                <Tooltip title={apt.sourceUrl}>
                  <LinkOutlined style={{ fontSize: 11, color: '#B5BAFF' }} />
                </Tooltip>
              )}
              {apt.photos && apt.photos.length > 1 && (
                <Tooltip title={`Фото: ${apt.photos.length}`}>
                  <span style={{ fontSize: 11, color: '#B5BAFF' }}>📷 {apt.photos.length}</span>
                </Tooltip>
              )}
            </AptMeta>
          </AptInfo>
        </ApartmentRow>
      ),
    },
    {
      title: 'Цена', dataIndex: 'price', key: 'price', width: 120,
      render: (price, apt) => <PriceTag>{price.toLocaleString('ru-RU')} {apt.currency}</PriceTag>,
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
            <Tag key={t} style={{ background: 'rgba(181,186,255,0.16)', border: 'none', color: '#B5BAFF', fontSize: 11 }}>
              {t}
            </Tag>
          ))}
          {tags.length > 2 && <Tag style={{ background: 'transparent', border: 'none', color: '#475569', fontSize: 11 }}>+{tags.length - 2}</Tag>}
        </TagPills>
      ),
    },
    {
      title: '', key: 'actions', width: 120, fixed: 'right',
      render: (_: unknown, apt: Apartment) => (
        <Space>
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
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader>
        <PageTitle>Квартиры</PageTitle>
        <Space size={12}>
          <ImportButton type="button" onClick={() => setImportModalOpen(true)}>
            <LinkOutlined /> Импорт по ссылке
          </ImportButton>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} size="large"
            style={{ background: theme.gradients.accent, border: 'none', height: 44, paddingInline: 24 }}>
            Добавить квартиру
          </Button>
        </Space>
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
          style={{ width: 160 }}
          value={statusFilter || undefined}
          onChange={(v) => { setStatusFilter(v ?? ''); setPage(1); }}
          options={Object.entries(STATUS_LABELS).map(([k, v]) => ({ value: k, label: v }))}
        />
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
          locale={{ emptyText: <EmptyState><div style={{ fontSize: 40, marginBottom: 8 }}>🏠</div>Квартиры не найдены</EmptyState> }}
        />
      </GlassCard>

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
                placeholder="https://www.cian.ru/sale/flat/..."
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
              Поддерживаются: CIAN, Avito, Яндекс Недвижимость, DomClick.
              Данные подставятся в форму — вы сможете их отредактировать перед сохранением.
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
          </Form>
        )}
      </DrawerStyled>

      <Modal
        title={<><LinkOutlined /> Импорт квартиры по ссылке</>}
        open={importModalOpen}
        onCancel={() => { setImportModalOpen(false); setImportUrl(''); }}
        onOk={handleParseInModal}
        okText="Импортировать"
        cancelText="Отмена"
        confirmLoading={importParsing}
        okButtonProps={{ disabled: !importUrl.trim() }}
        destroyOnClose
      >
        <p style={{ color: theme.colors.text.secondary, marginBottom: 12 }}>
          Вставьте ссылку на объявление. Поддерживаются: CIAN, Avito, Яндекс Недвижимость, DomClick.
        </p>
        <Input
          placeholder="https://www.cian.ru/sale/flat/..."
          value={importUrl}
          onChange={(e) => setImportUrl(e.target.value)}
          onPressEnter={handleParseInModal}
          autoFocus
        />
      </Modal>
    </div>
  );
}