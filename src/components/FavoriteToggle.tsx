import React, { FC, useContext, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Board, MainContext } from "../context/Context";
import { CiStar } from "react-icons/ci";

type Props = {
  board: Board;
  onFavChanged?: () => void;
  type?: string;
};

const FavoriteToggle: FC<Props> = ({ board, onFavChanged, type }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("no context");
  }

  const {
    makeBoardStarredToggle,
    setBoards,
    boards,
    getBoards,
    user,
    getBoardDetails,
  } = context;

  const handleFavToggle = async () => {
    const prevValue = board.isFav;

    setBoards(
      boards.map((b) => (b.id === board.id ? { ...b, isFav: !prevValue } : b))
    );

    const result = await makeBoardStarredToggle(board.id);
    console.log("handle starred");

    if (onFavChanged) {
      onFavChanged();
    }

    if (result) {
    } else {
      setBoards(
        boards.map((b) => (b.id === board.id ? { ...b, isFav: prevValue } : b))
      );
    }
  };

  return (
    <div>
      {board && board?.isFav ? (
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered ? (
            <CiStar
              size={18}
              className={
                type && type === "board"
                  ? "text-slate-400 ml-3"
                  : "text-yellow-400 "
              }
              id="star-icon"
              onClick={handleFavToggle}
            />
          ) : (
            <FaStar
              size={18}
              id="star-icon"
              className={
                type && type === "board"
                  ? "text-slate-400 ml-3"
                  : "text-yellow-400"
              }
              onClick={handleFavToggle}
            />
          )}
        </div>
      ) : (
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered ? (
            <FaStar
              size={18}
              className={
                type && type === "board"
                  ? "text-slate-400 ml-3"
                  : "text-yellow-400"
              }
              id="star-icon"
              onClick={handleFavToggle}
            />
          ) : (
            <CiStar
              size={18}
              className={
                type && type === "board"
                  ? "text-slate-400 ml-3"
                  : "text-yellow-400"
              }
              id="star-icon"
              onClick={handleFavToggle}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FavoriteToggle;
