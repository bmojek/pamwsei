import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useApiContext } from "../../app/contexts/ApiContext";
import { UserType } from "../../app/types/User.type";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../app/contexts/AuthContext";

const RegisterScreen: React.FC = () => {
  const { setUsers, users } = useApiContext();
  const navigation = useNavigation();
  const { login } = useAuth();
  const [formData, setFormData] = useState<UserType>({
    id: 0,
    name: "",
    username: "",
    email: "",
    website: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getMaxId = () => {
    return users.reduce(
      (maxId, user) => (user.id > maxId ? user.id : maxId),
      0
    );
  };

  const isUsernameTaken = (username: string) => {
    return users.some((user) => user.username === username);
  };

  const handleSubmit = () => {
    const newUserId = getMaxId() + 1;
    const newUser = { ...formData, id: newUserId };
    if (isUsernameTaken(formData.username)) {
      Alert.alert("Zajęta nazwa użytkownika", "Wybierz inną.");
      return;
    }
    setUsers((prevUsers) => [...prevUsers, newUser]);
    login({
      id: newUserId,
      username: newUser.username,
      password: newUser.website,
    });

    navigation.goBack();
    setFormData({
      id: 0,
      name: "",
      username: "",
      email: "",
      website: "",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Rejestracja</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Imię:</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleChange("name", text)}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          value={formData.username}
          onChangeText={(text) => handleChange("username", text)}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Website (Password):</Text>
        <TextInput
          style={styles.input}
          value={formData.website}
          onChangeText={(text) => handleChange("website", text)}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Zarejestruj</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "20%",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 15,
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
});

export default RegisterScreen;
