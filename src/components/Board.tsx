import React, { DragEvent, useContext, useState } from "react";
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
    activeList,
    setActiveList,
    activeItem,
    setActiveDraggedType,
    activeDraggedType,
  } = context;

  const onDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    list: ListType,
    index: number
  ) => {
    setActiveList(list);
    e.dataTransfer.setData("type", "list");
    console.log("Active List " + activeList?.id);
    console.log("Active List Index " + index);
    console.log("ACTIVE BOARD" + activeList?.title);
    console.log("ACTIVE BOARD" + activeItem?.title);
    console.log("ACTIVE BOARD" + " Board onStart");
    console.log("ACTIVE BOARD" + activeItem?.title);
    setActiveDraggedType("list");
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
                <List title={item.title} id={item.id} />
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
