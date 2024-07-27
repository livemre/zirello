import React from "react";
import Zirello_Hero from "../assets/zirello-hero.webp";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className="h-full bg-gray-700 flex font-Poppins">
      <div className="flex-col justify-start items-start w-full  ml-32 pt-40">
        <div className="flex flex-col text-left text-5xl text-slate-300">
          <p className="mb-4">Trello brings all your</p>
          <p className="mb-4">tasks, teammates, and</p>
          <p className="mb-4">tools together.</p>
        </div>
        <p className="text-left text-white text-2xl">
          Keep everything in the same place—even if your team isn’t.
        </p>
        <button className="bg-blue-600 p-3 flex self-start mt-12 text-slate-100">
          Get Zirello for Free
        </button>
      </div>
      <div>
        <img src={Zirello_Hero} className="p-32" />
      </div>
    </div>
  );
};

export default Home;
