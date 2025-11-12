"use client";

export default function ImageUploader({
  previewUrl,
  inputRef,
  onFileChange,
  onClear,
  hasFile,
}: {
  previewUrl: string | null;
  inputRef?: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  hasFile: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm text-gray-700">
        대표 이미지 (선택)
      </label>

      {previewUrl ? (
        <div className="mb-2 overflow-hidden rounded-lg border border-black/10 bg-gray-50">
          <img
            src={previewUrl}
            alt="preview"
            className="max-h-[360px] w-full object-contain"
          />
        </div>
      ) : (
        <p className="mb-2 text-xs text-gray-500">이미지가 없습니다.</p>
      )}

      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="block w-full text-sm file:mr-3 file:rounded-md file:border file:border-black/20 file:bg-white file:px-3 file:py-1.5 file:text-sm hover:file:bg-black/5"
        />
        {hasFile && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-md border border-black/20 bg-white px-3 py-1.5 text-sm hover:bg-black/5"
          >
            선택 해제
          </button>
        )}
      </div>
    </div>
  );
}
