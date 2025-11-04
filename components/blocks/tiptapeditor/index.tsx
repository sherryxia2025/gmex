import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export default function TiptapEditor({
  value,
  onChange,
  editable = true,
  showToolbar = true,
}: {
  value: string;
  onChange?: (value: string) => void;
  editable?: boolean;
  showToolbar?: boolean;
}) {
  return (
    <div
      className={`w-full ${editable ? "border border-input rounded-md overflow-hidden" : ""}`}
    >
      <SimpleEditor
        value={value}
        onChange={onChange}
        editable={editable}
        showToolbar={showToolbar}
      />
    </div>
  );
}
