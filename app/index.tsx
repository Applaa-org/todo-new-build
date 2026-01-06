import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');

  const addTodo = useCallback(() => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter a todo item');
      return;
    }
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      createdAt: new Date(),
    };
    setTodos(prev => [newTodo, ...prev]);
    setInputText('');
    Keyboard.dismiss();
  }, [inputText]);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    Alert.alert('Delete Todo', 'Are you sure you want to delete this todo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setTodos(prev => prev.filter(t => t.id !== id)),
      },
    ]);
  }, []);

  const renderTodo = ({ item }: { item: Todo }) => (
    <Pressable
      style={styles.todoItem}
      onPress={() => toggleTodo(item.id)}
      onLongPress={() => deleteTodo(item.id)}
    >
      <Ionicons
        name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color={item.completed ? '#4CAF50' : '#757575'}
      />
      <Text
        style={[
          styles.todoText,
          item.completed && styles.completedText,
        ]}
        numberOfLines={2}
      >
        {item.text}
      </Text>
      <Pressable
        style={styles.deleteButton}
        onPress={() => deleteTodo(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#FF5252" />
      </Pressable>
    </Pressable>
  );

  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = todos.filter(t => !t.completed).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>

      {/* Input Section */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="What needs to be done?"
            placeholderTextColor="#9E9E9E"
            onSubmitEditing={addTodo}
            returnKeyType="done"
            multiline
          />
          <Pressable style={styles.addButton} onPress={addTodo}>
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
        </View>

        {/* Todo List */}
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={renderTodo}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color="#E0E0E0" />
              <Text style={styles.emptyText}>No todos yet</Text>
              <Text style={styles.emptySubtext}>
                Add your first task to get started!
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    marginRight: 12,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#2196F3',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  list: {
    padding: 16,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
    marginLeft: 12,
    marginRight: 12,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  deleteButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#9E9E9E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BDBDBD',
    textAlign: 'center',
  },
});