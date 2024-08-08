import { DragEvent, FC, useContext, useEffect, useRef, useState } from "react";
import { Item, MainContext } from "../context/Context";
import { IoCloseSharp } from "react-icons/io5";
import { IoClipboard } from "react-icons/io5";

import ItemCardDescription from "./ItemCardDescription";
import ItemCardComments from "./ItemCardComments";
import { MdOutlineModeEdit } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

type Props = {
  item: Item;
  index: number;
  onDragEnter: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent, index: number) => void;
  title: string;
  onDeleteItem: () => void;
};

const ItemCard: FC<Props> = ({
  item,
  index,
  onDragEnter,
  onDragOver,
  title,
  onDeleteItem,
}) => {
  const draggedItemRef = useRef<HTMLDivElement | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const [isCardHovered, setIsCardHovered] = useState<boolean>(false);
  const [isCardEdit, setIsCardEdit] = useState<boolean>(false);
  const [_cardTitle, _setCardTitle] = useState<string>("");
  const [cardHeight, setCardHeight] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [showCardDeleteModal, setShowCardDeleteModal] =
    useState<boolean>(false);

  useEffect(() => {
    calculateCardHeight();
  }, [isCardEdit]);

  const calculateCardHeight = () => {
    if (cardRef.current) {
      const height = cardRef.current.offsetHeight;
      setCardHeight(height);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(e.target as Node)
      ) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No context");
  }

  const {
    setDraggedItemHeight,
    setActiveItem,
    setActiveDraggedType,
    setActiveItemIndex,
    updateItemTitle,
    db,
    setDB,
    deleteItem,
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

  const onBlur = async () => {
    setIsCardEdit(false);
    const prevTitle = item.title;

    setDB(db.map((i) => (i.id === item.id ? { ...i, title: _cardTitle } : i)));

    const result = await updateItemTitle(item.id, _cardTitle);

    if (!result) {
      setDB(db.map((i) => (i.id === item.id ? { ...i, title: prevTitle } : i)));
    }
  };

  const onFocus = () => {
    // Edit mode başladığında _cardTitle state'ini item.title ile doldur
    _setCardTitle(item.title);
  };

  const handleDeleteCard = async () => {
    console.log("delete card");
    const result = await deleteItem(item.id);

    if (result) {
      setShowCardDeleteModal(false);
      onDeleteItem();
    }
  };

  return (
    <>
      {showCardDeleteModal && (
        <>
          <div className="fixed inset-0 bg-black opacity-70 z-40"></div>
          <div className="modal-delete-list flex flex-col">
            <div className="flex items-center justify-between mb-2 w-full">
              <p className=" text-slate-200">
                Deleting a card is forever. There is no undo.
              </p>
              <IoMdClose
                size={18}
                color="white"
                onClick={() => {
                  setShowCardDeleteModal(false);
                }}
              />
            </div>

            <button
              className="bg-red-500 text-black px-2 py-1 rounded-md w-full"
              onClick={handleDeleteCard}
            >
              Delete Card
            </button>
          </div>
        </>
      )}
      <div
        className="flex flex-col w-full relative"
        onMouseOver={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
      >
        {showModal ? (
          <>
            <div className="fixed inset-0 bg-black opacity-70 z-40"></div>
            <div
              className="modal flex-col items-start justify-start"
              ref={detailsRef}
            >
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

        {isCardHovered && !isCardEdit && (
          <div className="flex flex-col justify-between">
            <div
              className="absolute right-2 top-1"
              onClick={() => setIsCardEdit(true)}
            >
              <MdOutlineModeEdit
                size={16}
                className="text-slate-200 bg-slate-500 rounded-full w-6 h-6 p-1 m-2 hover:bg-slate-50 hover:text-slate-700 cursor-pointer"
              />
            </div>
            <div
              className="absolute right-2 top-8"
              onClick={() => setShowCardDeleteModal(true)}
            >
              <AiOutlineDelete
                size={16}
                className="text-slate-200 bg-slate-500 rounded-full w-6 h-6 p-1 m-2 hover:bg-slate-50 hover:text-slate-700 cursor-pointer"
              />
            </div>
          </div>
        )}
        <div
          onClick={() => {
            !isCardEdit && setShowModal(true);
          }}
          onDragEnter={onDragEnter}
          onDragStart={(e) => onDragStart(e, item)}
          onDragOver={onDragOver}
          draggable={!isCardEdit}
          className="text-white m-1 border border-slate-900 bg-slate-800 rounded-lg py-3 hover:border hover:border-slate-300 hover:rounded-lg"
        >
          {isCardEdit ? (
            <textarea
              className="text-slate-200 bg-slate-700 text-left p-2 z-50"
              style={{ height: `${cardHeight}px` }}
              value={_cardTitle}
              onChange={(e) => _setCardTitle(e.target.value)}
              onBlur={onBlur}
              onFocus={onFocus}
              autoFocus
            />
          ) : (
            <div ref={cardRef} className="p-1 w-full">
              <p className="text-left p-2">{item.title}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ItemCard;
