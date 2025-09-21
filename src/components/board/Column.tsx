import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { ColumnItem } from "../../pages/BoardView";

type ColumnProps = {
  column: ColumnItem;
  onRename: (id: string, newTitle: string) => void;
onDelete: (id: string) => void; 
};

export default function Column({ column, onRename, onDelete }: ColumnProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(column.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

   const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);  

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

   useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [menuOpen]);

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
    <div className="min-w-[70vw] md:min-w-[40vw] lg:min-w-[20vw] bg-[#161a21] rounded-md md:p-1.5 p-1">
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
         <div className="relative" ref={menuRef}>
          <BsThreeDotsVertical
            className="hover:cursor-pointer opacity-80"
            onClick={() => setMenuOpen((s) => !s)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          />
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-1 w-30 rounded-md bg-[#0f141b] border border-[#263241] shadow-lg z-50 overflow-hidden"
            >
              <button
                role="menuitem"
                className="w-full text-left px-3 py-2 hover:bg-[#141b26] text-sm"
                onClick={() => {
                  setMenuOpen(false);
                  setEditing(true); 
                }}
              >
                Rename
              </button>
              <button
                role="menuitem"
                className="w-full text-left px-3 py-2 hover:bg-[#141b26] text-sm text-red-400"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(column.id); 
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="cards flex flex-col gap-2 px-3 py-2"></div>

      <div className="flex items-center gap-1 hover:bg-[#1f2125] hover:cursor-pointer p-3 rounded-md text-sm">
        <span className="text-lg leading-none">+</span>
        Add Card
      </div>
    </div>
  );
}
