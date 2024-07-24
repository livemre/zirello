import React, { FC, useContext, useEffect, useState } from "react";
import { Item, ItemComment, MainContext } from "../context/Context";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import SingleComment from "./SingleComment";

type Props = {
  item: Item;
};

const ItemCardComments: FC<Props> = ({ item }) => {
  const [comment, setComment] = useState<string>("");
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);
  const [comments, setComments] = useState<ItemComment[]>([]);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No context");
  }

  const { user, addCommentToItem, getItemComments } = context;

  const photoURL = user && user.photoURL ? user.photoURL : "";

  useEffect(() => {
    _getItemComments();
  }, [user]);

  const _getItemComments = async () => {
    const _comments = await getItemComments(item.id);
    setComments(_comments);
  };

  const _addCommentToItem = async () => {
    const result = await addCommentToItem(item.id, comment);
    if (result) {
      setShowCommentInput(false);
      _getItemComments();
    }
  };

  const onEditHandle = (id: string) => {
    setEditingItem(id);
  };

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
              className="bg-slate-400 w-full p-2"
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex w-full gap-3 mt-1">
              <button
                className="bg-blue-400 hover:bg-blue-300 px-3 py-1 rounded-md"
                onClick={_addCommentToItem}
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
      {comments && (
        <div className="flex-col gap-3 mt-6 mb-8">
          {user &&
            comments
              .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
              .map((commentItem) => {
                return (
                  <SingleComment
                    item={commentItem}
                    profileImg={photoURL}
                    user={user}
                    canEditing={commentItem.id === editingItem}
                    onEditHandle={onEditHandle}
                    setEditingItem={setEditingItem}
                    itemID={item.id}
                    getComment={_getItemComments}
                  />
                );
              })}
        </div>
      )}
    </>
  );
};

export default ItemCardComments;
