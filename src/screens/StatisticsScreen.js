import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Button } from '../components/Button';
import { Card, StatItem } from '../components/Cards';
import { colors } from '../styles/globalStyles';
import { getStatistics, clearAllData } from '../services/storageService';
import { GAME_MODES, DIFFICULTIES } from '../services/gameService';
import PieChart from '../components/PieChart';
import { View as RNView } from 'react-native';

const StatisticsScreen = () => {
  const navigation = useNavigation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    setLoading(true);
    const stats = await getStatistics();
    setStats(stats);
    setLoading(false);
  };

  const handleClearData = () => {
    Alert.alert(
      'Limpiar Datos',
      '¿Seguro que queres eliminar todo el historial?',
      [
        { text: 'Cancelar' },
        {
          text: 'Si, eliminar',
          onPress: async () => {
            await clearAllData();
            setStats(null);
            loadStats();
          },
        },
      ]
    );
  };

  if (loading || !stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (stats.totalGames === 0) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Estadisticas</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay datos disponibles. Juega para generar estadisticas!
          </Text>
          <Button
            title="Jugar Ahora"
            onPress={() => navigation.navigate('GameMode')}
            variant="primary"
            style={{ marginTop: 24 }}
          />
        </View>
      </ScrollView>
    );
  }

  const timeHours = Math.floor(stats.totalTime / 3600000);
  const timeMinutes = Math.floor((stats.totalTime % 3600000) / 60000);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Estadisticas Generales</Text>

      <Card>
        <StatItem
          label="Total de Juegos"
          value={stats.totalGames.toString()}
          color={colors.primary}
        />
        <StatItem
          label="Respuestas Correctas"
          value={stats.totalCorrect.toString()}
          color={colors.success}
        />
        <StatItem
          label="Respuestas Incorrectas"
          value={stats.totalIncorrect.toString()}
          color={colors.danger}
        />
        <StatItem
          label="Precision General"
          value={`${stats.accuracy}%`}
          color={colors.primary}
        />
        <StatItem
          label="Puntuacion Promedio"
          value={stats.averageScore.toString()}
          color={colors.primary}
        />
        <StatItem
          label="Tiempo Total"
          value={`${timeHours}h ${timeMinutes}m`}
          color={colors.primary}
        />
      </Card>

      <Text style={styles.sectionTitle}>Estadisticas por Dificultad</Text>
      {[DIFFICULTIES.EASY, DIFFICULTIES.MEDIUM, DIFFICULTIES.HARD].map(
        difficulty => {
          const diffStats = stats.byDifficulty[difficulty];
          const difficultyLabel = {
            easy: 'Facil',
            medium: 'Medio',
            hard: 'Dificil',
          }[difficulty];
          const difficultyColor = {
            easy: colors.easy,
            medium: colors.medium,
            hard: colors.hard,
          }[difficulty];

          if (diffStats.games === 0) return null;

          const total = diffStats.correct + diffStats.incorrect || 1;
          const correctPercent = Math.round((diffStats.correct / total) * 100);

          return (
            <Card key={difficulty} style={styles.cardSpacing}>
              <Text
                style={[styles.cardTitle, { color: difficultyColor }]}
              >
                {difficultyLabel}
              </Text>
              <RNView style={{ flexDirection: 'row', alignItems: 'center' }}>
                <PieChart size={96} width={18} data={[{ value: Number(diffStats.correct) || 0, color: difficultyColor }, { value: Number(diffStats.incorrect) || 0, color: colors.danger }]} />
                <RNView style={{ marginLeft: 12, flex: 1 }}>
                  <StatItem
                    label="Juegos"
                    value={diffStats.games.toString()}
                    color={difficultyColor}
                  />
                  <StatItem
                    label="Respuestas Correctas"
                    value={diffStats.correct.toString()}
                    color={colors.success}
                  />
                  <StatItem
                    label="Puntuacion Promedio"
                    value={diffStats.avgScore.toString()}
                    color={difficultyColor}
                  />
                </RNView>
              </RNView>
            </Card>
          );
        }
      )}

      <Text style={styles.sectionTitle}>Estadisticas por Modo</Text>

      {Object.values(GAME_MODES).map(mode => {
        const modeStats = stats.byMode[mode];
        const modeLabel = {
          classic: 'Clasico',
          truefalse: 'Verdadero/Falso',
          multiplechoice: 'Multiple Choice',
          race: 'Contra Reloj',
        }[mode];

        if (modeStats.games === 0) return null;

        const total = modeStats.correct + modeStats.incorrect || 1;
        const correctPercent = Math.round((modeStats.correct / total) * 100);

        return (
          <Card key={mode} style={styles.cardSpacing}>
            <Text style={styles.cardTitle}>{modeLabel}</Text>
            <RNView style={{ flexDirection: 'row', alignItems: 'center' }}>
              <PieChart size={96} width={18} data={[{ value: Number(modeStats.correct) || 0, color: colors.primary }, { value: Number(modeStats.incorrect) || 0, color: colors.danger }]} />
              <RNView style={{ marginLeft: 12, flex: 1 }}>
                <StatItem
                  label="Juegos Jugados"
                  value={modeStats.games.toString()}
                  color={colors.primary}
                />
                <StatItem
                  label="Puntuacion Promedio"
                  value={modeStats.avgScore.toString()}
                  color={colors.primary}
                />
              </RNView>
            </RNView>
          </Card>
        );
      })}

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 20,
    marginBottom: 12,
  },
  cardSpacing: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
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
    textAlign: 'center',
  },
  backButton: {
    marginVertical: 24,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  barLabel: {
    width: 80,
    color: colors.textSecondary,
  },
  barTrack: {
    flex: 1,
    minWidth: 120,
    height: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  barFill: {
    height: 16,
    borderRadius: 8,
  },
  barPercent: {
    width: 44,
    textAlign: 'right',
    color: colors.textSecondary,
  },
});

export default StatisticsScreen;
