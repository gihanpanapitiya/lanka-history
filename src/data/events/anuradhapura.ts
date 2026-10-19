import type { HistEvent } from '../types.ts';

export const anuradhapuraEvents: HistEvent[] = [
  // Early Anuradhapura
  {
    id: 'vijaya',
    title: 'Arrival of Prince Vijaya',
    year: -543,
    date: '543 BCE (traditional)',
    period: 'early-anuradhapura',
    summary:
      'The Mahavamsa tells of Vijaya and 700 followers landing at Tambapanni and marrying into the local Yakkha population – the founding legend of the Sinhalese kingship.',
    causes: ['iron-age-anuradhapura', 'megalithic-burials'],
    tags: ['political'],
  },
  {
    id: 'pandukabhaya',
    title: 'Pandukabhaya makes Anuradhapura the capital',
    year: -437,
    date: '437 BCE (traditional)',
    period: 'early-anuradhapura',
    summary:
      'Pandukabhaya establishes a planned city at Anuradhapura, which remains the royal capital for some 1,400 years.',
    causes: ['vijaya'],
    tags: ['political'],
  },
  {
    id: 'early-tanks',
    title: 'First reservoirs (Abhaya Wewa)',
    year: -400,
    date: 'c. 4th century BCE',
    period: 'early-anuradhapura',
    summary:
      'Abhaya Wewa (Basawakkulama), attributed to Pandukabhaya, is among the first large tanks – the start of the hydraulic civilisation of the dry zone.',
    causes: ['pandukabhaya'],
    tags: ['economic', 'environmental'],
  },
  {
    id: 'ashoka-missions',
    title: "Ashoka's Buddhist missions",
    year: -250,
    date: 'c. 250 BCE',
    period: 'early-anuradhapura',
    summary:
      'After the Third Buddhist Council, the Mauryan emperor Ashoka sends missionaries across Asia, including his son Mahinda to Lanka.',
    tags: ['external', 'religious'],
  },
  {
    id: 'mahinda',
    title: 'Mahinda introduces Buddhism',
    year: -247,
    date: 'c. 247 BCE',
    period: 'early-anuradhapura',
    summary:
      'Mahinda meets King Devanampiya Tissa at Mihintale; the king and court convert. Theravada Buddhism becomes the state religion.',
    causes: ['ashoka-missions', 'pandukabhaya'],
    tags: ['religious', 'political'],
  },
  {
    id: 'mahavihara',
    title: 'Founding of the Mahavihara',
    year: -246,
    date: 'c. 246 BCE',
    period: 'early-anuradhapura',
    summary:
      'Devanampiya Tissa grants the Mahamegha park to the Sangha; the Mahavihara becomes the centre of Theravada orthodoxy.',
    causes: ['mahinda'],
    tags: ['religious'],
  },
  {
    id: 'bodhi-tree',
    title: 'Sanghamitta brings the Sri Maha Bodhi',
    year: -245,
    date: 'c. 3rd century BCE',
    period: 'early-anuradhapura',
    summary:
      'A sapling of the Bodhi tree at Bodh Gaya is planted in Anuradhapura; Sanghamitta also founds the order of nuns. The tree still stands.',
    causes: ['mahinda'],
    tags: ['religious'],
  },
  {
    id: 'elara',
    title: 'Elara rules Anuradhapura',
    year: -205,
    date: '205–161 BCE (traditional)',
    period: 'early-anuradhapura',
    summary:
      'Elara, a Chola from South India, seizes Anuradhapura and rules for 44 years – remembered even in Sinhalese chronicles as a just king.',
    causes: ['pandukabhaya'],
    tags: ['political', 'military'],
  },
  {
    id: 'ruhuna-rise',
    title: 'Rise of Ruhuna under Kavantissa',
    year: -180,
    date: '2nd century BCE',
    period: 'early-anuradhapura',
    summary:
      'The southern principality of Ruhuna grows into a rival power centre, becoming the base for resistance against the rulers of Anuradhapura.',
    causes: ['pandukabhaya'],
    tags: ['political'],
  },
  {
    id: 'dutugemunu',
    title: 'Dutugemunu defeats Elara',
    year: -161,
    date: '161 BCE (traditional)',
    period: 'early-anuradhapura',
    summary:
      'Marching from Ruhuna with monks in his army, Dutugemunu kills Elara in single combat and unites the island under one king.',
    causes: ['elara', 'ruhuna-rise', 'mahavihara'],
    tags: ['military', 'political'],
  },
  {
    id: 'ruwanwelisaya',
    title: 'Ruwanwelisaya and Lovamahapaya',
    year: -140,
    date: 'c. 140 BCE',
    period: 'early-anuradhapura',
    summary:
      'Dutugemunu builds the Great Stupa and the nine-storey Brazen Palace, setting the pattern of monumental royal patronage.',
    causes: ['dutugemunu'],
    tags: ['religious', 'cultural'],
  },

  // Middle Anuradhapura
  {
    id: 'vattagamani-exile',
    title: 'Vattagamani driven out by invaders',
    year: -103,
    date: '103–89 BCE',
    period: 'middle-anuradhapura',
    summary:
      'A revolt and an invasion by five South Indian chiefs force King Vattagamani Abhaya into 14 years of exile, during which the Brahmanatissa famine ravages the land.',
    causes: ['dutugemunu'],
    tags: ['political', 'military'],
  },
  {
    id: 'abhayagiri',
    title: 'Abhayagiri Vihara founded',
    year: -89,
    date: '89 BCE',
    period: 'middle-anuradhapura',
    summary:
      'On regaining the throne, Vattagamani builds Abhayagiri and grants it to a monk who had helped him. It grows into a liberal, internationally connected rival to the Mahavihara.',
    causes: ['vattagamani-exile', 'mahavihara'],
    tags: ['religious'],
  },
  {
    id: 'tripitaka-written',
    title: 'Pali Canon written down at Aluvihare',
    year: -80,
    date: '1st century BCE',
    period: 'middle-anuradhapura',
    summary:
      'Fearing war and famine would break the oral lineage, monks commit the Tripitaka and its commentaries to writing – the first time the Theravada canon is written.',
    causes: ['vattagamani-exile', 'mahavihara'],
    tags: ['religious', 'cultural'],
  },
  {
    id: 'monastic-schism',
    title: 'Mahavihara–Abhayagiri rivalry',
    year: -50,
    date: '1st century BCE onwards',
    period: 'middle-anuradhapura',
    summary:
      'Competing monastic fraternities vie for royal patronage for a thousand years, with Abhayagiri open to Mahayana ideas.',
    causes: ['abhayagiri'],
    tags: ['religious'],
  },
  {
    id: 'mahasena',
    title: 'Mahasena builds Jetavana; persecutes Mahavihara',
    year: 274,
    date: 'r. 274–301 CE',
    period: 'middle-anuradhapura',
    summary:
      'Siding with the Abhayagiri faction, Mahasena demolishes Mahavihara buildings and raises Jetavanaramaya, then one of the tallest structures in the world.',
    causes: ['monastic-schism'],
    tags: ['religious', 'political'],
  },
  {
    id: 'minneriya',
    title: 'Minneriya and the great tanks',
    year: 276,
    date: 'c. 276 CE',
    period: 'middle-anuradhapura',
    summary:
      'Mahasena builds Minneriya and 15 other reservoirs, earning worship as a deity of the tanks.',
    causes: ['early-tanks', 'mahasena'],
    tags: ['economic', 'environmental'],
  },
  {
    id: 'tooth-relic',
    title: 'Tooth Relic arrives from Kalinga',
    year: 310,
    date: '4th century CE',
    period: 'middle-anuradhapura',
    summary:
      'Princess Hemamala and Prince Danta bring the Buddha’s tooth to Lanka in the reign of Sirimeghavanna. Possession of the relic becomes the symbol of the right to rule.',
    causes: ['mahinda'],
    tags: ['religious', 'political'],
  },
  {
    id: 'faxian',
    title: 'Chinese pilgrim Faxian visits',
    year: 410,
    date: 'c. 410–412 CE',
    period: 'middle-anuradhapura',
    summary:
      'Faxian stays two years at Abhayagiri, records the Tooth Relic procession and carries Lankan texts back to China.',
    causes: ['abhayagiri', 'tooth-relic'],
    tags: ['cultural', 'external'],
  },
  {
    id: 'buddhaghosa',
    title: 'Buddhaghosa writes the Pali commentaries',
    year: 430,
    date: 'c. 5th century CE',
    period: 'middle-anuradhapura',
    summary:
      'Working at the Mahavihara, the Indian scholar Buddhaghosa writes the Visuddhimagga and renders the Sinhala commentaries into Pali, fixing Theravada orthodoxy for South-East Asia too.',
    causes: ['tripitaka-written', 'monastic-schism'],
    tags: ['religious', 'cultural'],
  },

  // Late Anuradhapura
  {
    id: 'dhatusena',
    title: 'Dhatusena expels the Pandyas; builds Kalawewa',
    year: 455,
    date: 'r. 455–473 CE',
    period: 'late-anuradhapura',
    summary:
      'After ending a period of Pandyan rule, Dhatusena builds Kalawewa and the 87 km Jaya Ganga canal feeding Anuradhapura.',
    causes: ['minneriya'],
    tags: ['political', 'economic'],
  },
  {
    id: 'sigiriya',
    title: 'Kashyapa I builds Sigiriya',
    year: 477,
    date: '477–495 CE',
    period: 'late-anuradhapura',
    summary:
      'Kashyapa kills his father Dhatusena and, fearing his half-brother Moggallana, moves the capital to the rock fortress of Sigiriya with its gardens and frescoes.',
    causes: ['dhatusena'],
    tags: ['political', 'cultural'],
  },
  {
    id: 'moggallana',
    title: 'Moggallana I returns the capital to Anuradhapura',
    year: 495,
    date: '495 CE',
    period: 'late-anuradhapura',
    summary:
      'Moggallana returns with an army from India; Kashyapa dies in battle and Sigiriya is handed over to monks.',
    causes: ['sigiriya'],
    tags: ['military', 'political'],
  },
  {
    id: 'mahavamsa',
    title: 'The Mahavamsa is composed',
    year: 500,
    date: 'c. 5th–6th century CE',
    period: 'late-anuradhapura',
    summary:
      'The monk Mahanama composes the Great Chronicle in Pali verse, from the Mahavihara perspective – the main source for the island’s early history.',
    causes: ['buddhaghosa', 'monastic-schism'],
    tags: ['cultural', 'religious'],
  },
  {
    id: 'manavamma',
    title: 'Pallava-backed Manavamma takes the throne',
    year: 684,
    date: '684 CE',
    period: 'late-anuradhapura',
    summary:
      'Exiled prince Manavamma returns with Pallava troops. South Indian armies become a regular factor in Lankan succession struggles.',
    causes: ['moggallana'],
    tags: ['political', 'military'],
  },
  {
    id: 'mirror-wall',
    title: 'Sigiriya Mirror Wall graffiti',
    year: 750,
    date: '8th–10th century',
    period: 'late-anuradhapura',
    summary:
      'Visitors to the abandoned Sigiriya leave hundreds of poems on its polished wall – the earliest substantial body of Sinhala poetry.',
    causes: ['moggallana'],
    tags: ['cultural'],
  },
  {
    id: 'pandyan-sack',
    title: 'Pandyan sack of Anuradhapura',
    year: 840,
    date: 'c. 840 CE (reign of Sena I)',
    period: 'late-anuradhapura',
    summary:
      'Pandyan king Srimara Srivallabha invades, loots the treasury and carries off golden images.',
    causes: ['manavamma'],
    tags: ['military'],
  },
  {
    id: 'madurai-raid',
    title: 'Sena II sacks Madurai',
    year: 862,
    date: 'c. 862 CE',
    period: 'late-anuradhapura',
    summary:
      'Backing a Pandyan pretender, Sena II invades South India, sacks Madurai and recovers the looted treasures – binding Lanka into Pandyan politics.',
    causes: ['pandyan-sack'],
    tags: ['military', 'political'],
  },
  {
    id: 'chola-rise',
    title: 'Rise of the Chola empire',
    year: 985,
    date: 'from 985 CE',
    period: 'late-anuradhapura',
    summary:
      'Rajaraja I builds the Cholas into the dominant naval and military power of South India and the Bay of Bengal.',
    tags: ['external', 'political'],
  },
  {
    id: 'mercenary-revolt',
    title: 'Mercenary revolt; Mahinda V flees to Ruhuna',
    year: 991,
    date: 'c. 991 CE',
    period: 'late-anuradhapura',
    summary:
      'Unpaid mercenaries revolt and the king abandons Anuradhapura for Ruhuna, leaving the north exposed.',
    causes: ['madurai-raid'],
    tags: ['political', 'economic'],
  },
  {
    id: 'chola-invasion',
    title: 'Rajaraja I invades northern Lanka',
    year: 993,
    date: '993 CE',
    period: 'late-anuradhapura',
    summary:
      'A Chola army takes Rajarata, sacks Anuradhapura and annexes the north as the province of Mummudi-sola-mandalam, with Polonnaruwa as its centre.',
    causes: ['chola-rise', 'mercenary-revolt', 'madurai-raid'],
    tags: ['military', 'political'],
  },
];
