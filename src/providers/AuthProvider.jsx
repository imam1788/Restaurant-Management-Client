import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import app from "../firebase/firebase.config";

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = (email, password, name, photoURL) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password).then(
      (result) => {
        return updateProfile(result.user, {
          displayName: name,
          photoURL: photoURL,
        }).then(() => {
          setUser({ ...result.user, displayName: name, photoURL: photoURL });
          setLoading(false);
          return result.user;
        });
      }
    );
  };

  const login = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password).finally(() =>
      setLoading(false)
    );
  };

  const loginWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider).finally(() =>
      setLoading(false)
    );
  };

  const logout = () => {
    setLoading(true);
    return signOut(auth).finally(() => setLoading(false));
  };

  const authInfo = {
    user,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
