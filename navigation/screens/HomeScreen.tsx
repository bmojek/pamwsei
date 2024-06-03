import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { NavTypes } from "../../app/types/NavTypes";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../app/contexts/AuthContext";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<NavTypes>>();
  const { logout, user } = useAuth();
  const handleButtonPress = (buttonTitle: string) => {
    switch (buttonTitle) {
      case "Posty":
        navigation.navigate("PostScreen");
        break;
      case "Galeria":
        navigation.navigate("GalleryScreen");
        break;
      case "Zadania":
        navigation.navigate("TaskScreen");
        break;
      case "Uzytkownicy":
        navigation.navigate("UserScreen");
        break;
      default:
        break;
    }
  };

  const handleLoginBtn = () => {
    navigation.navigate("LoginScreen");
  };

  const buttonTitles = ["Posty", "Galeria", "Zadania", "Uzytkownicy"];
  const buttonColors = ["#FF5733", "#338857", "#3357FF", "#FF33A8"];
  const buttonWidth = (Dimensions.get("window").width - 90) / 2;

  return (
    <SafeAreaView style={styles.container}>
      {user == undefined ? (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => handleLoginBtn()}
        >
          <Text style={styles.loginText}>Zaloguj się</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={() => logout()}>
          <Text style={styles.loginText}>Wyloguj się</Text>
        </TouchableOpacity>
      )}

      <View style={styles.buttonContainer}>
        {buttonTitles.map((title, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              { backgroundColor: buttonColors[index], width: buttonWidth },
            ]}
            onPress={() => handleButtonPress(title)}
          >
            <Text style={styles.buttonText}>{title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  loginButton: {
    position: "absolute",
    top: 50,
    right: 10,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  loginText: {
    color: "white",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 8,
    marginTop: 16,
  },
  button: {
    marginVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 50,
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
});

export default HomeScreen;
