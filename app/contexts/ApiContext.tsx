import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { UserType } from "../types/User.type";
import { PostType } from "../types/Post.type";
import { CommentType } from "../types/Comment.type";
import { PhotoType } from "../types/Photo.type";
import { AlbumType } from "../types/Album.type";
import { ToDoType } from "../types/Todo.type";

interface ApiContextProps {
  users?: UserType[];
  setUsers?: React.Dispatch<React.SetStateAction<UserType[]>>;
  posts?: PostType[];
  setComments?: React.Dispatch<React.SetStateAction<CommentType[]>>;
  setPosts?: React.Dispatch<React.SetStateAction<PostType[]>>;
  comments?: CommentType[];
  photos?: PhotoType[];
  albums?: AlbumType[];
  todos?: ToDoType[];
  setTodos?: React.Dispatch<React.SetStateAction<ToDoType[]>>;
  setAlbums?: React.Dispatch<React.SetStateAction<AlbumType[]>>;
  setPhotos?: React.Dispatch<React.SetStateAction<PhotoType[]>>;
}

const ApiContext = createContext<ApiContextProps>({});
export const ApiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [todos, setTodos] = useState<ToDoType[]>([]);

  useEffect(() => {
    const newuser: UserType = {
      id: 11,
      name: "admin",
      email: "admin@gmail.com",
      website: "admin",
      username: "admin",
    };

    const fetchData = async () => {
      try {
        const usersResponse = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const usersJson = await usersResponse.json();
        setUsers([...usersJson, newuser]);

        const postsResponse = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );
        const postsJson = await postsResponse.json();
        setPosts(postsJson);

        const commentsResponse = await fetch(
          "https://jsonplaceholder.typicode.com/comments"
        );
        const commentsJson = await commentsResponse.json();
        setComments(commentsJson);
        const photoResponse = await fetch(
          "https://jsonplaceholder.typicode.com/photos"
        );
        const photoJson = await photoResponse.json();
        setPhotos(photoJson);
        const albumResponse = await fetch(
          "https://jsonplaceholder.typicode.com/albums"
        );
        const albumJson = await albumResponse.json();
        setAlbums(albumJson);
        const todoResponse = await fetch(
          "https://jsonplaceholder.typicode.com/todos"
        );
        const todoJson = await todoResponse.json();
        setTodos(todoJson);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <ApiContext.Provider
      value={{
        users,
        setUsers,
        posts,
        setComments,
        setPosts,
        comments,
        photos,
        albums,
        todos,
        setTodos,
        setAlbums,
        setPhotos,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export function useApiContext() {
  const {
    users,
    setUsers,
    posts,
    setComments,
    setPosts,
    comments,
    photos,
    albums,
    todos,
    setTodos,
    setAlbums,
    setPhotos,
  } = useContext(ApiContext) || {};
  if (
    !users ||
    !posts ||
    !setPosts ||
    !setComments ||
    !comments ||
    !photos ||
    !albums ||
    !setUsers ||
    !todos ||
    !setTodos ||
    !setAlbums ||
    !setPhotos
  ) {
    throw new Error("u have to wrap by ApiProvider");
  }
  return {
    users,
    setUsers,
    posts,
    setComments,
    setPosts,
    comments,
    photos,
    albums,
    todos,
    setTodos,
    setAlbums,
    setPhotos,
  };
}

export default ApiContext;
