import React, { FC, useContext, useEffect, useState } from "react";
import { Board, MainContext } from "../context/Context";
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

type Props = {
  item: Board;
};

const LeftMenuItem: FC<Props> = ({ item }) => {
  const [hover, setHover] = useState<boolean>(false);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No Context");
  }

  const { makeBoardStarredToggle, setBoards, boards } = context;

  const navigate = useNavigate();

  useEffect(() => {}, [boards]);

  const handleNavigate = (e: React.MouseEvent) => {
    if ((e.target as HTMLLIElement).closest("#star-icon")) {
      e.stopPropagation();
      return;
    }
    navigate(`/board/${item.id}`);
  };

  const handleStarred = async () => {
    const prevValue = item.isFav;

    setBoards(
      boards.map((board) =>
        board.id === item.id ? { ...board, isFav: !prevValue } : board
      )
    );

    const result = await makeBoardStarredToggle(item.id);
    console.log("handle starred");

    if (result) {
    } else {
      setBoards(
        boards.map((board) =>
          board.id === item.id ? { ...board, isFav: prevValue } : board
        )
      );
    }
  };

  return (
    <li
      onClick={(e: React.MouseEvent) => handleNavigate(e)}
      className="flex items-center justify-between m-1 p-2 hover:bg-slate-700 cursor-pointer"
    >
      <div className="flex items-center">
        <img src={item.bgImage} className="w-8 h-5 mr-2" />
        <p className="text-slate-400">{item.name}</p>
      </div>
      {item.isFav ? (
        <div
          id="star-icon"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {hover ? (
            <CiStar size={16} color="white" onClick={handleStarred} />
          ) : (
            <FaStar size={16} color="yellow" onClick={handleStarred} />
          )}
        </div>
      ) : (
        <CiStar
          id="star-icon"
          size={16}
          color="white"
          onClick={handleStarred}
        />
      )}
    </li>
  );
};

export default LeftMenuItem;
