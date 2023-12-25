"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { filters, tabs } from "@/enums";
import { GlobalFiltersType, UserType } from "@/types";
import { createUserWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDB } from "@/lib/firebase";

type AppContextType = {
  setSelectedTab(name: string): void;
  selectedTab: string;
  globalFilters: GlobalFiltersType;
  isDarkMode: boolean;
  toggleDarkMode(): void;
  user: UserType | null;
  createAccount: (email: string, password: string, fullName: string) => void;
};
const AppContext = createContext({} as AppContextType);
const auth = getFirebaseAuth();
const db = getFirebaseDB();

export const AppContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [globalFilters, setGlobalFilters] = useState<GlobalFiltersType>({
    tabFilter: filters.ALL,
    otherFilters: [],
  });
  const [selectedTab, setSelectedTab] = useState<string>("All");

  useEffect(() => {
    if (!auth || !db) return console.log("ERROR: There was a problem getting current user.");
    onAuthStateChanged(auth, async () => {
      if (auth.currentUser) {
        const docRef = doc(db, `users/${auth.currentUser.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const { id, email, fullName } = docSnap.data();
          const currentUser: UserType = { id, email, fullName };
          setUser(currentUser);
        }

        // onSnapshot(doc(db, `users/${auth.currentUser.uid}`), (doc) => {
        //   const { lastLoginAt, focusedTime, numOfStickyNotes, consecutiveDays, achievements } =
        //     doc.data();

        //   setUserData({
        //     lastLoginAt: timeStampToDateString(lastLoginAt),
        //     focusedTime: durationInDHMS(focusedTime),
        //     numOfStickyNotes: numOfStickyNotes,
        //     consecutiveDays: consecutiveDays,
        //     achievements: achievements,
        //   });
        // });
      }
    });
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

  const createAccount = async (email: string, password: string, fullName: string) => {
    console.log("Creating new account");
    if (!auth) return console.log("ERROR: There was a problem getting Firebase auth.");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user: UserType = {
        id: userCredential.user.uid,
        email: email,
        fullName: fullName,
      };
      setUser(user);
      addUserToDB(user);
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

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        globalFilters,
        selectedTab,
        setSelectedTab,
        user,
        createAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

export const useAppContext = () => useContext(AppContext);
