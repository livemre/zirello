import React, { DragEvent, useContext, useEffect, useState } from "react";
import CreateList from "../components/CreateList";
import {
  MainContext,
  List as ListType,
  Board as BoardType,
} from "../context/Context";
import List from "../components/List";
import ListOverlayZone from "../components/ListOverlayZone";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const Board = () => {
  const { id } = useParams();
  const [boardDetails, setBoardDetails] = useState<BoardType | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No Context");
  }

  const {
    lists,
    setActiveList,
    setActiveDraggedType,
    setActiveListIndex,
    user,
    getListsOfBoard,
    getItem,
    getBoardDetails,
  } = context;

  useEffect(() => {
    _getBoardDetails();
  }, [id]);

  const _getBoardDetails = async () => {
    if (id) {
      const data = await getBoardDetails(id);
      console.log(data);
      setBoardDetails(data);
    }
  };

  // İlk useEffect, id değiştiğinde veya lists güncellendiğinde çalışacak
  useEffect(() => {
    if (id) {
      getListsOfBoard(id)
        .then(() => console.log("Lists loaded successfully"))
        .catch((error) => console.error("Lists cannot be loaded", error))
        .then(() => setLoading(false));
    }
  }, [id]);

  // İkinci useEffect, lists değiştiğinde çalışacak
  useEffect(() => {
    const ids: any = [];
    lists.forEach((item) => {
      console.log("Item ID:", item.id);
      ids.push(item.id);
    });
    console.log(ids);
    getItem(ids);
  }, [lists]);

  const onDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    list: ListType,
    index: number
  ) => {
    setActiveList(list);
    e.dataTransfer.setData("type", "list");
    setActiveDraggedType("list");
    setActiveListIndex(index);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const onDragEnter = (e: DragEvent) => {
    e.preventDefault();
    console.log("Board drag enter");
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <ClipLoader size={48} className="text-slate-100" color="white" />
      </div>
    );
  }

  return (
    <div
      className="flex flex-row justify-start list-container h-full"
      style={{
        backgroundImage: `url(${boardDetails?.bgImage})`,
        backgroundSize: "cover",
      }}
    >
      {id && (
        <ListOverlayZone
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          index={0}
          boardID={id}
        />
      )}
      <div className="flex">
        {lists
          .sort((a, b) => a.indexInList - b.indexInList) // Listeleri indexInList değerine göre sırala
          .map((item, index) => {
            return (
              <div className="flex list" key={item.id}>
                <div draggable onDragStart={(e) => onDragStart(e, item, index)}>
                  <List
                    title={item.title}
                    id={item.id}
                    index={index}
                    indexInList={item.indexInList}
                  />
                </div>
                {id && (
                  <ListOverlayZone
                    onDragEnter={onDragEnter}
                    onDragOver={onDragOver}
                    index={index + 1}
                    boardID={id}
                  />
                )}
              </div>
            );
          })}
        {id && <CreateList boardID={id} />}
      </div>
    </div>
  );
};

export default Board;
