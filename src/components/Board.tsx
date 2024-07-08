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

  const { lists, activeList, setActiveList } = context;

  const onDragStart = (e: React.DragEvent, list: ListType, index: number) => {
    setActiveList(list);
    e.dataTransfer.setData("list", "list");
    console.log("Active List " + activeList?.id);
    console.log("Active List Index " + index);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const onDragEnter = (e: DragEvent) => {
    e.preventDefault();
    console.log("Board drag enter");
  };

  return (
    <div className="flex flex-row justify-start  bg-red-100">
      <ListOverlayZone
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        index={0}
      />
      <div className="flex">
        {lists.map((item, index) => {
          return (
            <div className="flex" key={item.id}>
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
