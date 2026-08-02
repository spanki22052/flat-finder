import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, Tag, Button, Space, Input, Select, Drawer, Form, Modal,
  message, Popconfirm, Tooltip, Row, Col, Segmented, Image, Upload, Pagination,
} from 'antd';
import type { TableColumnType } from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  EyeOutlined, EnvironmentOutlined, LinkOutlined, PhoneOutlined,
  CameraOutlined, CodeOutlined, HomeOutlined, BellOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { theme } from '@/app/styles/theme';
import { useAuth } from '@/app/providers/AuthProvider';
import { getEffectiveMoveInCost } from '@/entities/Flat/utils/price';
import { PARSE_LINK_HINT, PARSE_LINK_PLACEHOLDER } from '@/entities/Flat/utils/parseLink';
import type { Apartment, ApartmentStatus } from '@/entities/Flat/model/types';
import {
  CURRENCIES, HTML_SOURCE_OPTIONS, STATUS_CHIPS, STATUS_LABELS,
} from '../model/types';
import { initials, pluralApartments } from '../lib/utils';
import { useApartmentsPage } from '../hooks/useApartmentsPage';
import * as Styled from './ApartmentsPage.styled';

function HouseIcon() {
  return (
    <svg
      width="56" height="56" viewBox="0 0 64 64" fill="none"
      stroke={theme.colors.accent.primary} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden
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

function PhotoEditor() {
  const form = Form.useFormInstance();
  const photos: string[] = Form.useWatch('photos', form) ?? [];
  const [newUrl, setNewUrl] = React.useState('');

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
          <Styled.PhotoGrid>
            {photos.map((src, idx) => (
              <Styled.PhotoTile key={`${src}-${idx}`}>
                <Image
                  src={src}
                  alt={`Фото ${idx + 1}`}
                  loading="lazy"
                  preview={{ mask: <span style={{ fontSize: 12, padding: '0 8px' }}>Увеличить</span> }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Styled.PhotoRemoveBtn
                  type="button"
                  aria-label="Удалить фото"
                  onClick={(e) => { e.stopPropagation(); remove(idx); }}
                >
                  ×
                </Styled.PhotoRemoveBtn>
              </Styled.PhotoTile>
            ))}
          </Styled.PhotoGrid>
          <Styled.PhotoCounter>{photos.length} фото · будут сохранены вместе с квартирой</Styled.PhotoCounter>
        </>
      )}
      <Styled.PhotoAddRow>
        <Input
          placeholder="https://example.com/photo.jpg"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onPressEnter={add}
          style={{ flex: 1 }}
        />
        <Button icon={<PlusOutlined />} onClick={add}>Добавить</Button>
      </Styled.PhotoAddRow>
    </div>
  );
}

export function ApartmentsPage() {
  const ctrl = useApartmentsPage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const statusColor = (s: ApartmentStatus) => theme.colors.status[s];

  const columns: TableColumnType<Apartment>[] = [
    {
      title: 'Квартира', dataIndex: 'title', key: 'title', width: 300,
      render: (title: string, apt) => (
        <Styled.ApartmentRow>
          <Styled.AptThumb $status={apt.status}>
            {apt.photos && apt.photos[0] ? (
              <img src={apt.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} loading="lazy" />
            ) : (
              <HomeOutlined />
            )}
          </Styled.AptThumb>
          <Styled.AptInfo>
            <Styled.AptTitle>
              {apt.sourceUrl && (
                <Tooltip title={`Открыть источник: ${apt.sourceUrl}`}>
                  <Styled.SourceLinkButton
                    type="button"
                    aria-label="Открыть источник"
                    onClick={(e) => { e.stopPropagation(); window.open(apt.sourceUrl, '_blank', 'noopener,noreferrer'); }}
                  >
                    <LinkOutlined />
                  </Styled.SourceLinkButton>
                </Tooltip>
              )}
              <Styled.TitleButton type="button" onClick={() => navigate(`/apartments/${apt.id}`)} title="Открыть квартиру">
                {title}
              </Styled.TitleButton>
            </Styled.AptTitle>
            <Styled.AptMeta>
              <span><EnvironmentOutlined style={{ marginRight: 3 }} />{apt.city}{apt.district ? `, ${apt.district}` : ''}</span>
              {apt.rooms !== undefined && <span>{apt.rooms === 0 ? 'Студия' : `${apt.rooms} ком.`}</span>}
              {apt.area && <span>{apt.area} м²</span>}
              {apt.floor && <span>эт. {apt.floor}/{apt.totalFloors ?? '?'}</span>}
              {apt.phones && apt.phones.length > 0 && (
                <span><PhoneOutlined style={{ marginRight: 3 }} />{apt.phones.join(', ')}</span>
              )}
              {apt.photos && apt.photos.length > 1 && (
                <Tooltip title={`Фото: ${apt.photos.length}`}>
                  <span style={{ fontSize: 11, color: theme.colors.primary }}><CameraOutlined /> {apt.photos.length}</span>
                </Tooltip>
              )}
            </Styled.AptMeta>
          </Styled.AptInfo>
        </Styled.ApartmentRow>
      ),
    },
    {
      title: 'Цена', dataIndex: 'price', key: 'price', width: 120,
      render: (price, apt) => {
        const effectiveCost = getEffectiveMoveInCost(apt);
        return (
          <div>
            <Styled.PriceTag>{price.toLocaleString('ru-RU')} {apt.currency}</Styled.PriceTag>
            {effectiveCost !== undefined && (
              <Styled.PriceTagMeta>с учётом всего: {effectiveCost.toLocaleString('ru-RU')} {apt.currency}</Styled.PriceTagMeta>
            )}
          </div>
        );
      },
    },
    {
      title: 'Статус', dataIndex: 'status', key: 'status', width: 130,
      render: (s: ApartmentStatus) => (
        <Tag color={statusColor(s)} style={{ border: 'none', fontWeight: 600, fontSize: 12 }}>
          {STATUS_LABELS[s]}
        </Tag>
      ),
    },
    {
      title: 'Теги', dataIndex: 'tags', key: 'tags', width: 200,
      render: (tags: string[]) => (
        <Styled.TagPills>
          {tags.slice(0, 2).map((t) => (
            <Tag key={t} style={{ background: theme.colors.primaryFixed, border: 'none', color: theme.colors.onPrimaryFixedVariant, fontSize: 11 }}>
              {t}
            </Tag>
          ))}
          {tags.length > 2 && <Tag style={{ background: 'transparent', border: 'none', color: theme.colors.text.muted, fontSize: 11 }}>+{tags.length - 2}</Tag>}
        </Styled.TagPills>
      ),
    },
    {
      title: '', key: 'actions', width: 120, fixed: 'right',
      render: (_: unknown, apt: Apartment) => (
        <Styled.RowActions>
          <Tooltip title="Просмотр">
            <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/apartments/${apt.id}`)} />
          </Tooltip>
          <Tooltip title="Редактировать">
            <Button size="small" icon={<EditOutlined />} onClick={() => ctrl.openEdit(apt)} />
          </Tooltip>
          <Popconfirm title="Удалить?" onConfirm={() => { void ctrl.handleDelete(apt.id); }} okText="Да" cancelText="Нет">
            <Tooltip title="Удалить">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Styled.RowActions>
      ),
    },
  ];

  return (
    <div>
      <Styled.DesktopList>
        <Styled.PageHeader>
          <Styled.PageHeaderTitleGroup>
            <Styled.PageTitle>Квартиры</Styled.PageTitle>
            <Styled.PageSubtitle>
              {ctrl.total > 0 ? `${ctrl.total} ${pluralApartments(ctrl.total)} в подборке` : 'Пока нет объявлений'}
            </Styled.PageSubtitle>
          </Styled.PageHeaderTitleGroup>
          <Styled.HeaderActions>
            <Styled.ImportButton type="button" onClick={() => ctrl.setImportModalOpen(true)}>
              <LinkOutlined /> Импорт по ссылке
            </Styled.ImportButton>
            <Styled.ImportButton type="button" onClick={() => ctrl.setHtmlImportModalOpen(true)}>
              <CodeOutlined /> Добавить HTML
            </Styled.ImportButton>
            <Styled.AddApartmentButton type="primary" icon={<PlusOutlined />} onClick={ctrl.openCreate}>
              Добавить квартиру
            </Styled.AddApartmentButton>
          </Styled.HeaderActions>
        </Styled.PageHeader>

        <Styled.FiltersRow>
          <Styled.SearchInput
            placeholder="Поиск по названию, городу..."
            prefix={<SearchOutlined style={{ color: theme.colors.text.muted }} />}
            value={ctrl.search}
            onChange={(e) => { ctrl.setSearch(e.target.value); ctrl.setPage(1); }}
            allowClear
          />
          <Select
            placeholder="Статус"
            allowClear
            style={{ width: 170 }}
            suffixIcon={<FilterOutlined style={{ color: theme.colors.text.muted }} />}
            value={ctrl.statusFilter || undefined}
            onChange={(v) => { ctrl.setStatusFilter(v ?? ''); ctrl.setPage(1); }}
            options={Object.entries(STATUS_LABELS).map(([k, v]) => ({ value: k, label: v }))}
          />
          <Styled.ResultsBadge>
            <HomeOutlined /> {ctrl.total} {ctrl.total === 1 ? 'квартира' : 'квартир'}
          </Styled.ResultsBadge>
        </Styled.FiltersRow>

        <Styled.GlassCard>
          <Table
            columns={columns}
            dataSource={ctrl.data}
            rowKey="id"
            loading={ctrl.loading}
            pagination={{
              current: ctrl.page,
              pageSize: ctrl.pageSize,
              total: ctrl.total,
              showSizeChanger: true,
              showTotal: (t, range) => `${range[0]}–${range[1]} из ${t}`,
              onChange: (p, ps) => { ctrl.setPage(p); ctrl.setPageSize(ps); },
            }}
            scroll={{ x: 700 }}
            locale={{
              emptyText: (
                <Styled.EmptyState>
                  <Styled.EmptyIconWrap><HouseIcon /></Styled.EmptyIconWrap>
                  Квартиры не найдены
                </Styled.EmptyState>
              ),
            }}
          />
        </Styled.GlassCard>
      </Styled.DesktopList>

      <Styled.MobileShell>
        <Styled.MobileTopBar>
          <Styled.MobileBrand>
            <Styled.MobileBrandLogo><HomeOutlined /></Styled.MobileBrandLogo>
            <div>
              <div>FlatFinder</div>
              <Styled.MobileBrandCaption>Совместный поиск</Styled.MobileBrandCaption>
            </div>
          </Styled.MobileBrand>
          <Styled.MobileTopActions>
            <Styled.MobileBellBtn type="button" aria-label="Уведомления">
              <BellOutlined />
            </Styled.MobileBellBtn>
            <Styled.MobileAvatar size={38}>{user ? initials(user.name) : 'FF'}</Styled.MobileAvatar>
          </Styled.MobileTopActions>
        </Styled.MobileTopBar>

        <Styled.MobileBody>
          <Styled.MobileToolbar>
            <Styled.MobileHeading>
              Квартиры
              <span>{ctrl.total} {pluralApartments(ctrl.total)}</span>
            </Styled.MobileHeading>
            <Styled.MobileAddBtn type="button" onClick={ctrl.openCreate}>
              <PlusOutlined /> Добавить
            </Styled.MobileAddBtn>
          </Styled.MobileToolbar>

          <Styled.MobileImportRow>
            <Styled.MobileImportBtn type="button" onClick={() => ctrl.setImportModalOpen(true)}>
              <LinkOutlined /> Импорт по ссылке
            </Styled.MobileImportBtn>
            <Styled.MobileImportBtn type="button" onClick={() => ctrl.setHtmlImportModalOpen(true)}>
              <CodeOutlined /> Добавить HTML
            </Styled.MobileImportBtn>
          </Styled.MobileImportRow>

          <Styled.MobileSearch
            placeholder="Поиск по названию, городу..."
            prefix={<SearchOutlined style={{ color: theme.colors.text.muted }} />}
            value={ctrl.search}
            onChange={(e) => { ctrl.setSearch(e.target.value); ctrl.setPage(1); }}
            allowClear
          />

          <Styled.MobileChips>
            {STATUS_CHIPS.map((chip) => (
              <Styled.MobileChip
                key={chip.value || 'all'}
                type="button"
                $active={ctrl.statusFilter === chip.value}
                onClick={() => { ctrl.setStatusFilter(chip.value); ctrl.setPage(1); }}
              >
                {chip.label}
              </Styled.MobileChip>
            ))}
          </Styled.MobileChips>

          <Styled.MobileList aria-label="Список квартир">
            {ctrl.loading ? (
              <Styled.MobileEmptyState>Загружаем квартиры…</Styled.MobileEmptyState>
            ) : ctrl.data.length === 0 ? (
              <Styled.MobileEmptyState><HouseIcon />Квартиры не найдены</Styled.MobileEmptyState>
            ) : (
              ctrl.data.map((apt) => (
                <Styled.MobileApartmentCard key={apt.id}>
                  <Styled.MobileApartmentImage $status={statusColor(apt.status)}>
                    {apt.photos?.[0] ? (
                      <img src={apt.photos[0]} alt="" loading="lazy" />
                    ) : (
                      <HomeOutlined />
                    )}
                    <Styled.MobileStatusBadge $color={statusColor(apt.status)}>{STATUS_LABELS[apt.status]}</Styled.MobileStatusBadge>
                    {apt.photos && apt.photos.length > 1 && (
                      <Styled.MobilePhotoCount><CameraOutlined /> {apt.photos.length}</Styled.MobilePhotoCount>
                    )}
                  </Styled.MobileApartmentImage>
                  <Styled.MobileCardBody>
                    <Styled.MobileCardHeader>
                      <Styled.MobileApartmentTitle type="button" onClick={() => navigate(`/apartments/${apt.id}`)}>
                        {apt.title}
                      </Styled.MobileApartmentTitle>
                      <div>
                        <Styled.MobilePrice>{apt.price.toLocaleString('ru-RU')} {apt.currency}</Styled.MobilePrice>
                        {getEffectiveMoveInCost(apt) !== undefined && (
                          <Styled.MobilePriceMeta>
                            с учётом всего: {getEffectiveMoveInCost(apt)!.toLocaleString('ru-RU')} {apt.currency}
                          </Styled.MobilePriceMeta>
                        )}
                      </div>
                    </Styled.MobileCardHeader>
                    <Styled.MobileMeta>
                      <span><EnvironmentOutlined /> {apt.city}{apt.district ? `, ${apt.district}` : ''}</span>
                      <span>{apt.rooms === 0 ? 'Студия' : apt.rooms !== undefined ? `${apt.rooms} ком.` : 'Комнаты не указаны'}</span>
                      {apt.area && <span>{apt.area} м²</span>}
                      {apt.floor && <span>эт. {apt.floor}/{apt.totalFloors ?? '?'}</span>}
                      {apt.phones && apt.phones.length > 0 && (
                        <span><PhoneOutlined /> {apt.phones[0]}</span>
                      )}
                    </Styled.MobileMeta>
                    {apt.tags.length > 0 && (
                      <Styled.MobileTagRow>
                        {apt.tags.slice(0, 3).map((tag) => <Tag key={tag}>{tag}</Tag>)}
                        {apt.tags.length > 3 && <Tag>+{apt.tags.length - 3}</Tag>}
                      </Styled.MobileTagRow>
                    )}
                    <Styled.MobileCardActions>
                      {apt.sourceUrl && (
                        <Tooltip title="Открыть источник">
                          <Button icon={<LinkOutlined />} aria-label="Открыть источник" onClick={() => window.open(apt.sourceUrl, '_blank', 'noopener,noreferrer')} />
                        </Tooltip>
                      )}
                      <Button icon={<EyeOutlined />} aria-label="Просмотр квартиры" onClick={() => navigate(`/apartments/${apt.id}`)} />
                      <Button icon={<EditOutlined />} aria-label="Редактировать квартиру" onClick={() => ctrl.openEdit(apt)} />
                      <Popconfirm title="Удалить?" onConfirm={() => { void ctrl.handleDelete(apt.id); }} okText="Да" cancelText="Нет">
                        <Button danger icon={<DeleteOutlined />} aria-label="Удалить квартиру" />
                      </Popconfirm>
                    </Styled.MobileCardActions>
                  </Styled.MobileCardBody>
                </Styled.MobileApartmentCard>
              ))
            )}
          </Styled.MobileList>

          {!ctrl.loading && ctrl.total > ctrl.pageSize && (
            <Styled.MobilePagination>
              <Pagination
                current={ctrl.page}
                pageSize={ctrl.pageSize}
                total={ctrl.total}
                simple
                onChange={(p) => ctrl.setPage(p)}
              />
            </Styled.MobilePagination>
          )}
        </Styled.MobileBody>
      </Styled.MobileShell>

      <Styled.DrawerStyled
        title={ctrl.editing ? 'Редактировать квартиру' : 'Новая квартира'}
        placement="right"
        width={480}
        open={ctrl.drawerOpen}
        onClose={ctrl.closeDrawer}
        extra={
          <Space>
            <Button onClick={ctrl.closeDrawer}>Отмена</Button>
            <Button type="primary" onClick={() => { void ctrl.handleSave(); }} disabled={ctrl.mode === 'link'}
              style={{ background: theme.gradients.accent, border: 'none' }}>
              {ctrl.editing ? 'Сохранить' : 'Создать'}
            </Button>
          </Space>
        }
      >
        <Styled.ModeSwitchWrapper>
          <Segmented
            value={ctrl.mode}
            onChange={(v) => ctrl.setMode(v as typeof ctrl.mode)}
            options={[
              { value: 'form', label: 'Форма' },
              { value: 'link', label: 'Ссылка' },
            ]}
            block
          />
        </Styled.ModeSwitchWrapper>

        {ctrl.mode === 'link' ? (
          <div>
            <Form.Item label="Ссылка на объявление">
              <Input
                placeholder={PARSE_LINK_PLACEHOLDER}
                value={ctrl.linkUrl}
                onChange={(e) => ctrl.setLinkUrl(e.target.value)}
                onPressEnter={() => { void ctrl.handleParseInDrawer(); }}
                autoFocus
              />
            </Form.Item>
            <Button
              type="primary"
              icon={<LinkOutlined />}
              loading={ctrl.parsing}
              onClick={() => { void ctrl.handleParseInDrawer(); }}
              block
              size="large"
              style={{ background: theme.gradients.accent, border: 'none' }}
            >
              Импортировать
            </Button>
            <Styled.LinkModeHint>
              {PARSE_LINK_HINT}
              {' '}Данные подставятся в форму — вы сможете их отредактировать перед сохранением.
            </Styled.LinkModeHint>
          </div>
        ) : (
          <Form form={ctrl.form} layout="vertical">
            <Styled.FormSection>
              <Styled.SectionTitle>Основное</Styled.SectionTitle>
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
            </Styled.FormSection>

            <Styled.FormSection>
              <Styled.SectionTitle>Параметры</Styled.SectionTitle>
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
            </Styled.FormSection>

            <Styled.FormSection>
              <Styled.SectionTitle>Статус и теги</Styled.SectionTitle>
              <Form.Item name="status" label="Статус" initialValue="NEW">
                <Select options={Object.entries(STATUS_LABELS).map(([k, v]) => ({ value: k, label: v }))} />
              </Form.Item>
              <Form.Item name="tags" label="Теги (через запятую)">
                <Input
                  placeholder="центр, новый дом, с ремонтом"
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                    ctrl.form.setFieldValue('tags', tags);
                  }}
                />
              </Form.Item>
            </Styled.FormSection>

            <Styled.FormSection>
              <Styled.SectionTitle>Описание</Styled.SectionTitle>
              <Form.Item name="description" label="Описание">
                <Input.TextArea rows={3} placeholder="Светлая квартира с хорошим ремонтом..." />
              </Form.Item>
            </Styled.FormSection>

            <Styled.FormSection>
              <Styled.SectionTitle>Фото</Styled.SectionTitle>
              <Form.Item name="photos" valuePropName="value" trigger="onChange" noStyle>
                <span />
              </Form.Item>
              <PhotoEditor />
            </Styled.FormSection>

            <Styled.FormSection>
              <Styled.SectionTitle>Контакты</Styled.SectionTitle>
              <Form.Item name="phones" label="Телефоны (по одному на строку)">
                <Input.TextArea
                  rows={2}
                  placeholder={"+79991234567\n+79997654321"}
                  onChange={(e) => {
                    const phones = e.target.value
                      .split(/\r?\n/)
                      .map((s) => s.trim())
                      .filter(Boolean);
                    ctrl.form.setFieldValue('phones', phones);
                  }}
                />
              </Form.Item>
            </Styled.FormSection>

            <Form.Item name="source" hidden><Input /></Form.Item>
            <Form.Item name="sourceUrl" hidden><Input /></Form.Item>
          </Form>
        )}
      </Styled.DrawerStyled>

      <Modal
        title={<><CodeOutlined /> Импорт квартиры из HTML</>}
        open={ctrl.htmlImportModalOpen}
        onCancel={() => {
          ctrl.setHtmlImportModalOpen(false);
          ctrl.setHtmlContent('');
          ctrl.setHtmlSourceUrl('');
        }}
        onOk={() => { void ctrl.handleParseHtml(); }}
        okText="Разобрать HTML"
        cancelText="Отмена"
        confirmLoading={ctrl.htmlParsing}
        okButtonProps={{
          disabled: !ctrl.htmlContent.trim(),
          style: { background: theme.gradients.accent, border: 'none', color: '#fff' },
        }}
        width={720}
        destroyOnClose
      >
        <p style={{ color: theme.colors.text.secondary, marginBottom: 12 }}>
          Выберите площадку и вставьте HTML сохранённой страницы объявления. Разбор выполняется на сервере.
        </p>
        <Segmented
          value={ctrl.htmlSource}
          onChange={(value) => ctrl.setHtmlSource(value as typeof ctrl.htmlSource)}
          options={HTML_SOURCE_OPTIONS}
          block
          style={{ marginBottom: 12 }}
        />
        <Input
          placeholder="Исходная ссылка (необязательно)"
          value={ctrl.htmlSourceUrl}
          onChange={(event) => ctrl.setHtmlSourceUrl(event.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Upload
          accept=".html,.htm,text/html"
          beforeUpload={(file) => ctrl.loadHtmlFile(file)}
          showUploadList={false}
          maxCount={1}
        >
          <Button icon={<CodeOutlined />}>Загрузить HTML-файл</Button>
        </Upload>
      </Modal>

      <Modal
        title={<><LinkOutlined /> Импорт квартиры по ссылке</>}
        open={ctrl.importModalOpen}
        onCancel={() => { ctrl.setImportModalOpen(false); ctrl.setImportUrl(''); }}
        onOk={() => { void ctrl.handleParseInModal(); }}
        okText="Импортировать"
        cancelText="Отмена"
        confirmLoading={ctrl.importParsing}
        okButtonProps={{
          disabled: !ctrl.importUrl.trim(),
          style: { background: theme.gradients.accent, border: 'none', color: '#fff' },
        }}
        destroyOnClose
      >
        <p style={{ color: theme.colors.text.secondary, marginBottom: 12 }}>
          Вставьте ссылку на объявление. {PARSE_LINK_HINT}
        </p>
        <Input
          placeholder={PARSE_LINK_PLACEHOLDER}
          value={ctrl.importUrl}
          onChange={(e) => ctrl.setImportUrl(e.target.value)}
          onPressEnter={() => { void ctrl.handleParseInModal(); }}
          autoFocus
        />
      </Modal>
    </div>
  );
}