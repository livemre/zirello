import React, { DragEvent, useContext } from "react";
import CreateList from "./CreateList";
import { MainContext, List as ListType } from "../context/Context";
import List from "./List";
import ListOverlayZone from "./ListOverlayZone";

const Board = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No Context");
  }

  const {
    lists,
    setActiveList,
    setActiveDraggedType,
    setActiveListIndex,
    user,
  } = context;

  const onDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    list: ListType,
    index: number
  ) => {
    setActiveList(list);
    e.dataTransfer.setData("type", "list");
    setActiveDraggedType("list");
    setActiveListIndex(index);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const onDragEnter = (e: DragEvent) => {
    e.preventDefault();
    console.log("Board drag enter");
  };

  return (
    <div className="flex flex-row justify-start">
      <div className="flex-col">
        <div>Hosgeldin {user && user.displayName}</div>
        <img src={`${user ? user.photoURL : ""}`} width={200} height={200} />
      </div>
      <ListOverlayZone
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        index={0}
      />
      <div className="flex">
        {lists.map((item, index) => {
          return (
            <div className="flex list" key={item.id}>
              <div draggable onDragStart={(e) => onDragStart(e, item, index)}>
                <List title={item.title} id={item.id} index={index} />
              </div>
              <ListOverlayZone
                onDragEnter={onDragEnter}
                onDragOver={onDragOver}
                index={index + 1}
              />
            </div>
          );
        })}
        <CreateList />
      </div>
    </div>
  );
};

export default Board;
