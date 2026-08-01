import { useRef, type ChangeEvent, type DragEvent } from 'react';
import { ACCEPTED_FILE_EXTENSIONS } from '../constants';
import { CloudUploadDoodle } from './Doodles';
import styles from '../rough-note-contact.module.css';

interface UploadPaperProps {
  file: File | null;
  error?: string;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

function fileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function UploadPaper({
  file,
  error,
  onSelect,
  onRemove
}: UploadPaperProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    const selected = files?.[0];
    if (selected) onSelect(selected);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div className={styles.uploadField}>
      <span className={styles.uploadLabel}>
        3. Upload your reference <em>(Optional)</em>
      </span>
      <div
        className={`${styles.uploadPaper} ${error ? styles.fieldInvalid : ''}`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        data-drawing-exclusion
      >
        <input
          ref={inputRef}
          id="reference-file"
          className={styles.visuallyHidden}
          type="file"
          aria-label="Upload reference file"
          accept={ACCEPTED_FILE_EXTENSIONS.map((extension) => `.${extension}`).join(
            ','
          )}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleFiles(event.target.files)
          }
        />
        {!file ? (
          <button
            type="button"
            className={styles.uploadPrompt}
            onClick={() => inputRef.current?.click()}
            aria-describedby={error ? 'reference-file-error' : 'reference-file-help'}
          >
            <CloudUploadDoodle />
            <strong>Drag &amp; drop your file here</strong>
            <span>or click to browse</span>
            <small id="reference-file-help">Maximum file size: 5 MB</small>
          </button>
        ) : (
          <div className={styles.attachment}>
            <span className={styles.attachmentClip} aria-hidden="true">
              ⌇
            </span>
            <span>
              <strong>{file.name}</strong>
              <small>{fileSize(file.size)}</small>
            </span>
            <button type="button" onClick={onRemove} aria-label={`Remove ${file.name}`}>
              ×
            </button>
          </div>
        )}
      </div>
      {error && (
        <p id="reference-file-error" className={styles.fieldError} role="alert">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      )}
    </div>
  );
}
