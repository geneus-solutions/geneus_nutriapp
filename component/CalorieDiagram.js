import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const CalorieDiagram = ({ goal, current, remaining }) => {
  const size = 150; // Reduced size for better layout
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (current / goal) * circumference;

  return (
    <View style={styles.container}>
      <View style={styles.diagramContainer}>
        <Svg width={size} height={size}>
          <Circle
            stroke="#E0E0E0"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke="#0072DB"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
          />
        </Svg>
        <View style={styles.textContainer}>
          <Text style={styles.remainingText}>{remaining}</Text>
          <Text style={styles.remainingLabel}>Remaining</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Goal</Text>
          <Text style={styles.infoValue}>{goal}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Current</Text>
          <Text style={styles.infoValue}>{current}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  diagramContainer: {
    position: 'relative',
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remainingText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0072DB',
  },
  remainingLabel: {
    fontSize: 14,
    color: 'gray',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 20,
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    color: 'gray',
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CalorieDiagram;