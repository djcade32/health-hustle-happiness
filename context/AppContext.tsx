"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { filters, tabs } from "@/enums";
import { GlobalFiltersType, UserType } from "@/types";
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDB } from "@/lib/firebase";

type AppContextType = {
  setSelectedTab(name: string): void;
  selectedTab: string;
  globalFilters: GlobalFiltersType;
  isDarkMode: boolean;
  toggleDarkMode(): void;
  user: UserType | null;
  createAccount: (email: string, password: string, fullName: string) => Promise<void>;
  signUserOut: () => void;
  signUserIn: (email: string, password: string) => Promise<string>;
  createUserWithGoogle: () => void;
  signInWithGoogle: () => void;
  sendPasswordReset: (email: string) => Promise<void>;
  sendVerificationEmail: (currentUser: User) => Promise<void>;
  auth: any;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;
  likeArticle: (articleId: string, action: string) => void;
  bookmarkArticle: (articleId: string, action: string) => void;
};
const AppContext = createContext({} as AppContextType);
const auth = getFirebaseAuth();
const db = getFirebaseDB();

export const AppContextProvider = ({ children }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [globalFilters, setGlobalFilters] = useState<GlobalFiltersType>({
    tabFilter: filters.ALL,
    otherFilters: [],
  });
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);

  useEffect(() => {
    if (!auth || !db) return console.log("ERROR: There was a problem getting current user.");
    onAuthStateChanged(auth, async () => {
      if (!auth.currentUser?.emailVerified) return console.log("ERROR: User is not verified.");
      if (auth.currentUser) {
        const docRef = doc(db, `users/${auth.currentUser.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const { id, email, fullName } = docSnap.data();
          const currentUser: UserType = { id, email, fullName };
          setUser(currentUser);
        } else {
          // Adding user to DB if they don't exist
          const { uid, email, displayName } = auth.currentUser;
          const user: UserType = {
            id: uid,
            email: email!,
            fullName: displayName!,
          };
          addUserToDB(user);
          setUser(user);
        }
      }
    });
    setLoading(false);
  }, []);

  // Set dark mode from local storage
  useEffect(() => {
    const isDarkMode = localStorage.getItem("isDarkMode");
    if (isDarkMode === "true") {
      setIsDarkMode(true);
    }
  }, []);

  // Update global filters when selected tab changes
  useEffect(() => {
    if (selectedTab.toLowerCase() === globalFilters.tabFilter) return;

    console.log("updating global filters");
    switch (selectedTab) {
      case tabs.ALL:
        setGlobalFilters({ otherFilters: [], tabFilter: filters.ALL });
        break;
      case tabs.PHYSICAL_FITNESS:
        setGlobalFilters({ otherFilters: [], tabFilter: filters.PHYSICAL_FITNESS });
        break;
      case tabs.PERSONAL_FINANCE:
        setGlobalFilters({ otherFilters: [], tabFilter: filters.PERSONAL_FINANCE });
        break;
      case tabs.MENTAL_HEALTH:
        setGlobalFilters({ otherFilters: [], tabFilter: filters.MENTAL_HEALTH });
        break;
      default:
        setGlobalFilters({ otherFilters: [], tabFilter: filters.ALL });
        break;
    }
  }, [selectedTab]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("isDarkMode", !isDarkMode);
  };

  const createAccount = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<void> => {
    console.log("Creating new account");
    if (!auth) return console.log("ERROR: There was a problem getting Firebase auth.");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      updateProfile(userCredential.user!, { displayName: fullName });
      return await sendVerificationEmail(userCredential.user);
    } catch (error) {
      console.log("ERROR: There was a problem creating new account: ", error);
    }
  };

  const addUserToDB = async (user: UserType) => {
    console.log("Adding user to DB");
    try {
      if (!db) return;
      const usersDoc = doc(db, `users/${user.id}`);
      await setDoc(usersDoc, user);

      // addDoc(collection(db, "users"), user);
    } catch (error) {
      console.log("ERROR: There was a problem adding user to DB.");
      console.log(error);
    }
  };

  const signUserOut = () => {
    if (!auth) return console.log("ERROR: There was a problem getting Firebase auth to sign out.");
    setUser(null);
    signOut(auth);
  };

  const signUserIn = async (email: string, password: string): Promise<string> => {
    if (!auth || !db) {
      console.log(
        "ERROR: There was a problem getting Firebase auth to sign in or connecting to DB."
      );
      return new Promise((resolve, reject) =>
        reject("There was a problem getting Firebase auth to sign user in or connecting to DB.")
      );
    }

    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const { uid, displayName, emailVerified } = userCredentials.user;
      if (!emailVerified) {
        console.log("User is not verified.");
        return new Promise((resolve, reject) => reject("User is not verified"));
      }
      const user: UserType = {
        id: uid,
        email,
        fullName: displayName!,
      };

      setUser(user);
      addUserToDB(user);
      return new Promise((resolve) => resolve("User signed in"));
    } catch (error: any) {
      console.log("ERROR: There was a problem signing user in: ", error.code);
      if (error.code === "auth/invalid-credential") {
        return new Promise((resolve, reject) => reject("User not found"));
      } else if (error.code === "auth/too-many-requests") {
        return new Promise((resolve, reject) => reject("Too many requests"));
      } else {
        return new Promise((resolve, reject) => reject("There was a problem signing user in"));
      }
    }
  };

  // Create user with Google authentication
  const createUserWithGoogle = async () => {
    if (!auth)
      return console.log(
        "ERROR: There was a problem getting Firebase auth to create new user with google auth."
      );
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      const { uid, email, displayName } = userCredential.user;
      const user: UserType = {
        id: uid,
        email: email ?? "",
        fullName: displayName ?? "",
      };

      setUser(user);
      addUserToDB(user);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const signInWithGoogle = async () => {
    if (!auth)
      return console.log(
        "ERROR: There was a problem getting Firebase auth to sign in with Google."
      );
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    if (!auth)
      return console.log(
        "ERROR: There was a problem getting Firebase auth to send password reset email."
      );
    try {
      return await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.log("ERROR: There was a problem sending password reset email: ", error);
    }
  };

  const sendVerificationEmail = async (currentUser: User) => {
    if (!auth)
      return console.log(
        "ERROR: There was a problem getting Firebase auth to send verification email."
      );
    try {
      await sendEmailVerification(currentUser);
    } catch (error) {
      console.log("ERROR: There was a problem sending verification email: ", error);
    }
  };

  const likeArticle = async (articleId: string, action: string) => {
    if (!db || !user) return console.log("ERROR: There was a problem liking article.");
    try {
      const createQuery = query(collection(db, "articles"), where("id", "==", articleId));
      const querySnapshot = await getDocs(createQuery);
      querySnapshot.forEach(async (doc) => {
        if (action === "unlike") {
          await updateDoc(doc.ref, {
            ...doc.data(),
            usersLikes: doc.data().usersLikes.filter((userId: string) => userId !== user.id),
          });
          return;
        }
        await updateDoc(doc.ref, {
          ...doc.data(),
          usersLikes: [...doc.data().usersLikes, user.id],
        });
      });
      console.log(`Article ${articleId} ${action === "unlike" ? "unliked" : "liked"}`);
    } catch (error) {
      console.log("ERROR: There was a problem liking article: ", error);
    }
  };

  const bookmarkArticle = async (articleId: string, action: string) => {
    if (!db || !user) return console.log("ERROR: There was a problem bookmarking article.");
    try {
      const createQuery = query(collection(db, "articles"), where("id", "==", articleId));
      const querySnapshot = await getDocs(createQuery);
      querySnapshot.forEach(async (doc) => {
        if (action === "unbookmark") {
          await updateDoc(doc.ref, {
            ...doc.data(),
            usersBookmarks: doc
              .data()
              .usersBookmarks.filter((userId: string) => userId !== user.id),
          });
          return;
        }
        await updateDoc(doc.ref, {
          ...doc.data(),
          usersBookmarks: [...doc.data().usersBookmarks, user.id],
        });
      });
      console.log(
        `Article ${articleId} ${action === "unbookmark" ? "unbookmarked" : "bookmarked"}`
      );
    } catch (error) {
      console.log("ERROR: There was a problem bookmarking article: ", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        auth,
        isDarkMode,
        toggleDarkMode,
        globalFilters,
        selectedTab,
        setSelectedTab,
        user,
        createAccount,
        signUserOut,
        signUserIn,
        createUserWithGoogle,
        signInWithGoogle,
        sendPasswordReset,
        sendVerificationEmail,
        showOnboardingModal,
        setShowOnboardingModal,
        likeArticle,
        bookmarkArticle,
      }}
    >
      {!loading ? children : <></>}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

export const useAppContext = () => useContext(AppContext);
