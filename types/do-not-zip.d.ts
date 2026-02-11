declare module 'do-not-zip' {
  interface ZipFile {
    path: string;
    data: Uint8Array | string;
  }

  export function toArray(files: ZipFile[]): number[];
  export function toBuffer(files: ZipFile[]): Buffer;
  export function toBlob(files: ZipFile[]): Blob;
  export function toAuto(files: ZipFile[]): number[] | Buffer | Blob;
}
