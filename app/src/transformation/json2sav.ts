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

  // https://stackoverflow.com/a/14313213
  isASCII(str: string): boolean {
    return /^[\x00-\x7F]*$/.test(str);
  }

  // https://stackoverflow.com/a/24391376
  encodeUTF16LE(text: string) {
    var byteArray = new Uint8Array(text.length * 2);
    for (var i = 0; i < text.length; i++) {
      byteArray[i * 2] = text.charCodeAt(i) & 0xff;
      byteArray[i * 2 + 1] = (text.charCodeAt(i) >> 8) & 0xff;
    }

    return String.fromCharCode.apply(String, byteArray as any);
  }

  writeLengthPrefixedString(value: string, count = true) {
    if (value.length == 0) {
      this.writeInt(0, count);
    } else {
      if (this.isASCII(value)) {
        this.writeInt(value.length + 1, count);
        this.write(value, count);
        this.writeByte(0, count);
      } else {
        this.writeInt(-value.length - 1, count);
        this.write(this.encodeUTF16LE(value));
        this.writeByte(0, count);
        this.writeByte(0, count);
      }
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
      if (saveJson.saveHeaderType > 4) {
        this.buffer.writeByte(saveJson.sessionVisibility);
      }

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
          this.writeEntity(obj.entity, true, obj.className);
        } else if (obj.type == 0) {
          this.writeEntity(obj.entity, false, obj.className);
        }
      }

      this.buffer.writeInt(saveJson.collected.length);
      for (var i = 0; i < saveJson.collected.length; i++) {
        const obj = saveJson.collected[i];
        this.buffer.writeLengthPrefixedString(obj.levelName);
        this.buffer.writeLengthPrefixedString(obj.pathName);
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

  writeEntity(entity: any, withNames: boolean, className: string) {
    this.buffer.addBuffer(); // size will be written at this place later
    if (withNames) {
      this.buffer.writeLengthPrefixedString(entity.levelName);
      this.buffer.writeLengthPrefixedString(entity.pathName);
      this.buffer.writeInt(entity.children.length);
      for (var i = 0; i < entity.children.length; i++) {
        this.buffer.writeLengthPrefixedString(entity.children[i].levelName);
        this.buffer.writeLengthPrefixedString(entity.children[i].pathName);
      }
    }
    for (var i = 0; i < entity.properties.length; i++) {
      this.writeProperty(entity.properties[i]);
    }

    this.writeNone();
    this.buffer.writeInt(0); // extra object count?

    this.writeExtra(entity, className);

    if (entity.missing !== undefined) {
      this.buffer.writeHex(entity.missing);
    }
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
    this.buffer.writeInt(property.index, false);
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
          case "Color":
            this.buffer.writeByte(property.value.r);
            this.buffer.writeByte(property.value.g);
            this.buffer.writeByte(property.value.b);
            this.buffer.writeByte(property.value.a);
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
          case "RailroadTrackPosition":
            this.buffer.writeLengthPrefixedString(property.value.levelName);
            this.buffer.writeLengthPrefixedString(property.value.pathName);
            this.buffer.writeFloat(property.value.offset);
            this.buffer.writeFloat(property.value.forward);
            break;
          case "TimerHandle":
            this.buffer.writeLengthPrefixedString(property.value.handle);
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
          case "ByteProperty":
            for (var i = 0; i < property.value.values.length; i++) {
              this.buffer.writeByte(property.value.values[i]);
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

  writeExtra(entity: Entity, className: string) {
    switch(className) {
      case "/Game/FactoryGame/Buildable/Factory/PowerLine/Build_PowerLine.Build_PowerLine_C":
        this.writePowerLineExtra(entity);
        break;
    }
  }

  writePowerLineExtra(entity: Entity) {
    this.buffer.writeLengthPrefixedString(entity.extra.sourceLevelName);
    this.buffer.writeLengthPrefixedString(entity.extra.sourcePathName);
    this.buffer.writeLengthPrefixedString(entity.extra.targetLevelName);
    this.buffer.writeLengthPrefixedString(entity.extra.targetPathName);
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
    throw new Error(message);
  }
}
