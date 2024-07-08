import React, { FC, ReactNode, createContext, useState } from "react";

export type Item = {
  id: string;
  title: string;
  listID: string;
};

export type List = {
  id: string;
  title: string;
  items: Item[];
};

type Props = {
  addItem: (title: string, listID: string) => void;
  addList: (title: string) => void;
  db: Item[];
  lists: List[];
  draggedItemHeight: number;
  setDraggedItemHeight: React.Dispatch<React.SetStateAction<number>>;
  targetColumnID: string;
  setTargetColumnID: React.Dispatch<React.SetStateAction<string>>;
  activeItem: Item | null;
  setActiveItem: React.Dispatch<React.SetStateAction<Item | null>>;
  moveItem: (index: number, item: Item) => void;
  activeList: List | undefined;
  setActiveList: React.Dispatch<React.SetStateAction<List | undefined>>;
  moveList: (index: number) => void;
};

const MainContext = createContext<Props | null>(null);

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const [db, setDB] = useState<Item[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [draggedItemHeight, setDraggedItemHeight] = useState<number>(0);
  const [targetColumnID, setTargetColumnID] = useState<string>("");
  const [activeItem, setActiveItem] = useState<Item | null>(null);

  const [activeList, setActiveList] = useState<List | undefined>(undefined);

  const addItem = (title: string, listID: string) => {
    const id = (db.length + 1).toString();
    setDB([...db, { id, title, listID }]);
  };

  const addList = (title: string) => {
    const id = (lists.length + 1).toString();
    setLists([...lists, { id, title, items: [] }]);
  };

  const moveItem = (index: number, item: Item) => {
    if (index === null) return;

    const updatedDB = db.filter((dbItem) => dbItem.id !== item.id);

    updatedDB.splice(index, 0, { ...item, listID: targetColumnID });

    setDB(updatedDB);
  };

  const moveList = (index: number) => {
    console.log("Move Item Context");

    if (activeList) {
      setLists((prevLists) => {
        const updateLists = prevLists.filter(
          (listItem) => listItem.id !== activeList.id
        );
        updateLists.splice(index, 0, activeList);

        console.log(updateLists);
        return updateLists;
      });
    }
  };

  return (
    <MainContext.Provider
      value={{
        addItem,
        addList,
        db,
        lists,
        draggedItemHeight,
        setDraggedItemHeight,
        targetColumnID,
        setTargetColumnID,
        activeItem,
        setActiveItem,
        moveItem,
        activeList,
        setActiveList,
        moveList,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export { Provider, MainContext };
