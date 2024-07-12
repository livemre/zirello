// ItemCard.tsx
import { DragEvent, FC, useContext, useRef, useState } from "react";
import { Item, MainContext } from "../context/Context";
import { IoCloseSharp } from "react-icons/io5";

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
    <>
      {showModal ? (
        <div className="modal flex-col">
          <IoCloseSharp
            size={32}
            color="black"
            className="modal-close-icon"
            onClick={() => setShowModal(false)}
          />
          <h1>{item.title}</h1>
          <h2>{title} - Panosunda</h2>
        </div>
      ) : (
        ""
      )}
      <div
        onClick={() => setShowModal(true)}
        onDragEnter={onDragEnter}
        onDragStart={(e) => onDragStart(e, item)}
        onDragOver={onDragOver}
        draggable
        className="text-white m-1 bg-gray-800 card rounded-lg"
      >
        <p>{item.title}</p>
        <p className="text-white">{index}</p>
      </div>
    </>
  );
};

export default ItemCard;
