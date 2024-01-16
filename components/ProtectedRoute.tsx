"use client";

import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const { user } = useAppContext();
  const router = useRouter();

  // Replace this with your authentication logic
  const isAuthenticated = user;

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect the user to the login page if not authenticated
      router.push("/");
    }
  }, [isAuthenticated]);

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
