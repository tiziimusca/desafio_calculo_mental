export const DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

export const GAME_MODES = {
  CLASSIC: 'classic',
  TRUE_FALSE: 'truefalse',
  MULTIPLE_CHOICE: 'multiplechoice',
  RACE: 'race'
};

const difficultyConfig = {
  easy: {
    minNum: 1,
    maxNum: 10,
    maxTime: 10000, // 10 segs
    operations: ['+', '-']
  },
  medium: {
    minNum: 5,
    maxNum: 50,
    maxTime: 8000, // 8 segs
    operations: ['+', '-', '*']
  },
  hard: {
    minNum: 10,
    maxNum: 100,
    maxTime: 6000, // 6 segs
    operations: ['+', '-', '*', '/']
  }
};

export const generateOperation = (difficulty = DIFFICULTIES.EASY) => {
  const config = difficultyConfig[difficulty];
  let num1 = Math.floor(Math.random() * (config.maxNum - config.minNum + 1)) + config.minNum;
  let num2 = Math.floor(Math.random() * (config.maxNum - config.minNum + 1)) + config.minNum;
  const operation = config.operations[Math.floor(Math.random() * config.operations.length)];

  let result;
  switch (operation) {
    case '+':
      result = num1 + num2;
      break;
    case '-':
      result = num1 - num2;
      break;
    case '*':
      result = num1 * num2;
      break;
    case '/':
      num2 = Math.floor(Math.random() * (config.maxNum - config.minNum + 1)) + config.minNum;
      const maxQuotient = Math.max(1, Math.floor(config.maxNum / num2));
      const quotient = Math.floor(Math.random() * maxQuotient) + 1;
      result = quotient;
      num1 = result * num2;
      break;
    default:
      result = num1 + num2;
  }

  return {
    num1,
    num2,
    operation,
    result: Math.floor(result),
    display: `${num1} ${operation} ${num2}`,
    maxTime: config.maxTime
  };
};

export const generateMultipleChoices = (correctAnswer) => {
  const choices = [correctAnswer];
  
  while (choices.length < 4) {
    const variant = correctAnswer + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 10) + 1;
    if (!choices.includes(variant) && variant !== correctAnswer) {
      choices.push(variant);
    }
  }
  
  return choices.sort(() => Math.random() - 0.5);
};

export const calculateScore = (isCorrect, timeSpent, maxTime) => {
  if (!isCorrect) return -30;
  
  const timeFraction = timeSpent / maxTime;
  if (timeFraction < 0.75) {
    return 100;
  }
  return 70;
};

export const getDifficultyMultiplier = (difficulty) => {
  switch (difficulty) {
    case DIFFICULTIES.EASY:
      return 1;
    case DIFFICULTIES.MEDIUM:
      return 1.5;
    case DIFFICULTIES.HARD:
      return 2;
    default:
      return 1;
  }
};

export const generateFalseAnswer = (correctAnswer) => {
  return correctAnswer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 1);
};
