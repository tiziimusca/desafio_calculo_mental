import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/Button';
import { Badge } from '../components/Cards';
import { colors } from '../styles/globalStyles';
import { DIFFICULTIES, GAME_MODES } from '../services/gameService';

const GameModeScreen = () => {
  const navigation = useNavigation();
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTIES.EASY);
  const [numQuestions, setNumQuestions] = useState(10);

  const modes = [
    {
      id: GAME_MODES.CLASSIC,
      title: 'Clasico',
      description: 'Ingresa el resultado de la operacion',
    },
    {
      id: GAME_MODES.TRUE_FALSE,
      title: 'Verdadero/Falso',
      description: '¿Es correcta la operacion mostrada?',
    },
    {
      id: GAME_MODES.MULTIPLE_CHOICE,
      title: 'Multiple Choice',
      description: 'Selecciona la respuesta correcta entre 4 opciones',
    },
    {
      id: GAME_MODES.RACE,
      title: 'Contra Reloj',
      description: 'Responde operaciones continuamente hasta fallar',
    },
  ];

  const difficulties = [
    { id: DIFFICULTIES.EASY, label: 'Facil', color: colors.easy },
    { id: DIFFICULTIES.MEDIUM, label: 'Medio', color: colors.medium },
    { id: DIFFICULTIES.HARD, label: 'Dificil', color: colors.hard },
  ];

  const handleStartGame = () => {
    if (!selectedMode) return;

    const config = {
      gameMode: selectedMode,
      difficulty: selectedDifficulty,
      numQuestions: numQuestions,
    };

    navigation.navigate('Game', { config });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Selecciona un Modo</Text>

      <View style={styles.modesContainer}>
        {modes.map(mode => (
          <TouchableOpacity
            key={mode.id}
            style={[
              styles.modeCard,
              selectedMode === mode.id && styles.modeCardSelected,
            ]}
            onPress={() => setSelectedMode(mode.id)}
          >
            <Text style={styles.modeName}>{mode.title}</Text>
            <Text style={styles.modeDesc}>{mode.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedMode && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dificultad</Text>
            <View style={styles.difficultiesContainer}>
              {difficulties.map(diff => (
                <TouchableOpacity
                  key={diff.id}
                  style={[
                    styles.difficultyButton,
                    selectedDifficulty === diff.id &&
                      styles.difficultyButtonSelected,
                  ]}
                  onPress={() => setSelectedDifficulty(diff.id)}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      selectedDifficulty === diff.id &&
                        styles.difficultyTextSelected,
                    ]}
                  >
                    {diff.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {selectedMode !== GAME_MODES.RACE && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Cantidad de Preguntas: {numQuestions}
              </Text>
              <View style={styles.sliderContainer}>
                {[5, 10, 15, 20, 30].map(num => (
                  <Button
                    key={num}
                    title={num.toString()}
                    onPress={() => setNumQuestions(num)}
                    variant={numQuestions === num ? 'primary' : 'secondary'}
                    style={styles.sliderButton}
                  />
                ))}
              </View>
            </View>
          )}

          <Button
            title="Comenzar Juego"
            onPress={handleStartGame}
            variant="success"
            style={styles.startButton}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  modesContainer: {
    marginBottom: 24,
  },
  modeCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  modeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  modeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  modeDesc: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  difficultiesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  difficultyButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  difficultyTextSelected: {
    color: '#ffffff',
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  sliderButton: {
    flex: 1,
    paddingVertical: 12,
    marginVertical: 0,
  },
  startButton: {
    paddingVertical: 16,
    marginBottom: 24,
  },
});

export default GameModeScreen;
