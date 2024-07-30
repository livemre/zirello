import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { BGType, Board, MainContext } from "../context/Context";
import { Link, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { MdCircle } from "react-icons/md";
import board from "../assets/board.svg";
import { FaCheckCircle } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import NoBG from "../assets/no_bg.avif";
import { ClipLoader } from "react-spinners";
import { LazyLoadImage } from "react-lazy-load-image-component";

type Props = {};

const Boards = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [searchedBoards, setSearchedBoards] = useState<Board[]>([]);
  const [showCreateMenu, setShowCreateMenu] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [boardTitle, setBoardTitle] = useState<string>("");
  const [selectedBG, setSelectedBG] = useState<BGType | null>(null);
  const [bgImgs, setBgImgs] = useState<BGType[]>([]);

  const createMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log(search);
    if (search.length > 2) {
      searchBoard();
    } else {
      setSearchedBoards([]);
    }
  }, [search]);

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

  const navigate = useNavigate();

  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No Context");
  }

  const { addBoard, user, getBoards, boards, getBGImages } = context;

  useEffect(() => {
    _getBoards();
  }, [user]);

  useEffect(() => {
    _getBGImages();
  }, [user]);

  const _getBGImages = async () => {
    const bgImages = await getBGImages();
    setBgImgs(bgImages);
    const selected = bgImages[0]; // İlk arka planı seç
    setSelectedBG(selected);
  };

  const handleCreateMenu = async () => {
    if (bgImgs.length > 0 && selectedBG !== null) {
      setShowCreateMenu(true); // Menü gösterimi
    }
  };

  const _getBoards = async () => {
    if (user === null) return;
    if (user.email) {
      await getBoards(user.uid);
      setLoading(false);
    }
  };

  const handleLinkClick = (id: string) => {
    navigate(`/board/${id}`);
  };

  const searchBoard = () => {
    if (search.length > 2) {
      const filteredBoards = boards.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setSearchedBoards(filteredBoards);
    }
  };

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <ClipLoader color="white" size={32} />
      </div>
    );
  }

  return (
    <div className="boards-container">
      <div className="flex justify-between w-full items-center mb-4">
        <p className="text-slate-300 text-1xl py-3">YOUR WORKSPACES</p>
        <div className="flex items-center  relative p-1">
          <IoIosSearch
            size={18}
            className=" absolute ml-5  pointer-events-none text-slate-400 "
          />
          <input
            placeholder="search..."
            className="pl-7 py-2 dark-bg ml-3 text-slate-400 border rounded-md"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {searchedBoards.length < 1 && search.length > 2 ? (
        <div className="w-full">
          <p className="text-slate-300">
            We couldn't find any boards named "{search}"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {search.length <= 2
            ? boards.map((item) => (
                <div
                  key={item.id}
                  className="w-60 min-w-60 min-h-32 h-32 cursor-pointer rounded-md hover:border border-slate-500"
                  onClick={() => handleLinkClick(item.id)}
                  style={{
                    backgroundImage: `url(${item.bgImage})`,
                    backgroundSize: "cover",
                  }}
                >
                  <div className="flex gap-4 m-3">
                    <p className="p-3 bg-slate-500 text-slate-300">
                      {item.name}
                    </p>
                  </div>
                </div>
              ))
            : searchedBoards.map((item) => (
                <div
                  key={item.id}
                  className="w-60 min-w-60 h-32 cursor-pointer rounded-md hover:border border-slate-500"
                  onClick={() => handleLinkClick(item.id)}
                  style={{
                    backgroundImage: `url(${item.bgImage})`,
                    backgroundSize: "cover",
                  }}
                >
                  <div className="flex gap-4 m-3">
                    <p className="p-3 bg-slate-500 text-slate-300">
                      {item.name}
                    </p>
                  </div>
                </div>
              ))}
          {search.length > 2 ? (
            ""
          ) : (
            <div
              className="w-60 min-w-60 h-32 cursor-pointer rounded-md bg-slate-400 hover:bg-slate-300"
              onClick={handleCreateMenu}
            >
              <div className="flex items-center  justify-center h-full ">
                <FaPlus size={28} className="text-slate-500" />
                <p className="ml-3">Create Board</p>
              </div>
            </div>
          )}
        </div>
      )}

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
                <div className="h-32 flex items-center justify-center w-full mb-3">
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
    </div>
  );
};

export default Boards;
