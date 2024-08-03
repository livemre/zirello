import React, { useContext } from "react";
import { MainContext } from "../context/Context";
import { LuClipboardEdit } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";
import CreateBoardButton from "./CreateBoardButton";

type Props = {};

const LeftMenu = (props: Props) => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No Context");
  }

  const { boards } = context;

  return (
    <div className="h-screen bg-slate-900 w-64  border-r-2 border-slate-500">
      <div className="flex justify-between items-center mb-2">
        <p className="text-slate-400 font-bold">Your boards</p>
        <CreateBoardButton type="sidebar-button" />
      </div>
      <ul>
        {boards.map((item) => (
          <li className="flex items-center m-1 p-2 hover:bg-slate-700 cursor-pointer">
            <img src={item.bgImage} className="w-8 h-5 mr-2" />
            <p className="text-slate-400">{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftMenu;
