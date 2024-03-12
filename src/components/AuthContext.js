// This provides a way to set the user, isLoggedIn, and 
// userMode data into the AuthContext for global use.
import React from "react";

const AuthContext = React.createContext();

export default AuthContext;
