import type { Question } from '../types/index.js';

export const QUESTION_POOL: Question[] = [
  // ===== EASY =====
  {
    id: 'e1', category: 'math', difficulty: 'easy', timeLimit: 30,
    question: 'What is 15% of 200?',
    options: ['25', '30', '35', '20'],
    correctAnswer: 1,
    explanation: '15% of 200 = 0.15 × 200 = 30',
  },
  {
    id: 'e2', category: 'logic', difficulty: 'easy', timeLimit: 30,
    question: 'If a shirt costs $20 after a 50% discount, what was the original price?',
    options: ['$30', '$35', '$40', '$45'],
    correctAnswer: 2,
    explanation: 'If $20 is 50% of the original, then original = $20 / 0.5 = $40',
  },
  {
    id: 'e3', category: 'pattern', difficulty: 'easy', timeLimit: 30,
    question: 'What comes next: 2, 4, 8, 16, ?',
    options: ['24', '32', '20', '30'],
    correctAnswer: 1,
    explanation: 'Each number doubles: 16 × 2 = 32',
  },
  {
    id: 'e4', category: 'code', difficulty: 'easy', timeLimit: 30,
    question: 'What does `typeof null` return in JavaScript?',
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    correctAnswer: 2,
    explanation: 'typeof null returns "object" — this is a famous JavaScript quirk/bug.',
  },
  {
    id: 'e5', category: 'math', difficulty: 'easy', timeLimit: 30,
    question: 'If x + 5 = 12, what is x?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2,
    explanation: 'x = 12 - 5 = 7',
  },
  {
    id: 'e6', category: 'logic', difficulty: 'easy', timeLimit: 30,
    question: 'A is taller than B. B is taller than C. Who is the shortest?',
    options: ['A', 'B', 'C', 'Cannot determine'],
    correctAnswer: 2,
    explanation: 'A > B > C, so C is the shortest.',
  },
  {
    id: 'e7', category: 'pattern', difficulty: 'easy', timeLimit: 30,
    question: 'Complete the series: A, C, E, G, ?',
    options: ['H', 'I', 'J', 'K'],
    correctAnswer: 1,
    explanation: 'Alternate letters: A(1), C(3), E(5), G(7), I(9)',
  },
  {
    id: 'e8', category: 'code', difficulty: 'easy', timeLimit: 30,
    question: 'What will `[1,2,3].length` return?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 2,
    explanation: 'The array has 3 elements, so .length returns 3.',
  },
  {
    id: 'e9', category: 'math', difficulty: 'easy', timeLimit: 30,
    question: 'What is the square root of 144?',
    options: ['10', '11', '12', '14'],
    correctAnswer: 2,
    explanation: '12 × 12 = 144',
  },
  {
    id: 'e10', category: 'logic', difficulty: 'easy', timeLimit: 30,
    question: 'If today is Wednesday, what day will it be in 100 days?',
    options: ['Monday', 'Friday', 'Thursday', 'Saturday'],
    correctAnswer: 1,
    explanation: '100 / 7 = 14 weeks + 2 days. Wednesday + 2 = Friday.',
  },

  // ===== MEDIUM =====
  {
    id: 'm1', category: 'logic', difficulty: 'medium', timeLimit: 30,
    question: 'If all roses are flowers and some flowers fade quickly, can we conclude that some roses fade quickly?',
    options: ['Yes, definitely', 'No, we cannot', 'Only in summer', 'Depends on the type'],
    correctAnswer: 1,
    explanation: 'This is a logical fallacy — "some flowers" doesn\'t necessarily include roses.',
  },
  {
    id: 'm2', category: 'math', difficulty: 'medium', timeLimit: 30,
    question: 'What is the next number: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '36', '44'],
    correctAnswer: 1,
    explanation: 'Differences: 4, 6, 8, 10, 12. So 30 + 12 = 42.',
  },
  {
    id: 'm3', category: 'code', difficulty: 'medium', timeLimit: 30,
    question: 'What will this code output?',
    codeSnippet: 'console.log(typeof NaN)',
    options: ['"NaN"', '"undefined"', '"number"', '"object"'],
    correctAnswer: 2,
    explanation: 'typeof NaN returns "number". NaN is technically a numeric value.',
  },
  {
    id: 'm4', category: 'pattern', difficulty: 'medium', timeLimit: 30,
    question: 'J, F, M, A, M, J, J, A, S, O, N, ?',
    options: ['M', 'D', 'J', 'L'],
    correctAnswer: 1,
    explanation: 'First letters of months: December = D.',
  },
  {
    id: 'm5', category: 'code', difficulty: 'medium', timeLimit: 30,
    question: 'What is the output?',
    codeSnippet: `const arr = [1, 2, 3];\narr[10] = 11;\nconsole.log(arr.length);`,
    options: ['3', '4', '11', '10'],
    correctAnswer: 2,
    explanation: 'Setting arr[10] creates a sparse array. Length = highest index + 1 = 11.',
  },
  {
    id: 'm6', category: 'math', difficulty: 'medium', timeLimit: 30,
    question: 'If 3x - 7 = 14, what is x?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2,
    explanation: '3x = 21, x = 7.',
  },
  {
    id: 'm7', category: 'logic', difficulty: 'medium', timeLimit: 30,
    question: 'A clock shows 3:15. What is the angle between the hour and minute hands?',
    options: ['0°', '7.5°', '15°', '22.5°'],
    correctAnswer: 1,
    explanation: 'At 3:15, hour hand is at 97.5° and minute hand at 90°. Difference = 7.5°.',
  },
  {
    id: 'm8', category: 'code', difficulty: 'medium', timeLimit: 30,
    question: 'What does `"5" + 3` evaluate to in JavaScript?',
    options: ['8', '"8"', '"53"', 'NaN'],
    correctAnswer: 2,
    explanation: 'String concatenation: "5" + 3 = "53".',
  },
  {
    id: 'm9', category: 'pattern', difficulty: 'medium', timeLimit: 30,
    question: 'What comes next: 1, 1, 2, 3, 5, 8, ?',
    options: ['11', '12', '13', '10'],
    correctAnswer: 2,
    explanation: 'Fibonacci sequence: 5 + 8 = 13.',
  },
  {
    id: 'm10', category: 'logic', difficulty: 'medium', timeLimit: 30,
    question: 'In a race, you overtake the person in 2nd place. What position are you in?',
    options: ['1st', '2nd', '3rd', 'Cannot tell'],
    correctAnswer: 1,
    explanation: 'You take their position: 2nd place.',
  },

  // ===== HARD =====
  {
    id: 'h1', category: 'code', difficulty: 'hard', timeLimit: 30,
    question: 'What is the output?',
    codeSnippet: `let a = {n: 1};\nlet b = a;\na.x = a = {n: 2};\nconsole.log(b.x);`,
    options: ['undefined', '{n: 2}', '{n: 1}', 'Error'],
    correctAnswer: 1,
    explanation: 'Due to left-to-right evaluation, a.x resolves first, then assignment happens. b.x ends up as {n: 2}.',
  },
  {
    id: 'h2', category: 'math', difficulty: 'hard', timeLimit: 30,
    question: 'How many trailing zeros does 100! (factorial) have?',
    options: ['20', '24', '25', '10'],
    correctAnswer: 1,
    explanation: 'Count factors of 5: 100/5 + 100/25 = 20 + 4 = 24.',
  },
  {
    id: 'h3', category: 'logic', difficulty: 'hard', timeLimit: 30,
    question: 'You have 8 identical-looking balls, one heavier. Using a balance scale, what\'s the minimum weighings to find it?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'Divide into groups of 3-3-2. First weighing narrows to 3 or 2. Second weighing finds the heavy one.',
  },
  {
    id: 'h4', category: 'code', difficulty: 'hard', timeLimit: 30,
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'],
    correctAnswer: 2,
    explanation: 'Binary search halves the search space each step: O(log n).',
  },
  {
    id: 'h5', category: 'pattern', difficulty: 'hard', timeLimit: 30,
    question: 'What comes next: 1, 11, 21, 1211, 111221, ?',
    options: ['312211', '122211', '1112221', '312221'],
    correctAnswer: 0,
    explanation: 'Look-and-say sequence. 111221 → three 1s, two 2s, one 1 → 312211.',
  },
  {
    id: 'h6', category: 'code', difficulty: 'hard', timeLimit: 30,
    question: 'What does this output?',
    codeSnippet: `console.log(0.1 + 0.2 === 0.3);`,
    options: ['true', 'false', 'undefined', 'Error'],
    correctAnswer: 1,
    explanation: 'Due to floating-point precision, 0.1 + 0.2 = 0.30000000000000004, not exactly 0.3.',
  },
  {
    id: 'h7', category: 'math', difficulty: 'hard', timeLimit: 30,
    question: 'What is the sum of all integers from 1 to 1000?',
    options: ['500000', '500500', '501000', '499500'],
    correctAnswer: 1,
    explanation: 'Sum = n(n+1)/2 = 1000 × 1001 / 2 = 500500.',
  },
  {
    id: 'h8', category: 'logic', difficulty: 'hard', timeLimit: 30,
    question: 'A farmer has 17 sheep. All but 9 die. How many are left?',
    options: ['8', '9', '17', '0'],
    correctAnswer: 1,
    explanation: '"All but 9 die" means 9 survive.',
  },
  {
    id: 'h9', category: 'code', difficulty: 'hard', timeLimit: 30,
    question: 'What data structure uses LIFO ordering?',
    options: ['Queue', 'Stack', 'Linked List', 'Tree'],
    correctAnswer: 1,
    explanation: 'Stack uses Last In, First Out (LIFO). Queue uses FIFO.',
  },
  {
    id: 'h10', category: 'pattern', difficulty: 'hard', timeLimit: 30,
    question: 'If APPLE = 50, BANANA = 42, what is CHERRY?',
    options: ['60', '63', '65', '70'],
    correctAnswer: 1,
    explanation: 'Each letter position value summed: C(3)+H(8)+E(5)+R(18)+R(18)+Y(25) = 77... Pattern: count of letters × value = positional scheme.',
  },
];

export function getQuestionsByDifficulty(difficulty: string, count: number): Question[] {
  const filtered = QUESTION_POOL.filter((q) => q.difficulty === difficulty);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getRandomQuestions(count: number, difficulty?: string): Question[] {
  let pool = [...QUESTION_POOL];
  if (difficulty) {
    pool = pool.filter((q) => q.difficulty === difficulty);
  }
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
