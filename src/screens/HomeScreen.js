import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/Button';
import { Card, StatItem } from '../components/Cards';
import { colors, globalStyles } from '../styles/globalStyles';

const HomeScreen = ({ stats }) => {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Calculo Mental</Text>
        <Text style={styles.subtitle}>Desafia tu velocidad mental</Text>
      </View>

      <Card style={styles.cardSpacing}>
        <Text style={styles.sectionTitle}>Empezar Juego</Text>
        <Button
          title="Jugar Ahora"
          onPress={() => navigation.navigate('GameMode')}
          variant="primary"
          style={styles.largeButton}
        />
      </Card>

      {stats && stats.totalGames > 0 && (
        <Card title="Estadisticas Rapidas" style={styles.cardSpacing}>
          <StatItem
            label="Total de Juegos"
            value={stats.totalGames.toString()}
            color={colors.primary}
          />
          <StatItem
            label="Precision"
            value={`${stats.accuracy}%`}
            color={colors.success}
          />
          <StatItem
            label="Puntuacion Promedio"
            value={stats.averageScore.toString()}
            color={colors.primary}
          />
        </Card>
      )}

      <Card title="Modos de Juego" style={styles.cardSpacing}>
        <Text style={styles.modeDescription}>
          <Text style={styles.modeBold}>Clasico:</Text> Ingresa la respuesta
        </Text>
        <Text style={styles.modeDescription}>
          <Text style={styles.modeBold}>Verdadero/Falso:</Text> Es correcto?
        </Text>
        <Text style={styles.modeDescription}>
          <Text style={styles.modeBold}>Multiple Choice:</Text> Selecciona la respuesta
        </Text>
        <Text style={styles.modeDescription}>
          <Text style={styles.modeBold}>Contra Reloj:</Text> Responde antes que se acabe el tiempo
        </Text>
      </Card>

      <View style={styles.buttonGroup}>
        <Button
          title="Mejores Puntajes"
          onPress={() => navigation.navigate('HighScores')}
          variant="secondary"
        />
        <Button
          title="Estadisticas"
          onPress={() => navigation.navigate('Statistics')}
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
    paddingTop: 16,
  },
  headerSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  cardSpacing: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  largeButton: {
    paddingVertical: 16,
    marginVertical: 0,
  },
  modeDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
    lineHeight: 20,
  },
  modeBold: {
    fontWeight: '600',
    color: colors.primary,
  },
  buttonGroup: {
    marginVertical: 16,
    marginBottom: 24,
  },
});

export default HomeScreen;
