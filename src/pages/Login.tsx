import React, { useContext } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { MainContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { TiVendorMicrosoft } from "react-icons/ti";
import { FaGithub } from "react-icons/fa";
import { FaSlack } from "react-icons/fa";

type Props = {};

const Login = (props: Props) => {
  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No Context");
  }

  const { setUser, addUser, user } = context;

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

  if (user) {
    navigate("/boards");
  }

  return (
    <div className="flex flex-col items-center justify-center h-3/4">
      <div className="border shadow-lg w-4/12 p-8 bg-white">
        <p className="text-3xl">Zirello</p>
        <p>Sign in with your Google account to use Zirello</p>

        <div
          className="flex items-center justify-center border m-2 p-2 cursor-pointer hover:bg-gray-100"
          onClick={signIn}
        >
          <FcGoogle size={32} />
          <p className="font-bold  ml-2">Google</p>
        </div>
        <p className="mt-8 mb-3">Soon</p>
        <div className="flex items-center justify-center border m-2 p-2  hover:bg-gray-100 cursor-not-allowed">
          <TiVendorMicrosoft size={32} />
          <p className="font-bold ml-2">Microsoft</p>
        </div>
        <div className="flex items-center justify-center border m-2 p-2  hover:bg-gray-100 cursor-not-allowed">
          <FaGithub size={32} />
          <p className="font-bold ml-2">Github</p>
        </div>
        <div className="flex items-center justify-center border m-2 p-2  hover:bg-gray-100 cursor-not-allowed">
          <FaSlack size={32} />
          <p className="font-bold ml-2">Slack</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
