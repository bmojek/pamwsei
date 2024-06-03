import React from "react";
import MainContainer from "./navigation/MainContainer";
import { ApiProvider } from "./app/contexts/ApiContext";
import { AuthProvider } from "./app/contexts/AuthContext";
const App = () => {
  return (
    <ApiProvider>
      <AuthProvider>
        <MainContainer />
      </AuthProvider>
    </ApiProvider>
  );
};

export default App;
