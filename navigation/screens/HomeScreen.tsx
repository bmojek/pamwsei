import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { NavTypes } from "../../app/types/NavTypes";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../app/contexts/AuthContext";
import { useApiContext } from "../../app/contexts/ApiContext";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<NavTypes>>();
  const { photos } = useApiContext();
  const { logout, user } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % photos.slice(0, 10).length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [photos]);

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

  const handleRegisterBtn = () => {
    navigation.navigate("RegisterScreen");
  };

  const buttonTitles = ["Posty", "Galeria", "Zadania", "Uzytkownicy"];
  const buttonColors = ["#FF5733", "#338857", "#3357FF", "#FF33A8"];
  const buttonWidth = (Dimensions.get("window").width - 90) / 2;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {user == undefined ? (
          <>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLoginBtn}
            >
              <Text style={styles.loginText}>Zaloguj się</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegisterBtn}
            >
              <Text style={styles.loginText}>Rejestracja</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text>Witaj {user.username}!</Text>
            <TouchableOpacity style={styles.loginButton} onPress={logout}>
              <Text style={styles.loginText}>Wyloguj się</Text>
            </TouchableOpacity>
          </>
        )}

        <Pressable
          onPress={() =>
            setCurrentIndex((prevIndex) => (prevIndex < 9 ? prevIndex + 1 : 0))
          }
          style={styles.photoContainer}
        >
          <Text style={styles.textPhoto}>Najnowsze zdjęcia</Text>
          {photos.length > 0 && (
            <Image
              source={{ uri: photos[currentIndex].url }}
              style={styles.photo}
            />
          )}
        </Pressable>
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
        <View style={styles.postContainer}>
          <Text>Najlepsze posty</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  registerButton: {
    position: "absolute",
    top: 0,
    left: 10,
    padding: 10,
    backgroundColor: "#F05700",
    borderRadius: 5,
  },
  postContainer: {
    paddingTop: 10,
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  loginButton: {
    position: "absolute",
    top: 0,
    right: 10,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  loginText: {
    color: "white",
    fontSize: 16,
  },
  photoContainer: {
    marginTop: 80,
    marginBottom: 10,
    width: Dimensions.get("window").width - 60,
    height: 300,
    marginHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
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
  textPhoto: {
    fontSize: 20,
    paddingVertical: 10,
  },
});

export default HomeScreen;
