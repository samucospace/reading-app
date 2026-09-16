export interface WordItemData {
  text: string;
  hint?: string;
  emoji?: string;
}

export interface WordCategory {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  words: WordItemData[];
}

export const FRY_FIRST_100: string[] = [
  "THE", "OF", "AND", "A", "TO", "IN", "IS", "YOU", "THAT", "IT",
  "HE", "WAS", "FOR", "ON", "ARE", "AS", "WITH", "HIS", "THEY", "I",
  "AT", "BE", "THIS", "HAVE", "FROM", "OR", "ONE", "HAD", "BY", "WORDS",
  "BUT", "NOT", "WHAT", "ALL", "WERE", "WE", "WHEN", "YOUR", "CAN", "SAID",
  "THERE", "USE", "AN", "EACH", "WHICH", "SHE", "DO", "HOW", "THEIR", "IF",
  "WILL", "UP", "OTHER", "ABOUT", "OUT", "MANY", "THEN", "THEM", "THESE", "SO",
  "SOME", "HER", "WOULD", "MAKE", "LIKE", "HIM", "INTO", "TIME", "HAS", "LOOK",
  "TWO", "MORE", "WRITE", "GO", "SEE", "NUMBER", "NO", "WAY", "COULD", "PEOPLE",
  "MY", "THAN", "FIRST", "WATER", "BEEN", "CALL", "WHO", "OIL", "ITS", "NOW",
  "FIND", "LONG", "DOWN", "DAY", "DID", "GET", "COME", "MADE", "MAY", "PART"
];

export const FRY_SECOND_100: string[] = [
  "OVER", "NEW", "SOUND", "TAKE", "ONLY", "LITTLE", "WORK", "KNOW", "PLACE", "YEAR",
  "LIVE", "ME", "BACK", "GIVE", "MOST", "VERY", "AFTER", "THING", "OUR", "JUST",
  "NAME", "GOOD", "SENTENCE", "MAN", "THINK", "SAY", "GREAT", "WHERE", "HELP", "THROUGH",
  "MUCH", "BEFORE", "LINE", "RIGHT", "TOO", "MEAN", "OLD", "ANY", "SAME", "TELL",
  "BOY", "FOLLOW", "CAME", "WANT", "SHOW", "ALSO", "AROUND", "FORM", "THREE", "SMALL",
  "SET", "PUT", "END", "DOES", "ANOTHER", "WELL", "LARGE", "MUST", "BIG", "EVEN",
  "SUCH", "BECAUSE", "TURN", "HERE", "WHY", "ASK", "WENT", "MEN", "READ", "NEED",
  "LAND", "DIFFERENT", "HOME", "US", "MOVE", "TRY", "KIND", "HAND", "PICTURE", "AGAIN",
  "CHANGE", "OFF", "PLAY", "SPELL", "AIR", "AWAY", "ANIMAL", "HOUSE", "POINT", "PAGE",
  "LETTER", "MOTHER", "ANSWER", "FOUND", "STUDY", "STILL", "LEARN", "SHOULD", "WORLD", "HIGH"
];

export const FRY_THIRD_100: string[] = [
  "EVERY", "NEAR", "ADD", "FOOD", "BETWEEN", "OWN", "BELOW", "COUNTRY", "PLANT", "LAST",
  "SCHOOL", "FATHER", "KEEP", "TREE", "NEVER", "START", "CITY", "EARTH", "EYES", "LIGHT",
  "THOUGHT", "HEAD", "UNDER", "STORY", "SAW", "LEFT", "FEW", "WHILE", "ALONG", "MIGHT",
  "CLOSE", "SOMETHING", "SEEM", "NEXT", "HARD", "OPEN", "EXAMPLE", "BEGIN", "LIFE", "ALWAYS",
  "THOSE", "BOTH", "PAPER", "TOGETHER", "GOT", "GROUP", "OFTEN", "RUN", "IMPORTANT", "UNTIL",
  "CHILDREN", "SIDE", "FEET", "CAR", "MILE", "NIGHT", "WALK", "WHITE", "SEA", "BEGAN",
  "GROW", "TOOK", "RIVER", "FOUR", "CARRY", "STATE", "ONCE", "BOOK", "HEAR", "STOP",
  "WITHOUT", "SECOND", "LATE", "MISS", "IDEA", "ENOUGH", "EAT", "FACE", "WATCH", "FAR",
  "REAL", "ALMOST", "LET", "ABOVE", "GIRL", "SOMETIMES", "MOUNTAIN", "CUT", "YOUNG", "TALK",
  "SOON", "LIST", "SONG", "BEING", "LEAVE", "FAMILY", "COLOR", "FRIEND", "STREET", "HAPPY"
];

export const FRY_300: string[] = [...FRY_FIRST_100, ...FRY_SECOND_100, ...FRY_THIRD_100];

// Helper to convert word array to WordItemData
function toWordItems(words: string[], badgeEmoji: string): WordItemData[] {
  return words.map((text) => ({
    text,
    emoji: badgeEmoji,
  }));
}

export const DEFAULT_WORD_CATEGORIES: WordCategory[] = [
  {
    id: 'top300',
    name: 'Top 300 Most Common Words 🏆',
    description: 'The master list of the 300 most frequent words in the English language',
    emoji: '🏆',
    color: 'from-amber-400 via-orange-500 to-rose-500',
    words: toWordItems(FRY_300, '⭐'),
  },
  {
    id: 'top100',
    name: 'Top 100 Common Words (Tier 1)',
    description: 'Words 1–100: The absolute core words found in 50% of everything we read',
    emoji: '🥇',
    color: 'from-yellow-400 to-amber-500',
    words: toWordItems(FRY_FIRST_100, '🌟'),
  },
  {
    id: 'second100',
    name: 'Second 100 Common Words (Tier 2)',
    description: 'Words 101–200: Expanding fluency with rich verbs, adjectives, and questions',
    emoji: '🥈',
    color: 'from-blue-400 to-indigo-500',
    words: toWordItems(FRY_SECOND_100, '🚀'),
  },
  {
    id: 'third100',
    name: 'Third 100 Common Words (Tier 3)',
    description: 'Words 201–300: Advanced high-frequency words for confident young readers',
    emoji: '🥉',
    color: 'from-purple-400 to-pink-500',
    words: toWordItems(FRY_THIRD_100, '👑'),
  },
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
