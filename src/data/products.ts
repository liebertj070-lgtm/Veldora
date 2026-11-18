export type ProductCategory =
  | 'Outerwear'
  | 'Tailoring'
  | 'Knitwear'
  | 'Dresses'
  | 'Objects';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  category: ProductCategory;
  collection: 'Monolith AW26' | 'Raw Mineral' | 'Permanent Archive';
  tag?: string;
  description: string;
  composition: string;
  origin: string;
  fitNotes: string;
  image: string;
  secondaryImage: string;
  gallery: string[];
  sizes: string[];
  colors: ProductColor[];
  featured?: boolean;
  isNew?: boolean;
}

export const CAMPAIGN_MEDIA = {
  heroMonolith: '/src/assets/images/hero_campaign_monolith_1795037409795.jpg',
  atelierSpread: '/src/assets/images/editorial_atelier_spread_1795037410433.jpg',
  aboutPortrait: '/src/assets/images/editorial_about_portrait_1795037410230.jpg',
  textileDetail: '/src/assets/images/editorial_detail_textile_1795037410841.jpg',
};

export const FLOW_MEDIA = {
  heroConcreteFilm: '/assets/aistudio/Model_walking_in_concrete_gallery_1da79011_7acc8a45.mp4',
  coatMotionPortrait: '/assets/aistudio/Model_wearing_black_coat_7e0a56e5_2af1ad92.mp4',
  silkBlazerFilm: '/assets/aistudio/Model_posing_in_silk_blazer_053ceb98_8ed9f770.mp4',
  cutoutTrench: '/assets/aistudio/Model_wearing_trench_coat_trousers_3b01dc12_5fd0a368.jpg',
  cutoutPuffer: '/assets/aistudio/Model_wearing_oversized_puffer_cape_6055b3bf_4f190264.jpg',
  cutoutWoolDress: '/assets/aistudio/Model_wearing_wool_dress_6d3e330b_517d5201.jpg',
  macroEyesCollar: '/assets/aistudio/Model_eyes_and_brow_56d90be1_2K_103cd846.jpg',
};

export const PRODUCTS: Product[] = [
  {
    id: 'vlr-01-obsidian-trench',
    sku: 'VLR-AW26-001',
    name: 'Monolith Double-Breasted Trench',
    price: 1280,
    category: 'Outerwear',
    collection: 'Monolith AW26',
    tag: 'Runway Piece',
    description:
      'Constructed with dropped architectural shoulders and an exaggerated storm lapel, this floor-grazing trench is cut from dense water-repellent Japanese gabardine. Clean horn hardware and an elongated waist tie allow sculptural modulation.',
    composition: '100% Virgin Gabardine Wool · Cupro Bemberg Lining',
    origin: 'Patterned in Antwerp · Milled in Ichinomiya, Japan',
    fitNotes: 'Oversized architectural drape. Select your normal size for intended volume.',
    image: '/src/assets/images/prod_01_obsidian_trench_1795037412225.jpg',
    secondaryImage: CAMPAIGN_MEDIA.heroMonolith,
    gallery: [
      '/src/assets/images/prod_01_obsidian_trench_1795037412225.jpg',
      CAMPAIGN_MEDIA.heroMonolith,
      CAMPAIGN_MEDIA.textileDetail,
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Obsidian', hex: '#171717' },
      { name: 'Stone', hex: '#A6A39A' },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: 'vlr-02-bone-blazer',
    sku: 'VLR-AW26-002',
    name: 'Collarless Raw-Silk Tailored Blazer',
    price: 940,
    category: 'Tailoring',
    collection: 'Raw Mineral',
    tag: 'Signature Cut',
    description:
      'Stripped of traditional notch lapels, this single-breasted jacket frames the collarbone with a razor-sharp architectural edge. Unlined internal French seams maintain lightness while retaining crisp shoulder geometry.',
    composition: '72% Raw Mulberry Silk, 28% Virgin Wool',
    origin: 'Tailored in Milan, Italy',
    fitNotes: 'Sculpted straight torso with subtle waist suppression.',
    image: '/src/assets/images/prod_02_bone_blazer_1795037411802.jpg',
    secondaryImage: CAMPAIGN_MEDIA.atelierSpread,
    gallery: [
      '/src/assets/images/prod_02_bone_blazer_1795037411802.jpg',
      CAMPAIGN_MEDIA.atelierSpread,
      CAMPAIGN_MEDIA.textileDetail,
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Bone', hex: '#E9E6DF' },
      { name: 'Obsidian', hex: '#171717' },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: 'vlr-03-sage-knit',
    sku: 'VLR-AW26-003',
    name: 'Asymmetric Ribbed Merino Turtleneck',
    price: 520,
    category: 'Knitwear',
    collection: 'Monolith AW26',
    description:
      'Knitted on a 5-gauge flatbed frame from superfine Australian merino yarn in muted mineral sage. Features a diagonal bias hem, articulated elbow ribbing, and extended sleeve cuffs designed to gather naturally at the wrist.',
    composition: '100% Extrafine Merino Wool (RWS Certified)',
    origin: 'Knitted in Biella, Italy',
    fitNotes: 'Relaxed asymmetric drape with elongated sleeves.',
    image: '/src/assets/images/prod_03_sage_knit_1795037413401.jpg',
    secondaryImage: CAMPAIGN_MEDIA.textileDetail,
    gallery: [
      '/src/assets/images/prod_03_sage_knit_1795037413401.jpg',
      CAMPAIGN_MEDIA.textileDetail,
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Sage', hex: '#8A9A7E' },
      { name: 'Bone', hex: '#E9E6DF' },
      { name: 'Obsidian', hex: '#171717' },
    ],
    featured: true,
    isNew: true,
  },
  {
    id: 'vlr-04-draped-dress',
    sku: 'VLR-AW26-004',
    name: 'Bias-Cut Sculpted Crepe Gown',
    price: 1120,
    category: 'Dresses',
    collection: 'Permanent Archive',
    tag: 'Atelier Edition',
    description:
      'Engineered from a single continuous panel of heavyweight matte acetate-silk crepe, twisted across the left shoulder to create a fluid diagonal fold without darts or visible closures.',
    composition: '65% Japanese Triacetate, 35% Mulberry Silk',
    origin: 'Draped in Antwerp Atelier',
    fitNotes: 'Fluid bias cut that skims the silhouette. Floor length.',
    image: '/src/assets/images/prod_04_draped_dress_1795037413635.jpg',
    secondaryImage: CAMPAIGN_MEDIA.aboutPortrait,
    gallery: [
      '/src/assets/images/prod_04_draped_dress_1795037413635.jpg',
      CAMPAIGN_MEDIA.aboutPortrait,
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Obsidian', hex: '#171717' },
      { name: 'Stone', hex: '#A6A39A' },
    ],
    featured: false,
    isNew: true,
  },
  {
    id: 'vlr-05-cropped-jacket',
    sku: 'VLR-AW26-005',
    name: 'Waxed Cotton Modular Field Jacket',
    price: 680,
    category: 'Outerwear',
    collection: 'Raw Mineral',
    description:
      'A study in utilitarian proportion. Boxy cropped cut in dry-hand Scottish waxed cotton featuring oversized bellows pockets, concealed snap storm placket, and an upright structured funnel collar.',
    composition: '100% Organic Dry-Waxed Cotton (320gsm)',
    origin: 'Woven in Dundee · Assembled in Portugal',
    fitNotes: 'Cropped boxy silhouette ending cleanly at the hipbone.',
    image: '/src/assets/images/prod_05_cropped_jacket_1795037413511.jpg',
    secondaryImage: CAMPAIGN_MEDIA.atelierSpread,
    gallery: [
      '/src/assets/images/prod_05_cropped_jacket_1795037413511.jpg',
      CAMPAIGN_MEDIA.atelierSpread,
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Slate Stone', hex: '#6F6E6A' },
      { name: 'Obsidian', hex: '#171717' },
    ],
    featured: false,
    isNew: false,
  },
  {
    id: 'vlr-06-pleated-trouser',
    sku: 'VLR-AW26-006',
    name: 'Double-Pleated Wide Wool Trouser',
    price: 590,
    category: 'Tailoring',
    collection: 'Permanent Archive',
    description:
      'Deep twin forward pleats anchor the high-waisted silhouette before falling into a clean architectural column. Finished with a side-tab cinch waist and crisp pressed front crease.',
    composition: '100% Super 120s Flannel Wool',
    origin: 'Tailored in Milan, Italy',
    fitNotes: 'High rise, generous wide leg. Unhemmed 34" inseam option included.',
    image: '/src/assets/images/prod_06_pleated_trouser_1795037414043.jpg',
    secondaryImage: CAMPAIGN_MEDIA.textileDetail,
    gallery: [
      '/src/assets/images/prod_06_pleated_trouser_1795037414043.jpg',
      CAMPAIGN_MEDIA.textileDetail,
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal', hex: '#383836' },
      { name: 'Obsidian', hex: '#171717' },
      { name: 'Bone', hex: '#E9E6DF' },
    ],
    featured: false,
    isNew: false,
  },
  {
    id: 'vlr-07-cashmere-cardigan',
    sku: 'VLR-AW26-007',
    name: 'Brushed Cashmere Wrap Cardigan',
    price: 780,
    category: 'Knitwear',
    collection: 'Raw Mineral',
    description:
      'Spun from unbleached Inner Mongolian cashmere brushed for a tactile halo. Cut as an enveloping kimono-shoulder wrap secured by a single hand-carved ox-horn toggle.',
    composition: '100% Undyed Grade-A Cashmere',
    origin: 'Knitted in Hawick, Scotland',
    fitNotes: 'Generous cocoon fit; can be layered over tailoring.',
    image: '/src/assets/images/prod_07_cashmere_cardigan_1795037414457.jpg',
    secondaryImage: CAMPAIGN_MEDIA.aboutPortrait,
    gallery: [
      '/src/assets/images/prod_07_cashmere_cardigan_1795037414457.jpg',
      CAMPAIGN_MEDIA.aboutPortrait,
    ],
    sizes: ['XS/S', 'M/L'],
    colors: [
      { name: 'Oatmeal Bone', hex: '#D6CFC2' },
      { name: 'Stone', hex: '#A6A39A' },
    ],
    featured: false,
    isNew: true,
  },
  {
    id: 'vlr-08-leather-tote',
    sku: 'VLR-OBJ-008',
    name: 'Geometric Gusset Calfskin Tote',
    price: 890,
    category: 'Objects',
    collection: 'Permanent Archive',
    tag: 'Limited Run',
    description:
      'Sculpted from full-grain matte Italian box calfskin with structural vertical darting that holds its architectural trapezoid form even when empty. Raw edge-painted handles and suede-lined interior sleeve.',
    composition: '100% Vegetable-Tanned Box Calfskin',
    origin: 'Handcrafted in Florence, Italy',
    fitNotes: '38cm W × 34cm H × 16cm D · Fits 16" laptop.',
    image: '/src/assets/images/prod_08_leather_tote_1795037415207.jpg',
    secondaryImage: CAMPAIGN_MEDIA.heroMonolith,
    gallery: [
      '/src/assets/images/prod_08_leather_tote_1795037415207.jpg',
      CAMPAIGN_MEDIA.heroMonolith,
    ],
    sizes: ['ONE SIZE'],
    colors: [
      { name: 'Obsidian', hex: '#171717' },
      { name: 'Dark Moss', hex: '#4B5343' },
    ],
    featured: false,
    isNew: false,
  },
  {
    id: 'vlr-09-silk-slip-skirt',
    sku: 'VLR-RM-009',
    name: 'Raw Mulberry Bias Slip Skirt',
    price: 410,
    category: 'Dresses',
    collection: 'Raw Mineral',
    description:
      'Cut on a 45-degree true bias from sand-washed raw mulberry silk with subtle slub texture and an unpressed micro-fringed asymmetric hemline that moves effortlessly with stride.',
    composition: '100% Raw Sand-Washed Mulberry Silk',
    origin: 'Atelier Crafted in Portugal',
    fitNotes: 'Concealed elasticated internal waistband, mid-calf asymmetric drop.',
    image: '/src/assets/images/prod_09_silk_slip_skirt_1795037415434.jpg',
    secondaryImage: CAMPAIGN_MEDIA.atelierSpread,
    gallery: [
      '/src/assets/images/prod_09_silk_slip_skirt_1795037415434.jpg',
      CAMPAIGN_MEDIA.atelierSpread,
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Pale Bone', hex: '#E9E6DF' },
      { name: 'Sage', hex: '#B8C7A6' },
    ],
    featured: false,
    isNew: false,
  },
  {
    id: 'vlr-10-puffer-cape',
    sku: 'VLR-AW26-010',
    name: 'Sculptural Down Cocoon Cape',
    price: 1460,
    category: 'Outerwear',
    collection: 'Monolith AW26',
    tag: 'Archive Numbered',
    description:
      'An extreme volume study inspired by brutalist monoliths. Filled with ethically sourced 800-fill European goose down encased in matte Japanese ripstop nylon with diagonal architectural baffling.',
    composition: '100% Matte Ripstop Nylon · 90/10 Goose Down Fill',
    origin: 'Engineered in Seoul & Antwerp',
    fitNotes: 'Intentional monumental volume. Adjustable internal drawcords.',
    image: '/src/assets/images/prod_10_puffer_cape_1795037415767.jpg',
    secondaryImage: CAMPAIGN_MEDIA.heroMonolith,
    gallery: [
      '/src/assets/images/prod_10_puffer_cape_1795037415767.jpg',
      CAMPAIGN_MEDIA.heroMonolith,
    ],
    sizes: ['S/M', 'M/L'],
    colors: [{ name: 'Obsidian', hex: '#171717' }],
    featured: false,
    isNew: true,
  },
  {
    id: 'vlr-11-poplin-shirt',
    sku: 'VLR-PA-011',
    name: 'Elongated Cuff Architectural Shirt',
    price: 340,
    category: 'Tailoring',
    collection: 'Permanent Archive',
    description:
      'Crisp 120/2 double-twisted organic cotton poplin featuring an exaggerated 14cm architectural cuff, concealed mother-of-pearl front placket, and deep box-pleat back yoke.',
    composition: '100% GOTS Organic Double-Twisted Cotton Poplin',
    origin: 'Woven in Como · Cut in Portugal',
    fitNotes: 'Relaxed gallery proportion with extended sleeves.',
    image: '/src/assets/images/prod_11_poplin_shirt_1795037416418.jpg',
    secondaryImage: CAMPAIGN_MEDIA.aboutPortrait,
    gallery: [
      '/src/assets/images/prod_11_poplin_shirt_1795037416418.jpg',
      CAMPAIGN_MEDIA.aboutPortrait,
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Chalk Ivory', hex: '#F2EFE9' },
      { name: 'Sage', hex: '#B8C7A6' },
      { name: 'Obsidian', hex: '#171717' },
    ],
    featured: false,
    isNew: false,
  },
  {
    id: 'vlr-12-derby-boot',
    sku: 'VLR-OBJ-012',
    name: 'Goodyear-Welted Leather Derby Boot',
    price: 740,
    category: 'Objects',
    collection: 'Permanent Archive',
    description:
      'Anatomical round-toe silhouette crafted from oiled full-grain horsehide mounted on a stacked natural leather welt and custom lugged Vibram commando outsole.',
    composition: '100% Vegetable-Tanned Horsehide · Goodyear Storm Welt',
    origin: 'Lasted in Marche, Italy',
    fitNotes: 'True to European sizing. Supplied with waxed cotton laces and dust bag.',
    image: '/src/assets/images/prod_12_derby_boot_1795037416875.jpg',
    secondaryImage: CAMPAIGN_MEDIA.textileDetail,
    gallery: [
      '/src/assets/images/prod_12_derby_boot_1795037416875.jpg',
      CAMPAIGN_MEDIA.textileDetail,
    ],
    sizes: ['37', '38', '39', '40', '41', '42', '43'],
    colors: [{ name: 'Obsidian', hex: '#171717' }],
    featured: false,
    isNew: true,
  },
];

export interface CollectionStory {
  id: string;
  chapter: string;
  title: string;
  season: string;
  manifesto: string;
  image: string;
  productIds: string[];
}

export const COLLECTIONS: CollectionStory[] = [
  {
    id: 'monolith-aw26',
    chapter: '01',
    title: 'Monolith AW26',
    season: 'Autumn / Winter 2026',
    manifesto:
      'An architectural investigation into weight, shadow, and structural protection. Severe silhouettes softened solely by the kinetic fold of heavyweight Japanese wool and down-filled volumes.',
    image: CAMPAIGN_MEDIA.heroMonolith,
    productIds: [
      'vlr-01-obsidian-trench',
      'vlr-03-sage-knit',
      'vlr-10-puffer-cape',
    ],
  },
  {
    id: 'raw-mineral',
    chapter: '02',
    title: 'Raw Mineral',
    season: 'Capsule Study II',
    manifesto:
      'Unbleached cashmere, sand-washed mulberry silk, and bone-toned tailoring stripped of ornamental excess. Textiles left near their natural pigment state.',
    image: CAMPAIGN_MEDIA.atelierSpread,
    productIds: [
      'vlr-02-bone-blazer',
      'vlr-05-cropped-jacket',
      'vlr-07-cashmere-cardigan',
      'vlr-09-silk-slip-skirt',
    ],
  },
  {
    id: 'permanent-archive',
    chapter: '03',
    title: 'Permanent Archive',
    season: 'Core Objects & Tailoring',
    manifesto:
      'Seasonless foundational garments and leather objects engineered for longevity across decades. Produced in numbered studio editions.',
    image: CAMPAIGN_MEDIA.aboutPortrait,
    productIds: [
      'vlr-04-draped-dress',
      'vlr-06-pleated-trouser',
      'vlr-08-leather-tote',
      'vlr-11-poplin-shirt',
      'vlr-12-derby-boot',
    ],
  },
];
