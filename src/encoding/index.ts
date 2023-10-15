export function encodeBase64(
  data: ArrayLike<number> | ArrayBufferLike
): string {
  return btoa(String.fromCharCode(...new Uint8Array(data)));
}

export function decodeBase64(data: string): Uint8Array {
  return Uint8Array.from(
    atob(data)
      .split("")
      .map((x) => x.charCodeAt(0))
  );
}

export function encodeBase64Url(
  data: ArrayLike<number> | ArrayBufferLike
): string {
  return encodeBase64(data)
    .replaceAll("=", "")
    .replaceAll("+", "-")
    .replaceAll("/", "_");
}

export function decodeBase64Url(data: string): Uint8Array {
  return decodeBase64(data.replaceAll("-", "+").replaceAll("_", "/"));
}

export function encodeHex(data: ArrayLike<number> | ArrayBufferLike): string {
  const buffer = new Uint8Array(data);
  let result = "";
  for (let i = 0; i < buffer.length; i++) {
    result += buffer[i]!.toString(16).padStart(2, "0");
  }
  return result;
}

export function decodeHex(data: string): Uint8Array {
  const result = new Uint8Array(data.length / 2);
  for (let i = 0; i < data.length / 2; i++) {
    result[i] = parseInt(data.slice(i * 2, i * 2 + 2), 16);
  }
  return result;
}