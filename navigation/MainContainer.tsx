import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import GalleryScreen from "./screens/GalleryScreen";
import PostScreen from "./screens/PostScreen";
import TaskScreen from "./screens/TaskScreen";
import UserScreen from "./screens/UserScreen";
import LoginScreen from "./screens/LoginScreen";
import { NavTypes } from "../app/types/NavTypes";
import AlbumScreen from "./screens/AlbumScreen";
import RegisterScreen from "./screens/RegisterScreen";
const Stack = createStackNavigator<NavTypes>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="GalleryScreen" component={GalleryScreen} />
        <Stack.Screen name="PostScreen" component={PostScreen} />
        <Stack.Screen name="TaskScreen" component={TaskScreen} />
        <Stack.Screen name="UserScreen" component={UserScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="AlbumScreen" component={AlbumScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
