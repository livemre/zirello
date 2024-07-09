import React, { DragEvent, FC, useContext, useState } from "react";
import { MainContext } from "../context/Context";

type Props = {
  height: number;
  onDrop: (e: DragEvent, index: number) => void;
  onDragEnter: (e: DragEvent) => void;
  index: number;
};

const OverlayZone: FC<Props> = ({ height, onDrop, onDragEnter, index }) => {
  const [show, setShow] = useState(false);

  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No Context");
  }

  const { activeDraggedType } = context;

  const _onDragEnter = (e: DragEvent) => {
    if (activeDraggedType !== "item") {
      return; // Prevent the function from running if the type doesn't match
    }
    setShow(true);
    onDragEnter(e);
  };

  const onDragLeave = () => {
    setShow(false);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault(); // onDrop'un çalışması için gereklidir
  };

  const _onDrop = (e: DragEvent) => {
    e.preventDefault();
    console.log("EMRE " + e.dataTransfer.getData("type"));

    if (e.dataTransfer.getData("type") !== "item") {
      setShow(false);
    }
    setShow(false); // İsteğe bağlı: öğe bırakıldığında göstergeyi gizleyin

    onDrop(e, index);
  };

  return (
    <div>
      <div
        onDrop={_onDrop}
        onDragOver={onDragOver}
        className={show ? "showZone" : "hideZone"}
        style={{ height: show ? `${height}px` : undefined }}
        onDragEnter={_onDragEnter}
        onDragLeave={onDragLeave}
      >
        Overlay
      </div>
    </div>
  );
};

export default OverlayZone;
