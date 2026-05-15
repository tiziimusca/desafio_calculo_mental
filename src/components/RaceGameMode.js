import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard } from 'react-native';
import { Button } from './Button';
import { SimpleTimer } from './Timer';
import { colors } from '../styles/globalStyles';

export const RaceGameScreen = ({
  operation,
  onAnswer,
  onGameEnd,
  totalTime,
  elapsedTime,
  questionNumber,
  correct,
  incorrect,
}) => {
  const [input, setInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(null);

  const remainingTime = Math.max(0, (totalTime - elapsedTime) / 1000);

  useEffect(() => {
    if (remainingTime <= 0) {
      onGameEnd();
    }
  }, [remainingTime, onGameEnd]);

  const handleSubmit = () => {
    const answer = parseInt(input);
    const isCorrect = answer === operation.result;

    setShowFeedback(isCorrect ? 'correct' : 'incorrect');
    Keyboard.dismiss();

    setTimeout(() => {
      onAnswer({
        answer,
        isCorrect,
      });
      setInput('');
      setShowFeedback(null);
    }, 600);
  };

  const isAnswerProvided = input.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Correctas</Text>
          <Text style={[styles.statValue, { color: colors.success }]}>
            {correct}
          </Text>
        </View>
        <SimpleTimer seconds={remainingTime} isActive={true} />
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Incorrectas</Text>
          <Text style={[styles.statValue, { color: colors.danger }]}>
            {incorrect}
          </Text>
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>{operation.display} = ?</Text>
      </View>

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
          placeholder="Respuesta"
          keyboardType="number-pad"
          value={input}
          onChangeText={setInput}
          editable={!showFeedback}
          placeholderTextColor={colors.textSecondary}
          autoFocus={true}
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
            {showFeedback === 'correct' ? '✓' : '✗'}
          </Text>
        </View>
      )}

      {!showFeedback && (
        <Button
          title="Confirmar"
          onPress={handleSubmit}
          disabled={!isAnswerProvided || remainingTime <= 0}
          variant="primary"
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  questionContainer: {
    marginVertical: 16,
  },
  question: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  feedbackBox: {
    marginVertical: 12,
    borderRadius: 12,
    padding: 8,
  },
  input: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: 12,
    paddingHorizontal: 16,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
    color: colors.text,
  },
  feedbackContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  feedbackText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
