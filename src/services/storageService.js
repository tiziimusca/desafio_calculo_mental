import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  HIGH_SCORES: '@mentalmath_highscores',
  GAME_HISTORY: '@mentalmath_history',
  STATS: '@mentalmath_stats'
};

export const saveGameResult = async (result) => {
  try {
    const timestamp = new Date().toISOString();
    const gameResult = {
      ...result,
      timestamp
    };

    const history = await AsyncStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
    const historyArray = history ? JSON.parse(history) : [];
    historyArray.push(gameResult);
    await AsyncStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(historyArray));

    const highScores = await AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
    const scoresArray = highScores ? JSON.parse(highScores) : [];
    scoresArray.push({
      score: result.finalScore,
      difficulty: result.difficulty,
      mode: result.gameMode,
      timestamp,
      accuracy: result.accuracy,
      totalTime: result.totalTime
    });
    scoresArray.sort((a, b) => b.score - a.score);
    await AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(scoresArray.slice(0, 50)));

    return true;
  } catch (error) {
    console.error('Error guardando el resultado:', error);
    return false;
  }
};

export const getHighScores = async () => {
  try {
    const scores = await AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
    return scores ? JSON.parse(scores) : [];
  } catch (error) {
    console.error('Error consiguiendo el puntaje mas alto:', error);
    return [];
  }
};

export const getGameHistory = async () => {
  try {
    const history = await AsyncStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error consiguiendo el historial de juegos:', error);
    return [];
  }
};

export const getStatistics = async () => {
  try {
    const history = await getGameHistory();
    
    if (history.length === 0) {
      return {
        totalGames: 0,
        totalCorrect: 0,
        totalIncorrect: 0,
        averageScore: 0,
        accuracy: 0,
        totalTime: 0,
        byDifficulty: {
          easy: { games: 0, correct: 0, avgScore: 0 },
          medium: { games: 0, correct: 0, avgScore: 0 },
          hard: { games: 0, correct: 0, avgScore: 0 }
        },
        byMode: {
          classic: { games: 0, avgScore: 0 },
          truefalse: { games: 0, avgScore: 0 },
          multiplechoice: { games: 0, avgScore: 0 },
          race: { games: 0, avgScore: 0 }
        }
      };
    }

    const stats = {
      totalGames: history.length,
      totalCorrect: history.reduce((sum, game) => sum + game.correct, 0),
      totalIncorrect: history.reduce((sum, game) => sum + game.incorrect, 0),
      averageScore: Math.round(history.reduce((sum, game) => sum + game.finalScore, 0) / history.length),
      accuracy: 0,
      totalTime: history.reduce((sum, game) => sum + (game.totalTime || 0), 0),
      byDifficulty: {
        easy: { games: 0, correct: 0, incorrect: 0, avgScore: 0 },
        medium: { games: 0, correct: 0, incorrect: 0, avgScore: 0 },
        hard: { games: 0, correct: 0, incorrect: 0, avgScore: 0 }
      },
      byMode: {
        classic: { games: 0, correct: 0, incorrect: 0, avgScore: 0 },
        truefalse: { games: 0, correct: 0, incorrect: 0, avgScore: 0 },
        multiplechoice: { games: 0, correct: 0, incorrect: 0, avgScore: 0 },
        race: { games: 0, correct: 0, incorrect: 0, avgScore: 0 }
      }
    };

    stats.accuracy = Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalIncorrect)) * 100);

    history.forEach(game => {
      const difficulty = game.difficulty || 'easy';

      stats.byDifficulty[difficulty].games++;
      stats.byDifficulty[difficulty].correct += Number(game.correct) || 0;
      stats.byDifficulty[difficulty].incorrect += Number(game.incorrect) || 0;
      stats.byDifficulty[difficulty].avgScore += Number(game.finalScore) || 0;

      const mode = game.gameMode || 'classic';
      stats.byMode[mode].games++;
      stats.byMode[mode].correct += Number(game.correct) || 0;
      stats.byMode[mode].incorrect += Number(game.incorrect) || 0;
      stats.byMode[mode].avgScore += Number(game.finalScore) || 0;
    });

    Object.keys(stats.byDifficulty).forEach(key => {
      if (stats.byDifficulty[key].games > 0) {
        stats.byDifficulty[key].avgScore = Math.round(stats.byDifficulty[key].avgScore / stats.byDifficulty[key].games);
      }
    });

    Object.keys(stats.byMode).forEach(key => {
      if (stats.byMode[key].games > 0) {
        stats.byMode[key].avgScore = Math.round(stats.byMode[key].avgScore / stats.byMode[key].games);
      }
    });

    return stats;
  } catch (error) {
    console.error('Error con estadisticas:', error);
    return {};
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    return true;
  } catch (error) {
    console.error('Error data:', error);
    return false;
  }
};
