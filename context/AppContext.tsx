"use client";

import { createContext, useState, useContext, useEffect, use } from "react";
import { filters, tabs } from "@/enums";
import { GlobalFiltersType, UserType } from "@/types";
import {
  Auth,
  EmailAuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  getRedirectResult,
  linkWithPopup,
  linkWithRedirect,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDB } from "@/lib/firebase";
import { Spin } from "antd";
import { calculateDaysBetweenDates, formatNumberToTwoDecimalPlaces } from "@/utils";
import { useRouter, usePathname } from "next/navigation";

type AppContextType = {
  setSelectedTab(name: string): void;
  selectedTab: string;
  globalFilters: GlobalFiltersType;
  isDarkMode: boolean;
  toggleDarkMode(): void;
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  createAccount: (email: string, password: string, fullName: string) => Promise<void>;
  signUserOut: () => void;
  signUserIn: (email: string, password: string) => Promise<string>;
  createUserWithGoogle: () => void;
  signInWithGoogle: () => void;
  sendPasswordReset: (email: string) => Promise<void>;
  sendVerificationEmail: (currentUser: User) => Promise<void>;
  auth: Auth | undefined;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;
  likeArticle: (articleId: string, action: string) => void;
  bookmarkArticle: (articleId: string, action: string) => void;
  incrementNumViews: (articleId: string) => void;
  addUserToRecentlyViewed: (articleId: string) => void;
  showShareModal: boolean;
  setShowShareModal: (show: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: any;
  setShowAboutUsModal: (show: boolean) => void;
  showAboutUsModal: boolean;
  showProfileScreen: boolean;
  setShowProfileScreen: (show: boolean) => void;
  updateUser: (user: UserType) => void;
  deleteUserFromDB: (user: UserType) => Promise<boolean>;
  handleReauthenticate: (userPassword: string) => Promise<boolean>;
  addAnotherMethodOfAuthentication: (
    authProviderSelected: string
  ) => Promise<{ success: boolean; message: string }>;
};
const AppContext = createContext({} as AppContextType);
const auth = getFirebaseAuth();
const db = getFirebaseDB();

export const AppContextProvider = ({ children }: any) => {
  const router = useRouter();
  const pathname = usePathname();
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
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showAboutUsModal, setShowAboutUsModal] = useState<boolean>(false);
  const [showProfileScreen, setShowProfileScreen] = useState<boolean>(false);

  useEffect(() => {
    if (!auth || !db) {
      router.push("/dashboard");
      return console.log("ERROR: There was a problem getting current user.");
    }
    onAuthStateChanged(auth, async () => {
      if (!auth.currentUser?.emailVerified) {
        console.log("User is not verified.");
        setLoading(false);
      }
      if (auth.currentUser) {
        const docRef = doc(db, `users/${auth.currentUser.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const { id, email, fullName } = docSnap.data();
          const currentUser: UserType = { id, email, fullName };
          setUser(currentUser);
          console.log("User is logged in");
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
          console.log("User is logged in and added to db");
        }
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (pathname === "/") {
      setSelectedTab("All");
    } else if (pathname === "/profile") {
      setSelectedTab("Profile");
    }
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

    console.log("updating global filters: ", selectedTab);
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
      case tabs.BOOKMARKS:
        setGlobalFilters({ otherFilters: [], tabFilter: filters.BOOKMARKS });
        break;
      case tabs.MOST_LIKED:
        setGlobalFilters({ otherFilters: [], tabFilter: filters.MOST_LIKED });
        break;
      case tabs.POPULAR:
        setGlobalFilters({ otherFilters: [], tabFilter: filters.POPULAR });
        break;
      case tabs.RECENTLY_VIEWED:
        setGlobalFilters({ otherFilters: [], tabFilter: filters.RECENTLY_VIEWED });
        break;
      default:
        setGlobalFilters({ otherFilters: [], tabFilter: null });
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

  // Update user in DB
  const updateUser = async (user: UserType) => {
    if (!db) return console.log("ERROR: There was a problem updating user.");
    try {
      const docRef = doc(db, `users/${user.id}`);
      await updateDoc(docRef, user);
    } catch (error) {
      console.log("ERROR: There was a problem updating user: ", error);
    }
  };

  // Delete user from DB
  const deleteUserFromDB = async (user: UserType): Promise<boolean> => {
    if (!db || !auth?.currentUser) return new Promise((resolve, reject) => reject(false));
    try {
      const docRef = doc(db, `users/${user.id}`);
      await deleteDoc(docRef);
      console.log("User deleted from DB");
    } catch (error) {
      console.log("ERROR: There was a problem deleting user from DB: ", error);
      return new Promise((resolve, reject) => reject(false));
    }

    try {
      deleteUser(auth.currentUser);
      console.log("User deleted from authentication");
      return new Promise((resolve, reject) => resolve(true));
    } catch (error) {
      console.log("ERROR: There was a problem deleting user from authentication: ", error);
      return new Promise((resolve, reject) => reject(false));
    }
  };

  const handleReauthenticate = async (userPassword: string): Promise<boolean> => {
    if (!auth?.currentUser || !auth.currentUser.email) {
      console.log("ERROR: There was a problem reauthenticating user.");
      return new Promise((resolve) => resolve(false));
    }
    const credential = EmailAuthProvider.credential(auth.currentUser?.email, userPassword);
    try {
      await reauthenticateWithCredential(auth.currentUser, credential);
      return new Promise((resolve) => resolve(true));
    } catch (error) {
      console.log("ERROR: There was a problem reauthenticating user: ", error);
      return new Promise((resolve) => resolve(false));
    }
  };

  const addAnotherMethodOfAuthentication = async (
    authProviderSelected: string
  ): Promise<{ success: boolean; message: string }> => {
    const errorMessage =
      "There was a problem adding another method of authentication. Please try again later.";
    const successMessage = "Successfully added another method of authentication";

    if (!auth?.currentUser) {
      console.log("ERROR: There was a problem adding another method of authentication.");
      return new Promise((resolve) => resolve({ success: false, message: errorMessage }));
    }
    let authProvider = null;

    switch (authProviderSelected) {
      case "google":
        authProvider = new GoogleAuthProvider();
        break;
      case "facebook":
        authProvider = new FacebookAuthProvider();
        break;
      default:
        console.log(
          "ERROR: There was a problem adding another method of authentication: authProviderSelected is not valid."
        );
        return new Promise((resolve) => resolve({ success: false, message: errorMessage }));
    }

    try {
      const result = await linkWithPopup(auth.currentUser, authProvider);
      if (result) {
        console.log("Account linking success");
        return new Promise((resolve) => resolve({ success: true, message: successMessage }));
      } else {
        console.log("Account linking failed");
        return new Promise((resolve) => resolve({ success: false, message: errorMessage }));
      }
    } catch (error: any) {
      console.log("ERROR: There was a problem adding another method of authentication: ", error);
      if (error.message.includes("auth/credential-already-in-use")) {
        return new Promise((resolve) =>
          resolve({
            success: false,
            message: "This account is already linked to another account.",
          })
        );
      }
      return new Promise((resolve) => resolve({ success: false, message: errorMessage }));
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
            numOfLikes: doc.data().numOfLikes - 1,
            ranking: formatNumberToTwoDecimalPlaces(
              doc.data().ranking - 2 - getRankingMultiplier(doc.data())
            ),
          });
          return;
        }
        await updateDoc(doc.ref, {
          ...doc.data(),
          usersLikes: [...doc.data().usersLikes, user.id],
          numOfLikes: doc.data().numOfLikes + 1,
          ranking: formatNumberToTwoDecimalPlaces(
            doc.data().ranking + 2 + getRankingMultiplier(doc.data())
          ),
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
            bookmarkedDate: null,
            ranking: formatNumberToTwoDecimalPlaces(
              doc.data().ranking - 3 - getRankingMultiplier(doc.data())
            ),
          });
          return;
        }
        await updateDoc(doc.ref, {
          ...doc.data(),
          usersBookmarks: [...doc.data().usersBookmarks, user.id],
          bookmarkedDate: Date.now(),
          ranking: formatNumberToTwoDecimalPlaces(
            doc.data().ranking + 3 + getRankingMultiplier(doc.data())
          ),
        });
      });
      console.log(
        `Article ${articleId} ${action === "unbookmark" ? "unbookmarked" : "bookmarked"}`
      );
    } catch (error) {
      console.log("ERROR: There was a problem bookmarking article: ", error);
    }
  };

  const incrementNumViews = async (articleId: string) => {
    if (!db) return console.log("ERROR: There was a problem incrementing article num views.");
    try {
      const createQuery = query(collection(db, "articles"), where("id", "==", articleId));
      const querySnapshot = await getDocs(createQuery);
      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          ...doc.data(),
          numViews: doc.data().numViews + 1,
          ranking: formatNumberToTwoDecimalPlaces(
            doc.data().ranking + 1 + getRankingMultiplier(doc.data())
          ),
        });
      });
      console.log(`Article ${articleId} num views incremented`);
    } catch (error) {
      console.log("ERROR: There was a problem incrementing article num views: ", error);
    }
  };

  const addUserToRecentlyViewed = async (articleId: string) => {
    if (!db || !user)
      return console.log("ERROR: There was a problem adding article to recently viewed.");
    try {
      const createQuery = query(collection(db, "articles"), where("id", "==", articleId));
      const querySnapshot = await getDocs(createQuery);
      querySnapshot.forEach(async (doc) => {
        if (doc.data().recentlyViewedUsers.includes(user.id)) return;
        await updateDoc(doc.ref, {
          ...doc.data(),
          recentlyViewedUsers: [...doc.data().recentlyViewedUsers, user.id],
        });
      });
      console.log(`User ${user.id} added to recently viewed of article ${articleId}`);
    } catch (error) {
      console.log("ERROR: There was a problem adding article to recently viewed: ", error);
    }
  };

  const getRankingMultiplier = (article: any) => {
    const multiplier = (1 / calculateDaysBetweenDates(article.date, Date.now())) * 100;
    console.log("Multiplier: ", multiplier);
    return formatNumberToTwoDecimalPlaces(multiplier);
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
        setUser,
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
        incrementNumViews,
        addUserToRecentlyViewed,
        showShareModal,
        setShowShareModal,
        isSidebarOpen,
        setIsSidebarOpen,
        setShowAboutUsModal,
        showAboutUsModal,
        showProfileScreen,
        setShowProfileScreen,
        updateUser,
        deleteUserFromDB,
        handleReauthenticate,
        addAnotherMethodOfAuthentication,
      }}
    >
      {!loading ? children : <Spin fullscreen />}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

export const useAppContext = () => useContext(AppContext);
