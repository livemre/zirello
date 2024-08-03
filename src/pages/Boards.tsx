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

import { FaCheckCircle } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import NoBG from "../assets/no_bg.avif";
import { ClipLoader } from "react-spinners";
import { LazyLoadImage } from "react-lazy-load-image-component";

import BoardCard from "../components/BoardCard";
import LeftMenu from "../components/LeftMenu";
import CreateBoardButton from "../components/CreateBoardButton";
import { LuClock } from "react-icons/lu";
import { FaRegStar } from "react-icons/fa";

type Props = {};

const Boards = (props: Props) => {
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

  const { addBoard, user, getBoards, boards, getBGImages } = context;

  useEffect(() => {
    _getBoards();
  }, [user]);

  const _getBoards = async () => {
    if (user === null) return;
    if (user.email) {
      await getBoards(user.uid);
      setLoading(false);
    }
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
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <ClipLoader color="white" size={32} />
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <LeftMenu />
      <div className="boards-container">
        {boards.some((item) => item.isFav) && (
          <div className="flex flex-col   w-full  mb-4">
            <div className="flex items-center self-start">
              <FaRegStar size={22} className="mr-2 text-slate-200" />
              <p className="text-slate-300 text-1xl py-3">STARRED BOARDS</p>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {boards
                .sort(
                  (a, b) =>
                    a.lastUsingDate.toDate().getDate() -
                    b.lastUsingDate.toDate().getDate()
                )

                .map((item) => {
                  return item.isFav && <BoardCard item={item} />;
                })}
            </div>
          </div>
        )}
        <div className="flex flex-col   w-full  mb-4">
          {boards.some((item) => item.isFav !== true) && (
            <>
              <div className="flex items-center self-start">
                <LuClock size={22} className="mr-2 text-slate-200" />
                <p className="text-slate-300 text-1xl py-3">RECENT</p>
              </div>

              <div className="grid grid-cols-5 gap-4">
                {boards
                  .sort(
                    (a, b) =>
                      b.lastUsingDate.toDate().getTime() -
                      a.lastUsingDate.toDate().getTime()
                  )
                  .map((item) => {
                    return !item.isFav && <BoardCard item={item} />;
                  })}
              </div>
            </>
          )}
        </div>
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
              ? boards
                  .sort(
                    (a, b) =>
                      a.createdDate.toDate().getTime() -
                      b.createdDate.toDate().getTime()
                  )
                  .map((item) => <BoardCard item={item} />)
              : searchedBoards
                  .sort(
                    (a, b) =>
                      a.createdDate.toDate().getTime() -
                      b.createdDate.toDate().getTime()
                  )
                  .map((item) => <BoardCard item={item} />)}
            {search.length > 2 ? "" : <CreateBoardButton type="board-button" />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Boards;
