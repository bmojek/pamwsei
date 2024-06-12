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
import Post from "../../app/common/Post";
import { MergedPostType } from "../../app/types/MergedPost.type";
import { UserType } from "../../app/types/User.type";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<NavTypes>>();
  const { photos, posts, users, comments, albums, todos } = useApiContext();
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

  const mergePostsUsers = () => {
    return posts.map((post) => {
      const user = users.find((u) => u.id === post.userId);
      const postComments = comments.filter(
        (comment) => comment.postId === post.id
      );
      return {
        ...post,
        user: user || ({} as UserType),
        comments: postComments || [],
      };
    });
  };

  const latestPosts = mergePostsUsers().slice(-50);

  const getAvatarUrl = (userId: number): string | undefined => {
    const userAlbum = albums.find((album) => album.userId === userId);
    if (userAlbum) {
      const userPhotos = photos.filter(
        (photo) => photo.albumId === userAlbum.id
      );
      if (userPhotos.length > 0) {
        return userPhotos[0].url;
      }
    }
    return undefined;
  };

  const getUniquePostsByUser = () => {
    const userPostsMap: Record<number, MergedPostType> = {};
    latestPosts.forEach((post) => {
      if (!userPostsMap[post.userId]) {
        userPostsMap[post.userId] = post;
      }
    });
    return Object.values(userPostsMap);
  };

  const uniquePostsByUser = getUniquePostsByUser().reverse();

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
            <Text style={styles.welcomeText}>Witaj {user.username}!</Text>
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
          <Text style={styles.textPhoto}>Najlepsze posty</Text>
          <Pressable onPress={() => navigation.navigate("PostScreen")}>
            {uniquePostsByUser.map((post, index) => (
              <Post
                key={index}
                post={post}
                avatarUrl={getAvatarUrl(post.userId)}
              ></Post>
            ))}
          </Pressable>
        </View>

        {user && (
          <Pressable onPress={() => navigation.navigate("TaskScreen")}>
            <View style={styles.postContainer}>
              <Text style={styles.textPhoto}>Zadania do zrobienia</Text>
              {todos.map(
                (todo, index) =>
                  todo.userId === user.id &&
                  todo.completed && (
                    <View key={index} style={styles.todoItem}>
                      <View style={styles.todoTextContainer}>
                        <Text style={styles.todoText}>{todo.title}</Text>
                      </View>
                      <Text style={styles.todoAlert}>Do zrobienia</Text>
                    </View>
                  )
              )}
            </View>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  todoAlert: {
    backgroundColor: "orange",
    padding: 8,
    color: "white",
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
  welcomeText: {
    flex: 1,
    marginTop: 13,
    color: "darkblue",
    alignSelf: "center",
  },
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
    marginTop: 60,
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
    textAlign: "center",
  },
  latestPostsTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  post: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    width: "90%",
  },
});

export default HomeScreen;
