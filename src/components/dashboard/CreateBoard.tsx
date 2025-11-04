import { useEffect, useState } from "react";
import {
  Actions,
  Button,
  ColorCircle,
  ColorInput,
  ColorOptions,
  Dialog,
  Form,
  HeaderRow,
  Overlay,
} from "../../styles/dashboard/create-board";
import { Field } from "../../styles/dashboard/create-board";
import type { BoardForm, BoardModalProp } from "../../utils/types/dashboard";
import {
  MAX_BOARD_NAME_LENGTH,
  selectTypes,
} from "../../utils/constants/board";
import { DEFAULT_COLORS } from "../../utils/constants/colors";

const CreateBoard: React.FC<BoardModalProp> = ({
  open,
  onClose,
  onCreate,
  mode = "create",
  board,
  onUpdate,
}: BoardModalProp) => {
  const [form, setForm] = useState<BoardForm>({
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
  const isFormValid = form.name.trim() !== "" && form.type.trim() !== "";

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
              onChange={(e) =>
                setForm((field) => ({ ...field, name: e.target.value }))
              }
              placeholder="e.g. Sprint Planning"
              required
              maxLength={MAX_BOARD_NAME_LENGTH}
            />
          </Field>

          <Field>
            <h2>Type</h2>
            <select
              value={form.type}
              onChange={(e) =>
                setForm((form) => ({ ...form, type: e.target.value }))
              }
            >
              <option value="">Select type</option>
              {selectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
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
            <Button type="button" className="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="primary" disabled={!isFormValid}>
              {mode === "edit" ? "Save changes" : "Create"}
            </Button>
          </Actions>
        </Form>
      </Dialog>
    </Overlay>
  );
};

export default CreateBoard;
