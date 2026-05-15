import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../styles/globalStyles';

export const Timer = ({ maxTime, currentTime, isActive }) => {
  const percentage = (currentTime / maxTime) * 100;
  const isWarning = percentage > 75;
  const isCritical = percentage > 90;

  let timerColor = colors.success;
  if (isCritical) {
    timerColor = colors.danger;
  } else if (isWarning) {
    timerColor = colors.warning;
  }

  const remainingTime = (maxTime - currentTime) / 1000;

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.barFill,
            {
              width: `${percentage}%`,
              backgroundColor: timerColor,
            }
          ]}
        />
      </View>
      <Text style={[styles.timeText, { color: timerColor }]}>
        {Math.max(0, remainingTime.toFixed(1))}s
      </Text>
    </View>
  );
};

export const SimpleTimer = ({ seconds, isActive }) => {
  const isWarning = seconds < 5;
  const color = isWarning ? colors.danger : colors.primary;

  return (
    <Text style={[styles.largeTimer, { color }]}>
      {Math.max(0, seconds.toFixed(1))}s
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  barContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  largeTimer: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  }
});
