import React, { FC, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { UserType } from "../types/User.type";
import { PostType } from "../types/Post.type";
import { CommentType } from "../types/Comment.type";
import { useAuth } from "../contexts/AuthContext";
import { useApiContext } from "../contexts/ApiContext";

type MergedPostType = PostType & { user: UserType; comments: CommentType[] };

interface PostProps {
  post: MergedPostType;
  avatarUrl: string | undefined;
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
}

const Post: FC<PostProps> = ({ post, setComments, avatarUrl }) => {
  const { user } = useAuth();
  const [showAllComments, setShowAllComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { users } = useApiContext();
  const foundUser = users.find((u) => u.username === user?.username);

  const toggleComments = () => {
    setShowAllComments(!showAllComments);
  };

  const allComments = post.comments.slice().reverse();
  const visibleComments = showAllComments
    ? allComments
    : allComments.slice(0, 2);

  const handleAddComment = () => {
    const newCommentData: CommentType = {
      postId: post.id,
      id: post.comments.length + 1,
      name: user?.username,
      email: foundUser?.email || "/",
      body: newComment,
    };

    setComments((prevComments) => [...prevComments, newCommentData]);
    setNewComment("");
  };

  return (
    <View style={styles.post}>
      <Image
        source={{
          uri: avatarUrl ? avatarUrl : "https://via.placeholder.com/600/f1a745",
        }}
        style={styles.avatar}
      />
      <Text style={styles.username}>{post.user.username}</Text>
      <Text style={styles.body}>{post.body}</Text>

      {/* Comment Section */}
      <View style={styles.commentSection}>
        {/* Render visible comments */}
        {visibleComments.map((comment) => (
          <View style={styles.comment} key={comment.id}>
            <Text style={styles.commentEmail}>{comment.email}</Text>
            <Text>{comment.body}</Text>
          </View>
        ))}

        {/* Toggle comments button */}
        {post.comments.length > 2 && (
          <TouchableOpacity onPress={toggleComments}>
            <Text>
              {showAllComments
                ? "Ukryj komentarze"
                : "Pokaż wszystkie komentarze"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Comment Input */}
        <TextInput
          placeholder="Dodaj komentarz"
          value={newComment}
          onChangeText={setNewComment}
          style={styles.commentInput}
          onSubmitEditing={handleAddComment}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  post: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  body: {
    marginBottom: 10,
  },
  commentSection: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
    marginTop: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  comment: {
    marginBottom: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  commentEmail: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default Post;
