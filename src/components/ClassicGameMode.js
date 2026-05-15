import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import { Button } from './Button';
import { Timer } from './Timer';
import { colors, globalStyles } from '../styles/globalStyles';

export const ClassicGameScreen = ({
  operation,
  onAnswer,
  onTimeout,
  maxTime,
  questionNumber,
  totalQuestions,
}) => {
  const [input, setInput] = useState('');
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

  const handleSubmit = () => {
    const answer = parseInt(input);
    const isCorrect = answer === operation.result;
    
    setShowFeedback(isCorrect ? 'correct' : 'incorrect');
    Keyboard.dismiss();
    
    setTimeout(() => {
      onAnswer({
        answer,
        isCorrect,
        timeSpent,
        maxTime,
      });
    }, 800);
  };

  const isAnswerProvided = input.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.question}>{operation.display}</Text>
        <Text style={styles.counter}>
          {questionNumber}/{totalQuestions}
        </Text>
      </View>

      <Timer currentTime={timeSpent} maxTime={maxTime} />

      <View
        style={[
          styles.feedbackBox,
          showFeedback && {
            backgroundColor:
              showFeedback === 'correct'
                ? colors.success + '20'
                : colors.danger + '20',
          },
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu respuesta"
          keyboardType="number-pad"
          value={input}
          onChangeText={setInput}
          editable={!showFeedback}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {showFeedback && (
        <View style={styles.feedbackContainer}>
          <Text
            style={[
              styles.feedbackText,
              {
                color:
                  showFeedback === 'correct' ? colors.success : colors.danger,
              },
            ]}
          >
            {showFeedback === 'correct' ? '✓ ¡Correcto!' : '✗ Incorrecto'}
          </Text>
          {showFeedback === 'incorrect' && (
            <Text style={styles.correctAnswer}>
              Respuesta correcta: {operation.result}
            </Text>
          )}
        </View>
      )}

      {!showFeedback && (
        <Button
          title="Confirmar Respuesta"
          onPress={handleSubmit}
          disabled={!isAnswerProvided}
          variant="primary"
          style={styles.button}
        />
      )}
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
  question: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  counter: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  feedbackBox: {
    marginVertical: 16,
    borderRadius: 12,
    padding: 8,
  },
  input: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 12,
    paddingHorizontal: 16,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
    color: colors.text,
  },
  button: {
    marginTop: 16,
  },
  feedbackContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  correctAnswer: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
