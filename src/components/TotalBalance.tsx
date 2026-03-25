import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowUpRight, ChevronRight, TrendingUp } from 'lucide-react-native';

interface TotalBalanceProps {
  total: number;
  onPress?: () => void;
}

const TotalBalance: React.FC<TotalBalanceProps> = ({ total, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Surface style={styles.surface} elevation={4}>
        <LinearGradient
          colors={['#6366f1', '#4f46e5', '#3730a3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <View style={styles.labelContainer}>
              <TrendingUp size={16} color="#e0e7ff" style={styles.icon} />
              <Text variant="labelLarge" style={styles.label}>Total Monthly Spending</Text>
            </View>
            <View style={styles.chip}>
              <ArrowUpRight size={14} color="#10b981" />
              <Text style={styles.chipText}>+5%</Text>
            </View>
          </View>
          
          <Text variant="displaySmall" style={styles.amount}>₹{total.toLocaleString()}</Text>
          
          <View style={styles.footer}>
            <Text variant="bodySmall" style={styles.viewAnalytics}>View detailed analytics</Text>
            <ChevronRight size={16} color="#e0e7ff" />
          </View>
        </LinearGradient>
      </Surface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  surface: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
  },
  gradient: {
    padding: 24,
    borderRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  label: {
    color: '#e0e7ff',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 78, 59, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  amount: {
    color: 'white',
    fontWeight: '900',
    marginVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12,
  },
  viewAnalytics: {
    color: '#e0e7ff',
    marginRight: 4,
    fontWeight: '500',
  }
});

export default TotalBalance;
