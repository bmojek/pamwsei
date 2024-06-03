import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { ToDoType } from "../../app/types/Todo.type";
import { useAuth } from "../../app/contexts/AuthContext";
import { useApiContext } from "../../app/contexts/ApiContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavTypes } from "../../app/types/NavTypes";

export const Todos: React.FC = () => {
  const { todos, setTodos } = useApiContext();
  const { user } = useAuth();
  const [newTodo, setNewTodo] = useState("");
  const navigation = useNavigation<NavigationProp<NavTypes>>();

  const filteredTodos = todos
    .filter((todo) => todo.userId === user?.id)
    .reverse();

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      const newTodoItem: ToDoType = {
        userId: user?.id || 0,
        id: todos.length + 1,
        title: newTodo,
        completed: false,
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo("");
    }
  };

  const handleDeleteTodo = (id: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const handleToggleTodo = (id: number) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loginPrompt}>
          Zaloguj się żeby zobaczyć Zadania
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          <Text style={styles.buttonText}>Logowanie</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Twoje zadania</Text>
      <TextInput
        style={styles.input}
        placeholder="Dodaj nowe zadanie..."
        value={newTodo}
        onChangeText={(text) => setNewTodo(text)}
        onSubmitEditing={handleAddTodo}
      />
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <View style={styles.todoTextContainer}>
              <Text style={styles.todoText}>{item.title}</Text>
            </View>
            <View style={styles.todoActions}>
              <TouchableOpacity onPress={() => handleToggleTodo(item.id)}>
                <Text style={styles.checkbox}>
                  {item.completed ? "✓" : "○"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTodo(item.id)}>
                <Text style={styles.deleteButton}>Usuń</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  loginPrompt: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
  },
  todoActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    fontSize: 24,
    marginRight: 10,
  },
  deleteButton: {
    color: "#FF5733",
    fontSize: 16,
  },
});

export default Todos;
