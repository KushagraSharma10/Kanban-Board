import React, { useState } from "react";
import type { CardData } from "./Card";

interface CardModalProps {
  card: CardData;
  onSave: (card: CardData) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  existingCards?: CardData[];
}

const MAX_TITLE_LENGTH = 15;
const LABEL_OPTIONS: Array<{ value: CardData["label"]; text: string }> = [
  { value: "none", text: "None" },
  { value: "low", text: "Low Priority" },
  { value: "moderate", text: "Moderate Priority" },
  { value: "high", text: "High Priority" },
  { value: "urgent", text: "Urgent" },
];

const CardModal: React.FC<CardModalProps> = ({
  card,
  onSave,
  onDelete,
  onClose,
  existingCards = [],
}) => {
  const [title, setTitle] = useState<string>(card.title);
  const [description, setDescription] = useState<string>(card.description || "");
  const [dueDate, setDueDate] = useState(card.dueDate || "");
  const [dateError, setDateError] = useState<string>("");

  const [selectedLabel, setSelectedLabel] = useState<CardData["label"]>(
    card.label ?? "none"
  );

  const [assignees, setAssignees] = useState<string[]>(card.assignees ?? []);
  const [assigneeInput, setAssigneeInput] = useState<string>("");

  const addAssigneeFromInput = () => {
    const trimmed = assigneeInput.trim();
    if (!trimmed) return;
    const isDuplicate = assignees.some(
      (a) => a.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      setAssigneeInput("");
      return;
    }
    setAssignees((prev) => [...prev, trimmed]);
    setAssigneeInput("");
  };

  const removeAssignee = (name: string) => {
    setAssignees((prev) => prev.filter((assignee) => assignee !== name));
  };

  const handleAssigneeKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addAssigneeFromInput();
    }
    if (e.key === "Escape") {
      setAssigneeInput("");
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;
    if (title.length > MAX_TITLE_LENGTH) {
      alert(`Title cannot exceed ${MAX_TITLE_LENGTH} characters.`);
      return;
    }

    const titleClash = existingCards.some(
      (existing) =>
        existing.id !== card.id &&
        existing.title.toLowerCase() === title.toLowerCase()
    );
    if (titleClash) {
      alert("A card with this title already exists!");
      return;
    }

    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [year, month, day] = dueDate.split("-").map(Number);
      const selected = new Date(year, month - 1, day);
      if (selected < today) {
        setDateError("Due date cannot be in the past.");
        return;
      }
    }
    setDateError("");

    const finalAssignees = assigneeInput.trim()
      ? Array.from(new Set([...assignees, assigneeInput.trim()]))
      : assignees;

    onSave({
      ...card,
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      assignees: finalAssignees.length ? finalAssignees : undefined,
      label: selectedLabel ?? "none",
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(card.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-[#161a21] rounded-lg shadow-xl w-96 p-6 relative animate-fadeIn">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Edit Card</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none"
            aria-label="Close modal"
            title="Close"
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border border-gray-600 rounded px-3 py-2 mb-3 bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-800"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border border-gray-600 rounded px-3 py-2 mb-3 resize-none bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-800"
          rows={3}
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border border-gray-600 rounded px-3 py-2 mb-2 bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-zinc-800"
        />
        {dateError && <p className="text-red-400 text-sm mb-2">{dateError}</p>}

        <label className="block text-sm text-gray-300 mt-3 mb-1">
          Label / Priority
        </label>
        <select
          value={selectedLabel}
          onChange={(e) =>
            setSelectedLabel(e.target.value as CardData["label"])
          }
          className="w-full border border-zinc-700 rounded px-3 py-2 bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-zinc-800"
        >
          {LABEL_OPTIONS.map((opt) => (
            <option key={opt.value ?? "none"} value={opt.value ?? "none"}>
              {opt.text}
            </option>
          ))}
        </select>

        <label className="block text-sm text-gray-300 mt-4 mb-1">
          Assignees
        </label>
        <div className="w-full border border-zinc-700 rounded px-2 py-2 bg-zinc-800">
          <div className="flex flex-wrap gap-2 mb-2">
            {assignees.map((person) => (
              <span
                key={person}
                className="inline-flex items-center gap-2 text-xs bg-gray-600 text-white rounded-full px-2 py-1"
              >
                {person}
                <button
                  type="button"
                  onClick={() => removeAssignee(person)}
                  className="text-gray-300 hover:text-white"
                  aria-label={`Remove ${person}`}
                  title="Remove"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={assigneeInput}
            onChange={(e) => setAssigneeInput(e.target.value)}
            onKeyDown={handleAssigneeKeyDown}
            placeholder="Type name/email and press Enter or ,"
            className="w-full bg-transparent outline-none placeholder-gray-300 text-white"
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={handleDelete}
            className="px-3 py-1 rounded bg-red-600 text-sm text-white hover:bg-red-600 transition"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-zinc-600 text-sm text-white hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 rounded bg-blue-600 text-sm text-white hover:bg-blue-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
