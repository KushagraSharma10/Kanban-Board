import { useEffect, useState } from "react";
import {
  Actions,
  CloseBtn,
  ColorCircle,
  ColorInput,
  ColorOptions,
  Dialog,
  Form,
  HeaderRow,
  Input,
  Label,
  Overlay,
  Primary,
  Secondary,
  Select,
  Title,
} from "../../styles/dashboard/create-board";
import { Field } from "../../styles/auth/auth-form";

const DEFAULT_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
];

type Board = { id: string; name: string; type: string; color: string };
type Props = {
  open: boolean;
  mode?: "create" | "edit";
  board?: Board;
  onClose: () => void;
  onCreate: (data: { name: string; type: string; color: string }) => void;
  onUpdate?: (
    id: string,
    data: { name: string; type: string; color: string }
  ) => void;
};

export default function CreateBoardModal({
  open,
  onClose,
  onCreate,
  mode = "create",
  board,
  onUpdate,
}: Props) {
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
          <Title>{mode === "edit" ? "Edit Board" : "Create Board"}</Title>
          <CloseBtn onClick={onClose}>×</CloseBtn>
        </HeaderRow>

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label>Board name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Sprint Planning"
              required
            />
          </Field>

          <Field>
            <Label>Type</Label>
            <Select
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
            </Select>
          </Field>

          <Field>
            <Label>Color</Label>
            <ColorOptions>
              {DEFAULT_COLORS.map((colorOption) => (
                <ColorCircle
                  key={colorOption}
                  onClick={() => setForm({ ...form, color: colorOption })}
                  type="button"
                  style={{
                    backgroundColor: colorOption,
                    border:
                      form.color === colorOption
                        ? "2px solid #fff"
                        : "2px solid #2a3b4f",
                  }}
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
