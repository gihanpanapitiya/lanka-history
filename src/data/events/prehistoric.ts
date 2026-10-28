import type { HistEvent } from '../types.ts';

export const prehistoricEvents: HistEvent[] = [
  {
    id: 'balangoda-man',
    title: 'Earliest modern humans (Balangoda culture)',
    year: -46000,
    date: 'c. 48,000–38,000 BP',
    period: 'stone-age',
    summary:
      'Fa-Hien Lena and Batadombalena caves preserve some of the earliest evidence of anatomically modern humans in South Asia, along with very early microlithic tools.',
    wiki: 'Balangoda Man',
    tags: ['cultural'],
  },
  {
    id: 'rainforest-foraging',
    title: 'Rainforest foraging adaptation',
    year: -36000,
    date: 'c. 36,000 BP',
    period: 'stone-age',
    summary:
      'Balangoda people develop specialised hunting of monkeys and squirrels in the wet-zone rainforest – among the oldest known rainforest adaptations anywhere.',
    wiki: 'Fa Hien Cave',
    causes: ['balangoda-man'],
    tags: ['environmental', 'cultural'],
  },
  {
    id: 'island-separated',
    title: 'Rising seas cut the land bridge to India',
    year: -7000,
    date: 'c. 9,000–7,000 years ago',
    period: 'stone-age',
    summary:
      "Post-glacial sea-level rise submerges the land link across the Palk Strait, leaving Adam's Bridge as a chain of shoals. Later contact with India is by sea.",
    wiki: "Adam's Bridge",
    tags: ['environmental'],
  },
  {
    id: 'iron-age-anuradhapura',
    title: 'Iron Age settlement at Anuradhapura',
    year: -900,
    date: 'c. 900 BCE',
    period: 'iron-age',
    summary:
      'Excavations at the Anuradhapura citadel show an Early Iron Age settlement with iron working, rice cultivation, cattle and horses – centuries before the chronicled kings.',
    wiki: 'Anuradhapura',
    causes: ['island-separated'],
    tags: ['economic', 'social'],
  },
  {
    id: 'megalithic-burials',
    title: 'Megalithic burials (Ibbankatuwa, Pomparippu)',
    year: -750,
    date: 'c. 750–400 BCE',
    period: 'iron-age',
    summary:
      'Cist and urn burials with black-and-red ware link the island to the South Indian megalithic culture.',
    wiki: 'Ibbankatuwa Megalithic Tombs',
    causes: ['iron-age-anuradhapura'],
    tags: ['cultural'],
  },
];
