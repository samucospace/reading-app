export interface WordCategory {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  words: {
    text: string;
    hint?: string;
    emoji?: string;
  }[];
}

export const DEFAULT_WORD_CATEGORIES: WordCategory[] = [
  {
    id: 'cvc',
    name: 'Starter Phonics (CVC)',
    description: '3-letter sounding words ideal for new readers',
    emoji: '🐱',
    color: 'from-emerald-400 to-teal-500',
    words: [
      { text: 'CAT', hint: 'Meow! A furry pet', emoji: '🐱' },
      { text: 'DOG', hint: 'Woof! Friendly companion', emoji: '🐶' },
      { text: 'SUN', hint: 'Bright in the sky', emoji: '☀️' },
      { text: 'PIG', hint: 'Oink! Pink farm friend', emoji: '🐷' },
      { text: 'BUG', hint: 'Crawling in the garden', emoji: '🐛' },
      { text: 'HAT', hint: 'Worn on your head', emoji: '🎩' },
      { text: 'FOX', hint: 'Clever orange animal', emoji: '🦊' },
      { text: 'CUP', hint: 'Used for drinking juice', emoji: '🥤' },
      { text: 'BED', hint: 'Where you sleep at night', emoji: '🛏️' },
      { text: 'BAT', hint: 'Flies at night or hits a ball', emoji: '🦇' },
      { text: 'VAN', hint: 'A big family car', emoji: '🚐' },
      { text: 'NET', hint: 'Used to catch butterflies or fish', emoji: '🕸️' },
      { text: 'BOX', hint: 'Square carton for presents', emoji: '📦' },
      { text: 'POT', hint: 'Used for cooking yummy soup', emoji: '🍲' },
      { text: 'RUN', hint: 'Moving super fast with your feet', emoji: '🏃' },
    ],
  },
  {
    id: 'sight',
    name: 'Magic Sight Words',
    description: 'Essential everyday words that appear in all books',
    emoji: '⭐',
    color: 'from-amber-400 to-orange-500',
    words: [
      { text: 'THE', hint: 'A super common word', emoji: '📖' },
      { text: 'SEE', hint: 'What you do with your eyes', emoji: '👀' },
      { text: 'YOU', hint: 'The wonderful reader!', emoji: '👉' },
      { text: 'CAN', hint: 'Yes you can do it!', emoji: '💪' },
      { text: 'LOOK', hint: 'Check it out over here', emoji: '🔍' },
      { text: 'PLAY', hint: 'Having fun with games and toys', emoji: '🛝' },
      { text: 'LIKE', hint: 'Enjoying something you love', emoji: '👍' },
      { text: 'BIG', hint: 'Huge like an elephant', emoji: '🐘' },
      { text: 'RED', hint: 'The color of apples and hearts', emoji: '🍎' },
      { text: 'BLUE', hint: 'The color of the ocean and sky', emoji: '🌊' },
      { text: 'JUMP', hint: 'Leaping high into the air', emoji: '🦘' },
      { text: 'HELP', hint: 'Giving a helping hand', emoji: '🤝' },
      { text: 'AND', hint: 'Connecting words together', emoji: '➕' },
      { text: 'WE', hint: 'You and me together', emoji: '👫' },
    ],
  },
  {
    id: 'animals',
    name: 'Animals & Wonders',
    description: 'Exciting 4-letter blends and nature words',
    emoji: '🚀',
    color: 'from-purple-400 to-indigo-500',
    words: [
      { text: 'STAR', hint: 'Twinkling in the night sky', emoji: '⭐' },
      { text: 'MOON', hint: 'Glowing brightly above', emoji: '🌙' },
      { text: 'FROG', hint: 'Ribbit! Green hopping buddy', emoji: '🐸' },
      { text: 'FISH', hint: 'Swimming under water', emoji: '🐟' },
      { text: 'DUCK', hint: 'Quack! Splashing in the pond', emoji: '🦆' },
      { text: 'TREE', hint: 'Tall with green leaves', emoji: '🌳' },
      { text: 'LION', hint: 'King of the jungle, roar!', emoji: '🦁' },
      { text: 'BEAR', hint: 'Loves honey and cozy naps', emoji: '🐻' },
      { text: 'BOOK', hint: 'Pages filled with stories', emoji: '📚' },
      { text: 'BIRD', hint: 'Singing sweet songs in the sky', emoji: '🐦' },
      { text: 'BOAT', hint: 'Sailing across the lake', emoji: '⛵' },
      { text: 'RAIN', hint: 'Falling drops from clouds', emoji: '🌧️' },
      { text: 'SNOW', hint: 'Cold white winter flakes', emoji: '❄️' },
    ],
  },
];
