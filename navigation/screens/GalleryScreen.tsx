import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useApiContext } from "../../app/contexts/ApiContext";
import Album from "../../app/common/Album";
import { useAuth } from "../../app/contexts/AuthContext";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { NavTypes } from "../../app/types/NavTypes";

export const Gallery: React.FC = () => {
  const { photos, albums, setAlbums } = useApiContext();
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<NavTypes>>();
  const [inputAlbum, setInputAlbum] = useState("");
  const [showUserAlbums, setShowUserAlbums] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const userAlbums = albums.filter((album) => album.userId === user?.id);

  const photosByAlbumId = userAlbums.map((album) => ({
    album,
    photos: photos.filter((photo) => photo.albumId === album.id),
  }));

  const handleMyAlbums = (myAlbum: boolean) => {
    setShowUserAlbums(myAlbum);
  };

  const handleAddAlbum = () => {
    if (user && inputAlbum !== "") {
      const newAlbums = [
        ...albums,
        { id: albums.length + 1, title: inputAlbum, userId: user.id },
      ];
      setShowAddButton(false);
      setAlbums(newAlbums);
      setInputAlbum("");
    } else {
      console.error("User is not defined. Unable to add album.");
    }
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
      <Text style={styles.title}>Albumy</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleMyAlbums(true)}
        >
          <Text style={styles.buttonText}>Moje Albumy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleMyAlbums(false)}
        >
          <Text style={styles.buttonText}>Wszystkie Albumy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowAddButton(!showAddButton)}
        >
          <Text style={styles.buttonText}>Dodaj album</Text>
        </TouchableOpacity>
      </View>
      {showAddButton && (
        <View style={styles.addAlbum}>
          <TextInput
            style={styles.input}
            value={inputAlbum}
            onChangeText={(text) => setInputAlbum(text)}
            placeholder="Podaj nazwę albumu"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddAlbum}>
            <Text style={styles.addButtonText}>Dodaj</Text>
          </TouchableOpacity>
        </View>
      )}
      {showUserAlbums ? (
        <FlatList
          data={photosByAlbumId}
          keyExtractor={(item) => item.album.id.toString()}
          renderItem={({ item }) => (
            <Album album={item.album} photos={item.photos} />
          )}
        />
      ) : (
        <FlatList
          data={albums}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Album
              album={item}
              photos={photos.filter((photo) => photo.albumId === item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
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
  addAlbum: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
  },
});

export default Gallery;
