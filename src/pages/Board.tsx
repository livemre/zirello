import React, { DragEvent, useContext, useEffect, useState } from "react";
import CreateList from "../components/CreateList";
import { MainContext, List as ListType } from "../context/Context";
import List from "../components/List";
import ListOverlayZone from "../components/ListOverlayZone";
import { useParams } from "react-router-dom";

const Board = () => {
  const [isListsLoaded, setIsListsLoaded] = useState<boolean>(false);

  const { id } = useParams();
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
  } = context;

  // İlk useEffect, id değiştiğinde veya lists güncellendiğinde çalışacak
  useEffect(() => {
    if (id) {
      getListsOfBoard(id)
        .then(() => console.log("Lists loaded successfully"))
        .catch((error) => console.error("Lists cannot be loaded", error));
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

  return (
    <div className="flex flex-row justify-start">
      <div className="flex-col">
        <div>Hosgeldin {user && user.displayName}</div>
        <img src={`${user ? user.photoURL : ""}`} width={200} height={200} />
      </div>
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
