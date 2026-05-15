import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/globalStyles';

export const Button = ({ 
  title, 
  onPress, 
  style, 
  textStyle,
  disabled,
  variant = 'primary'
}) => {
  const variants = {
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.secondary },
    success: { backgroundColor: colors.success },
    danger: { backgroundColor: colors.danger },
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variants[variant],
        style,
        disabled && { opacity: 0.5 }
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  }
});
