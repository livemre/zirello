import React, { useContext } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { MainContext } from "../context/Context";
import { useNavigate } from "react-router-dom";

type Props = {};

const Login = (props: Props) => {
  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No Context");
  }

  const { setUser, addUser } = context;

  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const signIn = async () => {
    return await signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        console.log(user);

        if (user) {
          console.log("user var");

          setUser(user);
          if (user.email && user.displayName) {
            console.log("email ve displayname var");

            addUser(user.uid, user.email, user.displayName);
          }
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  return <div onClick={signIn}>Login</div>;
};

export default Login;
