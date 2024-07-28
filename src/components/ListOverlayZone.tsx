import React, { DragEvent, FC, useContext, useState } from "react";
import { MainContext } from "../context/Context";

type Props = {
  onDragOver: (e: DragEvent) => void;
  onDragEnter: (e: DragEvent) => void;
  index: number;

  onDrop: (e: DragEvent, index: number) => void;
};

const ListOverlayZone: FC<Props> = ({
  onDragOver,
  onDragEnter,
  index,

  onDrop,
}) => {
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

    // if (index === activeListIndex) {
    //   return;
    // }

    // if (index === activeListIndex + 1) {
    //   return;
    // }

    onDragEnter(e);
    console.log(index);

    setShow(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    console.log("Leave");
    setShow(false);
  };

  const _onDrop = (e: DragEvent, index: number) => {
    e.preventDefault();
    console.log("EMRE " + e.dataTransfer.getData("type"));

    if (e.dataTransfer.getData("type") !== "item") {
      setShow(false);
    }
    //setShow(false); // İsteğe bağlı: öğe bırakıldığında göstergeyi gizleyin

    onDrop(e, index);
  };

  return (
    <div
      onDragLeave={onDragLeave}
      onDragEnter={_onDragEnter}
      onDragOver={_onDragOver}
      onDrop={(e: React.DragEvent) => _onDrop(e, index)}
      className={`${show ? "show-list-overlay" : "hide-list-overlay"}`}
      style={{ minWidth: show ? "300px" : undefined }}
    >
      <div className="text-white">{index}</div>
    </div>
  );
};

export default ListOverlayZone;
