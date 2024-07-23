import React, { FC, useContext, useEffect, useState } from "react";

import { Item, MainContext } from "../context/Context";
import { ClipLoader } from "react-spinners";
import { GrTextAlignLeft } from "react-icons/gr";

type Props = {
  item: Item;
};

const ItemCardDescription: FC<Props> = ({ item }) => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No context");
  }

  const { addDescToItem, getDecsForItem, updateDesc } = context;

  const [desc, setDesc] = useState<string>("");
  const [updatedDesc, setUpdatedDesc] = useState<string | null>(null);
  const [showDescInput, setShowDescInput] = useState<boolean>(false);
  const [descLoading, setDescLoading] = useState<boolean>(true);
  const [editDesc, setEditDesc] = useState<boolean>(false);
  const [descEditing, setDescEditing] = useState<string>("");
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const _addDescToItem = () => {
    addDescToItem(desc, item.id).then((result) => {
      if (result) {
        getDecsForItem(item.id).then((res) => setUpdatedDesc(res));
      }
    });
  };

  useEffect(() => {
    console.log("desc Editing " + descEditing);
    console.log("updated Desc " + updatedDesc);
  }, [updatedDesc, descEditing]);

  const getUpdatedDesc = async () => {
    const desc = await getDecsForItem(item.id);
    setUpdatedDesc(desc);
  };

  useEffect(() => {
    getUpdatedDesc().then(() => setDescLoading(false));
  }, []);

  useEffect(() => {
    if (updatedDesc) {
      setDescEditing(updatedDesc);
    }
  }, [updatedDesc]);

  const _updateDesc = () => {
    console.log("Desc update");

    setSaveLoading(true);

    updateDesc(item.id, descEditing)
      .then(getUpdatedDesc)
      .then(() => setEditDesc(false))
      .then(() => setSaveLoading(false));
  };

  if (descLoading) {
    return (
      <div className="flex-col items-center justify-between">
        <div className="flex items-center ">
          <GrTextAlignLeft size={20} color="#94a3b8" />
          <h1 className="text-1xl ml-2 text-slate-400">Description</h1>
        </div>
        <ClipLoader color={"#94a3b8"} loading={descLoading} size={25} />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center ">
          <GrTextAlignLeft size={20} color="#94a3b8" />
          <h1 className="text-1xl ml-2 text-slate-400">Description</h1>
        </div>
        {updatedDesc && editDesc !== true && (
          <button
            className=" bg-slate-500 px-4 py-1 hover:bg-slate-400"
            onClick={() => setEditDesc(true)}
          >
            Edit
          </button>
        )}
      </div>
      {editDesc && updatedDesc && descEditing.length > -1 && (
        <div className="ml-8">
          <textarea
            className="pl-2 mt-3 bg-slate-600 p-2 text-slate-400 w-full"
            placeholder={updatedDesc}
            value={descEditing}
            onChange={(e) => setDescEditing(e.target.value)}
          />
          <div className="flex gap-3">
            {saveLoading ? (
              <button
                className="bg-gray-400 px-3 py-1 rounded-md cursor-not-allowed"
                onClick={_updateDesc}
                disabled={true}
              >
                Saving...
              </button>
            ) : (
              <button
                className="bg-blue-400 hover:bg-blue-300 px-3 py-1 rounded-md"
                onClick={_updateDesc}
              >
                Save
              </button>
            )}
            <button
              onClick={() => setEditDesc(false)}
              className="text-slate-400 hover:bg-slate-500 px-3 py-1 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {updatedDesc !== null &&
        updatedDesc !== undefined &&
        editDesc === false && (
          <div className="text-slate-400 bg-slate-700 mt-3 p-3 ml-8 flex self-start">
            <p>{updatedDesc}</p>
          </div>
        )}
      {updatedDesc === null ||
        (updatedDesc === undefined && (
          <>
            {showDescInput === false && (
              <div
                onClick={() => setShowDescInput(true)}
                className="w-full mt-3"
              >
                <p className="bg-slate-500 p-4 ml-8 cursor-pointer">
                  Add a more detailed description...{" "}
                </p>
              </div>
            )}
            {showDescInput === true && (
              <div className="w-full pl-8">
                <textarea
                  className="pl-2 mt-3 bg-slate-600 p-2 text-slate-400 w-full"
                  placeholder="add description..."
                  onChange={(e) => setDesc(e.target.value)}
                />
                <div className="flex items-center justify-start gap-3 mt-1">
                  <button
                    className="bg-blue-400 hover:bg-blue-300 px-3 py-1 rounded-md"
                    onClick={_addDescToItem}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowDescInput(false)}
                    className="text-slate-400 hover:bg-slate-500 px-3 py-1 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        ))}
    </>
  );
};

export default ItemCardDescription;
