import React, { FC, useContext, useEffect, useState } from "react";
import { Board, MainContext } from "../context/Context";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Props = {
  item: Board;
};

const BoardCard: FC<Props> = ({ item }) => {
  const [starClicked, setStarClicked] = useState<boolean>(item.isFav);
  const navigate = useNavigate();
  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No context");
  }

  useEffect(() => {
    setStarClicked(item.isFav);
  }, [item]);

  const { makeBoardStarredToggle, setBoards, boards } = context;

  const handleLinkClick = (id: string, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".star-icon")) {
      e.stopPropagation();
      return;
    }
    navigate(`/board/${id}`);
  };

  const handleStarClicked = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const previousState = starClicked;
    setStarClicked(!previousState); // UI'yı hemen güncelle

    setBoards(
      boards.map((board) =>
        board.id === item.id ? { ...board, isFav: !previousState } : board
      )
    );

    const result = await makeBoardStarredToggle(item.id);
    if (result) {
      // Eğer işlem başarılı olursa, context'teki boards listesini güncelle
    } else {
      // Eğer işlem başarısız olursa, UI'yı geri al
      setBoards(
        boards.map((board) =>
          board.id === item.id ? { ...board, isFav: previousState } : board
        )
      );
    }
  };

  return (
    <div
      className="relative w-54 min-h-24 min-w-54 h-24 rounded-md cursor-pointer border hover:border border-slate-900 hover:border-slate-100 overflow-hidden"
      onClick={(e) => handleLinkClick(item.id, e)}
    >
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-50"
        style={{ backgroundImage: `url(${item.bgImage})` }}
      ></div>
      <div className="relative h-full w-full flex flex-col justify-between p-3 z-10">
        <p className="text-slate-100 text-left text-lg font-bold">
          {item.name}
        </p>
        <div className="absolute right-1 bottom-1">
          {starClicked ? (
            <FaStar
              size={16}
              onClick={handleStarClicked}
              className="text-yellow-400 star-icon"
            />
          ) : (
            <CiStar
              size={16}
              onClick={handleStarClicked}
              className="text-white star-icon"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
