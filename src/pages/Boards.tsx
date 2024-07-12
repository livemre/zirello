import React, { ChangeEvent, useContext, useState } from "react";
import { MainContext } from "../context/Context";

type Props = {};

const Boards = (props: Props) => {
  const [name, setName] = useState<string>("");

  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No Context");
  }

  const { createBoard, getUserId, user } = context;

  const _addBoard = async () => {
    if (user === null) return;

    if (user.email) {
      const userID = await getUserId(user?.email);
      createBoard(name, userID);
    }
  };

  return (
    <div>
      <input
        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
      />
      <button onClick={_addBoard}>Create Board</button>
    </div>
  );
};

export default Boards;
