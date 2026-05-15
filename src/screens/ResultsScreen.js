import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../components/Button';
import { Card, StatItem, Badge } from '../components/Cards';
import { colors } from '../styles/globalStyles';
import { DIFFICULTIES, GAME_MODES } from '../services/gameService';

const ResultsScreen = ({ route, navigation }) => {
  const { result } = route.params;

  const getDifficultyLabel = (diff) => {
    switch (diff) {
      case DIFFICULTIES.EASY:
        return 'Facil';
      case DIFFICULTIES.MEDIUM:
        return 'Medio';
      case DIFFICULTIES.HARD:
        return 'Dificil';
      default:
        return diff;
    }
  };

  const getGameModeLabel = (mode) => {
    switch (mode) {
      case GAME_MODES.CLASSIC:
        return 'Clasico';
      case GAME_MODES.TRUE_FALSE:
        return 'Verdadero/Falso';
      case GAME_MODES.MULTIPLE_CHOICE:
        return 'Multiple Choice';
      case GAME_MODES.RACE:
        return 'Contra Reloj';
      default:
        return mode;
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case DIFFICULTIES.EASY:
        return colors.easy;
      case DIFFICULTIES.MEDIUM:
        return colors.medium;
      case DIFFICULTIES.HARD:
        return colors.hard;
      default:
        return colors.primary;
    }
  };

  const minutes = Math.floor(result.totalTime / 60000);
  const seconds = ((result.totalTime % 60000) / 1000).toFixed(1);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Puntuacion Final</Text>
        <Text style={styles.score}>{result.finalScore}</Text>
      </View>

      <Card title="Informacion del Juego">
        <StatItem
          label="Modo"
          value={getGameModeLabel(result.gameMode)}
          color={colors.primary}
        />
        <StatItem
          label="Dificultad"
          value={getDifficultyLabel(result.difficulty)}
          color={getDifficultyColor(result.difficulty)}
        />
        <StatItem
          label="Tiempo Total"
          value={`${minutes}m ${seconds}s`}
          color={colors.primary}
        />
      </Card>

      <Card title="Estadisticas de Respuestas">
        <StatItem
          label="Correctas"
          value={result.correct.toString()}
          color={colors.success}
        />
        <StatItem
          label="Incorrectas"
          value={result.incorrect.toString()}
          color={colors.danger}
        />
        <StatItem
          label="Precision"
          value={`${result.accuracy}%`}
          color={colors.primary}
        />
      </Card>

      {result.responses && result.responses.length > 0 && (
        <Card title="Detalle de Respuestas">
          {result.responses.map((response, index) => (
            <View
              key={index}
              style={[
                styles.responseItem,
                response.isCorrect
                  ? styles.responseCorrect
                  : styles.responseIncorrect,
              ]}
            >
              <View style={styles.responseLeft}>
                <Text style={styles.responseOperation}>{response.operation}</Text>
                <Text style={styles.responseAnswer}>
                  Tu respuesta: {response.answer || 'Sin respuesta'}
                </Text>
              </View>
              <Text style={styles.responseScore}>
                {response.score > 0 ? '+' : ''}{response.score}
              </Text>
            </View>
          ))}
        </Card>
      )}

      <View style={styles.buttonGroup}>
        <Button
          title="Jugar de Nuevo"
          onPress={() => navigation.replace('GameMode')}
          variant="primary"
        />
        <Button
          title="Menu Principal"
          onPress={() => navigation.navigate('Home')}
          variant="secondary"
        />
      </View>
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
  scoreContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  responseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  responseCorrect: {
    backgroundColor: colors.success + '15',
    borderLeftColor: colors.success,
  },
  responseIncorrect: {
    backgroundColor: colors.danger + '15',
    borderLeftColor: colors.danger,
  },
  responseLeft: {
    flex: 1,
  },
  responseOperation: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  responseAnswer: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  responseScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  buttonGroup: {
    marginVertical: 24,
  },
});

export default ResultsScreen;
