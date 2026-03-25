import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { CreditCard, Tag, Calendar } from 'lucide-react-native';

interface ExpenseCardProps {
  amount: number;
  category: string;
  note: string;
  createdAt: any;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ amount, category, note, createdAt }) => {
  const date = createdAt?.toDate ? createdAt.toDate().toDateString() : 'Just now';

  return (
    <Surface style={styles.card} elevation={1}>
      <View style={styles.left}>
        <View style={styles.iconContainer}>
          <Tag size={20} color="#6366f1" />
        </View>
        <View>
          <Text variant="titleMedium" style={styles.category}>{category}</Text>
          <Text variant="bodySmall" style={styles.note}>{note}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text variant="titleLarge" style={styles.amount}>₹{amount}</Text>
        <Text variant="bodySmall" style={styles.date}>{date}</Text>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    marginBottom: 12,
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  category: {
    fontWeight: '700',
    color: '#1e293b',
  },
  note: {
    color: '#64748b',
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontWeight: '800',
    color: '#6366f1',
  },
  date: {
    color: '#94a3b8',
    marginTop: 2,
  }
});

export default ExpenseCard;
