import React, { useContext, useEffect, useState } from "react";
import { BGType, MainContext } from "../context/Context";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import { MdCircle } from "react-icons/md";
import board from "../assets/board.svg";
import { FaCheckCircle } from "react-icons/fa";

type Props = {};

const Navbar = (props: Props) => {
  const context = useContext(MainContext);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showCreateMenu, setShowCreateMenu] = useState<boolean>(false);
  const [boardTitle, setBoardTitle] = useState<string>("");
  const [bgImgs, setBgImgs] = useState<BGType[]>([]);
  const [selectedBG, setSelectedBG] = useState<BGType | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loadingButton, setLoadingButton] = useState(false);

  if (!context) {
    throw new Error("No Context");
  }

  const { user, addBoard, getBGImages } = context;

  const auth = getAuth();
  const navigate = useNavigate();

  const photoURL = user && user.photoURL ? user.photoURL : "";

  const showMenuHandler = () => {
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
    _getBgs();
  }, [user]);

  useEffect(() => {
    const selected = bgImgs[1];
    console.log(selected);

    setSelectedBG(selected);
  }, [bgImgs]);

  const _getBgs = async () => {
    const bgs = await getBGImages();
    console.log(bgs);
    setBgImgs(bgs);
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

  const handleBackGround = (id: number) => {
    console.log(id);
    const selected = bgImgs[id];
    setSelectedBG(selected);
  };

  const _addBoard = async () => {
    if (user === null) return;

    if (boardTitle === "") {
      setMessage("Board title can not be empty!");
      return;
    }

    if (user.email) {
      if (selectedBG) {
        addBoard(user.uid, boardTitle, selectedBG?.url);
      }
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
      <div className="flex items-center">
        <h1 className="text-white text-3xl mr-8">Zirello</h1>
        <div
          className="bg-slate-800 hover:bg-slate-600 p-3 cursor-pointer rounded-lg"
          onClick={() => handleMenu("/boards")}
        >
          <h1 className="text-slate-400 text-1xl mx-5">Boards</h1>
        </div>
        <div
          className="bg-slate-800 hover:bg-slate-600 p-3 cursor-pointer rounded-lg"
          onClick={handleCreateMenu}
        >
          <h1 className="text-slate-400 text-1xl mx-5">Create Board</h1>
        </div>
      </div>
      <div>
        {showCreateMenu ? (
          <div className="modal-create-board">
            <div className="flex flex-col items-start">
              <IoCloseSharp
                size={32}
                color="white"
                className="m-3 flex self-end"
                onClick={() => setShowCreateMenu(false)}
              />
              <div
                className="p-4 self-center"
                style={{
                  backgroundImage: `url(${selectedBG?.url})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <img src={board} width={200} height={200} />
              </div>

              <p className="px-0 py-1 flex mt-3 text-slate-400 p-2 self-start">
                BOARD TITLE
              </p>

              <input
                className="w-full rounded-lg p-3 bg-slate-600"
                onChange={(e) => setBoardTitle(e.target.value)}
              />

              <p className="px-0 py-1 mt-3 flex flex-start text-slate-400 p-2">
                BACKGROUND
              </p>

              <div className="grid grid-cols-4 gap-1">
                {bgImgs &&
                  bgImgs
                    .sort((a, b) => a.id - b.id)
                    .map((item, index) => {
                      return (
                        <div className="relative min-h-14 h-14 w-18 max-w-18">
                          {selectedBG && selectedBG.id === index ? (
                            <FaCheckCircle
                              color="white"
                              size={24}
                              className=" absolute top-1 left-1 shadow-sm"
                            />
                          ) : (
                            ""
                          )}
                          <img
                            src={item.url}
                            className="rounded-md  w-full h-full  hover:border-2 hover:border-white"
                            key={item.id}
                            onClick={() => {
                              handleBackGround(item.id);
                            }}
                          />
                        </div>
                      );
                    })}
              </div>
              {message && <p>{message}</p>}
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
