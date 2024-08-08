import React, {
  FC,
  LegacyRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Board, MainContext } from "../context/Context";
import { CiStar } from "react-icons/ci";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import FavoriteToggle from "./FavoriteToggle";

type Props = {
  item: Board;
  setShowStar: React.Dispatch<React.SetStateAction<boolean>>;
  starDivRef: LegacyRef<HTMLDivElement>;
};

const StarredCard: FC<Props> = ({ item, setShowStar }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    console.log(item.id);
  }, [item]);

  if (loading) {
    return <p>Loading</p>;
  }

  return (
    <div className="flex items-center justify-between">
      <Link
        to={`/board/${item.id}`}
        onClick={() => setShowStar(false)}
        key={item.id}
      >
        <div className="flex m-1 justify-start items-center hover:bg-slate-800 rounded-md p-1 cursor-pointer">
          <img src={item.bgImage} className="min-w-6 min-h-4 w-16 h-10" />
          <div className="ml-1">
            <p className="ml-1 text-slate-400">{item.name}</p>
            <p className="ml-1 text-slate-400 text-sm">
              Emre Karaduman Workspace
            </p>
          </div>
        </div>
      </Link>
      <div>
        <FavoriteToggle board={item} />
      </div>
    </div>
  );
};

export default StarredCard;
