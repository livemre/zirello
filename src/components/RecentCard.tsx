import React, { FC, useState } from "react";
import { Board } from "../context/Context";
import { CiStar } from "react-icons/ci";

type Props = {
  item: Board;
};

const RecentCard: FC<Props> = ({ item }) => {
  return (
    <div className="flex m-1 justify-start items-center hover:bg-slate-800 rounded-md p-1 cursor-pointer">
      <img src={item.bgImage} className="min-w-6 min-h-4 w-16 h-10" />
      <div className="ml-1">
        <p className="ml-1 text-slate-400">{item.name}</p>
        <p className="ml-1 text-slate-400 text-sm">Emre Karaduman Workspace</p>
      </div>
    </div>
  );
};

export default RecentCard;
