import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { ColumnItem } from "../../pages/BoardView";

type ColumnProps = {
  column: ColumnItem;
  onRename: (id: string, newTitle: string) => void;
};

export default function Column({ column, onRename }: ColumnProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(column.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commitRename = () => {
    const Title = title.trim();
    if (!Title) {
      setTitle(column.title);
      setEditing(false);
      return;
    }
    onRename(column.id, Title);
    setEditing(false);
  };

  return (
    <div className="min-w-[20vw] bg-[#161a21] rounded-md p-1.5">
      <div className="flex items-center justify-between mb-2 px-4 py-3 ">
        {editing ? (
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") {
                setTitle(column.title);
                setEditing(false);
              }
            }}
            onBlur={commitRename}
            className="text-sm font-medium w-full bg-transparent outline-none border-b border-transparent focus:border-[#2b3647] pb-0.5"
            placeholder="Column name"
          />
        ) : (
          <h2
            className="text-sm w-full font-medium"
            onDoubleClick={() => setEditing(true)}
            title="Double-click to rename"
          >
            {column.title}
          </h2>
        )}
        <BsThreeDotsVertical className="hover:cursor-pointer opacity-80" />
      </div>

      <div className="cards flex flex-col gap-2 px-3 py-2"></div>

      <div className="flex items-center gap-1 hover:bg-[#1f2125] hover:cursor-pointer p-3 rounded-md text-sm">
        <span className="text-lg leading-none">+</span>
        Add Card
      </div>
    </div>
  );
}
