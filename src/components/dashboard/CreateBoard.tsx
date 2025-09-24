import { useEffect, useState } from "react";
import { Actions,  ColorCircle, ColorInput, ColorOptions, Dialog, Form, HeaderRow, Overlay, Primary, Secondary,
} from "../../styles/dashboard/create-board";
import { Field } from "../../styles/dashboard/create-board";
import type { boardModalProp } from "../../types/dashboard";
import { DEFAULT_COLORS } from "../../constants/Colors";

export default function CreateBoardModal({
  open,
  onClose,
  onCreate,
  mode = "create",
  board,
  onUpdate,
}: boardModalProp) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    color: DEFAULT_COLORS[0],
  });

   useEffect(() => {
    if (!open) return;
    if (mode === "edit" && board) {
      setForm({ name: board.name, type: board.type, color: board.color });
    } else {
      setForm({ name: "", type: "", color: DEFAULT_COLORS[0] });
    }
  }, [open, mode, board]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Please enter a board name");

    if (mode === "edit" && board && onUpdate) {
      onUpdate(board.id, form);  
      onClose();
      return;
    }

    onCreate(form);
    setForm({ name: "", type: "", color: DEFAULT_COLORS[0] });
    onClose();
  };

  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <HeaderRow>
          <h2>{mode === "edit" ? "Edit Board" : "Create Board"}</h2>
          <button onClick={onClose}>×</button>
        </HeaderRow>

        <Form onSubmit={handleSubmit}>
          <Field>
            <h2>Board name</h2>
            <input
              value={form.name}
              onChange={(e) => setForm((field) => ({ ...field, name: e.target.value }))}
              placeholder="e.g. Sprint Planning"
              required
            />
          </Field>

          <Field>
            <h2>Type</h2>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="">Select type</option>
              <option>Engineering</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>PM</option>
              <option>Ops</option>
              <option>General</option>
            </select>
          </Field>

          <Field>
            <h2>Color</h2>
            <ColorOptions>
              {DEFAULT_COLORS.map((colorOption) => (
                <ColorCircle
                  key={colorOption}
                  onClick={() => setForm({ ...form, color: colorOption })}
                  type="button"
                  $bg={colorOption}
                  $active={form.color === colorOption}
                />
              ))}
              <ColorInput
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
              />
            </ColorOptions>
          </Field>

          <Actions>
            <Secondary type="button" onClick={onClose}>
              Cancel
            </Secondary>
            <Primary type="submit">{mode === "edit" ? "Save changes" : "Create"}</Primary>
          </Actions>
        </Form>
      </Dialog>
    </Overlay>
  );
}
