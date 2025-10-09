import React, { useState } from "react";
import type { CardData } from "../../utils/interface/card";
import type { CardModalProps } from "../../utils/interface/card-modal";
import {
  LABEL_OPTIONS,
  MAX_TITLE_LENGTH,
} from "../../utils/constants/card-modal";
import { validateEmail } from "../../utils/validation";
import { toast } from "react-toastify";
import { getActiveUser } from "../../utils/auth";
import { toast } from "react-toastify";

const CardModal: React.FC<CardModalProps> = ({
  card,
  onSave,
  onDelete,
  onClose,
  existingCards = [],
}) => {
  const [title, setTitle] = useState<string>(card.title);
  const [description, setDescription] = useState<string>(
    card.description || ""
  );
  const [dueDate, setDueDate] = useState<string>(card.dueDate || "");
  const [dateError, setDateError] = useState<string>("");

  const [selectedLabel, setSelectedLabel] = useState<CardData["label"]>(
    card.label ?? "none"
  );

  const [assignees, setAssignees] = useState<string[]>(card.assignees ?? []);
  const [assigneeInput, setAssigneeInput] = useState<string>("");
  const [assigneeError, setAssigneeError] = useState<string>("");

  const activeUser = getActiveUser();

  const addAssigneeFromInput = () => {
    const trimmed = assigneeInput.trim();
    if (!trimmed) return;

    const errorMessage = validateEmail(trimmed);
    if (errorMessage) {
      setAssigneeError(errorMessage);
      return;
    }

    const isDuplicate = assignees.some(
      (assignee) => assignee.toLowerCase() === trimmed.toLowerCase()
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

  const handleAssigneeKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addAssigneeFromInput();
    }
    if (e.key === "Escape") {
      setAssigneeInput("");
      setAssigneeError("");
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;
    if (title.length > MAX_TITLE_LENGTH) {
      toast.error(`Title cannot exceed ${MAX_TITLE_LENGTH} characters.`);
      return;
    }

    const titleClash = existingCards.some(
      (existing) =>
        existing.id !== card.id &&
        existing.title.toLowerCase() === title.toLowerCase()
    );
    if (titleClash) {
      toast.error("A card with this title already exists!");
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

    const pendingAssignee = assigneeInput.trim();
    let finalAssignees = assignees;

    if (pendingAssignee) {
      const emailError = validateEmail(pendingAssignee);
      if (emailError) {
        setAssigneeError(emailError);
        return;
      }

      const isDuplicateAssignee = assignees.some(
        (assignee) => assignee.toLowerCase() === pendingAssignee.toLowerCase()
      );

      if (!isDuplicateAssignee) {
        finalAssignees = [...assignees, pendingAssignee];
      }

      setAssigneeInput("");
      setAssigneeError("");
    }

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

  const handleAssigneeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAssigneeInput(e.target.value);

    if (assigneeError) {
      setAssigneeError("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-[#161a21] rounded-lg shadow-xl w-96 p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#e6edf3]">Edit Card</h2>
          <button
            onClick={onClose}
            className="text-[#a3b1c2] hover:text-[#e6edf3] text-xl leading-none"
            aria-label="Close modal"
            title="Close"
          >
            ✕
          </button>
        </div>
        <label
          htmlFor="card-title"
          className="block text-sm text-[#9ca3af] mt-1 mb-1"
        >
          Title
        </label>
        <input
          id="card-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border border-[#3a3f44] rounded px-3 py-2 mb-3 bg-[#0b0f14] text-[#e6edf3] placeholder-[#9e9e9e] focus:outline-none"
        />

        <label
          htmlFor="card-description"
          className="block text-sm text-[#9ca3af] mt-1 mb-1"
        >
          Description
        </label>
        <textarea
          id="card-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border border-[#3a3f44] rounded px-3 py-2 mb-3 resize-none bg-[#0b0f14] text-[#e6edf3] placeholder-[#9e9e9e] focus:outline-none"
          rows={3}
        />

        <label
          htmlFor="card-due-date"
          className="block text-sm text-[#9ca3af] mt-1 mb-1"
        >
          Due date
        </label>
        <input
          id="card-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border border-[#3a3f44] rounded px-3 py-2 mb-2 bg-[#0b0f14] text-[#e6edf3] focus:outline-none"
        />
        {dateError && <p className="text-red-400 text-sm mb-2">{dateError}</p>}

        <label
          htmlFor="card-priority"
          className="block text-sm text-[#9ca3af] mt-3 mb-1"
        >
          Priority
        </label>
        <select
          id="card-priority"
          value={selectedLabel}
          onChange={(e) =>
            setSelectedLabel(e.target.value as CardData["label"])
          }
          className="w-full border border-[#3a3f44] rounded px-3 py-2 bg-[#0b0f14] text-[#e6edf3] focus:outline-none"
        >
          {LABEL_OPTIONS.map((opt) => (
            <option key={opt.value ?? "none"} value={opt.value ?? "none"}>
              {opt.text}
            </option>
          ))}
        </select>

        <label htmlFor="card-assignees" className="block text-sm text-[#9ca3af] mt-4 mb-1">
          Assignees
        </label>
        <div className="w-full border border-[#3a3f44] rounded px-2 py-2 bg-[#0e1114]">
          <div className="flex flex-wrap gap-2 mb-2">
            {assignees.map((person) => (
              <span
                key={person}
                className="inline-flex items-center gap-2 text-xs bg-[#3a3f44] text-[#e6edf3] rounded-full px-2 py-1"
              >
                {person}
                <button
                  type="button"
                  onClick={() => removeAssignee(person)}
                  className="text-[#a3b1c2] hover:text-[#e6edf3]"
                  aria-label={`Remove ${person}`}
                  title="Remove"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <input
          id="card-assignees"
            type="email"
            value={assigneeInput}
            onChange={handleAssigneeInputChange}
            onKeyDown={handleAssigneeKeyDown}
            placeholder="Add assignees..."
            disabled={activeUser?.role !== "admin"}
            className="w-full bg-transparent outline-none placeholder-[#9e9e9e] text-[#e6edf3] disabled:cursor-no-drop"
          />
        </div>
        {assigneeError && (
          <p className="text-red-400 text-sm mt-1">{assigneeError}</p>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={handleDelete}
            className="px-3 py-1 rounded bg-red-600 text-sm text-white hover:brightness-110"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-[#222c38] text-sm text-[#e6edf3] border border-[#3a3f44] hover:brightness-110"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 rounded bg-[#0096ff] text-sm text-black hover:bg-[#6ca0ff]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
