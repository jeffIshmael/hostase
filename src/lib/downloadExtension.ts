export async function downloadExtensionZip(
  onProgress?: (percent: number | null) => void
): Promise<void> {
  const res = await fetch("/hostase-extension.zip", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Could not download the extension. Please try again.");
  }

  const total = Number(res.headers.get("Content-Length")) || 0;
  const reader = res.body?.getReader();

  let blob: Blob;
  if (!reader) {
    onProgress?.(null);
    blob = await res.blob();
  } else {
    const chunks: Uint8Array[] = [];
    let received = 0;
    onProgress?.(total ? 0 : null);

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        received += value.length;
        if (total > 0) {
          onProgress?.(Math.min(99, Math.round((received / total) * 100)));
        } else {
          onProgress?.(null);
        }
      }
    }

    const merged = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }
    blob = new Blob([merged.buffer], { type: "application/zip" });
  }

  onProgress?.(100);

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "hostase-extension.zip";
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Keep URL briefly so the browser can start the save dialog
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
