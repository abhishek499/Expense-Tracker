import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../api/firebase';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Info } from 'lucide-react-native';

const screenWidth = Dimensions.get("window").width;

const AnalyticsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, `users/${user.uid}/expenses`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: any = {};
      let sum = 0;
      snapshot.docs.forEach(doc => {
        const { amount, category } = doc.data();
        const cat = category || 'Uncategorized';
        data[cat] = (data[cat] || 0) + (Number(amount) || 0);
        sum += (Number(amount) || 0);
      });

      const colors = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
      const formattedData = Object.keys(data).map((key, index) => ({
        name: key,
        population: data[key],
        color: colors[index % colors.length],
        legendFontColor: "#64748b",
        legendFontSize: 12
      }));

      setChartData(formattedData);
      setTotal(sum);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <IconButton
          icon={() => <ChevronLeft size={24} color="#1e293b" />}
          onPress={() => navigation.goBack()}
        />
        <Text variant="headlineSmall" style={styles.title}>Spending Analytics</Text>
        <IconButton
          icon={() => <Info size={24} color="#1e293b" />}
          onPress={() => {}}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={styles.chartTitle}>Expense Breakdown</Text>
          {chartData.length > 0 ? (
            <PieChart
              data={chartData}
              width={screenWidth - 80}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[10, 0]}
              absolute
            />
          ) : (
            <Text style={styles.noData}>No data to display yet.</Text>
          )}
        </Surface>

        <View style={styles.summaryCard}>
            <Text variant="titleLarge" style={styles.summaryTitle}>Monthly Insights</Text>
            {chartData.map((item, idx) => (
                <View key={idx} style={styles.summaryRow}>
                    <View style={styles.categoryLeft}>
                        <View style={[styles.dot, { backgroundColor: item.color }]} />
                        <Text style={styles.categoryName}>{item.name}</Text>
                    </View>
                    <View style={styles.categoryRight}>
                        <Text style={styles.categoryAmount}>₹{item.population.toLocaleString()}</Text>
                        <Text style={styles.percent}>{((item.population / total) * 100).toFixed(1)}%</Text>
                    </View>
                </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  title: {
    fontWeight: '800',
    color: '#1e293b',
  },
  content: {
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: 24,
  },
  chartTitle: {
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  noData: {
    marginVertical: 40,
    color: '#94a3b8',
  },
  summaryCard: {
    padding: 20,
  },
  summaryTitle: {
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  percent: {
    fontSize: 12,
    color: '#64748b',
  }
});

export default AnalyticsScreen;
