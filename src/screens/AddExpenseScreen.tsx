import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../api/firebase';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Save } from 'lucide-react-native';

const AddExpenseScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddExpense = async () => {
    const numAmount = parseFloat(amount);
    
    // Validation
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      return Alert.alert("Invalid Amount", "Please enter a valid positive amount.");
    }
    if (numAmount > 1000000) {
      return Alert.alert("Amount Too Large", "Please enter an amount less than 1,000,000.");
    }
    if (!category || category.trim().length === 0) {
      return Alert.alert("Missing Category", "Please enter a category for this expense.");
    }

    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, `users/${user.uid}/expenses`), {
        amount: numAmount,
        category: category.trim(),
        note: note.trim(),
        createdAt: serverTimestamp(),
      });
      navigation.goBack();
    } catch (error: any) {
      console.error("Error adding expense: ", error);
      Alert.alert("Error", "Failed to save expense: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text variant="titleLarge" style={styles.title}>Add Expense</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Surface style={styles.card} elevation={1}>
          <TextInput
            label="Amount (₹)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            outlineColor="#e2e8f0"
            activeOutlineColor="#6366f1"
          />
          <TextInput
            label="Category (e.g., Food, Travel)"
            value={category}
            onChangeText={setCategory}
            mode="outlined"
            style={styles.input}
            outlineColor="#e2e8f0"
            activeOutlineColor="#6366f1"
          />
          <TextInput
            label="Note"
            value={note}
            onChangeText={setNote}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
            outlineColor="#e2e8f0"
            activeOutlineColor="#6366f1"
          />
        </Surface>

        <Button
          mode="contained"
          onPress={handleAddExpense}
          loading={loading}
          disabled={loading || !amount || !category}
          style={styles.button}
          contentStyle={styles.buttonContent}
          icon={() => <Save size={20} color="white" />}
        >
          Save Expense
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
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
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  button: {
    borderRadius: 12,
    backgroundColor: '#6366f1',
    marginTop: 20,
  },
  buttonContent: {
    height: 56,
  }
});

export default AddExpenseScreen;
