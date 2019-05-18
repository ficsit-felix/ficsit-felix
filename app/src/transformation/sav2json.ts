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

  // https://stackoverflow.com/a/14601808
  decodeUTF16LE(binaryStr: string): string {
    var cp = [];
    for (var i = 0; i < binaryStr.length; i += 2) {
      cp.push(binaryStr.charCodeAt(i) | (binaryStr.charCodeAt(i + 1) << 8));
    }

    return String.fromCharCode.apply(String, cp);
  }

  readLengthPrefixedString(): string {
    let length = this.readInt();
    if (length == 0) {
      return "";
    }

    var utf16 = false;
    if (length < 0) {
      // Thanks to @Goz3rr we know that this is now an utf16 based string
      // throw new Error("length of string < 0: " + length);
      length = -2 * length;
      utf16 = true;
    }

    if (this.cursor + length > this.buffer.length) {
      // throw new Error('TOO LONG: ' +length + ' | ' + this.readHex(32) + ': ' + this.cursor + ' / ' + this.buffer.length );
      //console.error(this.readHex(this.buffer.length - this.cursor -1));
      console.log(this.readHex(32));
      // return '';
      console.trace("buffer < " + length);
      throw new Error("cannot read string of length: " + length);
    }

    var resultStr;
    if (utf16) {
      var result = this.buffer.slice(this.cursor, this.cursor + length - 2);
      resultStr = this.decodeUTF16LE(result.toString("binary"));

      this.cursor += length - 2;
      this.bytesRead += length - 2;
    } else {
      var result = this.buffer.slice(this.cursor, this.cursor + length - 1);
      resultStr = result.toString("utf8");

      this.cursor += length - 1;
      this.bytesRead += length - 1;
    }

    if (this.cursor < 0) {
      throw new Error("Cursor overflowed to " + this.cursor + " by " + length);
    }
    if (utf16) {
      this.assertNullByte(); // two null bytes for utf16
    }
    this.assertNullByte();
    return resultStr;
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

export class Sav2Json {
  hadError = false;
  buffer: DataBuffer;

  constructor(data: Buffer) {
    var buffer = new DataBuffer(data);
    this.buffer = buffer;
  }

  transform() {
    var buffer = this.buffer;

    const saveHeaderType = buffer.readInt();
    const saveVersion = buffer.readInt();

    var saveJson: SaveGame = {
      saveHeaderType: saveHeaderType,
      saveVersion: saveVersion,
      buildVersion: buffer.readInt(),
      mapName: buffer.readLengthPrefixedString(),
      mapOptions: buffer.readLengthPrefixedString(),
      sessionName: buffer.readLengthPrefixedString(),
      playDurationSeconds: buffer.readInt(),
      saveDateTime: buffer.readLong(),
      sessionVisibility: saveHeaderType > 4 ? buffer.readByte() : 0,
      objects: [],
      collected: [],
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

    const collectedCount = buffer.readInt();
    for (var i = 0; i < collectedCount; i++) {
      saveJson.collected.push({
        levelName: buffer.readLengthPrefixedString(),
        pathName: buffer.readLengthPrefixedString()
      });
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

    const index = buffer.readInt();
    
    switch (prop) {
      case "IntProperty":
        buffer.assertNullByte();
        properties.push({
          name: name,
          type: prop,
          index: index,
          value: buffer.readInt()
        });
        break;
      case "BoolProperty":
        properties.push({
          name: name,
          type: prop,
          index: index,
          value: buffer.readByte()
        });
        buffer.assertNullByte();
        break;
      case "FloatProperty":
        buffer.assertNullByte();
        properties.push({
          name: name,
          type: prop,
          index: index,
          value: buffer.readFloat()
        });
        break;
      case "StrProperty":
      case "NameProperty":
        buffer.assertNullByte();
        properties.push({
          name: name,
          type: prop,
          index: index,
          value: buffer.readLengthPrefixedString()
        });
        break;
      case "TextProperty":
        buffer.assertNullByte();
        properties.push({
          name: name,
          type: prop,
          index: index,
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
            index: index,
            value: {
              unk1: unk1,
              unk2: buffer.readByte()
            }
          });
        } else {
          properties.push({
            name: name,
            type: prop,
            index: index,
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
          index: index,
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
          index: index,
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
              index: index,
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
              index: index,
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
          case "Color":
            properties.push({
              name: name,
              type: prop,
              index: index,
              structUnknown: unknown,
              value: {
                type: type,
                r: buffer.readByte(),
                g: buffer.readByte(),
                b: buffer.readByte(),
                a: buffer.readByte()
              }
            });

            break;
          case "LinearColor":
            properties.push({
              name: name,
              type: prop,
              index: index,
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
              index: index,
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
              index: index,
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
              index: index,
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
              index: index,
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
          case "RailroadTrackPosition":
            properties.push({
              name: name,
              type: prop,
              index: index,
              structUnknown: unknown,
              value: {
                type: type,
                levelName: buffer.readLengthPrefixedString(),
                pathName: buffer.readLengthPrefixedString(),
                offset: buffer.readFloat(),
                forward: buffer.readFloat()
              }
            });
            break;
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
          case "ByteProperty":
            for (var j = 0; j < count; j++) {
              values.push(buffer.readByte());
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
              index: index,
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
          index: index,
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
          index: index,
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
    if (this.buffer) {
      console.error("cursor: " + this.buffer.cursor);
    }
    if (!this.hadError) {
      // we cannot send two error messages
    }
    this.hadError = true;
    throw new Error(message);
  }
}
