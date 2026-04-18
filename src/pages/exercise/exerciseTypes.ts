export type ExerciseType = 'translate' | 'fill' | 'order' | 'match' | 'guess' | 'listen' | 'picture' | 'spelling';

export interface MatchPair {
  fr: string;
  ru: string;
}

export interface Exercise {
  type: ExerciseType;
  question: string;
  hint?: string;
  options?: string[];
  correct: string | number;
  pairs?: MatchPair[];
  word?: string;
  pictures?: { emoji: string; label: string }[];
  audio?: string;
}

export const EXERCISES: Exercise[] = [
  {
    type: 'translate',
    question: 'Как переводится слово «maison»?',
    hint: 'Место, где живут люди',
    options: ['Машина', 'Дом', 'Магазин', 'Школа'],
    correct: 1,
  },
  {
    type: 'picture',
    question: 'Выбери картинку, которая соответствует слову «chat»',
    pictures: [
      { emoji: '🐶', label: 'chien' },
      { emoji: '🐱', label: 'chat' },
      { emoji: '🐟', label: 'poisson' },
      { emoji: '🐦', label: 'oiseau' },
    ],
    correct: 1,
  },
  {
    type: 'fill',
    question: 'Je ___ français. (изучаю)',
    options: ['mange', 'apprends', 'parle', 'lis'],
    correct: 1,
  },
  {
    type: 'guess',
    question: 'Угадай слово по подсказкам',
    hint: '🥖 Французская выпечка, длинная и хрустящая',
    word: 'BAGUETTE',
    correct: 'BAGUETTE',
  },
  {
    type: 'order',
    question: 'Составь фразу: «Я хочу кофе»',
    options: ['veux', 'Je', 'café', 'un'],
    correct: 'Je veux un café',
  },
  {
    type: 'match',
    question: 'Соедини французские слова с переводом',
    pairs: [
      { fr: 'chat', ru: '🐱 кот' },
      { fr: 'chien', ru: '🐶 собака' },
      { fr: 'oiseau', ru: '🐦 птица' },
    ],
    correct: 0,
  },
  {
    type: 'listen',
    question: 'Послушай слово и выбери правильный перевод',
    hint: 'bonjour',
    options: ['До свидания', 'Спасибо', 'Здравствуйте', 'Пожалуйста'],
    correct: 2,
  },
  {
    type: 'spelling',
    question: 'Напиши по-французски: «спасибо»',
    hint: 'Начинается на M...',
    correct: 'merci',
    options: ['m', 'e', 'r', 'c', 'i', 'a', 'o', 'u'],
  },
];

export const TYPE_LABELS: Record<ExerciseType, string> = {
  translate: '📖 Перевод',
  fill: '✍️ Заполни пропуск',
  order: '🔀 Составь фразу',
  match: '🔗 Сопоставь пары',
  guess: '🔮 Угадай слово',
  listen: '👂 Аудирование',
  picture: '🖼️ Выбери картинку',
  spelling: '⌨️ Напиши слово',
};
