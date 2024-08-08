import React, {
  DragEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { Timestamp } from "firebase/firestore";
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import FavoriteToggle from "../components/FavoriteToggle";

const Board = () => {
  const { id } = useParams();
  const [boardDetails, setBoardDetails] = useState<BoardType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tempLists, setTempLists] = useState<ListType[]>([]);
  const [boardDetailsLoading, setBoardDetailsLoading] = useState<boolean>(true);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No Context");
  }

  const onDeleteList = () => {
    console.log("On delete list");
    if (!id) {
      return;
    }
    getListsOfBoard(id)
      .then(() => console.log("Lists loaded successfully"))
      .catch((error) => console.error("Lists cannot be loaded", error));
  };

  useEffect(() => {
    if (boardDetails) {
      setBoardDetailsLoading(false);
    }
  }, [boardDetails]);

  const {
    lists,
    setActiveList,
    setActiveDraggedType,
    setActiveListIndex,
    user,
    getListsOfBoard,
    getItem,
    getBoardDetails,
    moveList,
    activeList,
    updateLastUsingDate,
    setBoards,
    boards,
    makeBoardStarredToggle,
  } = context;

  useEffect(() => {
    _updateLastUsingDate();
  }, [id]);

  useEffect(() => {
    _getBoardDetails();
  }, [id]);

  const _updateLastUsingDate = async () => {
    if (!id) {
      return;
    }
    const date = Timestamp.now();
    const result = await updateLastUsingDate(id, date);
    console.log(result);
  };

  const _getBoardDetails = async () => {
    if (id) {
      const data = await getBoardDetails(id);
      setBoardDetails(data);
      console.log(data);
    }
  };

  useEffect(() => {
    if (id) {
      getListsOfBoard(id)
        .then(() => console.log("Lists loaded successfully"))
        .then(() => {
          getBoardDetails(id).then((data) => setBoardDetails(data));
        })
        .catch((error) => console.error("Lists cannot be loaded", error))
        .then(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    setTempLists(lists);
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
    e.stopPropagation();
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

  const onDrop = async (e: React.DragEvent, index: number) => {
    e.preventDefault();
    console.log("Drop");
    const draggedItemType = e.dataTransfer.getData("type");
    if (draggedItemType !== "list") {
      return;
    }

    if (
      activeList?.indexInList !== null &&
      activeList?.indexInList !== undefined &&
      id !== undefined
    ) {
      let newIndex = index;

      if (activeList?.indexInList === 0) {
        newIndex = index - 1;
      } else if (index === 0) {
        newIndex = 0;
      } else if (index <= activeList?.indexInList) {
        newIndex = index;
      } else if (index >= activeList?.indexInList) {
        newIndex = index - 1;
      }

      const newLists = [...tempLists];
      newLists.splice(activeList.indexInList, 1);
      newLists.splice(newIndex, 0, activeList);

      newLists.forEach((list, idx) => {
        list.indexInList = idx;
      });

      setTempLists(newLists);
      await moveList(newIndex, id, setTempLists, tempLists);
    }
  };

  const handleFavChanged = () => {
    console.log("Boards ici on fav changed");
    // setBoardDetails((prevDetails) => {
    //   // Ensure prevDetails is not null before attempting to update it
    //   if (prevDetails) {
    //     return {
    //       ...prevDetails,
    //       isFav: !prevDetails.isFav,
    //     };
    //   }
    //   // If prevDetails is null, return it unchanged
    //   return prevDetails;
    // });
  };

  useEffect(() => {
    if (boards && id) {
      const updatedBoard = boards.find((board) => board.id === id);
      if (updatedBoard) {
        setBoardDetails(updatedBoard);
      }
    }
  }, [boards, id]);

  if (loading || boardDetailsLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <ClipLoader size={48} className="text-slate-100" color="white" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {boardDetails && (
        <div className="h-14 bg-gray-300 flex items-center pl-10 border-b-2 border-slate-400">
          <p className="font-bold text-lg">{boardDetails?.name}</p>
          <div>
            {boardDetails && (
              <FavoriteToggle
                type="board"
                board={boardDetails}
                onFavChanged={handleFavChanged}
              />
            )}
          </div>
        </div>
      )}
      <div
        draggable="false"
        className="flex flex-row justify-start list-container h-full dark-overlay"
        style={{
          backgroundImage: `url(${boardDetails?.bgImage})`,
          backgroundColor: "#dddddd",
          backgroundSize: "cover",
        }}
      >
        {id && (
          <ListOverlayZone
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            index={0}
            onDrop={(e) => onDrop(e, 0)}
          />
        )}

        <div className="flex">
          {tempLists
            .sort((a, b) => a.indexInList - b.indexInList) // Listeleri indexInList değerine göre sırala
            .map((item, index) => {
              return (
                <div className="flex list" key={item.id}>
                  <div
                    draggable
                    onDragStart={(e) => onDragStart(e, item, index)}
                  >
                    <List
                      onDeleteList={onDeleteList}
                      title={item.title}
                      id={item.id}
                      index={index}
                      indexInList={item.indexInList}
                      boardID={item.boardID}
                    />
                  </div>
                  {id && (
                    <ListOverlayZone
                      onDragEnter={onDragEnter}
                      onDragOver={onDragOver}
                      index={index + 1}
                      onDrop={(e) => onDrop(e, index + 1)}
                    />
                  )}
                </div>
              );
            })}
          {id && <CreateList boardID={id} />}
        </div>
      </div>
    </div>
  );
};

export default Board;
