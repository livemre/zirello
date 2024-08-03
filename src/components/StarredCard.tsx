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

type Props = {
  item: Board;
  setShowStar: React.Dispatch<React.SetStateAction<boolean>>;
  starDivRef: LegacyRef<HTMLDivElement>;
};

const StarredCard: FC<Props> = ({ item, setShowStar, starDivRef }) => {
  const [loading, setLoading] = useState(true);
  const [isStarHovered, setIsStarHovered] = useState(false);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No context");
  }

  const { makeBoardStarredToggle, getBoards, user } = context;

  const handleClickStar = async () => {
    const starBackUp = item.isFav; // Mevcut durumu yedekle
    item.isFav = !item.isFav; // UI'yi hemen güncelle

    // Firebase'de durumu güncelle
    const result = await makeBoardStarredToggle(item.id);

    if (!user) {
      return;
    }

    // Eğer işlem başarısız olursa durumu geri al
    if (!result) {
      item.isFav = starBackUp;
    } else {
      getBoards(user.uid);
    }
  };

  useEffect(() => {
    setLoading(false);
    console.log(item.id);
  }, [item]);

  useEffect(() => {
    console.log("Item guncellendi!");
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
      <div
        ref={starDivRef}
        onClick={handleClickStar}
        onMouseEnter={() => setIsStarHovered(true)}
        onMouseLeave={() => setIsStarHovered(false)}
      >
        {!isStarHovered ? (
          <FaStar size={22} className="text-yellow-500 hover:text-slate-200" />
        ) : (
          <CiStar size={22} className="text-yellow-500 hover:text-slate-200" />
        )}
      </div>
    </div>
  );
};

export default StarredCard;
