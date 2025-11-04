"use client";
import TiptapEditor from "@/components/blocks/tiptapeditor";

interface TiptapRendererProps {
  content: string;
}

export default function TiptapRenderer({ content }: TiptapRendererProps) {
  return (
    <div>
      <div className="simple-editor-wrapper-renderer">
        <TiptapEditor value={content} editable={false} showToolbar={false} />
      </div>
    </div>
  );
}
