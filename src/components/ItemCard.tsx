// ItemCard.tsx
import { DragEvent, FC, useContext, useRef, useState } from "react";
import { Item, MainContext } from "../context/Context";
import { IoCloseSharp } from "react-icons/io5";
import { IoClipboard } from "react-icons/io5";

import ItemCardDescription from "./ItemCardDescription";
import ItemCardComments from "./ItemCardComments";

type Props = {
  item: Item;
  index: number;
  onDragEnter: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent, index: number) => void;
  title: string;
};

const ItemCard: FC<Props> = ({
  item,
  index,
  onDragEnter,
  onDragOver,
  title,
}) => {
  const draggedItemRef = useRef<HTMLDivElement | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No context");
  }

  const {
    setDraggedItemHeight,
    setActiveItem,
    setActiveDraggedType,
    setActiveItemIndex,
  } = context;

  const onDragStart = (e: DragEvent, item: Item) => {
    e.stopPropagation();
    draggedItemRef.current = e.target as HTMLDivElement;
    setActiveItem(item);
    setActiveDraggedType("item");
    setActiveItemIndex(index);

    e.dataTransfer.setData("type", "item");

    const draggedItemheight = draggedItemRef.current?.offsetHeight;
    if (draggedItemheight) {
      setDraggedItemHeight(draggedItemheight);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {showModal ? (
        <>
          <div className="fixed inset-0 bg-black opacity-70 z-40"></div>
          <div className="modal flex-col items-start justify-start">
            <IoCloseSharp
              size={32}
              color="#94a3b8"
              className="modal-close-icon hover:bg-slate-600"
              onClick={() => setShowModal(false)}
            />
            <div className="flex justify-start items-center mt-8">
              <IoClipboard className="" size={20} color="#94a3b8" />
              <h1 className="text-1xl ml-2 text-slate-400">{item.title}</h1>
            </div>

            <h2 className="text-slate-400 ml-8">In list - {title}</h2>

            <div className="w-full mt-8">
              <ItemCardDescription item={item} />
            </div>
            <div className="w-full mt-8">
              <ItemCardComments item={item} />
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      <div
        onClick={() => setShowModal(true)}
        onDragEnter={onDragEnter}
        onDragStart={(e) => onDragStart(e, item)}
        onDragOver={onDragOver}
        draggable
        className="text-white m-1 bg-slate-800 rounded-lg py-3 "
      >
        <p>{item.title}</p>
        <p className="text-white">{index}</p>
        <p className="text-white">{item.itemIndex}</p>
      </div>
    </div>
  );
};

export default ItemCard;
