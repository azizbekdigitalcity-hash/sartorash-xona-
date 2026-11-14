import haircutImg from '../assets/images/service_haircut_tools_1794639991187.jpg';
import stylingImg from '../assets/images/service_hair_styling_1794639991396.jpg';
import beardImg from '../assets/images/service_beard_grooming_1794639991663.jpg';

export type ServiceId = 'soch' | 'turmaklash' | 'soqol';

export interface BarberService {
  id: ServiceId;
  index: string;
  title: string;
  description: string;
  durationMinutes: number;
  durationLabel: string;
  price: number;
  priceLabel: string;
  master: string;
  image: string;
  imageAlt: string;
  availableTimes: [string, string, string];
}

export const BARBER_SERVICES: BarberService[] = [
  {
    id: 'soch',
    index: '01',
    title: 'Soch olish',
    description: "Aniq shakl berish, bosh yuvish va klassik pardozlash.",
    durationMinutes: 45,
    durationLabel: '45 daqiqa',
    price: 120000,
    priceLabel: "120 000 so'm",
    master: 'Sardor Karimov',
    image: haircutImg,
    imageAlt: 'Travertin tosh ustidagi qora sartaroshlik qaychisi va taroq',
    availableTimes: ['10:00', '14:00', '17:30'],
  },
  {
    id: 'turmaklash',
    index: '02',
    title: 'Soch turmaklash',
    description: "Tabiiy hajm, yengil tuzilma va kun bo'yi barqaror turmak.",
    durationMinutes: 30,
    durationLabel: '30 daqiqa',
    price: 90000,
    priceLabel: "90 000 so'm",
    master: 'Jahongir Alimov',
    image: stylingImg,
    imageAlt: "Yog'och cho'tka va shisha idishdagi soch turmaklash vositasi",
    availableTimes: ['11:00', '15:30', '18:30'],
  },
  {
    id: 'soqol',
    index: '03',
    title: 'Soqolni tartibga keltirish',
    description: "Ustara bilan toza chiziq, issiq sochiq va teri parvarishi.",
    durationMinutes: 25,
    durationLabel: '25 daqiqa',
    price: 80000,
    priceLabel: "80 000 so'm",
    master: 'Bobur Rahimov',
    image: beardImg,
    imageAlt: "Po'lat ustara, soqol olish cho'tkasi va oq zig'ir sochiq",
    availableTimes: ['10:30', '13:00', '19:00'],
  },
];

const UZBEK_MONTHS = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
];

const UZBEK_WEEKDAYS = [
  'Yakshanba',
  'Dushanba',
  'Seshanba',
  'Chorshanba',
  'Payshanba',
  'Juma',
  'Shanba',
];

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getQuickDateOptions(): Array<{ label: string; iso: string; sublabel: string }> {
  const today = new Date();
  return [0, 1, 2].map((offset) => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    const label = offset === 0 ? 'Bugun' : offset === 1 ? 'Ertaga' : 'Indinga';
    const sublabel = `${d.getDate()}-${UZBEK_MONTHS[d.getMonth()]}`;
    return {
      label,
      iso: toIsoDate(d),
      sublabel,
    };
  });
}

export function formatUzbekDate(isoDate: string): string {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return isoDate;
  }
  const [year, month, day] = parts;
  const dateObj = new Date(year, month - 1, day);
  const weekday = UZBEK_WEEKDAYS[dateObj.getDay()];
  const monthName = UZBEK_MONTHS[month - 1];
  return `${day}-${monthName}, ${year} (${weekday})`;
}
