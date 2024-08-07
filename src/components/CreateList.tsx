import React, {
  ChangeEvent,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CiSquarePlus } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import { MainContext } from "../context/Context";

type Props = {
  boardID: string;
};

const CreateList: FC<Props> = ({ boardID }) => {
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState<string>("");

  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No Context");
  }

  const { addList, lists } = context;

  useEffect(() => {
    const onOutisdeClick = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        console.log("Disariya tiklandi");
        setShowInput(false);
      }
    };

    document.addEventListener("click", onOutisdeClick);

    return () => {
      document.removeEventListener("click", onOutisdeClick);
    };
  }, []);

  const prepareList = () => {
    console.log("prepare");
    setShowInput((prev) => !prev);
  };

  const _addList = async () => {
    const listSize = lists.length;
    const result = await addList(title, boardID, listSize);
    if (result) {
      setTitle("");
    }
  };

  if (showInput) {
    return (
      <div
        className="flex-col items-start justify-start w-72 bg-black p-2 rounded-lg h-fit m-3"
        ref={inputRef}
      >
        <input
          className="bg-slate-600 p-3 text-white flex w-full rounded-lg mb-2"
          placeholder="Add list title..."
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          value={title}
        />

        <div className="flex justify-between w-full gap-1">
          <button
            className="bg-blue-400 hover:bg-blue-500 px-8 py-3 flex-1 rounded-lg"
            onClick={_addList}
          >
            Add List...
          </button>
          <button
            className="bg-slate-900 hover:bg-slate-600 px-3 py-3 rounded-lg"
            onClick={prepareList}
          >
            <IoCloseSharp size={16} color="white" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-72 bg-slate-200 flex items-center justify-start p-3 gap-2 hover:bg-slate-400 rounded-lg cursor-pointer h-fit m-3"
      onClick={prepareList}
    >
      <CiSquarePlus size={16} />
      Create List
    </div>
  );
};

export default CreateList;
