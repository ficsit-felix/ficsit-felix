import { Readable } from 'stream';
import { ReadStream } from 'fs';

export interface FileHeader {
  filename: string;
  saveHeaderType: number;
  saveVersion: number;
  buildVersion: number;
  mapName: string;
  mapOptions: string;
  sessionName: string;
  playDurationSeconds: number;
  saveDateTime: Date;
  sessionVisibility: number;
}

export class FileHeaderReader {
  private stream: ReadStream;

  constructor(
    file: string,
    stream: ReadStream,
    callback: (files: any) => void
  ) {
    this.stream = stream;
    stream.on('readable', () => {
      try {
        const header: FileHeader = {
          filename: file,
          saveHeaderType: this.readInt(),
          saveVersion: this.readInt(),
          buildVersion: this.readInt(),
          mapName: this.readString(),
          mapOptions: this.readString(),
          sessionName: this.readString(),
          playDurationSeconds: this.readInt(),
          saveDateTime: this.transformToDate(this.readLong()),
          sessionVisibility: this.readByte()
        };

        callback(header);
      } catch (e) {
        // TODO do we want to inform the user about broken saves?
        // maybe add a red X icon next to them?
        console.warn(e);
      }

      stream.close();
    });
  }

  private readInt() {
    const data = this.stream.read(4);
    return data.readInt32LE(0);
  }

  // TODO: add this into satisfactory-json
  private readString() {
    let length = this.readInt();
    if (length === 0) {
      return '';
    }
    let utf16 = false;
    if (length < 0) {
      // Thanks to @Goz3rr we know that this is now an utf16 based string
      // throw new Error('length of string < 0: ' + length);
      length = -2 * length;
      utf16 = true;
    }
    let resultStr;
    if (utf16) {
      const result = this.stream.read(length - 2);
      resultStr = this.decodeUTF16LE(result.toString('binary'));
    } else {
      const result = this.stream.read(length - 1);
      resultStr = result.toString('utf8');
    }
    if (utf16) {
      this.assertNullByte();
      //this.assertNullByteString(length, resultStr); // two null bytes for utf16
    }
    this.assertNullByte();
    //this.assertNullByteString(length, resultStr);
    return resultStr;
  }

  private assertNullByte() {
    const data = this.stream.read(1);
    if (data[0] !== 0) {
      throw new Error('NOT ZERO, but ' + data);
    }
  }

  private readLong(): bigint {
    const data = this.stream.read(8) as Buffer;
    return data.readBigInt64LE(0); // TODO polyfill for web?
  }

  private readByte() {
    const data = this.stream.read(1);
    return data.readUInt8(0);
  }

  private decodeUTF16LE(binaryStr: string): string {
    const cp = [];
    for (let i = 0; i < binaryStr.length; i += 2) {
      cp.push(binaryStr.charCodeAt(i) | (binaryStr.charCodeAt(i + 1) << 8));
    }
    return String.fromCharCode.apply(String, cp);
  }

  // Convert FDateTime to a javascript Date
  private transformToDate(ticks: bigint): Date {
    const microsecondsSince0001 = ticks / BigInt(10000);

    //see https://stackoverflow.com/a/1628018
    const microsecondsSince1970 =
      microsecondsSince0001 - BigInt(62135596800000);

    return new Date(Number(microsecondsSince1970));
  }
}
