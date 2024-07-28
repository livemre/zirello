// List.tsx
import React, {
  ChangeEvent,
  DragEvent,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { Item, MainContext } from "../context/Context";
import OverlayZone from "./OverlayZone";
import ItemCard from "./ItemCard"; // ItemCard'ı import edin

type Props = {
  title: string;
  id: string;
  index: number;
  indexInList: number;
};

const List: FC<Props> = ({ title, id, index, indexInList }) => {
  const [showInput, setShowInput] = useState(false);
  const [_title, _setTitle] = useState<string>("");

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No context");
  }

  const {
    addItem,
    db,
    setTargetColumnID,
    activeItem,
    targetColumnID,
    moveItem,
    draggedItemHeight,
  } = context;

  useEffect(() => {
    console.log(db);
  }, [db]);

  const onDragEnter = (e: DragEvent) => {
    e.preventDefault();
    setTargetColumnID(id);
    console.log("TCID " + targetColumnID);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: DragEvent, index: number) => {
    e.preventDefault();
    console.log("Active Item ItemIndex " + activeItem?.itemIndex);

    if (activeItem?.itemIndex !== undefined && activeItem.itemIndex !== null) {
      if (activeItem.itemIndex === 0 && activeItem.listID === targetColumnID) {
        console.log("sanane");
        moveItem(index - 1, activeItem);
      } else if (index === 0) {
        moveItem(0, activeItem);
        console.log("0 item");
        console.log("Index " + index);
        console.log("Active Item " + activeItem.itemIndex);
      } else if (index <= activeItem.itemIndex) {
        moveItem(index, activeItem);
        console.log("Index " + index);
        console.log("Active Item " + activeItem.itemIndex);
      } else if (index >= activeItem.itemIndex) {
        moveItem(index - 1, activeItem);
        console.log("Index " + index);
        console.log("Active Item " + activeItem);
      } else {
      }
    }
  };

  const _addItem = () => {
    const getIndex = db.length;
    addItem(_title, id, getIndex);
    _setTitle("");
  };

  return (
    <div className="w-72 min-w-72 bg-gray-950 p-2 rounded-xl list m-3 flex flex-col items-start justify-center">
      <p className="text-gray-200 text-2xl">{title}</p>
      <p className="text-gray-200 text-2xl">{id}</p>
      <p className="text-gray-200 text-2xl">{index}</p>
      {/* <p className="text-gray-200 text-2xl">{indexInList}</p> */}

      <div className="h-full w-full">
        <OverlayZone
          height={draggedItemHeight}
          onDrop={(e) => onDrop(e, 0)}
          onDragEnter={onDragEnter}
          index={0}
          bg={"red"}
        />
      </div>
      {db
        .sort((a, b) => a.itemIndex - b.itemIndex)
        .map((item, index) => {
          if (item.listID === id) {
            return (
              <div key={item.id} className="w-full h-full">
                <ItemCard
                  title={title}
                  item={item}
                  index={index}
                  onDragEnter={onDragEnter}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, index)}
                />
                <div className="h-full w-full">
                  <OverlayZone
                    height={draggedItemHeight}
                    onDrop={(e) => onDrop(e, index + 1)}
                    onDragEnter={onDragEnter}
                    index={index + 1}
                    bg={"yellow"}
                  />
                </div>
              </div>
            );
          }
          return null;
        })}
      {showInput ? (
        <div className="flex-col w-full">
          <textarea
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              _setTitle(e.target.value)
            }
            className="w-full p-2 rounded-lg mb-2 bg-gray-700 text-white"
            placeholder="Add title for this card..."
            value={_title}
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
          className="border text-white border-gray-100 hover:bg-gray-800 hover:text-gray-200 cursor-pointer py-2 rounded-lg w-full"
        >
          + Kart Ekle
        </div>
      )}
    </div>
  );
};

export default List;
