import React, { DragEvent, FC, useContext, useState } from "react";
import { MainContext } from "../context/Context";

type Props = {
  onDragOver: (e: DragEvent) => void;
  onDragEnter: (e: DragEvent) => void;
  index: number;
};

const ListOverlayZone: FC<Props> = ({ onDragOver, onDragEnter, index }) => {
  const [show, setShow] = useState<boolean>(false);

  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No context");
  }

  const { moveList, activeDraggedType, activeListIndex } = context;

  const _onDragOver = (e: DragEvent) => {
    e.preventDefault();
    console.log("List On Drag Over");
    onDragOver(e);
  };

  const _onDragEnter = (e: DragEvent) => {
    e.preventDefault();

    const draggedItemType = e.dataTransfer.getData("type");

    console.log(draggedItemType);

    if (activeDraggedType !== "list") {
      return;
    }

    if (index === activeListIndex) {
      return;
    }

    if (index === activeListIndex + 1) {
      return;
    }

    onDragEnter(e);
    setShow(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    console.log("Leave");
    setShow(false);
  };

  const onDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    console.log("Drop");
    const draggedItemType = e.dataTransfer.getData("type");
    if (draggedItemType !== "list") {
      return;
    }

    setShow(false);
    moveList(index);
  };

  return (
    <div
      onDragLeave={onDragLeave}
      onDragEnter={_onDragEnter}
      onDragOver={_onDragOver}
      onDrop={(e: React.DragEvent) => onDrop(e, index)}
      className={`${show ? "show-list-overlay" : "hide-list-overlay"}`}
      style={{ minWidth: show ? "300px" : undefined }}
    >
      <p className="text-white">{index}</p>
    </div>
  );
};

export default ListOverlayZone;
