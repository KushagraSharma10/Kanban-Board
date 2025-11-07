import React, { useEffect, useState } from "react";
import type { CardData } from "../../utils/interface/card";
import type { CardModalProps } from "../../utils/interface/card-modal";
import {
  LABEL_OPTIONS,
  MAX_TITLE_LENGTH,
} from "../../utils/constants/card-modal";
import { validateEmail } from "../../utils/validation";
import { toast } from "react-toastify";
import { getActiveUserId } from "../../utils/session";

const CardModal: React.FC<CardModalProps> = ({
  card,
  onSave,
  onClose,
  existingCards = [],
}) => {
  const [title, setTitle] = useState<string>(card.title);
  const [description, setDescription] = useState<string>(card.description || "");
  const [dueDate, setDueDate] = useState<string>(card.dueDate || "");
  const [dateError, setDateError] = useState<string>("");

  const [selectedLabel, setSelectedLabel] = useState<CardData["label"]>(card.label ?? "none");

  const [assigneeEmail, setAssigneeEmail] = useState<string>(card.assigneeEmail ?? "");
  const [assigneeError, setAssigneeError] = useState<string>("");

  const [canEdit, setCanEdit] = useState<boolean>(false);
  useEffect(() => {
    const myId = getActiveUserId();
    setCanEdit(Boolean(myId) && String(myId) === String(card.createdBy));
  }, [card.createdBy]);

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

    const trimmedAssignee = assigneeEmail.trim();
    if (trimmedAssignee) {
      const errorMessage = validateEmail(trimmedAssignee);
      if (errorMessage) {
        setAssigneeError(errorMessage);
        return;
      }
    }
    setAssigneeError("");

    onSave({
      ...card,
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      label: selectedLabel ?? "none",
      assigneeEmail: trimmedAssignee || undefined, 
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-theme-cardSurface rounded-lg shadow-xl w-96 p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-theme-textPrimary">Edit Card</h2>
          <button
            onClick={onClose}
            className="text-theme-inputIcon hover:text-theme-textPrimary text-xl leading-none"
            aria-label="Close modal"
            title="Close"
          >
            ✕
          </button>
        </div>

        <label className="block text-sm text-theme-textMuted2 mt-1 mb-1">Title</label>
        <input
          id="card-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border border-theme-inputBorder rounded px-3 py-2 mb-3 bg-theme-inputBg text-theme-textPrimary placeholder:text-theme-placeholder focus:outline-none"
          disabled={!canEdit}
        />

        <label className="block text-sm text-theme-textMuted2 mt-1 mb-1">Description</label>
        <textarea
          id="card-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border border-theme-inputBorder rounded px-3 py-2 mb-3 resize-none bg-theme-inputBg text-theme-textPrimary placeholder:text-theme-placeholder focus:outline-none"
          rows={3}
          disabled={!canEdit}
        />

        <label className="block text-sm text-theme-textMuted2 mt-1 mb-1">Due date</label>
        <input
          id="card-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border border-theme-inputBorder rounded px-3 py-2 mb-2 bg-theme-inputBg text-theme-textPrimary focus:outline-none"
          disabled={!canEdit}
        />
        {dateError && <p className="text-red-400 text-sm mb-2">{dateError}</p>}

        <label className="block text-sm text-theme-textMuted2 mt-3 mb-1">Priority</label>
        <select
          id="card-priority"
          value={selectedLabel}
          onChange={(e) => setSelectedLabel(e.target.value as CardData["label"])}
          className="w-full border border-theme-inputBorder rounded px-3 py-2 bg-theme-inputBg text-theme-textPrimary focus:outline-none"
          disabled={!canEdit}
        >
          {LABEL_OPTIONS.map((opt) => (
            <option key={opt.value ?? "none"} value={opt.value ?? "none"}>
              {opt.text}
            </option>
          ))}
        </select>

        <label className="block text-sm text-theme-textMuted2 mt-4 mb-1">Assignee</label>
        <input
          type="email"
          value={assigneeEmail}
          onChange={(e) => {
            setAssigneeEmail(e.target.value);
            if (assigneeError) setAssigneeError("");
          }}
          placeholder="someone@example.com"
          disabled={!canEdit}
          className="w-full border border-theme-inputBorder rounded px-3 py-2 bg-theme-inputBg text-theme-textPrimary placeholder:text-theme-placeholder focus:outline-none disabled:cursor-no-drop"
        />
        {assigneeError && <p className="text-red-400 text-sm mt-1">{assigneeError}</p>}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-theme-popover text-sm text-theme-textPrimary border border-theme-inputBorder hover:brightness-110"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 rounded bg-theme-primaryButton text-sm text-black hover:bg-theme-primaryButtonHover"
            disabled={!canEdit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
