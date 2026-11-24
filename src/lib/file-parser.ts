/**
 * Client-Side Document & File Parsing Utility
 * Extracts readable plain-text from files without exposing backend implementation details
 */

export interface ParsedFile {
  name: string;
  size: number;
  type: string;
  content: string;
  isImage: boolean;
  previewUrl?: string;
}

/**
 * Parses user-selected files into text content or image previews
 */
export const parseUploadedFile = async (file: File): Promise<ParsedFile> => {
  const isImage = file.type.startsWith("image/");

  if (isImage) {
    const previewUrl = URL.createObjectURL(file);
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      content: `[Attached Image: ${file.name}]`,
      isImage: true,
      previewUrl,
    };
  }

  // Text / Markdown / Code files
  if (
    file.type.includes("text") ||
    file.name.endsWith(".txt") ||
    file.name.endsWith(".md") ||
    file.name.endsWith(".json") ||
    file.name.endsWith(".ts") ||
    file.name.endsWith(".js")
  ) {
    const text = await file.text();
    return {
      name: file.name,
      size: file.size,
      type: file.type || "text/plain",
      content: text,
      isImage: false,
    };
  }

  // PDF or Binary Fallback
  // For basic PDFs, extract ASCII / UTF-8 text strings directly from binary buffer
  try {
    const buffer = await file.arrayBuffer();
    const decoder = new TextDecoder("utf-8", { fatal: false });
    const rawString = decoder.decode(buffer);
    
    // Simple sanitization to extract visible characters from PDF streams
    const sanitized = rawString
      .replace(/[^\x20-\x7E\t\n\r]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      name: file.name,
      size: file.size,
      type: file.type || "application/pdf",
      content: sanitized.length > 50 ? sanitized : `[Document Attached: ${file.name}]`,
      isImage: false,
    };
  } catch {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      content: `[Document Attached: ${file.name}]`,
      isImage: false,
    };
  }
};

/**
 * Format bytes into human-readable size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
