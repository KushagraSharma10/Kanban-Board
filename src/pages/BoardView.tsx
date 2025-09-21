import { useState, useRef, useEffect } from "react";
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

const BoardView = () => {
  const [columns, setColumns] = useState<ColumnItem[]>(cloumns);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [newColName, setNewColName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const renameColumn = (id: string, newTitle: string) => {
    const Title = newTitle.trim();
    if (!Title) return;
    setColumns((prev) =>
      prev.map((column) =>
        column.id === id ? { ...column, title: Title } : column
      )
    );
  };

  const deleteColumn = (id: string) => {
    setColumns((prev) => prev.filter((column) => column.id !== id));
  };

  useEffect(() => {
    if (showAdd) inputRef.current?.focus();
  }, [showAdd]);

  const handleCreateColumn = () => {
    const name = newColName.trim();
    if (!name) return;
    const exists = columns.some(
      (c) => c.title.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      alert("Column with this name already exists!");
      return;
    }

    setColumns((prev) => [...prev, { id: nanoid(), title: name, cards: [] }]);
    setNewColName("");
    setShowAdd(false);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") handleCreateColumn();
    if (e.key === "Escape") {
      setShowAdd(false);
      setNewColName("");
    }
  };

  return (
    <div className="w-full min-h-screen text-white bg-[#0b0f14]">
      <header className="p-6 border-b border-[#222c38] flex items-center justify-between">
        <h1 className="text-xl font-semibold">Board</h1>
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#1a1f27] hover:bg-[#222834] border border-[#263241]"
        >
          <GoPlus className="text-lg" />
          Add Column
        </button>
      </header>

      <div className="w-full min-h-[90vh] overflow-auto">
        <div className="flex gap-4 p-4 min-w-max">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onRename={renameColumn}
              onDelete={deleteColumn}
            />
          ))}

          <div className="min-w-[20vw] max-w-[20vw]">
            {showAdd ? (
              <div className="rounded-md bg-[#161a21] border border-[#263241] p-4">
                <input
                  ref={inputRef}
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={15}
                  className="w-full rounded-md text-sm border border-[#263241] px-3 py-2 outline-none"
                  placeholder="Column name"
                />

                <div className="mt-2 flex items-center">
                  <button
                    onClick={handleCreateColumn}
                    disabled={!newColName.trim()}
                    className="px-3 py-1.5 rounded-md bg-[#1a4fff] text-sm hover:bg-[#1745e0] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAdd(false);
                      setNewColName("");
                    }}
                    className="ml-auto px-3 py-2 rounded-md hover:bg-[#141b26] border border-transparent"
                    aria-label="Close"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAdd(true)}
                className="w-full h-[52px] flex items-center justify-center gap-2 rounded-md border border-dashed border-[#2b3647] bg-[#121824]/60 hover:bg-[#1a1f27] text-sm"
                title="Add column"
              >
                <GoPlus className="text-lg" />
                Add Column
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardView;
