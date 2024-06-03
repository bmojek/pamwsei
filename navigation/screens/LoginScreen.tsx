import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../app/contexts/AuthContext";
import { useApiContext } from "../../app/contexts/ApiContext";

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigation = useNavigation();
  const { users } = useApiContext();

  const handleLogin = () => {
    const foundUser = users.find((user) => user.username === formData.username);

    if (foundUser && foundUser.website === formData.password) {
      const userId = foundUser.id;
      login({ id: userId, ...formData });

      navigation.goBack();
    } else {
      Alert.alert("Błąd", "Zle dane logowania");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logowanie</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={formData.username}
          onChangeText={(text) => setFormData({ ...formData, username: text })}
          placeholder="Username"
          autoComplete="username"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hasło</Text>
        <TextInput
          style={styles.input}
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          placeholder="Hasło"
          secureTextEntry
          autoComplete="current-password"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Zaloguj</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
        <Text style={styles.registerLink}>Zarejestruj się</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  registerLink: {
    color: "#007AFF",
    marginTop: 20,
    textAlign: "center",
  },
});

export default LoginScreen;
