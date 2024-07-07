import React, { DragEvent, useContext, useState } from "react";
import CreateList from "./CreateList";
import { MainContext } from "../context/Context";
import List from "./List";

const Board = () => {
  const [showOverlay, setShowOverlay] = useState<boolean>(true);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No Context");
  }

  const onDragEnter = (e: DragEvent) => {
    e.preventDefault();
    setShowOverlay(true);
  };

  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setShowOverlay(false);
  };

  const { lists } = context;

  return (
    <div className="flex gap-3">
      {lists.map((item) => {
        return (
          <div draggable>
            <List key={item.id} title={item.title} id={item.id} />
          </div>
        );
      })}
      <CreateList />
    </div>
  );
};

export default Board;
