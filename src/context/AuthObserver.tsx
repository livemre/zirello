import React, { useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { MainContext } from "../context/Context";

const AuthObserver = () => {
  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No Context");
  }

  const { setUser } = context;
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth, setUser]);

  return null;
};

export default AuthObserver;
