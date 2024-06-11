import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Post from "../../app/common/Post";
import { PostType } from "../../app/types/Post.type";
import { useAuth } from "../../app/contexts/AuthContext";
import { useApiContext } from "../../app/contexts/ApiContext";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MergedPostType } from "../../app/types/MergedPost.type";
import { UserType } from "../../app/types/User.type";
import { NavTypes } from "../../app/types/NavTypes";
import { SafeAreaView } from "react-native-safe-area-context";

const Posts = () => {
  const { setComments, posts, setPosts, users, comments, photos, albums } =
    useApiContext();
  const [inputValue, setInputValue] = useState("");
  const [mergePostsUsersComment, setMergePostsUsersComment] = useState<
    MergedPostType[]
  >([]);
  const [visiblePosts, setVisiblePosts] = useState(10);
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<NavTypes>>();

  useEffect(() => {
    const mergePostsUsers = (): MergedPostType[] => {
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
    setMergePostsUsersComment(mergePostsUsers().reverse());
  }, [posts, users, comments]);

  const getMaxId = () => {
    return posts.reduce(
      (maxId, post) => (post.id > maxId ? post.id : maxId),
      0
    );
  };

  const handleOnSubmit = (value: string) => {
    const newPost: PostType = {
      userId: user?.id || NaN,
      id: (getMaxId() || 0) + 1,
      body: value,
      title: "Title",
    };
    setPosts((posts) => [...posts, newPost]);
    setInputValue("");
  };

  const postsWithUsers = mergePostsUsersComment;

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

  return (
    <SafeAreaView style={styles.container}>
      {!user ? (
        <SafeAreaView>
          <Text style={styles.loginPrompt}>
            Zaloguj się żeby zobaczyć Posty
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("LoginScreen")}
          >
            <Text style={styles.buttonText}>Logowanie</Text>
          </TouchableOpacity>
        </SafeAreaView>
      ) : (
        <View>
          <View style={styles.addPost}>
            <Text style={styles.addPostTitle}>Dodaj post</Text>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Dodaj wpis"
              onSubmitEditing={() => inputValue && handleOnSubmit(inputValue)}
            />
          </View>
          <ScrollView style={styles.postsContainer}>
            {posts.length === 1 ? (
              <Text>LOADING ....</Text>
            ) : (
              postsWithUsers
                .slice(0, visiblePosts)
                .map((post) => (
                  <Post
                    key={post.id}
                    post={post}
                    avatarUrl={getAvatarUrl(post.userId)}
                    setComments={(comments) => setComments(comments || [])}
                  />
                ))
            )}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
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
  addPost: {
    marginBottom: 20,
  },
  addPostTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 10,
    padding: 8,
  },
  postsContainer: {
    marginBottom: 20,
  },
});

export default Posts;
