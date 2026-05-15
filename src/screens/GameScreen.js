import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, BackHandler } from 'react-native';
import { ClassicGameScreen } from '../components/ClassicGameMode';
import { TrueFalseGameScreen } from '../components/TrueFalseGameMode';
import { MultipleChoiceGameScreen } from '../components/MultipleChoiceGameMode';
import { RaceGameScreen } from '../components/RaceGameMode';
import {
  GAME_MODES,
  generateOperation,
  generateMultipleChoices,
  generateFalseAnswer,
  calculateScore,
} from '../services/gameService';
import { saveGameResult } from '../services/storageService';
import soundService from '../services/soundService';
import { colors } from '../styles/globalStyles';

const GameScreen = ({ route, navigation }) => {
  const { config } = route.params;
  const {
    gameMode,
    difficulty,
    numQuestions,
  } = config;

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [operation, setOperation] = useState(null);
  const [choices, setChoices] = useState([]);
  const [displayResult, setDisplayResult] = useState(null);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);

  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [responses, setResponses] = useState([]);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);

  const [raceStartTime] = useState(Date.now());
  const [raceTimer, setRaceTimer] = useState(0);

  useEffect(() => {
    generateNextQuestion();
    soundService.initialize();

    return () => {
      soundService.cleanup();
    };
  }, []);

  useEffect(() => {
    if (gameMode === GAME_MODES.RACE && !gameEnded) {
      const timer = setInterval(() => {
        setRaceTimer(Date.now() - raceStartTime);
      }, 100);

      return () => clearInterval(timer);
    }
  }, [gameMode, gameEnded, raceStartTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);

    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Abandonar Juego', '¿Estas seguro de abandonar?', [
        {
          text: 'Cancelar',
          onPress: () => null,
        },
        {
          text: 'Abandonar',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const generateNextQuestion = () => {
    const newOperation = generateOperation(difficulty);
    setOperation(newOperation);

    if (gameMode === GAME_MODES.MULTIPLE_CHOICE) {
      const multipleChoices = generateMultipleChoices(newOperation.result);
      setChoices(multipleChoices);
    } else if (gameMode === GAME_MODES.TRUE_FALSE) {
      const correctAnswer = Math.random() > 0.5;
      setIsCorrectAnswer(correctAnswer);
      if (correctAnswer) {
        setDisplayResult(newOperation.result);
      } else {
        setDisplayResult(generateFalseAnswer(newOperation.result));
      }
    }
  };

  const handleAnswer = useCallback(
    (answerData) => {
      const { answer, isCorrect, timeSpent, maxTime } = answerData;
      const score = calculateScore(isCorrect, timeSpent, maxTime);

      const response = {
        questionNumber: currentQuestion,
        operation: operation.display,
        answer,
        isCorrect,
        timeSpent,
        score,
      };

      setTotalScore(prev => prev + score);

      if (isCorrect) {
        setCorrect(prev => prev + 1);
        soundService.playCorrectSound();
      } else {
        setIncorrect(prev => prev + 1);
        soundService.playIncorrectSound();
      }

      if (currentQuestion < numQuestions) {
        setResponses(prev => [...prev, response]);
        setCurrentQuestion(prev => prev + 1);
        generateNextQuestion();
      } else {
        setResponses(prev => {
          const next = [...prev, response];
          finishGame(next);
          return next;
        });
      }
    },
    [currentQuestion, numQuestions, operation]
  );

  const handleTimeout = () => {
    const response = {
      questionNumber: currentQuestion,
      operation: operation.display,
      answer: null,
      isCorrect: false,
      timeSpent: operation.maxTime,
      score: -50,
    };

    setTotalScore(prev => prev - 50);
    setIncorrect(prev => prev + 1);
    soundService.playIncorrectSound();

    if (currentQuestion < numQuestions) {
      setResponses(prev => [...prev, response]);
      setCurrentQuestion(prev => prev + 1);
      generateNextQuestion();
    } else {
      setResponses(prev => {
        const next = [...prev, response];
        finishGame(next);
        return next;
      });
    }
  };

  const handleRaceAnswer = (answerData) => {
    const { answer, isCorrect } = answerData;
    const timeSpent = raceTimer;
    const score = calculateScore(isCorrect, timeSpent, 60000);

    const response = {
      questionNumber: currentQuestion,
      operation: operation.display,
      answer,
      isCorrect,
      timeSpent,
      score,
    };

    setTotalScore(prev => prev + score);

    if (isCorrect) {
      setCorrect(prev => prev + 1);
      soundService.playCorrectSound();
      setResponses(prev => [...prev, response]);
      setCurrentQuestion(prev => prev + 1);
      generateNextQuestion();
    } else {
      setIncorrect(prev => prev + 1);
      soundService.playIncorrectSound();
      setResponses(prev => {
        const next = [...prev, response];
        finishGame(next);
        return next;
      });
    }
  };

  const handleRaceGameEnd = () => {
    finishGame();
  };

  const finishGame = async (finalResponses) => {
    setGameEnded(true);

    const responsesToSave = finalResponses || responses;

    const correctCount = responsesToSave.filter(r => r.isCorrect).length;
    const incorrectCount = responsesToSave.length - correctCount;
    const finalScoreSum = responsesToSave.reduce((sum, r) => sum + (r.score || 0), 0);
    const accuracy = responsesToSave.length > 0 ? Math.round((correctCount / responsesToSave.length) * 100) : 0;

    const gameResult = {
      gameMode,
      difficulty,
      correct: correctCount,
      incorrect: incorrectCount,
      finalScore: finalScoreSum,
      accuracy,
      totalTime: elapsedTime,
      responses: responsesToSave,
    };

    setCorrect(correctCount);
    setIncorrect(incorrectCount);
    setTotalScore(finalScoreSum);

    await saveGameResult(gameResult);

    setTimeout(() => {
      navigation.replace('Results', { result: gameResult });
    }, 500);
  };

  if (!operation) {
    return null;
  }

  const commonProps = {
    operation,
    questionNumber: currentQuestion,
    totalQuestions: numQuestions,
    onTimeout: handleTimeout,
  };

  return (
    <View style={styles.container}>
      {gameMode === GAME_MODES.CLASSIC && (
        <ClassicGameScreen
          key={currentQuestion}
          {...commonProps}
          onAnswer={handleAnswer}
          maxTime={operation.maxTime}
        />
      )}

      {gameMode === GAME_MODES.TRUE_FALSE && (
        <TrueFalseGameScreen
          key={currentQuestion}
          {...commonProps}
          displayResult={displayResult}
          isCorrectAnswer={isCorrectAnswer}
          onAnswer={handleAnswer}
          maxTime={operation.maxTime}
        />
      )}

      {gameMode === GAME_MODES.MULTIPLE_CHOICE && (
        <MultipleChoiceGameScreen
          key={currentQuestion}
          {...commonProps}
          choices={choices}
          onAnswer={handleAnswer}
          maxTime={operation.maxTime}
        />
      )}

      {gameMode === GAME_MODES.RACE && (
        <RaceGameScreen
          key={currentQuestion}
          {...commonProps}
          onAnswer={handleRaceAnswer}
          onGameEnd={handleRaceGameEnd}
          totalTime={60000}
          elapsedTime={raceTimer}
          correct={correct}
          incorrect={incorrect}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default GameScreen;
