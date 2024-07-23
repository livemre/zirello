import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Board, MainContext } from "../context/Context";
import { Link, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";

type Props = {};

const Boards = (props: Props) => {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [searchedBoards, setSearchedBoards] = useState<Board[]>([]);

  useEffect(() => {
    console.log(search);
    if (search.length > 2) {
      searchBoard();
    } else {
      setSearchedBoards([]);
    }
  }, [search]);

  const navigate = useNavigate();

  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No Context");
  }

  const { addBoard, user, getBoards, boards } = context;

  useEffect(() => {
    _getBoards();
  }, [user]);

  const _getBoards = async () => {
    if (user === null) return;
    if (user.email) {
      getBoards(user.uid);
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

  if (loading) {
    return <div>Loading...</div>;
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
      <div className="grid grid-cols-5 gap-4">
        {search.length <= 2
          ? boards.map((item) => (
              <div
                key={item.id}
                className="w-60 min-w-60 h-32 cursor-pointer rounded-md"
                onClick={() => handleLinkClick(item.id)}
                style={{
                  backgroundImage: `url(${item.bgImage})`,
                  backgroundSize: "cover",
                }}
              >
                <div className="flex gap-4 m-3">
                  <p className="p-3 bg-slate-500 text-slate-300">{item.name}</p>
                </div>
              </div>
            ))
          : searchedBoards.map((item) => (
              <div
                key={item.id}
                className="w-60 min-w-60 h-32 cursor-pointer rounded-md"
                onClick={() => handleLinkClick(item.id)}
                style={{
                  backgroundImage: `url(${item.bgImage})`,
                  backgroundSize: "cover",
                }}
              >
                <div className="flex gap-4 m-3">
                  <p className="p-3 bg-slate-500 text-slate-300">{item.name}</p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Boards;
