import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { PhotoType } from "../../app/types/Photo.type";
import { UserType } from "../../app/types/User.type";
import { useApiContext } from "../../app/contexts/ApiContext";
import { useAuth } from "../../app/contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

const AlbumScreen: React.FC = () => {
  const route = useRoute();
  const { albumId } = route.params as { albumId: string };
  const { photos, albums, users, setPhotos } = useApiContext();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { user } = useAuth();
  const selectedAlbum = albums.find((album) => album.id === Number(albumId));

  if (!selectedAlbum) {
    return (
      <View>
        <Text>Album not found</Text>
      </View>
    );
  }

  const selectedAlbumPhotos = photos.filter(
    (photo) => photo.albumId === selectedAlbum.id
  );

  const albumOwner: UserType | undefined = users.find(
    (user) => user.id === selectedAlbum.userId
  );
  const isCurrentUserAlbum = albumOwner && albumOwner.id === user?.id;

  const handleFileChange = (uri: string) => {
    setSelectedFile(uri);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const newPhoto: PhotoType = {
      albumId: selectedAlbum.id,
      id: photos.length + 1,
      title: "New Photo",
      url: selectedFile,
      thumbnailUrl: selectedFile,
    };

    setPhotos([...photos, newPhoto]);
    setSelectedFile(null);
  };

  const renderItem = ({ item }: { item: PhotoType }) => (
    <Image source={{ uri: item.url }} style={styles.image} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text>
        Album Użytkownika: {albumOwner ? albumOwner.username : "Unknown User"}
      </Text>
      <Text>Nazwa albumu: {selectedAlbum.title}</Text>
      {isCurrentUserAlbum && (
        <View style={styles.uploadContainer}>
          <TouchableOpacity onPress={() => handleFileChange("path/to/image")}>
            <Text>Dodaj zdjęcie</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleUpload} disabled={!selectedFile}>
            <Text>Dodaj</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={selectedAlbumPhotos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.flatList}
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
  uploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 400,
    marginBottom: 10,
  },
  flatList: {
    marginTop: 10,
  },
});

export default AlbumScreen;
