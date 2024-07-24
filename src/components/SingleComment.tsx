import React, { FC, useContext, useState } from "react";
import { ItemComment, MainContext } from "../context/Context";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

type Props = {
  item: ItemComment;
  profileImg: string;
  user: User;
  canEditing: boolean;
  onEditHandle: (id: string) => void;
  setEditingItem: React.Dispatch<React.SetStateAction<string | null>>;
  itemID: string;
  getComment: () => Promise<void>;
};

const SingleComment: FC<Props> = ({
  item,
  profileImg,
  user,
  canEditing,
  onEditHandle,
  setEditingItem,
  getComment,
  itemID,
}) => {
  const [comment, setComment] = useState<string>(item.comment);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No Context");
  }

  const { updateComment } = context;

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp.seconds * 1000); // Timestamp'i Date nesnesine dönüştürme

    const options: any = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("en-EN", options).format(date);
  };

  const _updateComment = async () => {
    console.log(itemID);
    console.log(item.id);

    const result = await updateComment(itemID, comment, item.id);
    console.log(result);

    if (result) {
      await getComment();
      setEditingItem(null);
    }
  };

  return (
    <>
      <div
        className="bg-slate-700 flex-col ml-8 rounded-md hover:bg-slate-600 mt-3"
        style={{ border: `${canEditing ? "2px solid #ddd" : ""}` }}
      >
        <div className=" text-slate-200 p-3 flex-col items-start  rounded-md mt-1">
          <div className="flex items-center gap-1">
            <img
              className="rounded-full mr-2"
              width={15}
              height={15}
              src={profileImg}
            />
            <p className="text-sm font-bold">{user.displayName}</p>
            <p className="text-sm font-thin ml-2">
              {formatDate(item.createdAt)}
            </p>
          </div>
          {canEditing ? (
            <div className="flex-col items-start justify-start ml-8">
              <textarea
                className="w-full p-2 bg-slate-500"
                placeholder={item.comment}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          ) : (
            <div className="flex-col items-start justify-start ml-8">
              <p className="text-left">{item.comment}</p>
            </div>
          )}
        </div>
      </div>
      {canEditing ? (
        <div className="flex ml-8 p-2">
          <button
            className=" px-4 py-1 text-slate-300 bg-blue-600 hover:bg-blue-500 rounded-md"
            onClick={_updateComment}
          >
            Save
          </button>

          <button
            onClick={() => {
              setEditingItem(null);
              setComment(item.comment);
            }}
            className=" px-4 py-1 text-slate-300"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex ml-8 p-2">
          <button
            className=" px-4 py-1 text-slate-300  underline text-sm"
            onClick={() => onEditHandle(item.id)}
          >
            Edit
          </button>

          <button className=" px-4 py-1 text-slate-300  underline text-sm">
            Delete
          </button>
        </div>
      )}
    </>
  );
};

export default SingleComment;