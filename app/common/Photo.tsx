import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { PhotoType } from "../types/Photo.type";

interface Props {
  photo: PhotoType;
}

const Photo: React.FC<Props> = ({ photo }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: photo.thumbnailUrl }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    margin: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
});

export default Photo;
