import { useCallback, useEffect, useState } from 'react';
import { Form, message, Upload } from 'antd';
import type { FormInstance } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { flatApi } from '@/entities/Flat/utils/api';
import { isSupportedParseUrl } from '@/entities/Flat/utils/parseLink';
import type { Apartment, HtmlParseSource, ParsedApartment } from '@/entities/Flat/model/types';
import type { ApartmentFormValues, DrawerMode, UseApartmentsPageReturn } from '../model/types';
import { describeParseError } from '../lib/utils';

const PAGE_SIZE_DEFAULT = 20;

export function useApartmentsPage(): UseApartmentsPageReturn {
  const [form] = Form.useForm<ApartmentFormValues>();
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState<Apartment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, pageSize };
      if (search) params.q = search;
      if (statusFilter) params.status = statusFilter;
      const res = await flatApi.getList(params);
      setData(res.data);
      setTotal(res.meta.total);
    } catch {
      message.error('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  useEffect(() => { void fetchData(); }, [fetchData]);

  // Prefill from /import (Chrome extension route)
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

  const applyParsedData = useCallback((parsed: ParsedApartment) => {
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
  }, [form]);

  const openCreate = useCallback(() => {
    setEditing(null);
    form.resetFields();
    setMode('form');
    setLinkUrl('');
    setDrawerOpen(true);
  }, [form]);

  const openEdit = useCallback((apt: Apartment) => {
    setEditing(apt);
    form.setFieldsValue({
      ...apt,
      tags: apt.tags,
      phones: apt.phones && apt.phones.length > 0 ? apt.phones.join('\n') : '',
    });
    setMode('form');
    setLinkUrl('');
    setDrawerOpen(true);
  }, [form]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const handleSave = useCallback(async () => {
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
      void fetchData();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errorFields' in err) return;
      message.error('Ошибка сохранения');
    }
  }, [form, editing, fetchData]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await flatApi.delete(id);
      message.success('Удалена');
      void fetchData();
    } catch {
      message.error('Ошибка удаления');
    }
  }, [fetchData]);

  const handleParseInDrawer = useCallback(async () => {
    if (!linkUrl.trim()) { message.warning('Введите ссылку'); return; }
    if (!isSupportedParseUrl(linkUrl)) { message.error('Этот источник пока не поддерживается'); return; }
    setParsing(true);
    try {
      const parsed = await flatApi.parseLink(linkUrl.trim());
      applyParsedData(parsed);
      message.success('Данные подставлены — проверьте и сохраните');
    } catch (err: unknown) {
      message.error(describeParseError(err));
      setMode('form');
    } finally {
      setParsing(false);
    }
  }, [linkUrl, applyParsedData]);

  const handleParseInModal = useCallback(async () => {
    if (!importUrl.trim()) { message.warning('Введите ссылку'); return; }
    if (!isSupportedParseUrl(importUrl)) { message.error('Этот источник пока не поддерживается'); return; }
    setImportParsing(true);
    try {
      const parsed = await flatApi.parseLink(importUrl.trim());
      setEditing(null);
      form.resetFields();
      applyParsedData(parsed);
      setDrawerOpen(true);
      setImportModalOpen(false);
      setImportUrl('');
      message.success('Данные подставлены — проверьте и сохраните');
    } catch (err: unknown) {
      message.error(describeParseError(err));
    } finally {
      setImportParsing(false);
    }
  }, [importUrl, applyParsedData, form]);

  const loadHtmlFile = useCallback(async (file: File) => {
    if (file.size > 2_000_000) {
      message.error('HTML-файл не должен превышать 2 MB');
      return Upload.LIST_IGNORE;
    }
    setHtmlContent(await file.text());
    return false;
  }, []);

  const handleParseHtml = useCallback(async () => {
    if (!htmlContent.trim()) { message.warning('Вставьте HTML страницы объявления'); return; }
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
      message.error(describeParseError(err));
    } finally {
      setHtmlParsing(false);
    }
  }, [htmlContent, htmlSource, htmlSourceUrl, applyParsedData, form]);

  return {
    data, total, page, pageSize, loading, search, statusFilter,
    drawerOpen, editing, mode, linkUrl, parsing,
    importModalOpen, importUrl, importParsing,
    htmlImportModalOpen, htmlSource, htmlContent, htmlSourceUrl, htmlParsing,
    form: form as unknown as FormInstance<ApartmentFormValues>,
    fetchData,
    setSearch, setStatusFilter, setPage, setPageSize,
    openCreate, openEdit, closeDrawer, handleSave, handleDelete,
    setMode, setLinkUrl, handleParseInDrawer, applyParsedData,
    setImportModalOpen, setImportUrl, handleParseInModal,
    setHtmlImportModalOpen, setHtmlSource, setHtmlContent, setHtmlSourceUrl,
    loadHtmlFile, handleParseHtml,
  };
}

import type { ApartmentStatus } from '@/entities/Flat/model/types';