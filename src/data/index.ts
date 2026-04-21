import { Property, Language } from "@/lib/index";
import { IMAGES } from "@/assets/images";

/**
 * 巴厘岛热门区域详细介绍数据接口
 */
export interface BaliArea {
  id: string;
  index: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  highlights: Record<Language, string[]>;
  image: string;
  coordinates: { lat: number; lng: number };
}

export const BALI_AREAS: BaliArea[] = [
  {
    id: "canggu",
    index: "01",
    name: { zh: "仓古", en: "Canggu" },
    description: {
      zh: "作为巴厘岛最热门的投资高地，仓古完美融合了冲浪文化、精致餐饮与现代生活方式。这里的地价增长率稳居全岛前列。",
      en: "As Bali's premier investment hotspot, Canggu seamlessly blends surf culture, fine dining, and modern lifestyle. Land appreciation leads the island."
    },
    highlights: {
      zh: ["潮流咖啡馆与俱乐部", "顶尖国际学校", "绝美黑沙滩", "高租金收益率"],
      en: ["Trendy Cafes & Clubs", "International Schools", "Black Sand Beaches", "High Rental Yields"]
    },
    image: IMAGES.CANGGU_AREA_4, // 更好看的仓古海滩冲浪风景
    coordinates: { lat: -8.6478, lng: 115.1385 }
  },
  {
    id: "uluwatu",
    index: "02",
    name: { zh: "乌鲁瓦图", en: "Uluwatu" },
    description: {
      zh: "位于布科半岛的最南端，以宏伟的断崖海景和世界级浪点闻名。这里是顶级奢华酒店与私人悬崖庄园的聚集地。",
      en: "Located at the southern tip of the Bukit Peninsula, famous for magnificent cliff-top ocean views and world-class surf breaks."
    },
    highlights: {
      zh: ["180度断崖海景", "顶级海滩俱乐部", "冲浪者天堂", "极高私密性"],
      en: ["180° Cliff Views", "Elite Beach Clubs", "Surfer's Paradise", "Extreme Privacy"]
    },
    image: IMAGES.ULUWATU_AREA_10, // 乌鲁瓦图悬崖海景
    coordinates: { lat: -8.8449, lng: 115.0849 }
  },
  {
    id: "ubud",
    index: "03",
    name: { zh: "乌布", en: "Ubud" },
    description: {
      zh: "巴厘岛的艺术与灵魂之都。被茂密的丛林与层叠的梯田环绕，是追求身心疗愈、灵感创作与静谧生活的首选之地。",
      en: "The artistic and spiritual heart of Bali. Surrounded by lush jungles and terraced rice fields, ideal for wellness."
    },
    highlights: {
      zh: ["艺术与文化中心", "丛林与梯田景观", "瑜伽与疗愈圣地", "传统建筑美学"],
      en: ["Arts & Culture Hub", "Jungle & Rice Terraces", "Yoga & Wellness", "Traditional Aesthetics"]
    },
    image: IMAGES.UBUD_AREA_5, // 乌布神庙与丛林景观
    coordinates: { lat: -8.5069, lng: 115.2625 }
  },
  {
    id: "pererenan",
    index: "04",
    name: { zh: "佩雷雷南", en: "Pererenan" },
    description: {
      zh: "紧邻仓古却保留了更多的原始稻田景观与宁静氛围。这里是注重生活品质、追求低调奢华的高端买家新宠。",
      en: "Neighboring Canggu but preserving more original rice field landscapes. A new favorite for low-key luxury."
    },
    highlights: {
      zh: ["静谧稻田景观", "高端精品别墅区", "高素质社区氛围", "稳健升值空间"],
      en: ["Quiet Rice Fields", "Boutique Villa Enclaves", "Premium Community", "Steady Appreciation"]
    },
    image: IMAGES.PERERENAN_AREA_10, // 佩雷雷南金色稻田景观
    coordinates: { lat: -8.6416, lng: 115.1235 }
  },
  {
    id: "seminyak",
    index: "05",
    name: { zh: "水明漾", en: "Seminyak" },
    description: {
      zh: "巴厘岛最成熟的高端生活区。这里汇集了顶级的精品店、高端餐厅和五星级酒店，是都会极简主义者的理想居住地。",
      en: "Bali's most established high-end area. Home to designer boutiques and five-star hotels."
    },
    highlights: {
      zh: ["高端购物体验", "世界级餐饮", "繁华便捷生活", "成熟租赁市场"],
      en: ["Luxury Shopping", "World-class Dining", "Urban Convenience", "Mature Rental Market"]
    },
    image: IMAGES.SEMINYAK_AREA_8, // 水明漾现代酒店海景
    coordinates: { lat: -8.6913, lng: 115.1682 }
  },
  {
    id: "jimbaran",
    index: "06",
    name: { zh: "金巴兰", en: "Jimbaran" },
    description: {
      zh: "以‘全球最美日落’著称的月牙形海湾。这里环境优美，配套齐全，是追求平衡生活与长期持有资产的明智之选。",
      en: "Known for one of the world's best sunsets, offering a balanced lifestyle for long-term holding."
    },
    highlights: {
      zh: ["日落海滩餐厅", "五星级酒店集群", "近机场交通便利", "宜居的海湾环境"],
      en: ["Sunset Seafood Dining", "Five-star Resort Cluster", "Airport Proximity", "Serene Bay"]
    },
    image: IMAGES.BALI_SUNSET_BAY_4, // 金巴兰日落海滩
    coordinates: { lat: -8.7849, lng: 115.1527 }
  },
  {
    id: "sanur",
    index: "07",
    name: { zh: "沙努尔", en: "Sanur" },
    description: {
      zh: "巴厘岛东海岸的经典度假胜地，以宁静的海滩、悠久的历史和成熟的配套著称。是家庭居住和长期投资的稳健选择。",
      en: "Classic East Coast destination known for its peaceful beaches, history, and established infrastructure."
    },
    highlights: {
      zh: ["平静的海滨步道", "成熟医疗教育配套", "传统与现代交汇", "稳健资产升值"],
      en: ["Calm Beach Boardwalk", "Premium Infrastructure", "Tradition Meets Modernity", "Steady Growth"]
    },
    image: IMAGES.SANUR_AREA_8, // 沙努尔宁静海滩
    coordinates: { lat: -8.6807, lng: 115.2633 }
  }
];

export const FEATURED_PROPERTIES: Property[] = [
  {
    id: "prop-001",
    title: { zh: "玄武岩之境", en: "The Basalt Sanctuary" },
    price: 1280000,
    location: { zh: "回声海滩", en: "Echo Beach" },
    type: { zh: "豪华别墅", en: "Luxury Villa" },
    bedrooms: 4,
    bathrooms: 4,
    landArea: 600,
    buildingArea: 420,
    image: IMAGES.LUXURY_VILLA_12,
    images: [IMAGES.LUXURY_VILLA_12, IMAGES.LUXURY_VILLA_1, IMAGES.LUXURY_VILLA_2, IMAGES.LUXURY_VILLA_3],
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 25,
    landZone: null,
    description: {
      zh: "这座位于仓古核心区域的静奢杰作，完美融合了都会极简主义与巴厘岛的热带美学。开放式生活空间与无边界泳池无缝衔接。",
      en: "A quiet luxury masterpiece in the heart of Canggu, blending urban minimalism with tropical aesthetics."
    },
    featured: true,
    tags: ['靠海滩500米', '自然风景房'],
    coordinates: { lat: -8.6478, lng: 115.1385 }
  },
  {
    id: "prop-002",
    title: { zh: "蔚蓝地平线", en: "Horizon Azure" },
    price: 3500000,
    location: { zh: "宾金", en: "Bingin" },
    type: { zh: "海滨别墅", en: "Beachfront Villa" },
    bedrooms: 5,
    bathrooms: 6,
    landArea: 1200,
    buildingArea: 850,
    image: IMAGES.POOL_VILLA_14,
    images: [IMAGES.POOL_VILLA_14, IMAGES.POOL_VILLA_1, IMAGES.POOL_VILLA_2, IMAGES.POOL_VILLA_3],
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "坐落于乌鲁瓦图壮丽的断崖之上，拥有270度无死角海景。建筑采用大量石灰石与天然原木，营造出一种宁静而充满力量感的居住氛围。",
      en: "Perched on the magnificent cliffs of Uluwatu with 270-degree unobstructed ocean views."
    },
    featured: true,
    tags: ['海景房', '私人沙滩'],
    coordinates: { lat: -8.8449, lng: 115.0849 }
  },
  {
    id: "prop-003",
    title: { zh: "林间静邸", en: "Forest Zen Retreat" },
    price: 850000,
    location: { zh: "乌布中心", en: "Ubud Center" },
    type: { zh: "生态别墅", en: "Eco Villa" },
    bedrooms: 3,
    bathrooms: 3,
    landArea: 450,
    buildingArea: 310,
    image: IMAGES.LUXURY_VILLA_13,
    images: [IMAGES.LUXURY_VILLA_13, IMAGES.LUXURY_VILLA_7, IMAGES.LUXURY_VILLA_8, IMAGES.BALI_LANDSCAPE_1],
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "被乌布翠绿的梯田与雨林包围，这里是远离尘嚣的避风港。室内设计强调'少即是多'，每一处细节都经过精心雕琢。",
      en: "Surrounded by Ubud's lush terraces and rainforest, this sanctuary offers a 'less is more' design."
    },
    featured: true,
    tags: ['自然风景房', '稻田景观', '温泉度假村'],
    coordinates: { lat: -8.5069, lng: 115.2625 }
  },
  {
    id: "prop-004",
    title: { zh: "佩雷雷南极简雅舍", en: "Minimalist Pererenan" },
    price: 1100000,
    location: { zh: "佩雷雷南", en: "Pererenan" },
    type: { zh: "豪华别墅", en: "Luxury Villa" },
    bedrooms: 3,
    bathrooms: 3.5,
    landArea: 520,
    buildingArea: 380,
    image: IMAGES.POOL_VILLA_15,
    images: [IMAGES.POOL_VILLA_15, IMAGES.POOL_VILLA_16, IMAGES.LUXURY_VILLA_5, IMAGES.LUXURY_VILLA_6],
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "位于新兴的高端社区，这座别墅以纯净的白色线条与温暖的木质色调为基调。其独特的挑高设计与自然采光极佳。",
      en: "Located in an emerging high-end community, this villa features pure white lines and warm wood tones."
    },
    featured: true,
    tags: ['靠海滩500米', '自然风景房'],
    coordinates: { lat: -8.6416, lng: 115.1235 }
  },
  {
    id: "prop-005",
    title: { zh: "都会绿洲", en: "Urban Oasis Villa" },
    price: 1550000,
    location: { zh: "塞米亚克", en: "Seminyak" },
    type: { zh: "豪华别墅", en: "Luxury Villa" },
    bedrooms: 4,
    bathrooms: 4,
    landArea: 650,
    buildingArea: 460,
    image: IMAGES.LUXURY_VILLA_16,
    images: [IMAGES.LUXURY_VILLA_16, IMAGES.LUXURY_VILLA_9, IMAGES.LUXURY_VILLA_10, IMAGES.POOL_VILLA_5],
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "在繁华的塞米亚克中心，开辟出一片宁静的绿洲。建筑风格现代干练，配备顶级品牌的智能家居系统。",
      en: "A peaceful oasis in the bustling center of Seminyak. Modern architectural style with top-tier tech."
    },
    featured: false,
    tags: ['市中心', '高尔夫球场'],
    coordinates: { lat: -8.6913, lng: 115.1682 }
  },
  {
    id: "prop-006",
    title: { zh: "日落海岸庄园", en: "Sunset Coast Estate" },
    price: 2200000,
    location: { zh: "金巴兰", en: "Jimbaran" },
    type: { zh: "海滨物业", en: "Beachfront Property" },
    bedrooms: 6,
    bathrooms: 7,
    landArea: 1800,
    buildingArea: 1200,
    image: IMAGES.POOL_VILLA_17,
    images: [IMAGES.POOL_VILLA_17, IMAGES.POOL_VILLA_18, IMAGES.POOL_VILLA_19, IMAGES.LUXURY_VILLA_11],
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "占地极广的海滨庄园，直通金巴兰细腻的沙滩。庄园内部包含私人影院、健身房及专业的酒窖。",
      en: "An expansive beachfront estate with direct access to Jimbaran beach, including private gym and cinema."
    },
    featured: false,
    tags: ['海景房', '私人沙滩'],
    coordinates: { lat: -8.7849, lng: 115.1527 }
  },
  {
    id: "prop-007",
    title: { zh: "翡翠谷庄园", en: "Emerald Valley Estate" },
    price: 980000,
    location: { zh: "乌布", en: "Ubud" },
    type: { zh: "山景别墅", en: "Mountain Villa" },
    bedrooms: 3,
    bathrooms: 3,
    landArea: 800,
    buildingArea: 350,
    image: IMAGES.LUXURY_VILLA_1,
    images: [IMAGES.LUXURY_VILLA_1, IMAGES.BALI_LANDSCAPE_2, IMAGES.BALI_LANDSCAPE_3, IMAGES.LUXURY_VILLA_4],
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "隐匿在乌布热带雨林中的精品别墅，享有壮丽的梯田景观。传统巴厘岛建筑与现代舒适完美结合。",
      en: "A boutique villa hidden in Ubud's rainforest with stunning rice terrace views."
    },
    featured: false,
    tags: ['山景房', '自然风景房'],
    coordinates: { lat: -8.5069, lng: 115.2624 }
  },
  {
    id: "prop-008",
    title: { zh: "海神之居", en: "Neptune's Residence" },
    price: 4200000,
    location: { zh: "乌鲁瓦图", en: "Uluwatu" },
    type: { zh: "悬崖别墅", en: "Cliff Villa" },
    bedrooms: 5,
    bathrooms: 6,
    landArea: 1200,
    buildingArea: 800,
    image: IMAGES.LUXURY_VILLA_2,
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "坐落在乌鲁瓦图悬崖边的奢华别墅，180度无敌海景。私人电梯直达海滩，配备无边际泳池。",
      en: "Luxury cliff-edge villa in Uluwatu with 180-degree ocean views and private beach access."
    },
    featured: true,
    tags: ['海景房', '私人沙滩'],
    coordinates: { lat: -8.8449, lng: 115.0849 }
  },
  {
    id: "prop-009",
    title: { zh: "竹林禅院", en: "Bamboo Zen Retreat" },
    price: 750000,
    location: { zh: "乌布", en: "Ubud" },
    type: { zh: "生态别墅", en: "Eco Villa" },
    bedrooms: 2,
    bathrooms: 2,
    landArea: 500,
    buildingArea: 280,
    image: IMAGES.LUXURY_VILLA_3,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "采用可持续建筑材料打造的生态别墅，竹制结构与热带花园融为一体。瑜伽平台俯瞰稻田。",
      en: "Sustainable eco-villa built with bamboo, featuring a yoga platform overlooking rice fields."
    },
    featured: false,
    tags: ['生态建筑', '瑜伽空间'],
    coordinates: { lat: -8.5169, lng: 115.2724 }
  },
  {
    id: "prop-010",
    title: { zh: "冲浪者天堂", en: "Surfer's Paradise Villa" },
    price: 1650000,
    location: { zh: "仓古", en: "Canggu" },
    type: { zh: "海滨别墅", en: "Beach Villa" },
    bedrooms: 4,
    bathrooms: 4,
    landArea: 700,
    buildingArea: 450,
    image: IMAGES.LUXURY_VILLA_4,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "距离著名冲浪点仅50米的现代别墅，开放式设计最大化海风流通。配备冲浪板储存室。",
      en: "Modern villa just 50m from famous surf breaks, with open design and surfboard storage."
    },
    featured: false,
    tags: ['靠海滩500米', '冲浪'],
    coordinates: { lat: -8.6578, lng: 115.1285 }
  },
  {
    id: "prop-011",
    title: { zh: "皇家花园别墅", en: "Royal Garden Villa" },
    price: 2800000,
    location: { zh: "水明漾", en: "Seminyak" },
    type: { zh: "豪华别墅", en: "Luxury Villa" },
    bedrooms: 5,
    bathrooms: 5,
    landArea: 1000,
    buildingArea: 650,
    image: IMAGES.LUXURY_VILLA_5,
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "水明漾核心地段的奢华别墅，私人花园占地广阔。室内装饰融合欧式古典与巴厘岛传统元素。",
      en: "Luxury villa in prime Seminyak location with expansive private gardens and classical design."
    },
    featured: true,
    tags: ['市中心', '私人花园'],
    coordinates: { lat: -8.6813, lng: 115.1582 }
  },
  {
    id: "prop-012",
    title: { zh: "月光海湾", en: "Moonlight Bay Villa" },
    price: 1950000,
    location: { zh: "沙努尔", en: "Sanur" },
    type: { zh: "海滨物业", en: "Beachfront Property" },
    bedrooms: 4,
    bathrooms: 4,
    landArea: 800,
    buildingArea: 500,
    image: IMAGES.LUXURY_VILLA_6,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "沙努尔宁静海湾的精品别墅，私人码头可停泊游艇。传统巴厘岛建筑风格，配备现代化设施。",
      en: "Boutique villa in peaceful Sanur bay with private jetty for yacht mooring."
    },
    featured: false,
    tags: ['海景房', '私人码头'],
    coordinates: { lat: -8.6707, lng: 115.2733 }
  },
  {
    id: "prop-013",
    title: { zh: "天空之城", en: "Sky Castle Villa" },
    price: 3200000,
    location: { zh: "乌鲁瓦图", en: "Uluwatu" },
    type: { zh: "悬崖别墅", en: "Cliff Villa" },
    bedrooms: 6,
    bathrooms: 7,
    landArea: 1500,
    buildingArea: 900,
    image: IMAGES.LUXURY_VILLA_7,
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "建在悬崖最高点的壮观别墅，360度全景视野。配备直升机停机坪和私人spa中心。",
      en: "Spectacular villa built on the highest cliff point with 360-degree views and helipad."
    },
    featured: true,
    tags: ['海景房', '直升机停机坪'],
    coordinates: { lat: -8.8349, lng: 115.0949 }
  },
  {
    id: "prop-014",
    title: { zh: "热带雨林隐居", en: "Rainforest Hideaway" },
    price: 850000,
    location: { zh: "乌布", en: "Ubud" },
    type: { zh: "丛林别墅", en: "Jungle Villa" },
    bedrooms: 3,
    bathrooms: 3,
    landArea: 600,
    buildingArea: 320,
    image: IMAGES.LUXURY_VILLA_8,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "完全融入热带雨林的隐秘别墅，树屋式设计让您与自然零距离接触。私人瀑布和天然泳池。",
      en: "Secret villa fully integrated into rainforest with treehouse design and natural pool."
    },
    featured: false,
    tags: ['自然风景房', '私人瀑布'],
    coordinates: { lat: -8.5269, lng: 115.2824 }
  },
  {
    id: "prop-015",
    title: { zh: "黑沙海岸", en: "Black Sand Coast Villa" },
    price: 1750000,
    location: { zh: "仓古", en: "Canggu" },
    type: { zh: "海滨别墅", en: "Beach Villa" },
    bedrooms: 4,
    bathrooms: 5,
    landArea: 750,
    buildingArea: 480,
    image: IMAGES.LUXURY_VILLA_9,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "面向仓古著名黑沙海滩的现代别墅，极简主义设计突出自然美景。无边际泳池与海平线融为一体。",
      en: "Modern villa facing Canggu's famous black sand beach with infinity pool merging with horizon."
    },
    featured: false,
    tags: ['靠海滩500米', '无边际泳池'],
    coordinates: { lat: -8.6478, lng: 115.1185 }
  },
  {
    id: "prop-016",
    title: { zh: "珊瑚礁庄园", en: "Coral Reef Estate" },
    price: 5200000,
    location: { zh: "努沙杜瓦", en: "Nusa Dua" },
    type: { zh: "度假村式别墅", en: "Resort Villa" },
    bedrooms: 8,
    bathrooms: 10,
    landArea: 2500,
    buildingArea: 1500,
    image: IMAGES.LUXURY_VILLA_10,
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "努沙杜瓦顶级度假区的超豪华庄园，私人海滩长达200米。配备专业厨师团队和管家服务。",
      en: "Ultra-luxury estate in premium Nusa Dua with 200m private beach and full staff service."
    },
    featured: true,
    tags: ['私人沙滩', '管家服务'],
    coordinates: { lat: -8.8049, lng: 115.2327 }
  },
  {
    id: "prop-017",
    title: { zh: "艺术家工作室", en: "Artist's Studio Villa" },
    price: 920000,
    location: { zh: "乌布", en: "Ubud" },
    type: { zh: "艺术别墅", en: "Art Villa" },
    bedrooms: 2,
    bathrooms: 2,
    landArea: 400,
    buildingArea: 250,
    image: IMAGES.LUXURY_VILLA_11,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "专为艺术家设计的创意空间，超高天花板和大面积玻璃窗提供充足自然光。配备专业画室。",
      en: "Creative space designed for artists with high ceilings and professional studio facilities."
    },
    featured: false,
    tags: ['艺术工作室', '高天花板'],
    coordinates: { lat: -8.5069, lng: 115.2524 }
  },
  {
    id: "prop-018",
    title: { zh: "棕榈湾度假村", en: "Palm Bay Resort Villa" },
    price: 2650000,
    location: { zh: "金巴兰", en: "Jimbaran" },
    type: { zh: "度假别墅", en: "Resort Villa" },
    bedrooms: 5,
    bathrooms: 6,
    landArea: 1200,
    buildingArea: 750,
    image: IMAGES.LUXURY_VILLA_12,
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "金巴兰湾畔的奢华度假别墅，私人沙滩俱乐部和水上运动中心。每晚可欣赏壮丽日落。",
      en: "Luxury resort villa on Jimbaran Bay with private beach club and water sports center."
    },
    featured: false,
    tags: ['海景房', '水上运动'],
    coordinates: { lat: -8.7749, lng: 115.1627 }
  },
  {
    id: "prop-019",
    title: { zh: "禅意花园", en: "Zen Garden Villa" },
    price: 1180000,
    location: { zh: "塞米亚克", en: "Seminyak" },
    type: { zh: "禅意别墅", en: "Zen Villa" },
    bedrooms: 3,
    bathrooms: 3,
    landArea: 550,
    buildingArea: 380,
    image: IMAGES.LUXURY_VILLA_13,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "日式禅意设计的宁静别墅，枯山水花园和茶室营造冥想氛围。隐藏在塞米亚克繁华中的静谧空间。",
      en: "Peaceful villa with Japanese zen design, featuring rock garden and meditation tea room."
    },
    featured: false,
    tags: ['禅意花园', '茶室'],
    coordinates: { lat: -8.6913, lng: 115.1482 }
  },
  {
    id: "prop-020",
    title: { zh: "海盗湾传奇", en: "Pirate Bay Legend" },
    price: 3800000,
    location: { zh: "乌鲁瓦图", en: "Uluwatu" },
    type: { zh: "历史别墅", en: "Heritage Villa" },
    bedrooms: 6,
    bathrooms: 8,
    landArea: 1800,
    buildingArea: 1100,
    image: IMAGES.LUXURY_VILLA_14,
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "传说中海盗藏宝地改建的奢华别墅，保留古老石墙和神秘洞穴。私人博物馆展示海洋文物。",
      en: "Luxury villa built on legendary pirate treasure site with ancient stone walls and museum."
    },
    featured: true,
    tags: ['历史建筑', '私人博物馆'],
    coordinates: { lat: -8.8549, lng: 115.0749 }
  },
  {
    id: "prop-021",
    title: { zh: "翠鸟湖畔", en: "Kingfisher Lakeside" },
    price: 1350000,
    location: { zh: "乌布", en: "Ubud" },
    type: { zh: "湖景别墅", en: "Lake Villa" },
    bedrooms: 4,
    bathrooms: 4,
    landArea: 900,
    buildingArea: 420,
    image: IMAGES.LUXURY_VILLA_15,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "坐落在天然湖泊边的宁静别墅，观鸟平台可观赏珍稀翠鸟。有机菜园供应新鲜蔬果。",
      en: "Peaceful villa by natural lake with bird-watching platform and organic vegetable garden."
    },
    featured: false,
    tags: ['湖景房', '有机菜园'],
    coordinates: { lat: -8.5169, lng: 115.2924 }
  },
  {
    id: "prop-022",
    title: { zh: "冲浪冠军之家", en: "Surf Champion's Home" },
    price: 2100000,
    location: { zh: "仓古", en: "Canggu" },
    type: { zh: "运动别墅", en: "Sports Villa" },
    bedrooms: 5,
    bathrooms: 5,
    landArea: 800,
    buildingArea: 550,
    image: IMAGES.LUXURY_VILLA_16,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "世界冲浪冠军的私人住宅，配备专业训练设施和冲浪板收藏室。私人教练可提供指导。",
      en: "World surf champion's private residence with professional training facilities and coaching."
    },
    featured: false,
    tags: ['冲浪', '专业训练'],
    coordinates: { lat: -8.6378, lng: 115.1385 }
  },
  {
    id: "prop-023",
    title: { zh: "蝴蝶谷秘境", en: "Butterfly Valley Secret" },
    price: 780000,
    location: { zh: "乌布", en: "Ubud" },
    type: { zh: "生态别墅", en: "Eco Villa" },
    bedrooms: 2,
    bathrooms: 2,
    landArea: 450,
    buildingArea: 200,
    image: IMAGES.POOL_VILLA_17,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "隐藏在蝴蝶保护区内的生态别墅，全年可观赏数百种热带蝴蝶。太阳能供电，雨水收集系统。",
      en: "Eco villa hidden in butterfly sanctuary with solar power and rainwater collection system."
    },
    featured: false,
    tags: ['生态建筑', '蝴蝶保护区'],
    coordinates: { lat: -8.5369, lng: 115.2624 }
  },
  {
    id: "prop-024",
    title: { zh: "星空观测台", en: "Stargazing Observatory Villa" },
    price: 1680000,
    location: { zh: "金巴兰", en: "Jimbaran" },
    type: { zh: "观景别墅", en: "Observatory Villa" },
    bedrooms: 4,
    bathrooms: 4,
    landArea: 700,
    buildingArea: 450,
    image: IMAGES.LUXURY_VILLA_1,
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "配备专业天文望远镜的别墅，屋顶观测台可360度观星。天文学家定期举办观星活动。",
      en: "Villa with professional telescope and 360-degree rooftop observatory for stargazing."
    },
    featured: false,
    tags: ['观星台', '天文望远镜'],
    coordinates: { lat: -8.7949, lng: 115.1427 }
  },
  {
    id: "prop-025",
    title: { zh: "海豚湾庄园", en: "Dolphin Bay Estate" },
    price: 4500000,
    location: { zh: "罗威纳", en: "Lovina" },
    type: { zh: "海滨庄园", en: "Beachfront Estate" },
    bedrooms: 7,
    bathrooms: 9,
    landArea: 2000,
    buildingArea: 1300,
    image: IMAGES.LUXURY_VILLA_2,
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "罗威纳海豚观赏区的超豪华庄园，每日清晨可在私人海滩观赏野生海豚。配备游艇码头。",
      en: "Ultra-luxury estate in Lovina dolphin area with daily wild dolphin viewing and yacht marina."
    },
    featured: true,
    tags: ['海豚观赏', '游艇码头'],
    coordinates: { lat: -8.1569, lng: 115.0324 }
  },
  {
    id: "prop-026",
    title: { zh: "香料花园别墅", en: "Spice Garden Villa" },
    price: 950000,
    location: { zh: "乌布", en: "Ubud" },
    type: { zh: "香料别墅", en: "Spice Villa" },
    bedrooms: 3,
    bathrooms: 3,
    landArea: 600,
    buildingArea: 300,
    image: IMAGES.LUXURY_VILLA_3,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "种植各种热带香料的主题别墅，私人厨师教授传统巴厘岛烹饪。香料花园供应餐厅食材。",
      en: "Themed villa with tropical spice garden and private chef teaching traditional Balinese cooking."
    },
    featured: false,
    tags: ['香料花园', '烹饪课程'],
    coordinates: { lat: -8.5069, lng: 115.2724 }
  },
  {
    id: "prop-027",
    title: { zh: "火山景观台", en: "Volcano View Terrace" },
    price: 1450000,
    location: { zh: "金塔马尼", en: "Kintamani" },
    type: { zh: "山景别墅", en: "Mountain Villa" },
    bedrooms: 4,
    bathrooms: 4,
    landArea: 1000,
    buildingArea: 400,
    image: IMAGES.LUXURY_VILLA_4,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "面向巴图尔火山和湖泊的壮观别墅，温泉私人浴池和火山岩桑拿房。清晨可观赏日出奇景。",
      en: "Spectacular villa facing Mount Batur with hot spring pools and volcanic rock sauna."
    },
    featured: false,
    tags: ['火山景观', '温泉浴池'],
    coordinates: { lat: -8.2569, lng: 115.3724 }
  },
  {
    id: "prop-028",
    title: { zh: "珍珠潜水基地", en: "Pearl Diving Base" },
    price: 2350000,
    location: { zh: "阿梅德", en: "Amed" },
    type: { zh: "潜水别墅", en: "Diving Villa" },
    bedrooms: 5,
    bathrooms: 5,
    landArea: 800,
    buildingArea: 500,
    image: IMAGES.LUXURY_VILLA_5,
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "专业潜水基地改建的豪华别墅，私人珊瑚礁保护区和潜水装备室。PADI认证教练常驻。",
      en: "Luxury villa converted from diving base with private coral reef sanctuary and PADI instructors."
    },
    featured: false,
    tags: ['潜水基地', '珊瑚礁'],
    coordinates: { lat: -8.3469, lng: 115.6724 }
  },
  {
    id: "prop-029",
    title: { zh: "咖啡庄园别墅", en: "Coffee Plantation Villa" },
    price: 1120000,
    location: { zh: "乌布", en: "Ubud" },
    type: { zh: "庄园别墅", en: "Plantation Villa" },
    bedrooms: 3,
    bathrooms: 3,
    landArea: 1500,
    buildingArea: 350,
    image: IMAGES.LUXURY_VILLA_6,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "拥有私人咖啡种植园的别墅，从种植到烘焙的完整体验。咖啡师工作室和品鉴室。",
      en: "Villa with private coffee plantation offering complete bean-to-cup experience and tasting room."
    },
    featured: false,
    tags: ['咖啡庄园', '品鉴室'],
    coordinates: { lat: -8.5269, lng: 115.2424 }
  },
  {
    id: "prop-030",
    title: { zh: "翡翠海湾", en: "Emerald Bay Villa" },
    price: 3100000,
    location: { zh: "塞米亚克", en: "Seminyak" },
    type: { zh: "海湾别墅", en: "Bay Villa" },
    bedrooms: 6,
    bathrooms: 7,
    landArea: 1200,
    buildingArea: 800,
    image: IMAGES.LUXURY_VILLA_7,
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "塞米亚克最美海湾的奢华别墅，私人海滩俱乐部和米其林星级餐厅。24小时礼宾服务。",
      en: "Luxury villa on Seminyak's most beautiful bay with private beach club and Michelin dining."
    },
    featured: true,
    tags: ['海湾景观', '米其林餐厅'],
    coordinates: { lat: -8.6713, lng: 115.1382 }
  },
  {
    id: "prop-031",
    title: { zh: "猴子森林边缘", en: "Monkey Forest Edge" },
    price: 680000,
    location: { zh: "乌布", en: "Ubud" },
    type: { zh: "森林别墅", en: "Forest Villa" },
    bedrooms: 2,
    bathrooms: 2,
    landArea: 400,
    buildingArea: 220,
    image: IMAGES.LUXURY_VILLA_8,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "紧邻神圣猴子森林的隐秘别墅，可观察野生长尾猕猴的自然行为。树屋式卧室设计。",
      en: "Secret villa adjacent to Sacred Monkey Forest with treehouse bedrooms for wildlife observation."
    },
    featured: false,
    tags: ['野生动物', '树屋设计'],
    coordinates: { lat: -8.5169, lng: 115.2624 }
  },
  {
    id: "prop-032",
    title: { zh: "白沙天堂", en: "White Sand Paradise" },
    price: 2750000,
    location: { zh: "努沙杜瓦", en: "Nusa Dua" },
    type: { zh: "海滨别墅", en: "Beach Villa" },
    bedrooms: 5,
    bathrooms: 6,
    landArea: 1000,
    buildingArea: 650,
    image: IMAGES.LUXURY_VILLA_9,
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "努沙杜瓦白沙海滩的奢华别墅，私人海滩长达100米。水上运动中心和专业按摩师服务。",
      en: "Luxury villa on Nusa Dua white sand beach with 100m private beachfront and spa services."
    },
    featured: false,
    tags: ['白沙海滩', 'spa服务'],
    coordinates: { lat: -8.8149, lng: 115.2227 }
  },
  {
    id: "prop-033",
    title: { zh: "艺术收藏馆", en: "Art Collection Gallery" },
    price: 1850000,
    location: { zh: "乌布", en: "Ubud" },
    type: { zh: "艺术别墅", en: "Art Villa" },
    bedrooms: 4,
    bathrooms: 4,
    landArea: 700,
    buildingArea: 500,
    image: IMAGES.LUXURY_VILLA_10,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "展示当代巴厘岛艺术品的别墅画廊，定期举办艺术沙龙。艺术家工作室可供创作。",
      en: "Villa gallery showcasing contemporary Balinese art with regular salons and artist studios."
    },
    featured: false,
    tags: ['艺术画廊', '艺术沙龙'],
    coordinates: { lat: -8.5069, lng: 115.2824 }
  },
  {
    id: "prop-034",
    title: { zh: "冲浪学院总部", en: "Surf Academy HQ" },
    price: 1950000,
    location: { zh: "仓古", en: "Canggu" },
    type: { zh: "教学别墅", en: "Academy Villa" },
    bedrooms: 6,
    bathrooms: 6,
    landArea: 900,
    buildingArea: 600,
    image: IMAGES.LUXURY_VILLA_11,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "国际冲浪学院总部，配备专业训练设施和学员宿舍。世界级教练团队和比赛训练场地。",
      en: "International surf academy headquarters with professional training facilities and world-class coaches."
    },
    featured: false,
    tags: ['冲浪学院', '专业训练'],
    coordinates: { lat: -8.6478, lng: 115.1285 }
  },
  {
    id: "prop-035",
    title: { zh: "瑜伽静修中心", en: "Yoga Retreat Center" },
    price: 1250000,
    location: { zh: "乌布", en: "Ubud" },
    type: { zh: "静修别墅", en: "Retreat Villa" },
    bedrooms: 4,
    bathrooms: 4,
    landArea: 800,
    buildingArea: 400,
    image: IMAGES.LUXURY_VILLA_12,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "专业瑜伽静修中心，多个瑜伽练习厅和冥想花园。国际瑜伽大师定期授课。",
      en: "Professional yoga retreat center with multiple practice halls and meditation gardens."
    },
    featured: false,
    tags: ['瑜伽中心', '冥想花园'],
    coordinates: { lat: -8.5169, lng: 115.2724 }
  },
  {
    id: "prop-036",
    title: { zh: "海龟保护站", en: "Turtle Conservation Villa" },
    price: 1680000,
    location: { zh: "沙努尔", en: "Sanur" },
    type: { zh: "保护别墅", en: "Conservation Villa" },
    bedrooms: 4,
    bathrooms: 4,
    landArea: 600,
    buildingArea: 400,
    image: IMAGES.LUXURY_VILLA_13,
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "参与海龟保护项目的生态别墅，可观察海龟筑巢和孵化过程。海洋生物研究中心。",
      en: "Eco villa participating in turtle conservation with nesting observation and marine research center."
    },
    featured: false,
    tags: ['海龟保护', '生态研究'],
    coordinates: { lat: -8.6807, lng: 115.2633 }
  },
  {
    id: "prop-037",
    title: { zh: "热带植物园", en: "Tropical Botanical Villa" },
    price: 1150000,
    location: { zh: "乌布", en: "Ubud" },
    type: { zh: "植物园别墅", en: "Botanical Villa" },
    bedrooms: 3,
    bathrooms: 3,
    landArea: 1200,
    buildingArea: 350,
    image: IMAGES.LUXURY_VILLA_14,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "拥有500多种热带植物的私人植物园别墅，植物学家导览和草药治疗课程。",
      en: "Private botanical villa with 500+ tropical species, botanist tours and herbal healing courses."
    },
    featured: false,
    tags: ['植物园', '草药治疗'],
    coordinates: { lat: -8.5269, lng: 115.2924 }
  },
  {
    id: "prop-038",
    title: { zh: "风筝冲浪基地", en: "Kitesurfing Base Villa" },
    price: 1750000,
    location: { zh: "沙努尔", en: "Sanur" },
    type: { zh: "运动别墅", en: "Sports Villa" },
    bedrooms: 4,
    bathrooms: 4,
    landArea: 700,
    buildingArea: 450,
    image: IMAGES.LUXURY_VILLA_15,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "专业风筝冲浪基地，配备装备租赁和教学设施。沙努尔海湾的完美风况适合各级别练习。",
      en: "Professional kitesurfing base with equipment rental and instruction in perfect Sanur bay conditions."
    },
    featured: false,
    tags: ['风筝冲浪', '装备租赁'],
    coordinates: { lat: -8.6707, lng: 115.2733 }
  },
  {
    id: "prop-039",
    title: { zh: "摄影师工作室", en: "Photographer's Studio Villa" },
    price: 1380000,
    location: { zh: "塞米亚克", en: "Seminyak" },
    type: { zh: "工作室别墅", en: "Studio Villa" },
    bedrooms: 3,
    bathrooms: 3,
    landArea: 500,
    buildingArea: 400,
    image: IMAGES.LUXURY_VILLA_16,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "专业摄影师工作室别墅，配备专业灯光设备和多个拍摄场景。暗房和后期制作室。",
      en: "Professional photographer's studio villa with lighting equipment and multiple shooting sets."
    },
    featured: false,
    tags: ['摄影工作室', '专业设备'],
    coordinates: { lat: -8.6913, lng: 115.1582 }
  },
  {
    id: "prop-040",
    title: { zh: "音乐制作中心", en: "Music Production Center" },
    price: 1650000,
    location: { zh: "仓古", en: "Canggu" },
    type: { zh: "音乐别墅", en: "Music Villa" },
    bedrooms: 4,
    bathrooms: 4,
    landArea: 600,
    buildingArea: 500,
    image: IMAGES.POOL_VILLA_17,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "专业音乐制作中心，隔音录音室和混音设备。国际音乐人经常在此创作和录制专辑。",
      en: "Professional music production center with soundproof studios where international artists record."
    },
    featured: false,
    tags: ['音乐制作', '录音室'],
    coordinates: { lat: -8.6578, lng: 115.1185 }
  },
  {
    id: "prop-041",
    title: { zh: "天体海滩别墅", en: "Naturist Beach Villa" },
    price: 2250000,
    location: { zh: "乌鲁瓦图", en: "Uluwatu" },
    type: { zh: "私密别墅", en: "Private Villa" },
    bedrooms: 5,
    bathrooms: 5,
    landArea: 1000,
    buildingArea: 600,
    image: IMAGES.LUXURY_VILLA_1,
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "完全私密的海滩别墅，隐蔽的天体海滩和私人日光浴区。高度隐私保护和安全系统。",
      en: "Completely private beach villa with secluded naturist beach and private sunbathing areas."
    },
    featured: false,
    tags: ['极度私密', '天体海滩'],
    coordinates: { lat: -8.8649, lng: 115.0649 }
  },
  {
    id: "prop-042",
    title: { zh: "蜜月套房别墅", en: "Honeymoon Suite Villa" },
    price: 1580000,
    location: { zh: "金巴兰", en: "Jimbaran" },
    type: { zh: "蜜月别墅", en: "Honeymoon Villa" },
    bedrooms: 2,
    bathrooms: 2,
    landArea: 400,
    buildingArea: 300,
    image: IMAGES.LUXURY_VILLA_2,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "专为蜜月设计的浪漫别墅，心形泳池和私人海滩晚餐。24小时管家服务和情侣spa。",
      en: "Romantic villa designed for honeymoons with heart-shaped pool and private beach dining."
    },
    featured: false,
    tags: ['蜜月专用', '浪漫设计'],
    coordinates: { lat: -8.7849, lng: 115.1527 }
  },
  {
    id: "prop-043",
    title: { zh: "企业家俱乐部", en: "Entrepreneur's Club Villa" },
    price: 3500000,
    location: { zh: "塞米亚克", en: "Seminyak" },
    type: { zh: "商务别墅", en: "Business Villa" },
    bedrooms: 6,
    bathrooms: 7,
    landArea: 1200,
    buildingArea: 900,
    image: IMAGES.LUXURY_VILLA_3,
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "高端企业家俱乐部总部，配备会议室、商务中心和网络活动空间。定期举办商业论坛。",
      en: "High-end entrepreneur club headquarters with meeting rooms and networking spaces for business forums."
    },
    featured: true,
    tags: ['商务中心', '网络活动'],
    coordinates: { lat: -8.6813, lng: 115.1482 }
  },
  {
    id: "prop-044",
    title: { zh: "数字游民基地", en: "Digital Nomad Base" },
    price: 950000,
    location: { zh: "仓古", en: "Canggu" },
    type: { zh: "共享别墅", en: "Co-living Villa" },
    bedrooms: 8,
    bathrooms: 8,
    landArea: 800,
    buildingArea: 600,
    image: IMAGES.LUXURY_VILLA_4,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "专为数字游民设计的共享生活空间，高速网络和共享办公区。国际社区和技能分享活动。",
      en: "Co-living space designed for digital nomads with high-speed internet and shared workspaces."
    },
    featured: false,
    tags: ['数字游民', '共享办公'],
    coordinates: { lat: -8.6478, lng: 115.1385 }
  },
  {
    id: "prop-045",
    title: { zh: "退休天堂", en: "Retirement Paradise" },
    price: 1200000,
    location: { zh: "沙努尔", en: "Sanur" },
    type: { zh: "养老别墅", en: "Retirement Villa" },
    bedrooms: 3,
    bathrooms: 3,
    landArea: 600,
    buildingArea: 350,
    image: IMAGES.LUXURY_VILLA_5,
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "专为退休生活设计的无障碍别墅，医疗设施齐全和护理服务。宁静的花园和阅读角落。",
      en: "Barrier-free villa designed for retirement with medical facilities and peaceful garden reading nooks."
    },
    featured: false,
    tags: ['无障碍设计', '医疗设施'],
    coordinates: { lat: -8.6807, lng: 115.2633 }
  },
  {
    id: "prop-046",
    title: { zh: "儿童乐园别墅", en: "Kids Paradise Villa" },
    price: 1450000,
    location: { zh: "沙努尔", en: "Sanur" },
    type: { zh: "家庭别墅", en: "Family Villa" },
    bedrooms: 5,
    bathrooms: 5,
    landArea: 1000,
    buildingArea: 500,
    image: IMAGES.LUXURY_VILLA_6,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "专为家庭设计的别墅，儿童游乐场、安全泳池和教育活动室。保姆服务和儿童看护。",
      en: "Family-designed villa with children's playground, safe pool and educational activity rooms."
    },
    featured: false,
    tags: ['儿童设施', '家庭友好'],
    coordinates: { lat: -8.6707, lng: 115.2833 }
  },
  {
    id: "prop-047",
    title: { zh: "宠物度假村", en: "Pet Resort Villa" },
    price: 1100000,
    location: { zh: "乌布", en: "Ubud" },
    type: { zh: "宠物别墅", en: "Pet Villa" },
    bedrooms: 3,
    bathrooms: 3,
    landArea: 800,
    buildingArea: 300,
    image: IMAGES.LUXURY_VILLA_7,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "宠物友好的度假别墅，专业宠物护理设施和兽医服务。宠物游乐场和训练区域。",
      en: "Pet-friendly resort villa with professional pet care facilities and veterinary services."
    },
    featured: false,
    tags: ['宠物友好', '兽医服务'],
    coordinates: { lat: -8.5169, lng: 115.2624 }
  },
  {
    id: "prop-048",
    title: { zh: "极限运动基地", en: "Extreme Sports Base" },
    price: 1850000,
    location: { zh: "乌鲁瓦图", en: "Uluwatu" },
    type: { zh: "运动基地", en: "Sports Base" },
    bedrooms: 4,
    bathrooms: 4,
    landArea: 700,
    buildingArea: 450,
    image: IMAGES.LUXURY_VILLA_8,
    status: "Available",
    ownership: "Leasehold",
    leaseholdYears: 30,
    landZone: null,
    description: {
      zh: "极限运动爱好者的天堂，悬崖跳水、攀岩和滑翔伞设施。专业教练和安全设备。",
      en: "Paradise for extreme sports enthusiasts with cliff diving, rock climbing and paragliding facilities."
    },
    featured: false,
    tags: ['极限运动', '专业教练'],
    coordinates: { lat: -8.8449, lng: 115.0849 }
  },
  {
    id: "prop-049",
    title: { zh: "美食家庄园", en: "Gourmet Estate" },
    price: 2950000,
    location: { zh: "金巴兰", en: "Jimbaran" },
    type: { zh: "美食庄园", en: "Culinary Estate" },
    bedrooms: 6,
    bathrooms: 6,
    landArea: 1500,
    buildingArea: 800,
    image: IMAGES.LUXURY_VILLA_9,
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "美食家的终极庄园，专业厨房、酒窖和私人餐厅。米其林星级厨师定期举办美食课程。",
      en: "Ultimate gourmet estate with professional kitchen, wine cellar and Michelin chef cooking classes."
    },
    featured: true,
    tags: ['美食庄园', '米其林厨师'],
    coordinates: { lat: -8.7749, lng: 115.1627 }
  },
  {
    id: "prop-050",
    title: { zh: "时光胶囊别墅", en: "Time Capsule Villa" },
    price: 5800000,
    location: { zh: "乌鲁瓦图", en: "Uluwatu" },
    type: { zh: "未来别墅", en: "Futuristic Villa" },
    bedrooms: 7,
    bathrooms: 9,
    landArea: 2000,
    buildingArea: 1200,
    image: IMAGES.LUXURY_VILLA_10,
    status: "Available",
    ownership: "Freehold",
    landZone: null,
    description: {
      zh: "融合2026年最新科技的未来主义别墅，AI管家、全息投影和可持续能源系统。智能家居的巅峰之作。",
      en: "Futuristic villa with 2026's latest technology including AI butler, holographic displays and sustainable energy."
    },
    featured: true,
    tags: ['未来科技', 'AI管家'],
    coordinates: { lat: -8.8549, lng: 115.0749 }
  }
];

export const SERVICES = [
  {
    id: "service-1",
    title: { zh: "高端房产买卖", en: "Luxury Property Sales" },
    description: {
      zh: "深耕巴厘岛高端市场，为您精选最具投资价值与居住品质的顶级别墅及海滨物业。",
      en: "Specializing in Bali's luxury market, curating premium villas and beachfront properties."
    },
    icon: "Home"
  },
  {
    id: "service-2",
    title: { zh: "法律与架构咨询", en: "Legal & Structural Consulting" },
    description: {
      zh: "专业的法律团队为您提供包括 Leasehold、Hak Pakai 及 PT PMA 在内的全方位合规投资建议。",
      en: "Professional legal team providing comprehensive compliance investment advice."
    },
    icon: "ShieldCheck"
  },
  {
    id: "service-3",
    title: { zh: "资产托管与运营", en: "Asset Management & Operations" },
    description: {
      zh: "一站式房产管理服务，确保您的物业在闲置期间获得最佳维护，并通过高端租赁实现稳定回报。",
      en: "One-stop property management services ensuring optimal maintenance and returns."
    },
    icon: "Settings"
  },
  {
    id: "service-4",
    title: { zh: "投资规划与定制", en: "Investment Planning & Customization" },
    description: {
      zh: "基于2026年市场趋势，为全球投资者量身定制从选址、设计到建设的完整开发方案。",
      en: "Tailored development solutions from site selection to construction based on 2026 trends."
    },
    icon: "BarChart3"
  }
];