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
  sendPasswordResetEmail
} from "firebase/auth";
import app from "../firebase/firebase.config";

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get API base URL
  const getApiBaseUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth State Changed:", currentUser);

      if (currentUser) {
        // When user logs in, ensure they exist in MongoDB
        try {
          console.log("Ensuring user exists in MongoDB:", currentUser.email);
          const mongoUserData = await ensureUserInMongoDB(currentUser);
          console.log("MongoDB user data:", mongoUserData);
          setMongoUser(mongoUserData);
        } catch (error) {
          console.error("Failed to ensure user in MongoDB:", error);
          setMongoUser(null);
        }
      } else {
        setMongoUser(null);
      }

      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fixed ensureUserInMongoDB function
  const ensureUserInMongoDB = async (firebaseUser) => {
    try {
      console.log("Checking if user exists in MongoDB:", firebaseUser.email);

      const apiBaseUrl = getApiBaseUrl();

      // First, try to get the user
      const checkResponse = await fetch(`${apiBaseUrl}/users/${firebaseUser.email}`);

      if (checkResponse.status === 404) {
        // User doesn't exist in MongoDB, create them
        console.log("User not found in MongoDB, creating now...");

        const mongoUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photoURL: firebaseUser.photoURL || '',
          role: 'customer',
          createdAt: new Date(),
          lastLogin: new Date(),
          profile: {
            phone: "",
            address: "",
            bio: ""
          }
        };

        console.log("Creating user in MongoDB with data:", mongoUserData);

        const createResponse = await fetch(`${apiBaseUrl}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mongoUserData)
        });

        if (!createResponse.ok) {
          const errorData = await createResponse.json().catch(() => ({ error: 'Unknown error' }));
          console.error("Failed to create user in MongoDB:", errorData);
          throw new Error(`Failed to create user profile: ${errorData.error}`);
        }

        const result = await createResponse.json();
        console.log("User successfully created in MongoDB:", result);
        return result.user || result;

      } else if (checkResponse.ok) {
        // User exists, update last login
        const userData = await checkResponse.json();
        console.log("User already exists in MongoDB:", userData);

        // Update last login using PATCH
        const updateResponse = await fetch(`${apiBaseUrl}/users/${firebaseUser.email}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lastLogin: new Date(),
            displayName: firebaseUser.displayName || userData.displayName,
            photoURL: firebaseUser.photoURL || userData.photoURL
          })
        });

        if (updateResponse.ok) {
          const updatedUser = await updateResponse.json();
          console.log("User updated successfully:", updatedUser);
          return updatedUser.user || updatedUser;
        } else {
          console.warn("Failed to update user last login, but user exists");
          return userData;
        }
      } else {
        const errorText = await checkResponse.text();
        console.error("Unexpected response from MongoDB:", checkResponse.status, errorText);
        throw new Error(`Unexpected response: ${checkResponse.status}`);
      }
    } catch (error) {
      console.error("MongoDB operation failed:", error);
      throw error;
    }
  };

  const register = async (email, password, name, photoURL) => {
    setLoading(true);
    try {
      console.log("Register attempt:", { email, name });

      // Validate inputs
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      if (password.length < 6) {
        throw new Error("Password should be at least 6 characters");
      }

      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Firebase user created:", user);

      // Safe profile update - handle photo URL carefully
      const profileData = {
        displayName: name || ''
      };

      // Only add photoURL if it's not empty and reasonably sized
      if (photoURL && photoURL.length > 0 && photoURL.length < 2000) {
        profileData.photoURL = photoURL;
        console.log("Setting photo URL, length:", photoURL.length);
      } else {
        console.log("Photo URL too long, empty, or invalid. Skipping. Length:", photoURL?.length || 0);
        profileData.photoURL = ""; // Safe empty string
      }

      // Update profile with safe data
      await updateProfile(user, profileData);
      console.log("Firebase profile updated successfully");

      const apiBaseUrl = getApiBaseUrl();

      // Create user in MongoDB - use the actual photoURL from Firebase user
      const mongoUserData = {
        uid: user.uid,
        email: user.email,
        displayName: name || '',
        photoURL: user.photoURL || photoURL || '', // Use Firebase's processed URL
        role: 'customer',
        createdAt: new Date(),
        lastLogin: new Date(),
        profile: {
          phone: "",
          address: "",
          bio: ""
        }
      };

      console.log("Creating user in MongoDB:", mongoUserData);

      const response = await fetch(`${apiBaseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mongoUserData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error("Failed to create user in MongoDB:", errorData);
        throw new Error("Failed to create user profile");
      }

      const result = await response.json();
      console.log("User successfully created in MongoDB");
      setMongoUser(result.user || result);
      setUser(user);
      setLoading(false);

      return {
        user: user,
        fullPhotoURL: user.photoURL // Return the actual Firebase photo URL
      };
    } catch (error) {
      console.error("Registration error:", error);
      setLoading(false);

      let errorMessage = "Registration failed. Please try again.";

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "This email is already registered. Please sign in instead.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address format.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak. Please use a stronger password.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "Email/password accounts are not enabled. Please contact support.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network error. Please check your internet connection.";
          break;
        case 'auth/invalid-profile-attribute':
          errorMessage = "Profile photo is too large. Please try without a photo or use a smaller image.";
          break;
        default:
          errorMessage = error.message || "Registration failed. Please try again.";
      }

      throw new Error(errorMessage);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log("Login attempt:", { email });

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log("Firebase login successful:", firebaseUser);

      // Ensure user exists in MongoDB
      const mongoUserData = await ensureUserInMongoDB(firebaseUser);
      console.log("MongoDB user after login:", mongoUserData);

      setUser(firebaseUser);
      setMongoUser(mongoUserData);
      setLoading(false);
      return firebaseUser;
    } catch (error) {
      console.error("Login error details:", error);
      setLoading(false);

      let errorMessage = "Login failed. Please try again.";

      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "Invalid email address format.";
          break;
        case 'auth/user-disabled':
          errorMessage = "This account has been disabled.";
          break;
        case 'auth/user-not-found':
          errorMessage = "No account found with this email. Please check your email or register first.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password. Please try again or reset your password.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network error. Please check your internet connection.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later or reset your password.";
          break;
        case 'auth/invalid-credential':
          errorMessage = "Invalid email or password. Please check your credentials or register first.";
          break;
        default:
          errorMessage = error.message || "Login failed. Please try again.";
      }

      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (email) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      throw new Error("Failed to send password reset email. Please try again.");
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      console.log("Google login attempt");
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;
      console.log("Google login successful:", googleUser);

      // Ensure user exists in MongoDB
      const mongoUserData = await ensureUserInMongoDB(googleUser);
      setMongoUser(mongoUserData);

      setUser(googleUser);
      setLoading(false);
      return googleUser;
    } catch (error) {
      console.error("Google login error:", error);
      setLoading(false);

      let errorMessage = "Google sign-in failed. Please try again.";

      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = "Sign-in was cancelled.";
          break;
        case 'auth/popup-blocked':
          errorMessage = "Popup was blocked. Please allow popups for this site.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network error. Please check your internet connection.";
          break;
        case 'auth/unauthorized-domain':
          errorMessage = "This domain is not authorized for Google sign-in.";
          break;
        default:
          errorMessage = error.message || "Google sign-in failed. Please try again.";
      }

      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      console.log("Logout attempt");
      await signOut(auth);
      setUser(null);
      setMongoUser(null);
      setLoading(false);
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      setLoading(false);
      throw new Error("Logout failed. Please try again.");
    }
  };

  // Function to update MongoDB user data
  const updateMongoUser = async (updates) => {
    try {
      if (!user?.email) {
        throw new Error("No user logged in");
      }

      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/users/${user.email}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`Failed to update user profile: ${errorData.error}`);
      }

      const updatedUser = await response.json();
      setMongoUser(updatedUser.user || updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating MongoDB user:", error);
      throw error;
    }
  };

  const authInfo = {
    user,
    mongoUser,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateMongoUser
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;