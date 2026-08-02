import React from 'react';
import { motion } from 'framer-motion';
import {
  Manifesto, ManifestoHeader, Stamp, HeroBlock, Eyebrow, Headline, Lede,
  IndexCard, IndexHeader, IndexList, IndexItem, IndexNum, IndexLabel, IndexMeta,
  TickerRow, TickerDot, ManifestoFooter,
} from './shared';

type Props = {
  eyebrow: string;
  headlinePrefix: string;
  headlineItalic: string;
  headlineTail: string;
  lede: string;
  stampLabel: string;
  ticker: string;
  footerLeft: string;
  footerRight: string;
};

const INDEX = [
  { num: '01', label: 'Парсинг по ссылке с Cian / Domclick', meta: 'CIAN · DOMCLICK' },
  { num: '02', label: 'Теги, статусы, журнал звонков', meta: 'WORKFLOW' },
  { num: '03', label: 'Команда и общая комната поиска', meta: 'TEAMS' },
  { num: '04', label: 'Напоминания о показах и звонках', meta: 'REMINDERS' },
];

export function ManifestoPane({
  eyebrow, headlinePrefix, headlineItalic, headlineTail, lede,
  stampLabel, ticker, footerLeft, footerRight,
}: Props) {
  return (
    <Manifesto>
      <ManifestoHeader>
        <span>FF · vol. 2026</span>
        <Stamp>{stampLabel}</Stamp>
      </ManifestoHeader>

      <HeroBlock>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Headline
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {headlinePrefix} <span>{headlineItalic}</span> {headlineTail}
        </Headline>
        <Lede>{lede}</Lede>
      </HeroBlock>

      <IndexCard>
        <IndexHeader>
          <span>Что внутри</span>
          <span>04 пункта</span>
        </IndexHeader>
        <IndexList>
          {INDEX.map((item, i) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.4 }}
            >
              <IndexItem>
                <IndexNum>{item.num}</IndexNum>
                <IndexLabel>{item.label}</IndexLabel>
                <IndexMeta>{item.meta}</IndexMeta>
              </IndexItem>
            </motion.div>
          ))}
        </IndexList>
      </IndexCard>

      <TickerRow>
        <TickerDot />
        <span>{ticker}</span>
      </TickerRow>

      <ManifestoFooter>
        <span>{footerLeft}</span>
        <span>{footerRight}</span>
      </ManifestoFooter>
    </Manifesto>
  );
}