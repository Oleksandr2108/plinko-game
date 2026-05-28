"use client";

import {
  type ChangeEvent,
  type DragEvent,
  useRef,
  useState,
} from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function AvatarUploadModal({
  isOpen,
  isPending,
  onClose,
  onUpload,
}: {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void> | void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <AvatarUploadDialog
      isPending={isPending}
      onClose={onClose}
      onUpload={onUpload}
    />
  );
}

function AvatarUploadDialog({
  isPending,
  onClose,
  onUpload,
}: {
  isPending: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void> | void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const selectFile = (file?: File) => {
    setError("");

    if (!file) {
      return;
    }

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setError("Only PNG and JPG images are supported.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be 5MB or smaller.");
      return;
    }

    setSelectedFile(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    selectFile(event.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Choose an image first.");
      return;
    }

    try {
      await onUpload(selectedFile);
    } catch {
      setError("Unable to upload avatar. Please try another image.");
    }
  };

  const handleClose = () => {
    if (isPending) {
      return;
    }

    setSelectedFile(null);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <section className="w-full max-w-[476px] rounded-[8px] border border-(--borderColor) bg-[#1a1f2e] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-bold text-white">Upload Avatar</h2>
            <p className="mt-2 text-[12px] text-(--text)">
              Choose a profile picture (max 5MB)
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            aria-label="Close upload avatar modal"
            className="text-[20px] leading-none text-(--text) transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            x
          </button>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className="flex min-h-[154px] w-full flex-col items-center justify-center rounded-[8px] border border-dashed border-[#34405a] bg-[#1b2132] px-4 py-6 text-center transition-colors hover:border-[#4a5877]"
        >
          <span
            aria-hidden="true"
            className="relative mb-4 h-8 w-8 text-(--text) before:absolute before:left-1/2 before:top-1 before:h-5 before:w-0.5 before:-translate-x-1/2 before:bg-current after:absolute after:left-1/2 after:top-1 after:h-3 after:w-3 after:-translate-x-1/2 after:rotate-45 after:border-l-2 after:border-t-2 after:border-current"
          >
            <span className="absolute bottom-0 left-1/2 h-2 w-5 -translate-x-1/2 rounded-b-[4px] border-b-2 border-l-2 border-r-2 border-current" />
          </span>
          <span className="text-[12px] text-(--secondaryText)">
            {selectedFile
              ? selectedFile.name
              : "Drop an image here or click to browse"}
          </span>
          <span className="mt-1 text-[11px] text-(--colorSmallText)">
            PNG, JPG up to 5MB
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={handleInputChange}
        />

        {error ? (
          <p className="mt-3 text-[12px] text-(--colorError)">{error}</p>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="rounded-[8px] bg-[#2a3144] px-4 py-3 text-[14px] font-medium text-(--secondaryText) transition-colors hover:bg-[#343c52] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isPending}
            className="rounded-[8px] bg-[#087a56] px-4 py-3 text-[14px] font-medium text-(--secondaryText) transition-colors hover:bg-[#099668] disabled:cursor-not-allowed disabled:opacity-55"
          >
            {isPending ? "Uploading..." : "Upload"}
          </button>
        </div>
      </section>
    </div>
  );
}
