import { DragEvent, FC, useContext, useState } from "react";
import { MainContext } from "../context/Context";

type Props = {
  height: number;
  onDrop: (e: DragEvent, index: number) => void;
  onDragEnter: (e: DragEvent) => void;
  index: number;
  bg: string;
};

const OverlayZone: FC<Props> = ({ height, onDrop, onDragEnter, index, bg }) => {
  const [show, setShow] = useState(false);

  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No Context");
  }

  const { activeDraggedType } = context;

  const _onDragEnter = (e: DragEvent) => {
    if (activeDraggedType !== "item") {
      return;
    }

    setShow(true);
    onDragEnter(e);
  };

  const onDragLeave = () => {
    setShow(false);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
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
    <div
      onDrop={_onDrop}
      onDragOver={onDragOver}
      className={show ? "showZone" : "hideZone"}
      style={{ height: show ? `${height}px` : undefined }}
      onDragEnter={_onDragEnter}
      onDragLeave={onDragLeave}
    >
      <div className="min-h-23 text-white"></div>
    </div>
  );
};

export default OverlayZone;
