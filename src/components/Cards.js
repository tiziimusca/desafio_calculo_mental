import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/globalStyles';

export const Card = ({ title, children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

export const Badge = ({ text, variant = 'primary', style }) => {
  const variants = {
    primary: { backgroundColor: colors.primary },
    easy: { backgroundColor: colors.easy },
    medium: { backgroundColor: colors.medium },
    hard: { backgroundColor: colors.hard },
    success: { backgroundColor: colors.success },
    warning: { backgroundColor: colors.warning },
    danger: { backgroundColor: colors.danger },
  };

  return (
    <View style={[styles.badge, variants[variant], style]}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
};

export const StatItem = ({ label, value, color = colors.primary }) => {
  return (
    <View style={styles.statItem}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});
