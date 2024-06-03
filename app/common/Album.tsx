import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AlbumType } from "../types/Album.type";
import { PhotoType } from "../types/Photo.type";
import Photo from "./Photo";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { NavTypes } from "../types/NavTypes";

interface AlbumProps {
  album: AlbumType;
  photos: PhotoType[];
}

const Album: React.FC<AlbumProps> = ({ album, photos }) => {
  const navigation = useNavigation<NavigationProp<NavTypes>>();

  const handleOnClick = () => {
    navigation.navigate("AlbumScreen", { albumId: album.id });
  };

  return (
    <TouchableOpacity onPress={handleOnClick} style={styles.albumContainer}>
      <View style={styles.albumContent}>
        <Text style={styles.albumTitle}>{album.title}</Text>
        <View style={styles.photosContainer}>
          {photos.slice(0, 6).map((photo: PhotoType, index) => (
            <Photo key={index} photo={photo} />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  albumContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  albumContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  albumTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});

export default Album;
