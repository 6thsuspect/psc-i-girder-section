export async function downloadBlob(filename: string, blob: Blob) {
  const desktop = window.girderDesktop;
  if (desktop?.saveFile) {
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const isText = filename.endsWith('.svg') || filename.endsWith('.dxf') || filename.endsWith('.json');
    if (isText) {
      const text = await blob.text();
      await desktop.saveFile({ defaultPath: filename, data: text, encoding: 'utf8' });
      return;
    }
    let binary = '';
    bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });
    await desktop.saveFile({
      defaultPath: filename,
      data: btoa(binary),
      encoding: 'base64',
    });
    return;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function svgElementToPngBlob(svg: SVGSVGElement, scale = 2): Promise<Blob> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const xml = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  const loaded = new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to rasterize SVG'));
  });
  img.src = url;
  await loaded;

  const vb = svg.viewBox.baseVal;
  const width = Math.max(1, Math.round((vb.width || svg.clientWidth) * scale));
  const height = Math.max(1, Math.round((vb.height || svg.clientHeight) * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unsupported');
  ctx.fillStyle = '#f7f4ec';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  URL.revokeObjectURL(url);

  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('PNG export failed'));
    }, 'image/png');
  });
}

export function serializeSvg(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(clone)}`;
}
