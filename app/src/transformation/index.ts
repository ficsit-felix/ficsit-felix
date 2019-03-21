import { v4 } from "uuid";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
interface Error {
  type: string;
  text: string;
}

class DataBuffer {
  buffer: Buffer;
  cursor: number;
  bytesRead: number;
  constructor(buffer: Buffer) {
    this.buffer = buffer;
    this.cursor = 0;
    this.bytesRead = 0;
  }

  readInt(): number {
    let result = this.buffer.readInt32LE(this.cursor);
    this.cursor += 4;
    this.bytesRead += 4;
    return result;
  }

  readLong(): string {
    /*let result = this.buffer.readInt32LE(this.cursor);
        // TODO figure out how to actually deal with longs in JS!
        this.cursor += 8;
        this.bytesRead += 8;
        return result;*/
    return this.readHex(8);
  }

  readByte(): number {
    let result = this.buffer.readUInt8(this.cursor);
    this.cursor += 1;
    this.bytesRead += 1;
    return result;
  }

  readFloat(): number {
    let result = this.buffer.readFloatLE(this.cursor);
    this.cursor += 4;
    this.bytesRead += 4;
    return result;
  }

  readHex(count: number): string {
    let result = this.buffer
      .slice(this.cursor, this.cursor + count)
      .toString("hex");
    this.cursor += count;
    this.bytesRead += count;
    return result;
  }

  readLengthPrefixedString(): string {
    let length = this.readInt();
    if (length == 0) {
      return "";
    }
    if (this.cursor + length > this.buffer.length) {
      // throw new Error('TOO LONG: ' +length + ' | ' + this.readHex(32) + ': ' + this.cursor + ' / ' + this.buffer.length );
      // console.error(this.readHex(this.buffer.length - this.cursor -1));
      // return '';
      console.trace("buffer < " + length);
      throw new Error("cannot read string of length: " + length);
    }
    let result = this.buffer
      .slice(this.cursor, this.cursor + length - 1)
      .toString("utf8");
    this.cursor += length - 1;
    this.bytesRead += length - 1;
    this.assertNullByte();
    return result;
  }
  assertNullByte() {
    const zero = this.buffer.readInt8(this.cursor);
    if (zero != 0) {
      throw new Error("string does not end with 0 byte, but " + zero);
      // TODO return error
    }
    this.cursor += 1;
    this.bytesRead += 1;
  }

  resetBytesRead() {
    this.bytesRead = 0;
  }
}

interface SaveGame {
  uuid: string;
  saveHeaderType: number;
  saveVersion: number;
  buildVersion: number;
  mapName: string;
  mapOptions: string;
  sessionName: string;
  playDurationSeconds: number;
  saveDateTime: string;
  sessionVisibility: number;
  objects: ActorOrObject[];
  missing: string;
}

interface Actor {
  type: number;
  className: string;
  levelName: string;
  pathName: string;
  needTransform: number;
  transform: {
    rotation: number[];
    translation: number[];
    scale3d: number[];
  };
  wasPlacedInLevel: number;
  entity?: Entity;
}

interface Object {
  type: number;
  className: string;
  levelName: string;
  pathName: string;
  outerPathName: string;
  entity?: Entity;
}

type ActorOrObject = Actor | Object;

interface Entity {
  levelName?: string;
  pathName?: string;
  children?: ObjectReference[];
  properties: Property[];
  missing?: string;
}

interface ObjectReference {
  levelName: string;
  pathName: string;
}

interface BaseProperty {
  name: string;
  type: string;
}

interface IntProperty extends BaseProperty {
  value: number;
}

interface BoolProperty extends BaseProperty {
  value: number;
}

interface FloatProperty extends BaseProperty {
  value: number;
}

interface StrProperty extends BaseProperty {
  value: string;
}

interface NameProperty extends BaseProperty {
  value: string;
}

interface TextProperty extends BaseProperty {
  textUnknown: string;
  value: string;
}

interface ByteProperty extends BaseProperty {
  unk1: string;
  unk2: string;
}

interface EnumProperty extends BaseProperty {
  enum: string;
  value: string;
}

interface ObjectProperty extends BaseProperty {
  levelName: string;
  pathName: string;
}

interface StructProperty extends BaseProperty {
  structUnknown: string;
  value: any; // TODO!!
}

interface ArrayProperty extends BaseProperty {
  structName?: string;
  structType?: string;
  structInnerType?: string;
}

interface MapProperty extends BaseProperty {}

type Property =
  | IntProperty
  | BoolProperty
  | FloatProperty
  | StrProperty
  | NameProperty
  | TextProperty
  | ByteProperty
  | EnumProperty
  | ObjectProperty
  | StructProperty
  | ArrayProperty
  | MapProperty;

export class Sav2Json {
  uuid: string;
  hadError = false;
  buffer: DataBuffer;

  constructor(data: Buffer) {
    var buffer = new DataBuffer(data);
    this.buffer = buffer;
    this.uuid = v4();
  }

  transform() {
    var buffer = this.buffer;

    var saveJson: SaveGame = {
      uuid: this.uuid,
      saveHeaderType: buffer.readInt(),
      saveVersion: buffer.readInt(),
      buildVersion: buffer.readInt(),
      mapName: buffer.readLengthPrefixedString(),
      mapOptions: buffer.readLengthPrefixedString(),
      sessionName: buffer.readLengthPrefixedString(),
      playDurationSeconds: buffer.readInt(),
      saveDateTime: buffer.readLong(),
      sessionVisibility: buffer.readByte(),
      objects: [],
      missing: ""
    };

    const entryCount = buffer.readInt();

    for (var i = 0; i < entryCount; i++) {
      if (this.hadError) {
        return;
      }
      const type = buffer.readInt();
      if (type == 1) {
        saveJson["objects"].push(this.readActor(buffer));
      } else if (type == 0) {
        saveJson["objects"].push(this.readObject(buffer));
      } else {
        this.error("Unknown type " + type);
        return;
      }
    }

    const elementCount = buffer.readInt();

    // # So far these counts have always been the same and the entities seem to belong 1 to 1 to the actors/objects read above
    if (elementCount != entryCount) {
      this.error(
        "elementCount (" + elementCount + ") != entryCount(" + entryCount + ")"
      );
      return;
    }

    for (var i = 0; i < elementCount; i++) {
      if (this.hadError) {
        return;
      }
      if (saveJson.objects[i].type == 1) {
        saveJson.objects[i].entity = this.readEntity(buffer, true);
      } else {
        // type == 0
        saveJson.objects[i].entity = this.readEntity(buffer, false);
      }
    }

    // read missing bytes
    saveJson.missing = this.buffer.readHex(
      this.buffer.buffer.length - this.buffer.cursor
    );

    return saveJson;
  }

  readActor(buffer: DataBuffer): Actor {
    return {
      type: 1,
      className: buffer.readLengthPrefixedString(),
      levelName: buffer.readLengthPrefixedString(),
      pathName: buffer.readLengthPrefixedString(),
      needTransform: buffer.readInt(),
      transform: {
        rotation: [
          buffer.readFloat(),
          buffer.readFloat(),
          buffer.readFloat(),
          buffer.readFloat()
        ],
        translation: [
          buffer.readFloat(),
          buffer.readFloat(),
          buffer.readFloat()
        ],
        scale3d: [buffer.readFloat(), buffer.readFloat(), buffer.readFloat()]
      },
      wasPlacedInLevel: buffer.readInt()
    };
  }

  readObject(buffer: DataBuffer): Object {
    return {
      type: 0,
      className: buffer.readLengthPrefixedString(),
      levelName: buffer.readLengthPrefixedString(),
      pathName: buffer.readLengthPrefixedString(),
      outerPathName: buffer.readLengthPrefixedString()
    };
  }

  readEntity(buffer: DataBuffer, withNames: boolean): Entity {
    const length = buffer.readInt();
    buffer.resetBytesRead();

    var entity: Entity = {
      properties: []
    };

    if (withNames) {
      entity.levelName = buffer.readLengthPrefixedString();
      entity.pathName = buffer.readLengthPrefixedString();
      entity.children = [];
      const childCount = buffer.readInt();
      for (var i = 0; i < childCount; i++) {
        entity.children.push({
          levelName: buffer.readLengthPrefixedString(),
          pathName: buffer.readLengthPrefixedString()
        });
      }
    }

    // read properties
    while (this.readProperty(buffer, entity.properties)) {}

    const missing = length - buffer.bytesRead;
    if (missing > 0) {
      entity.missing = buffer.readHex(missing);
    } else if (missing < 0) {
      this.error("negative missing amount: " + missing);
    }
    // console.log(entity);

    return entity;
  }

  readProperty(buffer: DataBuffer, properties: Property[]): boolean {
    const name = buffer.readLengthPrefixedString();
    if (name === "None") {
      return false; // end of properties
    }

    const prop = buffer.readLengthPrefixedString();

    const length = buffer.readInt();
    if (length == 0) {
      // TODO remove, only there so that length is used
    }

    const zero = buffer.readInt();
    if (zero != 0) {
      this.error("not null: " + zero);
      return false;
    }

    switch (prop) {
      case "IntProperty":
        buffer.assertNullByte();
        properties.push({
          name: name,
          type: prop,
          value: buffer.readInt()
        });
        break;
      case "BoolProperty":
        properties.push({
          name: name,
          type: prop,
          value: buffer.readByte()
        });
        buffer.assertNullByte();
        break;
      case "FloatProperty":
        buffer.assertNullByte();
        properties.push({
          name: name,
          type: prop,
          value: buffer.readFloat()
        });
        break;
      case "StrProperty":
      case "NameProperty":
        buffer.assertNullByte();
        properties.push({
          name: name,
          type: prop,
          value: buffer.readLengthPrefixedString()
        });
        break;
      case "TextProperty":
        buffer.assertNullByte();
        properties.push({
          name: name,
          type: prop,
          textUnknown: buffer.readHex(13),
          value: buffer.readLengthPrefixedString()
        });
        break;
      case "ByteProperty":
        const unk1 = buffer.readLengthPrefixedString();
        buffer.assertNullByte();
        if (unk1 === "None") {
          properties.push({
            name: name,
            type: prop,
            value: {
              unk1: unk1,
              unk2: buffer.readByte()
            }
          });
        } else {
          properties.push({
            name: name,
            type: prop,
            value: {
              unk1: unk1,
              unk2: buffer.readLengthPrefixedString()
            }
          });
        }
        break;
      case "EnumProperty":
        const enumName = buffer.readLengthPrefixedString();
        buffer.assertNullByte();
        properties.push({
          name: name,
          type: prop,
          value: {
            enum: enumName,
            value: buffer.readLengthPrefixedString()
          }
        });
        break;
      case "ObjectProperty":
        buffer.assertNullByte();
        properties.push({
          name: name,
          type: prop,
          value: {
            levelName: buffer.readLengthPrefixedString(),
            pathName: buffer.readLengthPrefixedString()
          }
        });
        break;
      case "StructProperty":
        const type = buffer.readLengthPrefixedString();
        const unknown = buffer.readHex(17);

        switch (type) {
          case "Vector":
          case "Rotator":
            properties.push({
              name: name,
              type: prop,
              structUnknown: unknown,
              value: {
                type: type,
                x: buffer.readFloat(),
                y: buffer.readFloat(),
                z: buffer.readFloat()
              }
            });
            break;
          case "Box":
            properties.push({
              name: name,
              type: prop,
              structUnknown: unknown,
              value: {
                type: type,
                min: [
                  buffer.readFloat(),
                  buffer.readFloat(),
                  buffer.readFloat()
                ],
                max: [
                  buffer.readFloat(),
                  buffer.readFloat(),
                  buffer.readFloat()
                ],
                isValid: buffer.readByte()
              }
            });
            break;
          case "LinearColor":
            properties.push({
              name: name,
              type: prop,
              structUnknown: unknown,
              value: {
                type: type,
                r: buffer.readFloat(),
                g: buffer.readFloat(),
                b: buffer.readFloat(),
                a: buffer.readFloat()
              }
            });
            break;
          case "Transform":
            const props: Property[] = [];
            while (this.readProperty(buffer, props)) {}
            properties.push({
              name: name,
              type: prop,
              structUnknown: unknown,
              value: {
                type: type,
                properties: props
              }
            });
            break;
          case "Quat":
            properties.push({
              name: name,
              type: prop,
              structUnknown: unknown,
              value: {
                type: type,
                a: buffer.readFloat(),
                b: buffer.readFloat(),
                c: buffer.readFloat(),
                d: buffer.readFloat()
              }
            });
            break;
          case "RemovedInstanceArray":
          case "InventoryStack": {
            const props: Property[] = [];
            while (this.readProperty(buffer, props)) {}
            properties.push({
              name: name,
              type: prop,
              structUnknown: unknown,
              value: {
                type: type,
                properties: props
              }
            });
            break;
          }
          case "InventoryItem": {
            const unk1 = buffer.readLengthPrefixedString();
            const itemName = buffer.readLengthPrefixedString();
            const levelName = buffer.readLengthPrefixedString();
            const pathName = buffer.readLengthPrefixedString();
            const props: Property[] = [];
            this.readProperty(buffer, props); // can't consume null here because it is needed by the entaingling struct

            properties.push({
              name: name,
              type: prop,
              structUnknown: unknown,
              value: {
                type: type,
                unk1: unk1,
                itemName: itemName,
                levelName: levelName,
                pathName: pathName,
                properties: props
              }
            });
            break;
          }
          default:
            this.error("Unknown struct type: " + type);
            break;
        }

        break;
      case "ArrayProperty":
        const itemType = buffer.readLengthPrefixedString();
        buffer.assertNullByte();
        const count = buffer.readInt();

        const values: any[] = []; // TODO

        switch (itemType) {
          case "IntProperty":
            for (var j = 0; j < count; j++) {
              values.push(buffer.readInt());
            }
            break;
          case "ObjectProperty":
            for (var j = 0; j < count; j++) {
              values.push({
                levelName: buffer.readLengthPrefixedString(),
                pathName: buffer.readLengthPrefixedString()
              });
            }
            break;
          case "StructProperty":
            const structName = buffer.readLengthPrefixedString();
            const structType = buffer.readLengthPrefixedString();
            const structSize = buffer.readInt();
            if (structSize == 0) {
            } // TODO remove?
            const zero = buffer.readInt();
            if (zero != 0) {
              this.error("not zero: " + zero);
              return false;
            }

            const type = buffer.readLengthPrefixedString();

            const unknown = buffer.readHex(17); // TODO
            /*property['structName'] = structName
                        property['structType'] = structType
                        property['structInnerType'] = type
            
                        property['structUnknown'] = readHex(17)  # TODO what are those?
                        property['_structLength'] = structSize*/
            for (var j = 0; j < count; j++) {
              var props: Property[] = [];
              while (this.readProperty(buffer, props)) {}
              values.push({
                properties: props
              });
            }
            properties.push({
              name: name,
              type: prop,
              structUnknown: unknown,
              structName: structName,
              structType: structType,
              structInnerType: type,
              value: {
                type: itemType,
                values: values
              }
            });
            return true;
            break;
          default:
            this.error("unknown itemType: " + itemType);
            break;
        }
        properties.push({
          name: name,
          type: prop,
          value: {
            type: itemType,
            values: values
          }
        });

        break;
      case "MapProperty": {
        const mapName = buffer.readLengthPrefixedString();
        const valueType = buffer.readLengthPrefixedString();
        for (var i = 0; i < 5; i++) {
          buffer.assertNullByte();
        }

        const count = buffer.readInt();
        var mapValues: { [id: string]: Property[] } = {};
        for (var i = 0; i < count; i++) {
          const key = buffer.readInt();
          const props: Property[] = [];
          while (this.readProperty(buffer, props)) {}
          mapValues[key] = props;
        }
        properties.push({
          name: name,
          type: prop,
          value: {
            name: mapName,
            type: valueType,
            values: mapValues
          }
        });
        break;
      }
      default:
        this.error("unknown type: " + prop);
        return false;
    }

    return true;
  }

  error(message: string) {
    console.trace("error: " + message);
    console.error("uuid: " + this.uuid);
    if (this.buffer) {
      console.error("cursor: " + this.buffer.cursor);
    }
    if (!this.hadError) {
      // we cannot send two error messages
      /*this.response.send(JSON.stringify({
                type: 'error',
                uuid: this.uuid,
                text: message
            }));*/
    }
    this.hadError = true;
  }
}

// TODO find a way to optimize this more!
interface OutputBufferBuffer {
  bytes: string;
  length: number;
}
class OutputBuffer {
  bytes: string = "";
  buffers: OutputBufferBuffer[] = [];

  constructor() {}

  write(bytes: string, count = true) {
    if (this.buffers.length == 0) {
      this.bytes += bytes;
    } else {
      this.buffers[this.buffers.length - 1].bytes += bytes;
      if (count) {
        this.buffers[this.buffers.length - 1].length += bytes.length;
      }
    }
  }

  addBuffer() {
    this.buffers.push({ bytes: "", length: 0 });
  }

  endBufferAndWriteSize() {
    let buffer = this.buffers[this.buffers.length - 1];
    this.buffers.pop(); // remove last element
    this.writeInt(buffer.length);
    this.write(buffer.bytes); // TODO check if correct
    return buffer.length;
  }

  writeInt(value: number, count = true) {
    let buffer = Buffer.alloc(4);
    buffer.writeInt32LE(value, 0);
    this.write(buffer.toString("binary"), count);
  }

  writeLong(value: string) {
    this.writeHex(value);
  }

  writeByte(value: number, count = true) {
    this.write(String.fromCharCode(value), count);
  }

  writeFloat(value: number) {
    let buffer = Buffer.alloc(4);
    buffer.writeFloatLE(value, 0);
    this.write(buffer.toString("binary"));
  }

  writeHex(value: string, count = true) {
    let buffer = Buffer.from(value, "hex");
    this.write(buffer.toString("binary"), count);
  }

  writeLengthPrefixedString(value: string, count = true) {
    if (value.length == 0) {
      this.writeInt(0, count);
    } else {
      this.writeInt(value.length + 1, count);
      this.write(value, count);
      this.writeByte(0, count);
    }
  }
}

export class Json2Sav {
  uuid?: string;
  hadError = false;
  buffer: OutputBuffer;
  saveJson: any;
  constructor(saveJson: any) {
    this.saveJson = saveJson;
    this.buffer = new OutputBuffer();
  }

  transform() {
    try {
      let saveJson = this.saveJson;
      // console.log(json);
      if (saveJson) {
      }

      // Header
      this.buffer.writeInt(saveJson.saveHeaderType);
      this.buffer.writeInt(saveJson.saveVersion);
      this.buffer.writeInt(saveJson.buildVersion);
      this.buffer.writeLengthPrefixedString(saveJson.mapName);
      this.buffer.writeLengthPrefixedString(saveJson.mapOptions);
      this.buffer.writeLengthPrefixedString(saveJson.sessionName);
      this.buffer.writeInt(saveJson.playDurationSeconds);
      this.buffer.writeLong(saveJson.saveDateTime);
      this.buffer.writeByte(saveJson.sessionVisibility);

      this.buffer.writeInt(saveJson.objects.length);

      for (var i = 0; i < saveJson.objects.length; i++) {
        const obj = saveJson.objects[i];
        this.buffer.writeInt(obj.type);
        if (obj.type == 1) {
          this.writeActor(obj);
        } else if (obj.type == 0) {
          this.writeObject(obj);
        } else {
          this.error("uknown type " + obj.type);
        }
      }

      this.buffer.writeInt(saveJson.objects.length);
      for (var i = 0; i < saveJson.objects.length; i++) {
        const obj = saveJson.objects[i];
        if (obj.type == 1) {
          this.writeEntity(obj.entity, true);
        } else if (obj.type == 0) {
          this.writeEntity(obj.entity, false);
        }
      }

      this.buffer.writeHex(saveJson.missing);
      // const response = Buffer.from(this.buffer.bytes);

      return this.buffer.bytes;
      /*this.response.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-Length': response.byteLength
            });
            this.response.end(response, 'binary');*/
    } catch (e) {
      console.error(e.stack);
      this.error(e.message);
    }
  }

  writeActor(obj: any) {
    this.buffer.writeLengthPrefixedString(obj.className);
    this.buffer.writeLengthPrefixedString(obj.levelName);
    this.buffer.writeLengthPrefixedString(obj.pathName);
    this.buffer.writeInt(obj.needTransform);
    this.buffer.writeFloat(obj.transform.rotation[0]);
    this.buffer.writeFloat(obj.transform.rotation[1]);
    this.buffer.writeFloat(obj.transform.rotation[2]);
    this.buffer.writeFloat(obj.transform.rotation[3]);
    this.buffer.writeFloat(obj.transform.translation[0]);
    this.buffer.writeFloat(obj.transform.translation[1]);
    this.buffer.writeFloat(obj.transform.translation[2]);
    this.buffer.writeFloat(obj.transform.scale3d[0]);
    this.buffer.writeFloat(obj.transform.scale3d[1]);
    this.buffer.writeFloat(obj.transform.scale3d[2]);
    this.buffer.writeInt(obj.wasPlacedInLevel);
  }

  writeObject(obj: any) {
    this.buffer.writeLengthPrefixedString(obj.className);
    this.buffer.writeLengthPrefixedString(obj.levelName);
    this.buffer.writeLengthPrefixedString(obj.pathName);
    this.buffer.writeLengthPrefixedString(obj.outerPathName);
  }

  writeEntity(obj: any, withNames: boolean) {
    this.buffer.addBuffer(); // size will be written at this place later
    if (withNames) {
      this.buffer.writeLengthPrefixedString(obj.levelName);
      this.buffer.writeLengthPrefixedString(obj.pathName);
      this.buffer.writeInt(obj.children.length);
      for (var i = 0; i < obj.children.length; i++) {
        this.buffer.writeLengthPrefixedString(obj.children[i].levelName);
        this.buffer.writeLengthPrefixedString(obj.children[i].pathName);
      }
    }
    for (var i = 0; i < obj.properties.length; i++) {
      this.writeProperty(obj.properties[i]);
    }

    this.writeNone();

    this.buffer.writeHex(obj.missing);
    this.buffer.endBufferAndWriteSize();
  }

  writeNone() {
    this.buffer.writeLengthPrefixedString("None");
  }

  writeProperty(property: any) {
    this.buffer.writeLengthPrefixedString(property.name);
    const type = property.type;
    this.buffer.writeLengthPrefixedString(property.type);
    this.buffer.addBuffer();
    this.buffer.writeInt(0, false);
    switch (type) {
      case "IntProperty":
        this.buffer.writeByte(0, false);
        this.buffer.writeInt(property.value);
        break;
      case "BoolProperty":
        this.buffer.writeByte(property.value, false);
        this.buffer.writeByte(0, false);
        break;
      case "FloatProperty":
        this.buffer.writeByte(0, false);
        this.buffer.writeFloat(property.value);
        break;
      case "StrProperty":
      case "NameProperty":
        this.buffer.writeByte(0, false);
        this.buffer.writeLengthPrefixedString(property.value);
        break;
      case "TextProperty":
        this.buffer.writeByte(0, false);
        this.buffer.writeHex(property.textUnknown);
        this.buffer.writeLengthPrefixedString(property.value);
        break;
      case "ByteProperty":
        this.buffer.writeLengthPrefixedString(property.value.unk1, false);
        if (property.value.unk1 === "None") {
          this.buffer.writeByte(0, false);
          this.buffer.writeByte(property.value.unk2);
        } else {
          this.buffer.writeByte(0, false);
          this.buffer.writeLengthPrefixedString(property.value.unk2);
        }
        break;

      case "EnumProperty":
        this.buffer.writeLengthPrefixedString(property.value.enum, false);
        this.buffer.writeByte(0, false);
        this.buffer.writeLengthPrefixedString(property.value.value);
        break;

      case "ObjectProperty":
        this.buffer.writeByte(0, false);
        this.buffer.writeLengthPrefixedString(property.value.levelName);
        this.buffer.writeLengthPrefixedString(property.value.pathName);
        break;

      case "StructProperty":
        this.buffer.writeLengthPrefixedString(property.value.type, false);
        this.buffer.writeHex(property.structUnknown, false);

        const structType = property.value.type;
        switch (structType) {
          case "Vector":
          case "Rotator":
            this.buffer.writeFloat(property.value.x);
            this.buffer.writeFloat(property.value.y);
            this.buffer.writeFloat(property.value.z);
            break;
          case "Box":
            this.buffer.writeFloat(property.value.min[0]);
            this.buffer.writeFloat(property.value.min[1]);
            this.buffer.writeFloat(property.value.min[2]);
            this.buffer.writeFloat(property.value.max[0]);
            this.buffer.writeFloat(property.value.max[1]);
            this.buffer.writeFloat(property.value.max[2]);
            this.buffer.writeByte(property.value.isValid);
            break;
          case "LinearColor":
            this.buffer.writeFloat(property.value.r);
            this.buffer.writeFloat(property.value.g);
            this.buffer.writeFloat(property.value.b);
            this.buffer.writeFloat(property.value.a);
            break;
          case "Transform":
            for (var i = 0; i < property.value.properties.length; i++) {
              this.writeProperty(property.value.properties[i]);
            }
            this.writeNone();
            break;
          case "Quat":
            this.buffer.writeFloat(property.value.a);
            this.buffer.writeFloat(property.value.b);
            this.buffer.writeFloat(property.value.c);
            this.buffer.writeFloat(property.value.d);
            break;
          case "RemovedInstanceArray":
          case "InventoryStack":
            for (var i = 0; i < property.value.properties.length; i++) {
              this.writeProperty(property.value.properties[i]);
            }
            this.writeNone();
            break;
          case "InventoryItem":
            this.buffer.writeLengthPrefixedString(property.value.unk1, false);
            this.buffer.writeLengthPrefixedString(property.value.itemName);
            this.buffer.writeLengthPrefixedString(property.value.levelName);
            this.buffer.writeLengthPrefixedString(property.value.pathName);
            const oldval = this.buffer.buffers[this.buffer.buffers.length - 1]
              .length;
            this.writeProperty(property.value.properties[0]);
            // Dirty hack to make in this one case the inner property only take up 4 bytes
            this.buffer.buffers[this.buffer.buffers.length - 1].length =
              oldval + 4;
            break;
        }
        break;
      case "ArrayProperty":
        const itemType = property.value.type;
        this.buffer.writeLengthPrefixedString(itemType, false);
        this.buffer.writeByte(0, false);
        this.buffer.writeInt(property.value.values.length);
        switch (itemType) {
          case "IntProperty":
            for (var i = 0; i < property.value.values.length; i++) {
              this.buffer.writeInt(property.value.values[i]);
            }
            break;

          case "ObjectProperty":
            for (var i = 0; i < property.value.values.length; i++) {
              const obj = property.value.values[i];
              this.buffer.writeLengthPrefixedString(obj.levelName);
              this.buffer.writeLengthPrefixedString(obj.pathName);
            }
            break;
          case "StructProperty":
            this.buffer.writeLengthPrefixedString(property.structName);
            this.buffer.writeLengthPrefixedString(property.structType);
            this.buffer.addBuffer();
            this.buffer.writeInt(0, false);
            this.buffer.writeLengthPrefixedString(
              property.structInnerType,
              false
            );
            this.buffer.writeHex(property.structUnknown, false);
            for (var i = 0; i < property.value.values.length; i++) {
              const obj = property.value.values[i];
              for (var j = 0; j < obj.properties.length; j++) {
                this.writeProperty(obj.properties[j]);
              }
              this.writeNone();
            }
            this.buffer.endBufferAndWriteSize();
            break;
          default:
            this.error("Unknown array type: " + itemType);
            break;
        }
        break;
      case "MapProperty":
        this.buffer.writeLengthPrefixedString(property.value.name, false);
        this.buffer.writeLengthPrefixedString(property.value.type, false);
        this.buffer.writeByte(0, false);
        this.buffer.writeInt(0); // for some reason this counts towards the length

        const keys = Object.keys(property.value.values);
        this.buffer.writeInt(keys.length);
        for (var i = 0; i < keys.length; i++) {
          //(let [key, value] of property.value.values) {
          const key = keys[i];
          const value = property.value.values[key];
          this.buffer.writeInt(+key); // parse key to int
          for (var j = 0; j < value.length; j++) {
            this.writeProperty(value[j]);
          }
          this.writeNone();
        }

        break;
      default:
        this.error("Unknown property type " + type);
    }
    this.buffer.endBufferAndWriteSize();
  }

  error(message: string) {
    console.trace("error: " + message);
    if (this.uuid) {
      console.error("uuid: " + this.uuid);
    }
    if (!this.hadError) {
      // we cannot send two error messages
      /*this.response.send(JSON.stringify({
                type: 'error',
                uuid: this.uuid,
                text: message
            }));*/
      // TODO
    }
    this.hadError = true;
  }
}
