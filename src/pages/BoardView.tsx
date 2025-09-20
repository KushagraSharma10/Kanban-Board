import { useState } from "react";
import Column from "../components/board/Column";
import { GoPlus } from "react-icons/go";
import { nanoid } from "nanoid";

export type CardItem = {
  id: string;
  title: string;
  description?: string;
};

export type ColumnItem = {
  id: string;
  title: string;
  cards: CardItem[];
};

const cloumns = [
  { id: nanoid(), title: "To Do", cards: [] },
  { id: nanoid(), title: "In Progress", cards: [] },
  { id: nanoid(), title: "Done", cards: [] },
];



export default function BoardView() {
  const [columns, setColumns] = useState<ColumnItem[]>(cloumns);

  const renameColumn = (id: string, newTitle: string) => {
    const t = newTitle.trim();
    if (!t) return;
    setColumns(prev => prev.map(c => (c.id === id ? { ...c, title: t } : c)));
  };

  const addColumn = () => {
    const name = prompt("Column name?");
    if (!name?.trim()) return;
    setColumns((prev) => [
      ...prev,
      { id: nanoid(), title: name.trim(), cards: [] },
    ]);
  };

  return (
    <div className="w-full min-h-screen text-white bg-[#0b0f14]">
      <header className="p-6 border-b border-[#222c38] flex items-center justify-between">
        <h1 className="text-xl font-semibold">Board</h1>
        <button
          onClick={addColumn}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#1a1f27] hover:bg-[#222834] border border-[#263241]"
        >
          <GoPlus className="text-lg" />
          Add Column
        </button>
      </header>

      <div className="w-full min-h-[90vh] overflow-auto">
        <div className="flex gap-4 p-4 min-w-max">
          {columns.map((column) => (
            <Column key={column.id} column={column} onRename={renameColumn} />
          ))}
        </div>
      </div>
    </div>
  );
}
