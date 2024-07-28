import React, { FC, ReactNode, createContext, useState } from "react";
import myFirebaseApp from "./firebaseConfig";
import {
  FieldValue,
  QueryDocumentSnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { User } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { list } from "firebase/storage";

export type Item = {
  id: string;
  title: string;
  listID: string;
  itemIndex: number;
  desc: string;
};

export type List = {
  id: string;
  title: string;
  indexInList: number;
};

export type Board = {
  name: string;
  userID: string;
  id: string;
  bgImage: string;
};

export type BGType = {
  id: number;
  url: string;
};

export type ItemComment = {
  comment: string;
  createdAt: Timestamp;
  id: string;
};

type Props = {
  addItem: (title: string, listID: string, index: number) => void;
  //addList: (title: string) => void;
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
  moveList: (index: number, boardID: string) => Promise<boolean>;
  activeDraggedType: string;
  setActiveDraggedType: React.Dispatch<React.SetStateAction<string>>;
  activeListIndex: number;
  setActiveListIndex: React.Dispatch<React.SetStateAction<number>>;
  activeItemIndex: number;
  setActiveItemIndex: React.Dispatch<React.SetStateAction<number>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  addUser: (userID: string, email: string, displayName: string) => void;
  getBoards: (userID: string) => Promise<boolean>;
  addBoard: (userID: string, name: string, bgImage: string) => Promise<boolean>;
  boards: Board[];
  addList: (
    title: string,
    boardID: string,
    indexInList: number
  ) => Promise<boolean>;
  getListsOfBoard: (boardID: string) => Promise<boolean>;
  getItem: (listIDs?: any, listID?: string) => void;
  getBGImages: () => Promise<BGType[]>;
  getBoardDetails: (id: string) => Promise<Board | null>;
  addDescToItem: (desc: string, id: string) => Promise<boolean>;
  getDecsForItem: (id: string) => Promise<string>;
  updateDesc: (id: string, desc: string) => Promise<boolean>;
  addCommentToItem: (ItemID: string, comment: string) => Promise<boolean>;
  getItemComments: (itemID: string) => Promise<ItemComment[]>;
  updateComment: (
    itemID: string,
    comment: string,
    commentID: string
  ) => Promise<boolean>;
  deleteComment: (itemID: string, commentID: string) => Promise<boolean>;
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
  const [boards, setBoards] = useState<Board[]>([]);
  const database = getFirestore(myFirebaseApp);

  const deleteComment = async (
    itemID: string,
    commentID: string
  ): Promise<boolean> => {
    try {
      const itemRef = doc(database, "items", itemID);
      const commentRef = doc(itemRef, "comments", commentID);
      await deleteDoc(commentRef);
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateComment = async (
    itemID: string,
    comment: string,
    commentID: string
  ): Promise<boolean> => {
    try {
      const itemRef = doc(database, "items", itemID);
      const commentRef = doc(itemRef, "comments", commentID);
      await setDoc(commentRef, { comment: comment }, { merge: true });
      console.log(comment);

      console.log("Update comment");

      return true;
    } catch (error) {
      return false;
    }
  };

  const getItemComments = async (itemID: string): Promise<ItemComment[]> => {
    const itemRef = doc(database, "items", itemID);
    const commentsRef = collection(itemRef, "comments");
    const allComments = await getDocs(commentsRef);
    let comments: ItemComment[] = [];
    allComments.forEach((item) => {
      const comment = item.data() as ItemComment;
      comments.push(comment);
      console.log(comment.comment);
    });
    return comments;
  };

  const addCommentToItem = async (
    itemID: string,
    comment: string
  ): Promise<boolean> => {
    try {
      const itemRef = doc(database, "items", itemID);
      const commentsCollectionRef = collection(itemRef, "comments");

      const result = await addDoc(commentsCollectionRef, {
        createdAt: serverTimestamp(),
        comment: comment,
      });
      const docID = result.id;

      const commentRef = doc(commentsCollectionRef, docID);

      console.log(result.id);

      await setDoc(commentRef, { id: docID }, { merge: true });
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateDesc = async (id: string, desc: string): Promise<boolean> => {
    try {
      const itemRef = collection(database, "items");
      const docRef = doc(itemRef, id);
      await updateDoc(docRef, { desc: desc });
      return true;
    } catch (error) {
      return false;
    }
  };

  const getDecsForItem = async (id: string): Promise<string> => {
    const itemRef = collection(database, "items");
    const docRef = doc(itemRef, id);
    const document = await getDoc(docRef);
    const item = document.data() as Item;
    console.log(item.desc);
    return item.desc;
  };

  const addDescToItem = async (desc: string, id: string): Promise<boolean> => {
    try {
      const itemRef = collection(database, "items");
      const docRef = doc(itemRef, id);
      await setDoc(docRef, { desc: desc }, { merge: true });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const getListsOfBoard = async (boardID: string): Promise<boolean> => {
    const listRef = collection(database, "lists");

    const q = query(listRef, where("boardID", "==", boardID));
    const querySnapshot = await getDocs(q);
    let lists: List[] = [];
    querySnapshot.forEach((item) => {
      const listData = item.data() as List;
      lists.push({ ...listData, id: item.id });
    });

    setLists(lists);
    return true;
  };

  const getBoardDetails = async (id: string): Promise<Board | null> => {
    const boardRef = collection(database, "boards");
    const q = query(boardRef, where("id", "==", id));
    const docs = await getDocs(q);

    if (!docs.empty) {
      // İlk belgeyi al ve geri döndür
      const firstDoc = docs.docs[0];
      const data = firstDoc.data() as Board;
      return data;
    }

    return null; // Eğer eşleşen belge yoksa null döndür
  };

  const addBoard = async (
    userID: string,
    name: string,
    bgImage: string
  ): Promise<boolean> => {
    try {
      const boardRef = collection(database, "boards");
      const board = await addDoc(boardRef, {
        name,
        userID,
        bgImage,
      });

      const boardDocID = board.id;

      await setDoc(
        doc(database, "boards", boardDocID),
        { id: boardDocID },
        { merge: true }
      );
      return true;
    } catch (error) {
      return false;
    }
  };

  const getBoards = async (userID: string): Promise<boolean> => {
    try {
      const boardRef = collection(database, "boards");
      const q = query(boardRef, where("userID", "==", userID));
      const querySnapshot = await getDocs(q);
      let boardsData: Board[] = []; // Yeni array

      querySnapshot.forEach((item: QueryDocumentSnapshot) => {
        const boardData = item.data() as Board;
        boardsData.push({ ...boardData });
      });
      setBoards(boardsData);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const addUser = async (
    userID: string,
    email: string,
    displayName: string
  ) => {
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

    await addDoc(userRef, {
      email: email,
      displayName: displayName,
      id: userID,
    });
  };

  const addItem = async (title: string, listID: string, index: number) => {
    const itemRef = collection(database, "items");

    const addedItem = await addDoc(itemRef, {
      title: title,
      listID: listID,
      itemIndex: index,
    });

    const id = addedItem.id;

    await setDoc(doc(database, "items", id), { id: id }, { merge: true });

    await getItem();

    // const id = (db.length + 1).toString();
    // setDB([...db, { id, title, listID }]);
  };

  const getBGImages = async (): Promise<BGType[]> => {
    const imagesRef = collection(database, "assets");

    const bgArray: BGType[] = [];

    const bgs = await getDocs(imagesRef);
    bgs.forEach((item) => {
      const singleData = item.data() as BGType;
      bgArray.push(singleData);
    });

    return bgArray;
  };

  const getItem = async () => {
    const itemRef = collection(database, "items");
    const receivedList: any = [];

    const docs = await getDocs(itemRef);
    docs.docs.forEach((doc) => {
      receivedList.push({ id: doc.id, ...doc.data() });
    });

    setDB(receivedList);
  };

  const addList = async (
    title: string,
    boardID: string,
    indexInList: number
  ): Promise<boolean> => {
    try {
      const id = uuidv4();
      const listRef = collection(database, "lists");

      await addDoc(listRef, { id: id, title, boardID, indexInList });
      getListsOfBoard(boardID);
      return true;
    } catch (error) {
      return false;
    }
  };

  const moveItem = async (index: number, item: Item) => {
    if (index === null) return;

    const updatedDB = db.filter((dbItem) => dbItem.id !== item.id);
    console.log(targetColumnID);

    updatedDB.splice(index, 0, { ...item, listID: targetColumnID });

    setDB(updatedDB);
    console.log(updatedDB);

    // itemIndex değerlerini güncelle
    updatedDB.forEach((item, idx) => {
      item.itemIndex = idx;
    });

    // Firebase'de toplu güncelleme işlemi
    const batch = writeBatch(database);

    updatedDB.forEach((item) => {
      const itemRef = doc(database, "items", item.id); // Burada doc fonksiyonunun doğru kullanıldığından emin olun
      batch.update(itemRef, { listID: item.listID, itemIndex: item.itemIndex });
    });

    try {
      await batch.commit();
      console.log("Firebase güncellemesi başarılı");
      setDB(updatedDB);
    } catch (error) {
      console.error("Firebase güncellemesi sırasında hata: ", error);
    }
  };

  const moveList = async (index: number, boardID: string): Promise<boolean> => {
    console.log("Move Item Context");

    try {
      // Firebase'den listeleri al
      const boardsRef = collection(database, "lists");
      const q = query(boardsRef, where("boardID", "==", boardID));
      const listsSnapshot = await getDocs(q);
      const listsData = listsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Mevcut listelerin yedeğini al
      let backupLists: any;

      // Verileri güncelle
      if (activeList) {
        setLists((prevLists) => {
          backupLists = [...prevLists]; // Yedeği al

          const updatedLists = prevLists.filter(
            (listItem) => listItem.id !== activeList.id
          );
          updatedLists.splice(index, 0, activeList);

          // indexInList değerlerini güncelle
          updatedLists.forEach((list, idx) => {
            list.indexInList = idx;
          });

          console.log(updatedLists);

          // Firebase'de toplu güncelleme işlemi
          const batch = writeBatch(database);

          updatedLists.forEach((list) => {
            const listRef = doc(database, "lists", list.id);
            batch.update(listRef, { indexInList: list.indexInList });
          });

          batch
            .commit()
            .then(() => {
              console.log("Firebase güncellemesi başarılı");
            })
            .catch((error) => {
              console.error("Firebase güncellemesi sırasında hata: ", error);
              // Firebase güncellemesi başarısız olursa eski durumu geri yükle
              setLists(backupLists);
            });

          return updatedLists;
        });
      }
      return true;
    } catch (error) {
      return false;
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
        getBoards,
        addBoard,
        boards,
        getListsOfBoard,
        getItem,
        getBGImages,
        getBoardDetails,
        addDescToItem,
        getDecsForItem,
        updateDesc,
        addCommentToItem,
        getItemComments,
        updateComment,
        deleteComment,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export { Provider, MainContext };
