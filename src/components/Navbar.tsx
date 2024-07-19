import React, { useContext, useState } from "react";
import { MainContext } from "../context/Context";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";

type Props = {};

const Navbar = (props: Props) => {
  const context = useContext(MainContext);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showCreateMenu, setShowCreateMenu] = useState<boolean>(false);
  const [boardTitle, setBoardTitle] = useState<string>("");

  if (!context) {
    throw new Error("No Context");
  }

  const { user, addBoard } = context;

  const auth = getAuth();
  const navigate = useNavigate();

  const photoURL = user && user.photoURL ? user.photoURL : "";

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

  const handleCreateMenu = () => {
    setShowCreateMenu((prev) => !prev);
  };

  const _addBoard = async () => {
    if (user === null) return;

    if (user.email) {
      addBoard(user.uid, boardTitle);
    }
  };

  if (!user) {
    return (
      <div className="h-24 w-full bg-gray-800 flex items-center justify-between p-3 gap-3">
        <div className="flex">
          <h1 className="text-white text-3xl">Zirello</h1>
          <div className="bg-slate-800 hover:bg-slate-600 p-3 cursor-pointer rounded-lg">
            <h1 className="text-slate-400 text-1xl mx-5">Boards</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-24 w-full bg-gray-800 flex items-center justify-between p-3 gap-3">
      <div className="flex">
        <h1 className="text-white text-3xl">Zirello</h1>
        <div
          className="bg-slate-800 hover:bg-slate-600 p-3 cursor-pointer rounded-lg"
          onClick={() => handleMenu("/boards")}
        >
          <h1 className="text-slate-400 text-1xl mx-5">Boards</h1>
        </div>
      </div>
      <div>
        <div
          className="bg-slate-800 hover:bg-slate-600 p-3 cursor-pointer rounded-lg"
          onClick={handleCreateMenu}
        >
          <h1 className="text-slate-400 text-1xl mx-5">Create Board</h1>
        </div>
        {showCreateMenu ? (
          <div className={"show-create-board-div"}>
            <div className="flex-col items-end justify-end">
              <IoCloseSharp
                color="white"
                className="self-end"
                onClick={() => setShowCreateMenu(false)}
              />
              <p className="text-slate-300 p-2">Board Title</p>
              <input
                placeholder="board name ..."
                className="w-full rounded-lg p-3"
                onChange={(e) => setBoardTitle(e.target.value)}
              />
              <button
                className="p-3 bg-slate-400 hover:bg-slate-500 w-full mt-2 rounded-lg"
                onClick={_addBoard}
              >
                CREATE
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      <img
        className="rounded-full"
        src={photoURL}
        width={64}
        height={64}
        onClick={showMenuHandler}
      />
      {showMenu ? (
        <div className="showMenu">
          <ul>
            <li className="p-3 bg-slate-500 cursor-pointer m-3 hover:bg-slate-800 text-slate-100">
              Edit Profile
            </li>
            <li
              className="p-3 bg-slate-500 cursor-pointer m-3 hover:bg-slate-800 text-slate-100"
              onClick={signOutHandler}
            >
              Sign Out
            </li>
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Navbar;
