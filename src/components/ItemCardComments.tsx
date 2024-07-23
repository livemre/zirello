import React, { FC, useContext, useState } from "react";
import { Item, MainContext } from "../context/Context";
import { BsFillChatLeftTextFill } from "react-icons/bs";

type Props = {
  item: Item;
};

const ItemCardComments: FC<Props> = ({ item }) => {
  const [comment, setComment] = useState<string>("");
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No context");
  }

  const { user, addCommentToItem } = context;

  const photoURL = user && user.photoURL ? user.photoURL : "";

  return (
    <>
      <div className="flex items-center justify-start mt-6">
        <BsFillChatLeftTextFill size={20} color="#94a3b8" />
        <h1 className="text-1xl ml-2 text-slate-400">Activity</h1>
      </div>
      <div className="mt-5 flex items-start w-full ">
        {<img className="rounded-full" width={25} height={25} src={photoURL} />}
        {showCommentInput ? (
          <div className="w-full pl-2">
            <textarea
              className="bg-slate-400 w-full"
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex w-full gap-3 mt-1">
              <button
                className="bg-blue-400 hover:bg-blue-300 px-3 py-1 rounded-md"
                onClick={() => addCommentToItem(item.id, comment)}
              >
                Save
              </button>
              <button
                onClick={() => setShowCommentInput(false)}
                className="text-slate-400 hover:bg-slate-500 px-3 py-1 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className="ml-2 py-2 px-4 rounded-lg bg-gray-900 text-slate-400 w-full"
            onClick={() => setShowCommentInput(true)}
          >
            <p className="cursor-pointer">Write a comment...</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ItemCardComments;
