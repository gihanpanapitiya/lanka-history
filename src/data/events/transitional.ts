import type { HistEvent } from '../types.ts';

export const transitionalEvents: HistEvent[] = [
  // Dambadeniya to Kurunegala
  {
    id: 'dambadeniya',
    title: 'Kingdom of Dambadeniya',
    year: 1232,
    date: '1232',
    period: 'dambadeniya-kurunegala',
    summary:
      'Vijayabahu III establishes a capital at Dambadeniya, away from Magha’s reach, and recovers the Tooth and Bowl relics hidden in Kotmale.',
    causes: ['magha', 'dry-zone-collapse', 'tooth-relic'],
    tags: ['political'],
  },
  {
    id: 'jaffna-kingdom',
    title: 'Jaffna Kingdom emerges',
    year: 1260,
    date: '13th century',
    period: 'dambadeniya-kurunegala',
    summary:
      'A Tamil kingdom under the Aryacakravarti dynasty takes shape in the north, controlling the pearl fisheries and the Palk Strait trade.',
    causes: ['magha', 'dry-zone-collapse'],
    tags: ['political'],
  },
  {
    id: 'chandrabhanu',
    title: 'Chandrabhanu’s Javaka invasions',
    year: 1247,
    date: '1247 and c. 1262',
    period: 'dambadeniya-kurunegala',
    summary:
      'Chandrabhanu of Tambralinga (Malay Peninsula) invades twice seeking the Tooth Relic; Parakramabahu II and Pandyan forces repel him.',
    causes: ['dambadeniya'],
    tags: ['military', 'external'],
  },
  {
    id: 'yapahuwa',
    title: 'Rock fortress capital at Yapahuwa',
    year: 1272,
    date: '1272',
    period: 'dambadeniya-kurunegala',
    summary: 'Bhuvanekabahu I moves the capital and the Tooth Relic to a fortified rock at Yapahuwa.',
    causes: ['chandrabhanu', 'jaffna-kingdom'],
    tags: ['political', 'military'],
  },
  {
    id: 'relic-seized',
    title: 'Pandyas carry off the Tooth Relic',
    year: 1284,
    date: '1284',
    period: 'dambadeniya-kurunegala',
    summary:
      'A Pandyan army under Arya Chakravarti takes Yapahuwa and the relic; Parakramabahu III later recovers it through diplomacy.',
    causes: ['yapahuwa'],
    tags: ['military', 'religious'],
  },
  {
    id: 'kurunegala',
    title: 'Capital moves to Kurunegala',
    year: 1293,
    date: '1293',
    period: 'dambadeniya-kurunegala',
    summary: 'After Yapahuwa’s fall, the court relocates again, to Kurunegala.',
    causes: ['relic-seized'],
    tags: ['political'],
  },

  // Gampola & Kotte
  {
    id: 'gampola',
    title: 'Capital moves to Gampola',
    year: 1341,
    date: '1341',
    period: 'gampola-kotte',
    summary:
      'Bhuvanekabahu IV moves into the hill country. Real power increasingly lies with ministers such as the Alakeshvara family.',
    causes: ['kurunegala'],
    tags: ['political'],
  },
  {
    id: 'ibn-battuta',
    title: 'Ibn Battuta visits',
    year: 1344,
    date: '1344',
    period: 'gampola-kotte',
    summary:
      "The Moroccan traveller is received by the Aryacakravarti king of Jaffna and climbs Adam's Peak, describing a cosmopolitan Indian Ocean trading island.",
    causes: ['jaffna-kingdom'],
    tags: ['external', 'cultural'],
  },
  {
    id: 'jaffna-expansion',
    title: 'Jaffna kingdom expands south',
    year: 1350,
    date: 'mid-14th century',
    period: 'gampola-kotte',
    summary:
      'At its height, Jaffna collects tribute from much of the west coast and threatens Gampola.',
    causes: ['jaffna-kingdom', 'gampola'],
    tags: ['political', 'military'],
  },
  {
    id: 'kotte-fortress',
    title: 'Alakeshvara fortifies Kotte',
    year: 1370,
    date: 'c. 1370s',
    period: 'gampola-kotte',
    summary:
      'Minister Nissanka Alakeshvara builds a fortress at Kotte, near Colombo, and defeats the Jaffna army.',
    causes: ['jaffna-expansion', 'gampola'],
    tags: ['military'],
  },
  {
    id: 'zheng-he',
    title: 'Zheng He captures Vira Alakeshvara',
    year: 1411,
    date: '1411',
    period: 'gampola-kotte',
    summary:
      'The Ming admiral’s fleet clashes with Vira Alakeshvara and takes him captive to China. The Galle trilingual inscription (1409) records an earlier visit.',
    causes: ['kotte-fortress'],
    tags: ['external', 'military'],
  },
  {
    id: 'parakramabahu-vi',
    title: 'Parakramabahu VI rules from Kotte',
    year: 1412,
    date: 'r. 1412–1467',
    period: 'gampola-kotte',
    summary:
      'Filling the vacuum left by the Alakeshvaras, Parakramabahu VI makes Kotte the capital of the last king to rule the whole island.',
    causes: ['zheng-he', 'kotte-fortress'],
    tags: ['political'],
  },
  {
    id: 'jaffna-conquered',
    title: 'Sapumal Kumaraya conquers Jaffna',
    year: 1450,
    date: 'c. 1450',
    period: 'gampola-kotte',
    summary: 'Kotte’s army takes Jaffna; for 17 years the island is united under one crown.',
    causes: ['parakramabahu-vi', 'jaffna-expansion'],
    tags: ['military', 'political'],
  },
  {
    id: 'kotte-literature',
    title: 'Golden age of Sinhala literature',
    year: 1450,
    date: '15th century',
    period: 'gampola-kotte',
    summary:
      'Monk-poets such as Sri Rahula and Vidagama Maitreya write the classic sandesha (messenger) poems under royal patronage.',
    causes: ['parakramabahu-vi'],
    tags: ['cultural'],
  },
  {
    id: 'pbvi-death',
    title: 'Death of Parakramabahu VI',
    year: 1467,
    date: '1467',
    period: 'gampola-kotte',
    summary:
      'Succession struggles follow. Sapumal Kumaraya leaves Jaffna to seize Kotte, and Jaffna regains its independence.',
    causes: ['parakramabahu-vi', 'jaffna-conquered'],
    tags: ['political'],
  },
  {
    id: 'kandy-autonomy',
    title: 'Kandyan kingdom breaks away',
    year: 1469,
    date: 'c. 1469',
    period: 'gampola-kotte',
    summary:
      'Senasammata Vikramabahu establishes an autonomous kingdom in the central highlands, with its capital at Senkadagala (Kandy).',
    causes: ['pbvi-death'],
    tags: ['political'],
  },
  {
    id: 'vasco-da-gama',
    title: 'Vasco da Gama reaches India',
    year: 1498,
    date: '1498',
    period: 'gampola-kotte',
    summary:
      'The Portuguese open the sea route around Africa, aiming to control the spice trade of the Indian Ocean.',
    tags: ['external', 'economic'],
  },
];
