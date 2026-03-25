import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, FAB, ActivityIndicator } from 'react-native-paper';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../api/firebase';
import { useAuth } from '../context/AuthContext';
import ExpenseCard from '../components/ExpenseCard';
import TotalBalance from '../components/TotalBalance';
import { Plus, LogOut } from 'lucide-react-native';
import { IconButton } from 'react-native-paper';

const ExpenseListScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/expenses`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenseData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExpenses(expenseData);
      
      const sum = expenseData.reduce((acc, curr: any) => acc + (Number(curr.amount) || 0), 0);
      setTotal(sum);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text variant="headlineMedium" style={styles.title}>Dashboard</Text>
            <Text variant="bodyMedium" style={styles.subtitle}>Welcome back!</Text>
          </View>
          <IconButton
            icon={() => <LogOut size={22} color="#f43f5e" />}
            onPress={logout}
            style={styles.logoutBtn}
          />
        </View>

        <TotalBalance 
          total={total} 
          onPress={() => navigation.navigate('Analytics')} 
        />
        
        <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Recent Transactions</Text>
        </View>

        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExpenseCard 
              amount={item.amount} 
              category={item.category} 
              note={item.note} 
              createdAt={item.createdAt} 
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text variant="bodyLarge" style={styles.emptyText}>No expenses yet. Add one!</Text>
            </View>
          }
        />
      </View>

      <FAB
        icon={() => <Plus size={24} color="white" />}
        style={styles.fab}
        onPress={() => navigation.navigate('AddExpense')}
        color="white"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  inner: {
    padding: 20,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 10,
  },
  logoutBtn: {
    margin: 0,
    backgroundColor: '#f1f5f9',
  },
  title: {
    fontWeight: '900',
    color: '#1e293b',
  },
  subtitle: {
    color: '#64748b',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#1e293b',
  },
  list: {
    paddingBottom: 80,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 24,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
    borderRadius: 20,
  },
  empty: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#94a3b8',
  }
});

export default ExpenseListScreen;
