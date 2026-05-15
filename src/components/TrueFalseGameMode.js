import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';
import { Timer } from './Timer';
import { colors } from '../styles/globalStyles';

export const TrueFalseGameScreen = ({
  operation,
  displayResult,
  isCorrectAnswer,
  onAnswer,
  onTimeout,
  maxTime,
  questionNumber,
  totalQuestions,
}) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => {
        const newTime = prev + 100;
        if (newTime >= maxTime) {
          clearInterval(timer);
          onTimeout();
          return maxTime;
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [maxTime, onTimeout]);

  const handleAnswer = (selectedTrue) => {
    const isCorrect = selectedTrue === isCorrectAnswer;
    setShowFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
      onAnswer({
        answer: selectedTrue,
        isCorrect,
        timeSpent,
        maxTime,
      });
    }, 800);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.counter}>
          {questionNumber}/{totalQuestions}
        </Text>
      </View>

      <Timer currentTime={timeSpent} maxTime={maxTime} />

      <View style={styles.questionBox}>
        <Text style={styles.operation}>{operation.display}</Text>
        <Text style={styles.result}>= {displayResult}</Text>
      </View>

      {showFeedback && (
        <View
          style={[
            styles.feedbackBox,
            {
              backgroundColor:
                showFeedback === 'correct' ? colors.success : colors.danger,
            },
          ]}
        >
          <Text style={styles.feedbackText}>
            {showFeedback === 'correct' ? '✓ ¡Correcto!' : '✗ Incorrecto'}
          </Text>
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <Button
          title="Verdadero"
          onPress={() => handleAnswer(true)}
          disabled={showFeedback !== null}
          variant="success"
          style={styles.button}
        />
        <Button
          title="Falso"
          onPress={() => handleAnswer(false)}
          disabled={showFeedback !== null}
          variant="danger"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 24,
  },
  counter: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  questionBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    marginVertical: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  operation: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  result: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  feedbackBox: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  feedbackText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
  },
});
