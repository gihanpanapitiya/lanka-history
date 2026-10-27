import type { HistEvent } from '../types.ts';

export const polonnaruwaEvents: HistEvent[] = [
  // Chola rule
  {
    id: 'chola-conquest',
    title: 'Rajendra I captures Mahinda V',
    year: 1017,
    date: '1017 CE',
    period: 'chola-rule',
    summary:
      'Rajendra Chola completes the conquest, seizes the royal regalia and the king, who dies a captive in India. The whole island but Ruhuna is under Chola rule.',
    causes: ['chola-invasion'],
    tags: ['military', 'political'],
  },
  {
    id: 'ruhuna-resistance',
    title: 'Resistance from Ruhuna',
    year: 1029,
    date: 'c. 1029–1070',
    period: 'chola-rule',
    summary:
      'Successive Sinhalese princes hold out in the south and wage a long guerrilla war against the Chola garrisons.',
    causes: ['chola-conquest'],
    tags: ['military'],
  },

  // Polonnaruwa kingdom
  {
    id: 'vijayabahu-i',
    title: 'Vijayabahu I expels the Cholas',
    year: 1070,
    date: '1070',
    period: 'polonnaruwa-kingdom',
    summary:
      'After years of war, Vijayabahu takes Polonnaruwa and keeps it as his capital – further from South India than Anuradhapura.',
    causes: ['ruhuna-resistance'],
    tags: ['military', 'political'],
  },
  {
    id: 'burmese-ordination',
    title: 'Ordination restored with monks from Bagan',
    year: 1071,
    date: 'c. 1070s',
    period: 'polonnaruwa-kingdom',
    summary:
      'With the Sangha decimated under Chola rule, Vijayabahu invites monks from King Anawrahta of Burma to restore the higher ordination.',
    causes: ['vijayabahu-i', 'chola-conquest'],
    tags: ['religious', 'external'],
  },
  {
    id: 'civil-war-1110',
    title: 'Civil war after Vijayabahu I',
    year: 1110,
    date: '1110–1153',
    period: 'polonnaruwa-kingdom',
    summary: 'Rival branches of the royal family carve the island into competing principalities.',
    causes: ['vijayabahu-i'],
    tags: ['political', 'military'],
  },
  {
    id: 'parakramabahu-i',
    title: 'Parakramabahu I unifies the island',
    year: 1153,
    date: '1153 (sole rule from 1153)',
    period: 'polonnaruwa-kingdom',
    summary:
      'Parakramabahu the Great wins the civil war and rules a centralised kingdom; the "not one drop of rain to reach the sea without serving man" maxim is attributed to him.',
    causes: ['civil-war-1110'],
    tags: ['political', 'military'],
  },
  {
    id: 'parakrama-samudra',
    title: 'Parakrama Samudra built',
    year: 1160,
    date: '12th century',
    period: 'polonnaruwa-kingdom',
    summary:
      'The "Sea of Parakrama", linking older tanks into one vast reservoir, marks the peak of the dry-zone irrigation system.',
    causes: ['parakramabahu-i'],
    tags: ['economic', 'environmental'],
  },
  {
    id: 'sangha-unified',
    title: 'The Sangha unified under the Mahavihara',
    year: 1165,
    date: 'c. 1165',
    period: 'polonnaruwa-kingdom',
    summary:
      'Parakramabahu purges and merges the rival fraternities, ending the Abhayagiri and Jetavana lineages.',
    causes: ['parakramabahu-i'],
    tags: ['religious'],
  },
  {
    id: 'burma-expedition',
    title: 'Expedition against Ramanna (Burma)',
    year: 1164,
    date: 'c. 1164',
    period: 'polonnaruwa-kingdom',
    summary:
      'After a trade and diplomatic dispute, a Lankan naval expedition attacks the Burmese coast – a rare overseas campaign.',
    causes: ['parakramabahu-i'],
    tags: ['military', 'external'],
  },
  {
    id: 'kalinga-dynasty',
    title: 'Kalinga dynasty: Nissanka Malla',
    year: 1187,
    date: 'r. 1187–1196',
    period: 'polonnaruwa-kingdom',
    summary:
      'Through royal marriage alliances, the Kalinga prince Nissanka Malla takes the throne; his many inscriptions insist only Buddhists may rule.',
    causes: ['parakramabahu-i'],
    tags: ['political'],
  },
  {
    id: 'instability-1196',
    title: 'Courtly instability',
    year: 1196,
    date: '1196–1215',
    period: 'polonnaruwa-kingdom',
    summary:
      'Over a dozen rulers in two decades; factions of the nobility and South Indian adventurers make and unmake kings.',
    causes: ['kalinga-dynasty'],
    tags: ['political'],
  },
  {
    id: 'magha',
    title: 'Kalinga Magha sacks Polonnaruwa',
    year: 1215,
    date: '1215',
    period: 'polonnaruwa-kingdom',
    summary:
      'Magha of Kalinga invades with a large army, persecutes the Sangha and rules harshly from Polonnaruwa for some 21 years.',
    causes: ['instability-1196'],
    tags: ['military', 'political'],
  },
  {
    id: 'dry-zone-collapse',
    title: 'Collapse of the dry-zone civilisation',
    year: 1230,
    date: '13th century',
    period: 'polonnaruwa-kingdom',
    summary:
      'War, the breakdown of tank maintenance and probably malaria empty the Rajarata. The Sinhalese population and capitals drift to the wet south-west.',
    causes: ['magha', 'parakrama-samudra'],
    tags: ['environmental', 'social', 'economic'],
  },
];
