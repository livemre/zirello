import React, { ChangeEvent, useEffect, useState } from "react";

type Props = {};

const Input = (props: Props) => {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    addCursor();
  }, [text]);

  const addCursor = () => {
    console.log("Text");
    console.log(text);

    // | karakterini sadece ekranda gösterilecek olan değişkene ekleyin
    const textWithCursor = text + "|";

    // input value'sini güncellemek için setState çağırmayın
    document.querySelector(".input-text").value = textWithCursor;
  };

  return (
    <div>
      <input
        onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
        placeholder={text}
        className="input-text"
        value={text} // input'un value'sini state ile senkronize tutun
      />
    </div>
  );
};

export default Input;
