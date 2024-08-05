import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaPlus } from "react-icons/fa";
import { BGType, MainContext } from "../context/Context";
import { IoCloseSharp } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import board from "../assets/board.svg";

type Props = {
  type: string;
};

const CreateBoardButton: FC<Props> = ({ type }) => {
  const [showCreateMenu, setShowCreateMenu] = useState<boolean>(false);
  const [selectedBG, setSelectedBG] = useState<BGType | null>(null);
  const [bgImgs, setBgImgs] = useState<BGType[]>([]);
  const [boardTitle, setBoardTitle] = useState<string>("");

  const [message, setMessage] = useState<string | null>(null);

  const createMenuRef = useRef<HTMLDivElement | null>(null);

  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No Context");
  }

  const { user, getBGImages, addBoard, getBoards } = context;

  const _addBoard = async () => {
    if (user === null) return;

    if (boardTitle === "") {
      setMessage("Board title can not be empty!");
      return;
    }

    if (user.email) {
      if (selectedBG) {
        const result = await addBoard(user.uid, boardTitle, selectedBG?.url);
        if (result) {
          getBoards(user.uid);
          setShowCreateMenu(false);
          setBoardTitle("");
        }
      }
    }
  };

  const handleBackGround = (id: number) => {
    console.log(id);
    const selected = bgImgs[id];
    setSelectedBG(selected);
  };

  useEffect(() => {
    _getBGImages();
  }, [user]);

  const _getBGImages = async () => {
    const bgImages = await getBGImages();
    setBgImgs(bgImages);
    const selected = bgImages[0]; // İlk arka planı seç
    setSelectedBG(selected);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        createMenuRef.current &&
        !createMenuRef.current.contains(e.target as Node)
      ) {
        setShowCreateMenu(false);
        console.log(showCreateMenu);
        console.log("Outside");
      } else {
        console.log("Inside");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateMenu = async () => {
    if (bgImgs.length > 0 && selectedBG !== null) {
      setShowCreateMenu(true); // Menü gösterimi
    }
  };

  const createMenuDiv = () => {
    return (
      <div ref={createMenuRef}>
        {showCreateMenu ? (
          <div className="modal-create-board">
            <div className="flex flex-col items-start w-full">
              <IoCloseSharp
                size={32}
                color="white"
                className="m-3 flex self-end"
                onClick={() => setShowCreateMenu(false)}
              />
              {selectedBG === null ? (
                <ClipLoader size={32} color="white" />
              ) : (
                <div className="h-32 flex items-center justify-center w-full mb-3 mt-3">
                  <div
                    className="p-4 items-center w-full justify-center"
                    style={{
                      backgroundImage: `url(${selectedBG?.url})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  >
                    <div
                      style={{
                        backgroundImage: `url(${board})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                      }}
                      className="w-full h-32 flex self-center "
                    ></div>
                  </div>
                </div>
              )}

              <p className="px-0 py-1 flex mt-3 text-slate-400 p-2 self-start">
                BOARD TITLE
              </p>

              <input
                className="w-full rounded-lg p-3 bg-slate-600 text-slate-300"
                onChange={(e) => setBoardTitle(e.target.value)}
              />

              <p className="px-0 py-1 mt-3 flex flex-start text-slate-400 p-2">
                BACKGROUND
              </p>

              <div className="grid grid-cols-4 gap-1 w-full">
                {bgImgs
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
                        <div
                          className="bg-slate-600  min-w-18 min-h-14 rounded-md hover:border-2 hover:border-white"
                          onClick={() => {
                            handleBackGround(item.id);
                          }}
                          style={{
                            backgroundImage: `url(${item.url})`,
                            backgroundSize: "cover",
                          }}
                          key={item.id}
                        ></div>
                      </div>
                    );
                  })}
              </div>

              {message && <p>{message}</p>}

              <button
                className="p-3 bg-blue-400 hover:bg-slate-500 w-full mt-2 rounded-lg"
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
    );
  };

  if (type === "sidebar-button") {
    return (
      <div>
        <FaPlus
          size={24}
          className="text-slate-400 hover:bg-slate-700 p-1"
          onClick={handleCreateMenu}
        />
        {createMenuDiv()}
      </div>
    );
  }

  if (type === "navbar-button") {
    return (
      <>
        <div
          className="text-slate-400 text-1xl mx-1 bg-blue-700 hover:bg-blue-600 px-4 py-1 cursor-pointer rounded ml-3 flex items-center"
          onClick={handleCreateMenu}
        >
          <h1 className=" text-left">Create Board</h1>
        </div>
        {createMenuDiv()}
      </>
    );
  }

  return (
    <>
      <div
        className="w-60 min-w-60 h-24 cursor-pointer rounded-md bg-slate-400 hover:bg-slate-300"
        onClick={handleCreateMenu}
      >
        <div className="flex items-center  justify-center h-full ">
          <FaPlus size={28} className="text-slate-500" />
          <p className="ml-3">Create Board</p>
        </div>
      </div>
      {createMenuDiv()}
    </>
  );
};

export default CreateBoardButton;
