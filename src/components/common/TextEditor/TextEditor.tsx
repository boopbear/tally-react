import React from "react";
import { editorConfig } from "./TextEditorConfig";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface TextEditorProps {
  value?: string;
  readOnly?: boolean;
  theme?: string;
  onChange?: (val: any) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, readOnly = false, theme = "snow", onChange }) => {
  return (
    <ReactQuill
      theme={theme}
      modules={editorConfig.modules}
      formats={editorConfig.formats}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
  );
};

export default TextEditor;