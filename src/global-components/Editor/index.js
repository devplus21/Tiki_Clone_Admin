import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useState } from "react";
import "./style.scss";

const Editor = ({ defauleDesc, onDescChange }) => {
  const [data, setData] = useState(defauleDesc);

  return (
    <div id="editor">
      <CKEditor
        editor={ClassicEditor}
        config={{
          placeholder: "Nhập mô tả sản phẩm...",
        }}
        data={data}
        onChange={(event, editor) => {
          const data = editor.getData();
          setData(data);
          onDescChange && onDescChange(data);
        }}
      />
    </div>
  );
};

export default Editor;
