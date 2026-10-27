import type { Period } from './types.ts';

/**
 * Period hierarchy. Top-level periods have no `parent`.
 * Events are attached to leaf periods; a parent's view shows all its descendants.
 */
export const periods: Period[] = [
  {
    id: 'prehistoric',
    name: 'Prehistoric & Protohistoric',
    start: -48000,
    end: -544,
    summary: 'From the earliest modern humans to the Iron Age settlements that preceded the chronicles.',
    color: '#8d6e63',
  },
  { id: 'stone-age', parent: 'prehistoric', name: 'Stone Age', start: -48000, end: -1000, summary: 'Hunter-gatherers of the Balangoda culture.' },
  { id: 'iron-age', parent: 'prehistoric', name: 'Early Iron Age', start: -1000, end: -544, summary: 'Settled villages, iron, rice, and megalithic burials.' },

  {
    id: 'anuradhapura',
    name: 'Anuradhapura Period',
    start: -543,
    end: 1017,
    summary: 'Fifteen centuries of kingship centred on Anuradhapura: Buddhism, great stupas and tank irrigation.',
    color: '#3a86c8',
  },
  { id: 'early-anuradhapura', parent: 'anuradhapura', name: 'Early Anuradhapura', start: -543, end: -137, summary: 'Vijaya to Dutugemunu; the arrival of Buddhism.' },
  { id: 'middle-anuradhapura', parent: 'anuradhapura', name: 'Middle Anuradhapura', start: -137, end: 455, summary: 'Monastic rivalry, the written canon and great reservoirs.' },
  { id: 'late-anuradhapura', parent: 'anuradhapura', name: 'Late Anuradhapura', start: 455, end: 1017, summary: 'Sigiriya, South Indian entanglements and the Chola conquest.' },

  {
    id: 'polonnaruwa',
    name: 'Polonnaruwa Period',
    start: 1017,
    end: 1232,
    summary: 'Chola rule, Sinhalese restoration, and the peak and collapse of the dry-zone civilisation.',
    color: '#2e7d32',
  },
  { id: 'chola-rule', parent: 'polonnaruwa', name: 'Chola Rule', start: 1017, end: 1070, summary: 'Rajarata as a province of the Chola empire.' },
  { id: 'polonnaruwa-kingdom', parent: 'polonnaruwa', name: 'Polonnaruwa Kingdom', start: 1070, end: 1232, summary: 'Vijayabahu I to Kalinga Magha.' },

  {
    id: 'transitional',
    name: 'Transitional Period',
    start: 1232,
    end: 1505,
    summary: 'The drift of the capital to the south-west and the rise of the Jaffna kingdom.',
    color: '#00838f',
  },
  { id: 'dambadeniya-kurunegala', parent: 'transitional', name: 'Dambadeniya to Kurunegala', start: 1232, end: 1341, summary: 'Mobile capitals guarding the Tooth Relic.' },
  { id: 'gampola-kotte', parent: 'transitional', name: 'Gampola & Kotte', start: 1341, end: 1505, summary: 'Gampola, the Alakeshvaras and the unification under Kotte.' },

  {
    id: 'colonial',
    name: 'Kandyan & Colonial Period',
    start: 1505,
    end: 1948,
    summary: 'Portuguese, Dutch and British rule on the coasts and, from 1815, the whole island.',
    color: '#5c6bc0',
  },
  { id: 'portuguese', parent: 'colonial', name: 'Portuguese Era', start: 1505, end: 1658, summary: 'Kotte, Sitawaka, Kandy and the Portuguese.' },
  { id: 'dutch', parent: 'colonial', name: 'Dutch Era', start: 1658, end: 1796, summary: 'The VOC on the coasts; the Nayakkar kings in Kandy.' },
  { id: 'british', parent: 'colonial', name: 'British Era', start: 1796, end: 1948, summary: 'Crown colony, plantations, revival and the road to independence.' },
];
