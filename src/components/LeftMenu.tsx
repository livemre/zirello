import React, { useContext } from "react";
import { MainContext } from "../context/Context";
import { LuClipboardEdit } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";
import CreateBoardButton from "./CreateBoardButton";
import LeftMenuItem from "./LeftMenuItem";

type Props = {};

const LeftMenu = (props: Props) => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No Context");
  }

  const { boards } = context;

  return (
    <div className="h-screen bg-slate-900 w-64  border-r border-slate-500">
      <div className="flex justify-between items-center mb-2 p-2">
        <p className="text-slate-400 font-bold">Your boards</p>
        <CreateBoardButton type="sidebar-button" />
      </div>
      <ul>
        {boards.map((item) => (
          <LeftMenuItem item={item} />
        ))}
      </ul>
    </div>
  );
};

export default LeftMenu;
