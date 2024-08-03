import React, { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "../context/Context";
import { getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Zirello from "../assets/logo.svg";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import StarredCard from "./StarredCard";
import RecentCard from "./RecentCard";
import NoStarred from "../assets/no_starred.svg";
import CreateBoardButton from "./CreateBoardButton";

type Props = {};

const Navbar = (props: Props) => {
  const context = useContext(MainContext);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showRecent, setShowRecent] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const recentButtonRef = useRef<HTMLDivElement | null>(null);
  const recentMenuRef = useRef<HTMLDivElement | null>(null);

  const [showStar, setShowStar] = useState<boolean>(false);
  const starButtonRef = useRef<HTMLDivElement | null>(null);
  const [starClicked, setStarClicked] = useState(false);
  const starMenuRef = useRef<HTMLDivElement | null>(null);
  const starDivRef = useRef<HTMLDivElement | null>(null);

  if (!context) {
    throw new Error("No Context");
  }

  const { user, boards, getBoards } = context;
  const auth = getAuth();
  const navigate = useNavigate();
  const photoURL = user && user.photoURL ? user.photoURL : "";

  useEffect(() => {
    // Burada ekstra bir işlem yapmanıza gerek yok, boards değiştikçe bileşen otomatik olarak render edilecektir
  }, [boards]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        recentMenuRef.current &&
        !recentMenuRef.current.contains(e.target as Node) &&
        recentButtonRef.current &&
        !recentButtonRef.current.contains(e.target as Node)
      ) {
        setShowRecent(false);
        setShowStar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        starMenuRef.current &&
        !starMenuRef.current.contains(e.target as Node) &&
        starButtonRef.current &&
        !starButtonRef.current.contains(e.target as Node)
      ) {
        setShowStar(false);
        setShowRecent(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      <div className="h-24 bg-slate-900 flex items-center">
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
    <div className="h-12 bg-slate-900 flex items-center border-b-1">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to={"/"}>
            <h1 className="text-white text-3xl">Zirello</h1>
          </Link>
          <div
            className="text-slate-400 text-1xl mx-1 hover:bg-slate-600 px-4 py-1 cursor-pointer rounded ml-3 flex items-center"
            onClick={() => handleMenu("/boards")}
          >
            <h1 className=" text-left">Boards</h1>
          </div>
          <div className="relative" ref={recentButtonRef}>
            <div
              className="text-slate-400 text-1xl mx-1 hover:bg-slate-600 px-4 py-1 cursor-pointer rounded ml-3 flex items-center"
              onClick={() => setShowRecent((prev) => !prev)}
            >
              <h1 className=" text-left">Recent</h1>
              <i>
                <MdKeyboardArrowDown size={24} className="ml-1" />
              </i>
            </div>

            {showRecent && (
              <div
                className="absolute w-96 bg-slate-900  flex flex-col justify-start items-start rounded-md p-3 ml-3 mt-3 z-30"
                ref={recentMenuRef}
              >
                <ul className="w-full text-left">
                  {boards.map((item) => {
                    return (
                      <Link
                        to={`/board/${item.id}`}
                        onClick={() => setShowRecent(false)}
                        key={item.id}
                      >
                        <RecentCard item={item} />
                      </Link>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          <div className="relative" ref={starButtonRef}>
            <div
              className="text-slate-400 text-1xl mx-1 hover:bg-slate-600 px-4 py-1 cursor-pointer rounded ml-3 flex items-center"
              onClick={() => setShowStar((prev) => !prev)}
              style={{ backgroundColor: `${showStar ? "#475569" : ""}` }}
            >
              <h1 className=" text-left">Starred</h1>
              <i>
                <MdKeyboardArrowDown size={24} className="ml-1" />
              </i>
            </div>

            {showStar && (
              <div
                className="absolute w-96 bg-slate-900 flex flex-col justify-start items-start rounded-md p-3 ml-3 mt-3 z-40"
                ref={starMenuRef}
              >
                <ul className="w-full text-left">
                  {boards.some((item) => item.isFav) ? (
                    boards.map((item) => {
                      return (
                        item.isFav && (
                          <StarredCard
                            item={item}
                            setShowStar={setShowStar}
                            starDivRef={starDivRef}
                            key={item.id}
                          />
                        )
                      );
                    })
                  ) : (
                    <div className="flex flex-col justify-center items-center">
                      <img src={NoStarred} width={200} height={"auto"} />
                      <p className="text-slate-400 ml-1">
                        Star important boards to access them quickly and easily.
                      </p>
                    </div>
                  )}
                </ul>
              </div>
            )}
          </div>
          <div className="relative">
            <CreateBoardButton type="navbar-button" />
          </div>
        </div>

        <div ref={profileRef}>
          <img
            className="rounded-full"
            src={photoURL}
            width={32}
            height={32}
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
