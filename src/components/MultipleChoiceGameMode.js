import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Timer } from './Timer';
import { colors } from '../styles/globalStyles';

export const MultipleChoiceGameScreen = ({
  operation,
  choices,
  onAnswer,
  onTimeout,
  maxTime,
  questionNumber,
  totalQuestions,
}) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

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

  const handleSelectAnswer = (choice) => {
    if (showFeedback) return;

    const isCorrect = choice === operation.result;
    setSelectedAnswer(choice);
    setShowFeedback(true);

    setTimeout(() => {
      onAnswer({
        answer: choice,
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

      <Text style={styles.question}>{operation.display} = ?</Text>

      <View style={styles.choicesContainer}>
        {choices.map((choice, index) => {
          const isSelected = selectedAnswer === choice;
          const isCorrect = choice === operation.result;
          let choiceStyle = styles.choiceButton;
          let choiceTextStyle = styles.choiceText;

          if (showFeedback && isSelected) {
            if (isCorrect) {
              choiceStyle = [choiceStyle, styles.choiceCorrect];
              choiceTextStyle = [choiceTextStyle, { color: '#ffffff' }];
            } else {
              choiceStyle = [choiceStyle, styles.choiceIncorrect];
              choiceTextStyle = [choiceTextStyle, { color: '#ffffff' }];
            }
          } else if (showFeedback && isCorrect && !isSelected) {
            choiceStyle = [choiceStyle, styles.choiceCorrect];
            choiceTextStyle = [choiceTextStyle, { color: '#ffffff' }];
          }

          return (
            <TouchableOpacity
              key={index}
              style={choiceStyle}
              onPress={() => handleSelectAnswer(choice)}
              disabled={showFeedback}
              activeOpacity={0.7}
            >
              <Text style={choiceTextStyle}>{choice}</Text>
            </TouchableOpacity>
          );
        })}
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
  question: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginVertical: 24,
  },
  choicesContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
  },
  choiceButton: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  choiceCorrect: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  choiceIncorrect: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
});
