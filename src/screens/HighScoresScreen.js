import React, { useState, useFocus } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Button } from '../components/Button';
import { Card, Badge } from '../components/Cards';
import { colors } from '../styles/globalStyles';
import { getHighScores } from '../services/storageService';
import { DIFFICULTIES, GAME_MODES } from '../services/gameService';

const HighScoresScreen = () => {
  const navigation = useNavigation();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadScores();
    }, [])
  );

  const loadScores = async () => {
    setLoading(true);
    const highScores = await getHighScores();
    setScores(highScores);
    setLoading(false);
  };

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

  const filteredScores = selectedDifficulty
    ? scores.filter(s => s.difficulty === selectedDifficulty)
    : scores;

  const renderScore = ({ item, index }) => {
    const date = new Date(item.timestamp);
    const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

    return (
      <View style={styles.scoreItem}>
        <View style={styles.medalContainer}>
          <Text style={styles.medal}>{index + 1}</Text>
        </View>
        <View style={styles.scoreInfo}>
          <View style={styles.scoreTop}>
            <Text style={styles.scoreValue}>{item.score} pts</Text>
            <Text style={styles.accuracy}>{item.accuracy}% acertado</Text>
          </View>
          <Text style={styles.scoreDate}>{dateStr}</Text>
        </View>
        <View style={styles.badgesContainer}>
          <Badge
            text={getGameModeLabel(item.mode)}
            variant="primary"
            style={styles.badge}
          />
          <Badge
            text={getDifficultyLabel(item.difficulty)}
            variant={item.difficulty}
            style={styles.badge}
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Mejores Puntajes</Text>

      <View style={styles.filterContainer}>
        <Button
          title="Todos"
          onPress={() => setSelectedDifficulty(null)}
          variant={selectedDifficulty === null ? 'primary' : 'secondary'}
          style={styles.filterButton}
        />
        <Button
          title="Facil"
          onPress={() => setSelectedDifficulty(DIFFICULTIES.EASY)}
          variant={
            selectedDifficulty === DIFFICULTIES.EASY ? 'primary' : 'secondary'
          }
          style={styles.filterButton}
        />
        <Button
          title="Medio"
          onPress={() => setSelectedDifficulty(DIFFICULTIES.MEDIUM)}
          variant={
            selectedDifficulty === DIFFICULTIES.MEDIUM ? 'primary' : 'secondary'
          }
          style={styles.filterButton}
        />
        <Button
          title="Dificil"
          onPress={() => setSelectedDifficulty(DIFFICULTIES.HARD)}
          variant={
            selectedDifficulty === DIFFICULTIES.HARD ? 'primary' : 'secondary'
          }
          style={styles.filterButton}
        />
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : filteredScores.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay puntajes registrados</Text>
          <Button
            title="Jugar Ahora"
            onPress={() => navigation.navigate('GameMode')}
            variant="primary"
            style={{ marginTop: 16 }}
          />
        </View>
      ) : (
        <FlatList
          scrollEnabled={false}
          data={filteredScores}
          renderItem={renderScore}
          keyExtractor={(item, index) => index.toString()}
        />
      )}

      <Button
        title="Volver"
        onPress={() => navigation.goBack()}
        variant="secondary"
        style={styles.backButton}
      />
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
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    marginVertical: 0,
  },
  scoreItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medalContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medal: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreInfo: {
    flex: 1,
  },
  scoreTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  accuracy: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600',
  },
  scoreDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  badgesContainer: {
    flexDirection: 'column',
    gap: 4,
    marginLeft: 12,
  },
  badge: {
    marginBottom: 0,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  backButton: {
    marginVertical: 24,
  },
});

export default HighScoresScreen;
