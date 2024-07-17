import React, { ChangeEvent, useContext, useState } from "react";
import { MainContext } from "../context/Context";
import { Link } from "react-router-dom";

type Props = {};

const Boards = (props: Props) => {
  const [name, setName] = useState<string>("");

  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No Context");
  }

  const { addBoard, user, getBoards, boards } = context;

  const _addBoard = async () => {
    if (user === null) return;

    if (user.email) {
      addBoard(user.uid, name);
    }
  };

  const _getBoards = async () => {
    if (user === null) return;
    if (user.email) {
      getBoards(user.uid);
    }
  };

  return (
    <div>
      <input
        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
      />
      <h1>{user?.uid}</h1>
      <button onClick={_addBoard}>Create Board</button>
      <button onClick={_getBoards}>Get Boards</button>
      {boards &&
        boards.map((item) => {
          return (
            <Link to={`/board/${item.id}`}>
              <div className="flex gap-4 m-3 bg-red-300">
                <p>{item.id}</p>
                <p>{item.name}</p>
                <p>{item.userID}</p>
              </div>
            </Link>
          );
        })}
    </div>
  );
};

export default Boards;
