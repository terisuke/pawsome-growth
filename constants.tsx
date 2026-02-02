
import { Dog, WeightLog, FoodLog } from './types';

export const MOCK_DOGS: Dog[] = [
  {
    id: 'dog-1',
    name: 'Mochi',
    breed: 'Shiba Inu',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=200&h=200',
    birthday: '2021-05-10',
  },
  {
    id: 'dog-2',
    name: 'Coco',
    breed: 'Toy Poodle',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=200&h=200',
    birthday: '2022-08-15',
  },
  {
    id: 'dog-3',
    name: 'Luna',
    breed: 'Chihuahua',
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=200&h=200',
    birthday: '2023-01-20',
  },
];

export const MOCK_WEIGHT_LOGS: WeightLog[] = [
  { id: 'w1', dogId: 'dog-1', date: '2023-10-01', weight: 8.5 },
  { id: 'w2', dogId: 'dog-1', date: '2023-10-08', weight: 8.6 },
  { id: 'w3', dogId: 'dog-1', date: '2023-10-15', weight: 8.4 },
  { id: 'w4', dogId: 'dog-1', date: '2023-10-22', weight: 8.5 },
  { id: 'w5', dogId: 'dog-1', date: '2023-10-29', weight: 8.7 },
  { id: 'w6', dogId: 'dog-2', date: '2023-10-01', weight: 3.2 },
  { id: 'w7', dogId: 'dog-2', date: '2023-10-15', weight: 3.3 },
  { id: 'w8', dogId: 'dog-3', date: '2023-10-01', weight: 2.1 },
  { id: 'w9', dogId: 'dog-3', date: '2023-10-15', weight: 2.2 },
];

export const MOCK_FOOD_LOGS: FoodLog[] = [
  { id: 'f1', dogId: 'dog-1', date: '2023-10-25', amount: 120, memo: 'Healthy appetite' },
  { id: 'f2', dogId: 'dog-1', date: '2023-10-26', amount: 115, memo: 'Left a bit' },
  { id: 'f3', dogId: 'dog-1', date: '2023-10-27', amount: 120 },
  { id: 'f4', dogId: 'dog-1', date: '2023-10-28', amount: 125 },
  { id: 'f5', dogId: 'dog-1', date: '2023-10-29', amount: 120 },
];

export const MOCK_DIARIES = [
  { id: 'd1', dogId: 'dog-1', date: '2024-05-10', title: '公園でお散歩', content: '今日は近くの公園で30分もお散歩しました。シッポをフリフリして楽しそうでした！' },
  { id: 'd2', dogId: 'dog-1', date: '2024-05-09', title: '新しいおもちゃ', content: '音の鳴るボールがお気に入り。ずっと噛んでいます。' },
  { id: 'd3', dogId: 'dog-2', date: '2024-05-10', title: 'トリミングの日', content: 'ふわふわになって帰ってきました。リボンが似合うね。' },
  { id: 'd4', dogId: 'dog-3', date: '2024-05-10', title: '初めてのお座り', content: 'ついに「お座り」ができました！ご褒美をたくさんあげました。' },
];
