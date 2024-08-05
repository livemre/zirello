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
import { list } from "firebase/storage";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";

type Props = {
  title: string;
  id: string;
  index: number;
  indexInList: number;
  boardID: string;
  onDeleteList: () => void;
};

const List: FC<Props> = ({
  title,
  id,
  index,
  indexInList,
  onDeleteList,
  boardID,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [_title, _setTitle] = useState<string>("");
  const [editListTitle, setEditListTitle] = useState(false);
  const [_updatedTitle, _setUpdatedTitle] = useState<string>("");
  const [showDeleteListModal, setShowDeleteListModal] =
    useState<boolean>(false);

  useEffect(() => {
    _setUpdatedTitle(title);
  }, [title]);

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
    setLists,
    lists,
    updateListTitle,
    deleteList,
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

  const _addItem = async () => {
    const getIndex = db.length;

    const result = await addItem(_title, id, getIndex);

    if (!result) {
      console.log("Error");
    }

    _setTitle("");
  };

  const handleTitleFocus = async () => {
    setEditListTitle(false);
    if (_updatedTitle === "") {
      return;
    }

    const _prevTitle = title;

    setLists(
      lists.map((list) => {
        return list.id === id ? { ...list, title: _updatedTitle } : list;
      })
    );
    const result = await updateListTitle(id, _updatedTitle);

    if (!result) {
      setLists(
        lists.map((list) => {
          return list.id === id ? { ...list, title: _prevTitle } : list;
        })
      );
    }
  };

  const handleDeleteList = async () => {
    const previousLists = lists;

    const result = await deleteList(id, boardID);
    if (result) {
      onDeleteList();
    }
  };

  return (
    <div className="w-72 min-w-72 bg-gray-950 p-2  list m-3 flex flex-col items-start justify-center rounded-2xl">
      {editListTitle ? (
        <input
          value={_updatedTitle}
          className="bg-transparent text-gray-200 text-lg w-full rounded-md border-0 focus:border-0"
          autoFocus
          onBlur={handleTitleFocus}
          onChange={(e) => _setUpdatedTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleTitleFocus();
            }
          }}
        />
      ) : (
        <div className="w-full relative">
          <div className="flex items-center justify-between w-full">
            <p
              onClick={() => setEditListTitle(true)}
              className="text-gray-200 text-lg font-semibold cursor-pointer"
            >
              {title}
            </p>
            <RiDeleteBin6Line
              onClick={() => setShowDeleteListModal(true)}
              size={16}
              className="text-slate-200 hover:text-red-400 cursor-pointer"
            />
          </div>
          {showDeleteListModal && (
            <div className="modal-delete-list flex flex-col">
              <div className="flex items-center justify-between mb-2 w-full">
                <p className=" text-slate-200">
                  Deleting a list is forever. There is no undo.
                </p>
                <IoMdClose
                  size={18}
                  color="white"
                  onClick={() => {
                    setShowDeleteListModal(false);
                  }}
                />
              </div>

              <button
                className="bg-red-500 text-black px-2 py-1 rounded-md w-full"
                onClick={handleDeleteList}
              >
                Delete List
              </button>
            </div>
          )}
        </div>
      )}
      <p className="text-gray-200 text-2xl">{id}</p>
      <p className="text-gray-200 text-2xl">{index}</p>
      <p className="text-gray-200 text-2xl">{indexInList}</p>

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
