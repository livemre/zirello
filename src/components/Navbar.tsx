import React, { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "../context/Context";
import { getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Zirello from "../assets/logo.svg";

type Props = {};

const Navbar = (props: Props) => {
  const context = useContext(MainContext);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  if (!context) {
    throw new Error("No Context");
  }

  const { user } = context;
  const auth = getAuth();
  const navigate = useNavigate();
  const photoURL = user && user.photoURL ? user.photoURL : "";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showMenuHandler = () => {
    setShowMenu((prev) => !prev);
  };

  const signOutHandler = () => {
    auth.signOut().then(() => navigate("/login"));
    setShowMenu(false);
  };

  const handleMenu = (url: string) => {
    navigate(url);
  };

  if (!user) {
    return (
      <div className="h-24 bg-gray-800 flex items-center">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex">
            <Link to={"/"}>
              <h1 className="text-white text-3xl">Zirello</h1>
            </Link>
          </div>
          <Link to={"/login"}>
            <div className="cursor-pointer rounded-lg">
              <h1 className="text-blue-100 bg-blue-600 hover:bg-blue-500 text-1xl p-3">
                Log in
              </h1>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-24 bg-gray-800 flex items-center ">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to={"/"}>
            <h1 className="text-white text-3xl">Zirello</h1>
          </Link>
          <div
            className="bg-slate-800 hover:bg-slate-600 p-3 cursor-pointer rounded-lg ml-3"
            onClick={() => handleMenu("/boards")}
          >
            <h1 className="text-slate-400 text-1xl mx-5">Boards</h1>
          </div>
        </div>

        <div ref={profileRef}>
          <img
            className="rounded-full"
            src={photoURL}
            width={64}
            height={64}
            onClick={showMenuHandler}
          />
        </div>
        {showMenu && (
          <div className="showMenu z-10 absolute right-0" ref={menuRef}>
            <ul>
              <li
                className="p-3 bg-slate-800 cursor-pointer hover:bg-slate-700 text-slate-100"
                onClick={signOutHandler}
              >
                Sign Out
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
