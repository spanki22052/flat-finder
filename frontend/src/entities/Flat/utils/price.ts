import type { Apartment } from '../model/types';

/**
 * "Действительная стоимость" — цена квартиры плюс единоразовые платежи
 * при заселении: залог (в валюте price) и комиссия риелтору (% от price,
 * платит арендатор). Возвращает undefined, если ни залога, ни комиссии нет —
 * значит показывать доп. сумму не нужно.
 */
export function getEffectiveMoveInCost(apt: Pick<Apartment, 'price' | 'deposit' | 'agentCommissionPercent'>): number | undefined {
  if (apt.deposit === undefined && apt.agentCommissionPercent === undefined) return undefined;
  const commissionAmount = apt.agentCommissionPercent !== undefined
    ? (apt.price * apt.agentCommissionPercent) / 100
    : 0;
  return apt.price + (apt.deposit ?? 0) + commissionAmount;
}
