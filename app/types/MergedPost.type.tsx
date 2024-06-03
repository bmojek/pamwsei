import { CommentType } from "./Comment.type";
import { PostType } from "./Post.type";
import { UserType } from "./User.type";

export type MergedPostType = PostType & {
  user: UserType;
  comments: CommentType[];
};
