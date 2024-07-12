import React, { FC, ReactNode, createContext, useState } from "react";
import myFirebaseApp from "./firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { User } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

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

export type Board = {
  id: string;
  name: string;
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
  activeDraggedType: string;
  setActiveDraggedType: React.Dispatch<React.SetStateAction<string>>;
  activeListIndex: number;
  setActiveListIndex: React.Dispatch<React.SetStateAction<number>>;
  activeItemIndex: number;
  setActiveItemIndex: React.Dispatch<React.SetStateAction<number>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  addUser: (email: string, displayName: string) => void;
  createBoard: (name: string, userId: string) => void;
  getUserId: (email: string) => any;
};

const MainContext = createContext<Props | null>(null);

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const [db, setDB] = useState<Item[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [draggedItemHeight, setDraggedItemHeight] = useState<number>(0);
  const [targetColumnID, setTargetColumnID] = useState<string>("");
  const [activeItem, setActiveItem] = useState<Item | null>(null);

  const [activeList, setActiveList] = useState<List | undefined>(undefined);

  const [activeDraggedType, setActiveDraggedType] = useState<string>("");

  const [activeListIndex, setActiveListIndex] = useState<number>(0);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

  const [user, setUser] = useState<User | null>(null);

  const database = getFirestore(myFirebaseApp);

  const getUserId = async (email: string) => {
    const userRef = collection(database, "users");
    const q = query(userRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    const userId =
      querySnapshot.size > 0 ? querySnapshot.docs[0].id : undefined;

    return userId;
  };

  const addUser = async (email: string, displayName: string) => {
    // Check if user exist

    const userRef = collection(database, "users");

    const userExist = query(userRef, where("email", "==", email));

    console.log(userExist);

    const querySnapshot = await getDocs(userExist);
    querySnapshot.forEach((item) => {
      return item.data();
    });

    if (querySnapshot.size > 0) {
      return;
    }

    const newUser = await addDoc(userRef, {
      email: email,
      displayName: displayName,
    });

    const id = newUser.id;

    await setDoc(doc(database, "users", id), { id }, { merge: true });
  };

  const createBoard = async (name: string, userId: string) => {
    const id = uuidv4();

    if (userId === null) return console.log("No User Id");
    const userRef = doc(database, "users", userId);
    const boardsRef = collection(userRef, "boards");

    const newBoard = await addDoc(boardsRef, {
      id: id,
      name: name,
    });
  };

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
        activeDraggedType,
        setActiveDraggedType,
        activeListIndex,
        setActiveListIndex,
        setActiveItemIndex,
        activeItemIndex,
        user,
        setUser,
        addUser,
        createBoard,
        getUserId,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export { Provider, MainContext };
