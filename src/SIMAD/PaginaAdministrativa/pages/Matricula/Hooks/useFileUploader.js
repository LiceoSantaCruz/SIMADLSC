import { useState } from "react";
import Swal from "sweetalert2";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
];

export default function useFileUploader() {
  const [files, setFiles] = useState([]);

  const onFileChange = (e) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const invalid = selected.filter(f => !ALLOWED_TYPES.includes(f.type));
    if (invalid.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Tipo no permitido",
        text: "Solo puedes subir PDF e imágenes (png/jpg/gif).",
      });
    }
    const valid = selected.filter(f => ALLOWED_TYPES.includes(f.type));
    setFiles(valid);
  };

  const resetFiles = () => {
    setFiles([]);
  };

  return { files, onFileChange, resetFiles };
}
