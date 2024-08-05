import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoSearchSharp } from "react-icons/io5";
import { Board, MainContext } from "../context/Context";
import { Link } from "react-router-dom";

type Props = {};

const NavbarSearchBoards = (props: Props) => {
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [focus, setFocus] = useState(false);
  const [term, setTerm] = useState<string>("");
  const [filteredBoards, setFilteredBoards] = useState<Board[]>();
  const [isLinkClicked, setIsLinkClicked] = useState(false);

  const context = useContext(MainContext);
  if (!context) {
    throw new Error("No context");
  }

  const { boards } = context;

  useEffect(() => {
    handleSearch();
  }, [term]);

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    if (!isLinkClicked) {
      // Eğer Link'e tıklanmadıysa blur işlemini gerçekleştir
      setTimeout(() => {
        setFocus(false);
      }, 100); // Küçük bir gecikme ekleyin
    }
  };

  const handleSearch = () => {
    if (term.length > 2) {
      setFilteredBoards(
        boards.filter((item) =>
          item.name.toLowerCase().includes(term.toLowerCase())
        )
      );
    } else {
      setFilteredBoards(boards);
    }
  };

  const handleLinkClick = () => {
    setIsLinkClicked(true);
    setTimeout(() => {
      setIsLinkClicked(false);
    }, 100);
  };

  return (
    <div
      className={`flex border rounded-md relative py-1  ${
        focus
          ? "w-full flex-1 ml-10 border-blue-500 transition-all duration-300 "
          : "w-52 border-slate-400 transition-all duration-100 "
      } `}
      ref={searchRef}
    >
      <IoSearchSharp
        size={24}
        className="text-slate-400 absolute pointer-events-none ml-1"
      />
      <input
        className="bg-transparent ml-8 focus:outline-none text-slate-400"
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTerm(e.target.value)}
      />
      {focus && (
        <div className="absolute mt-9 bg-slate-700 w-full z-50 rounded-md border border-slate-500 min-w-full ">
          {filteredBoards && filteredBoards.length > 0
            ? filteredBoards.map((item) => (
                <Link
                  to={`/board/${item.id}`}
                  key={item.id}
                  onMouseDown={handleLinkClick}
                  onClick={() => setFocus(false)}
                >
                  <div className="flex items-center p-1 hover:bg-slate-800">
                    <img
                      src={item.bgImage}
                      className="w-12 h-10 m-w-12 min-h-8 rounded-md"
                      alt="board bg"
                    />
                    <div className="flex flex-col items-start">
                      <p className="text-slate-300 ml-2 mb-0">{item.name}</p>
                      <p className="text-slate-300 ml-2 mt-0 text-sm">
                        Emre Karaduman Workspace
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            : boards.map((item) => (
                <Link
                  to={`/board/${item.id}`}
                  key={item.id}
                  onMouseDown={handleLinkClick}
                  onClick={() => setFocus(false)}
                >
                  <div className="flex items-center p-1 hover:bg-slate-800">
                    <img
                      src={item.bgImage}
                      className="w-12 h-10 m-w-12 min-h-8 rounded-md"
                      alt="board bg"
                    />
                    <div className="flex flex-col items-start">
                      <p className="text-slate-300 ml-2 mb-0">{item.name}</p>
                      <p className="text-slate-300 ml-2 mt-0 text-sm">
                        Emre Karaduman Workspace
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      )}
    </div>
  );
};

export default NavbarSearchBoards;
