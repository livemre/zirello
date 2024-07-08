import React, {
  ChangeEvent,
  DragEvent,
  FC,
  useContext,
  useRef,
  useState,
} from "react";
import { Item, MainContext } from "../context/Context";
import OverlayZone from "./OverlayZone";

type Props = {
  title: string;
  id: string;
};

const List: FC<Props> = ({ title, id }) => {
  const draggedItemRef = useRef<HTMLDivElement | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [_title, _setTitle] = useState<string>("");

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No context");
  }

  const {
    addItem,
    db,
    setDraggedItemHeight,
    draggedItemHeight,
    setTargetColumnID,
    activeItem,
    setActiveItem,
    targetColumnID,
    moveItem,
  } = context;

  const onDragStart = (e: DragEvent, item: Item) => {
    draggedItemRef.current = e.target as HTMLDivElement;
    setActiveItem(item);

    e.dataTransfer.setData("item", "item");

    const draggedItemheight = draggedItemRef.current?.offsetHeight;
    if (draggedItemheight) {
      setDraggedItemHeight(draggedItemheight);
    }
  };

  const onDragEnter = (e: DragEvent) => {
    e.preventDefault();
    setTargetColumnID(id);
    console.log(targetColumnID);
  };

  const onDragOver = (e: DragEvent) => {};

  const onDrop = (e: DragEvent, index: number) => {
    e.preventDefault();
    // MoveItem fonksiyonu yazicam ve su 3 veriyi gondermem lazim
    // 1 - Suruklenen Oge
    // ActiveItem
    // 2 - Suruklenecek Liste
    // TargetColumnID
    // 3 - Suruklenecek konum

    if (activeItem) {
      moveItem(index, activeItem);
    }
  };

  const _addItem = () => {
    addItem(_title, id);
  };

  return (
    <div className="w-80 min-w-80 h-full bg-gray-950 p-2">
      <p className="text-gray-200 text-2xl">{title}</p>

      <OverlayZone
        height={draggedItemHeight}
        onDrop={(e) => onDrop(e, 0)}
        onDragEnter={onDragEnter}
        index={0}
      />
      {db.map((item, index) => {
        if (item.listID === id) {
          return (
            <div key={item.id}>
              <div
                onDragEnter={onDragEnter}
                onDragStart={(e) => onDragStart(e, item)}
                onDragOver={(e) => onDragOver(e)}
                draggable
                className={`text-white  m-1 bg-gray-800 card`}
              >
                <p>{item.title}</p>
                <p>{item.id}</p>
                <p>{index}</p>
              </div>
              <OverlayZone
                height={draggedItemHeight}
                onDrop={(e) => onDrop(e, index + 1)}
                onDragEnter={(e) => onDragEnter(e)}
                index={index}
              />
            </div>
          );
        }
        return null;
      })}
      {showInput ? (
        <div className=" flex-col">
          <textarea
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              _setTitle(e.target.value)
            }
            className=" w-full p-2 rounded-lg mb-2 bg-gray-700 text-white"
            placeholder="Bu kart icin bir baslik girin..."
          />
          <div className="flex justify-start mb-2">
            <button
              className="bg-blue-400 p-2 rounded-lg mr-2 px-7"
              onClick={_addItem}
            >
              Kart Ekle
            </button>
            <button
              onClick={() => setShowInput(false)}
              className="bg-gray-700 p-2 rounded-lg text-white px-3"
            >
              X
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            setShowInput(true);
          }}
          className="border text-white border-gray-100 hover:bg-gray-800 hover:text-gray-200 cursor-pointer py-2 rounded-lg"
        >
          + Kart Ekle
        </div>
      )}
    </div>
  );
};

export default List;
