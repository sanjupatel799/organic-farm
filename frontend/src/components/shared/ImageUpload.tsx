"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadsApi } from "@/lib/api";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const currentCount = images.length;
      const fileArray = Array.from(files).slice(0, maxImages - currentCount);
      if (fileArray.length === 0) return;

      // Validate file sizes (max 5MB each)
      const maxSize = 5 * 1024 * 1024;
      const validFiles = fileArray.filter((f) => {
        if (f.size > maxSize) {
          toast.error(`${f.name} exceeds 5MB limit`);
          return false;
        }
        return true;
      });
      if (validFiles.length === 0) return;

      setUploading(true);
      try {
        const uploadedUrls = await uploadsApi.uploadMultiple(validFiles);
        onImagesChange([...images, ...uploadedUrls]);
        toast.success(`${validFiles.length} image(s) uploaded!`);
      } catch (error: any) {
        toast.error(error.message || "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [images, maxImages, onImagesChange],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files?.length) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      uploadFiles(e.target.files);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const remaining = maxImages - images.length;

  return (
    <div className="space-y-3">
      {/* Existing images preview */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div key={index} className="group relative h-24 w-24 overflow-hidden rounded-xl border border-gray-200">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {remaining > 0 && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${
            dragging
              ? "border-green-500 bg-green-50"
              : "border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50/50"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
          <p className="mt-2 text-sm font-medium text-gray-700">
            {uploading
              ? "Uploading..."
              : "Drop images here or click to browse"}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            PNG, JPG, WebP up to 5MB ({remaining} of {maxImages} remaining)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
