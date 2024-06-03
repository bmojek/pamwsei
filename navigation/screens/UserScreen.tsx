import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Dimensions,
  ListRenderItem,
  SafeAreaView,
} from "react-native";
import { useApiContext } from "../../app/contexts/ApiContext";
import { UserType } from "../../app/types/User.type";

function UserScreen() {
  const { users } = useApiContext();

  const renderItem: ListRenderItem<UserType> = ({ item }) => (
    <View style={styles.userContainer}>
      <Text>{item.username}</Text>
      <Text>{item.name}</Text>
      <Text>Email: {item.email}</Text>
      <Text>{item.website}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Użytkownicy </Text>
      <FlatList
        data={users}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        numColumns={1}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 25,
    paddingVertical: 2,
  },

  container: {
    backgroundColor: "white",
    color: "white",
  },
  userContainer: {
    backgroundColor: "#f0f0f0",
    opacity: 0.7,
    padding: 10,
    margin: 10,
    borderRadius: 13,
  },
});

export default UserScreen;
