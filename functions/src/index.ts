import * as functions from 'firebase-functions';
import * as cors from 'cors';
import * as gcs from '@google-cloud/storage';
import { v4 } from 'uuid';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const options: cors.CorsOptions = {
    origin: true
};
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

    readLong(): number {
        let result = this.buffer.readInt32LE(this.cursor);
        // TODO figure out how to actually deal with longs in JS!
        this.cursor += 8;
        this.bytesRead += 8;
        return result;
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
        let result = this.buffer.slice(this.cursor, this.cursor + count).toString('hex');
        this.cursor += count;
        return result;
    }

    readLengthPrefixedString(): string {
        let length = this.readInt();
        if (length == 0) {
            return '';
        }
        let result = this.buffer.slice(this.cursor, this.cursor + length - 1).toString('utf8');
        this.cursor += length - 1;
        this.assertNullByte();
        return result;

    }

    assertNullByte() {
        if (this.buffer.readInt8(this.cursor) != 0) {
            console.log('ERROR');
            // TODO return error
        }
        this.cursor += 1;
    }

    resetBytesRead() {
        this.bytesRead = 0;
    }
}



interface SaveGame {
    saveHeaderType: number;
    saveVersion: number;
    buildVersion: number;
    mapName: string;
    mapOptions: string;
    sessionName: string;
    playDurationSeconds: number;
    saveDateTime: number;
    sessionVisibility: number;
    objects: ActorOrObject[];
    missing: string
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
        wasPlacedInLevel: number
    }
    entity?: Entity
}

interface Object {
    type: number;
    className: string;
    levelName: string;
    pathName: string;
    outerPathName: string;
    entity?: Entity
}

type ActorOrObject = Actor | Object;

interface Entity {
    levelName?: string;
    pathName?: string;
    children?: ObjectReference[];
    properties: Property[]
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
}

interface FloatProperty extends BaseProperty {
}

interface StrProperty extends BaseProperty {
}

interface NameProperty extends BaseProperty {
}

interface TextProperty extends BaseProperty {
}

interface ByteProperty extends BaseProperty {
}

interface EnumProperty extends BaseProperty {
}

interface ObjectProperty extends BaseProperty {
}

interface StructProperty extends BaseProperty {
}

interface ArrayProperty extends BaseProperty {
}

interface MapProperty extends BaseProperty {
}

type Property = IntProperty | BoolProperty | FloatProperty | StrProperty | NameProperty | TextProperty |
    ByteProperty | EnumProperty | ObjectProperty | StructProperty | ArrayProperty | MapProperty;

class Sav2Json {
    request: functions.Request;
    response: functions.Response;
    uuid: string;
    hadError = false;
    constructor(request: functions.Request, response: functions.Response) {
        this.request = request;
        this.response = response;
        this.uuid = v4();
    }

    transform() {
        const fileName = this.uuid + '.sav';
        const tempFile = path.join(os.tmpdir(), fileName);

        fs.writeFile(tempFile, this.request.body, (err) => {
            if (err) {
                this.error(err.message);
                return;
            }
            // upload to cloud storage
            const bucket = new gcs.Storage().bucket('ficsit-felix.appspot.com')
            bucket.upload(tempFile, {
                destination: 'saves/' + fileName
            });

            let data = this.request.body as Buffer;
            var buffer = new DataBuffer(data);


            var saveJson: SaveGame = {
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
                missing: ''
            };

            const entryCount = buffer.readInt();

            for (var i = 0; i < entryCount; i++) {
                const type = buffer.readInt()
                if (type == 1) {
                    saveJson['objects'].push(this.readActor(buffer));
                } else if (type == 0) {
                    saveJson['objects'].push(this.readObject(buffer));
                } else {
                    this.error('Unknown type ' + type);
                    return;
                }
            }

            const elementCount = buffer.readInt();

            // # So far these counts have always been the same and the entities seem to belong 1 to 1 to the actors/objects read above
            if (elementCount != entryCount) {
                this.error('elementCount (' + elementCount + ') != entryCount(' + entryCount + ')');
                return;
            }

            for (var i = 0; i < elementCount; i++) {
                if (saveJson.objects[i].type == 1) {
                    saveJson.objects[i].entity = this.readEntity(this.buffer, true);
                } else { // type == 0
                    saveJson.objects[i].entity = this.readEntity(this.buffer, false);
                }
            }

            this.response.send(JSON.stringify(saveJson));
        });
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
                scale3d: [
                    buffer.readFloat(),
                    buffer.readFloat(),
                    buffer.readFloat()
                ],
                wasPlacedInLevel: buffer.readInt()
            }
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
        buffer.resetBytesRead();

        var entity: Entity = {
            properties: []
        };

        if (withNames) {
            entity.levelName = buffer.readLengthPrefixedString();
            entity.pathName = buffer.readLengthPrefixedString();
            entity.children = []
            const childCount = buffer.readInt();
            for (var i = 0; i < childCount; i++) {
                entity.children.push(
                    {
                        levelName: buffer.readLengthPrefixedString(),
                        pathName: buffer.readLengthPrefixedString()
                    }
                );
            }
        }

        // read properties
        while (this.readProperty(buffer, entity.properties)) {
        }

        return entity;
    }

    readProperty(buffer: DataBuffer, properties: Property[]): boolean {
        const name = buffer.readLengthPrefixedString();
        if (name === 'None') {
            return false; // end of properties
        }

        const prop = buffer.readLengthPrefixedString();
        const length = buffer.readInt();
        const zero = buffer.readInt();
        if (zero != 0) {
            this.error('not null: ' + zero);
            return false;
        }

        switch(prop) {
            case 'IntProperty':
                buffer.assertNullByte();
                properties.push({
                    name: name,
                    type: prop,
                    value: buffer.readInt()
                });
                break;
            case 'BoolProperty':
                properties.push({
                    name: name,
                    type: prop,
                    value: buffer.readByte()
                });
                buffer.assertNullByte();
                break;
            case 'FloatProperty':
                buffer.assertNullByte();
                properties.push({
                    name: name,
                    type: prop,
                    value: buffer.readFloat()
                });
                break;
            case 'StrProperty':
                break;
            case 'NameProperty':
                break;
            case 'TextProperty':
                break;
            case 'ByteProperty':
                break;
            case 'EnumProperty':
                break;
            case 'ObjectProperty':
                break;
            case 'StructProperty':
                break;
            case 'ArrayProperty':
                break;
            case 'MapProperty':
                break;
            default:
                this.error('unknown type: ' + prop);
                return false;
        }



        return true;
    }



    error(message: string) {
        this.response.send(JSON.stringify({
            type: 'error',
            uuid: this.uuid,
            text: message
        }));
        console.log('error: ' + message+ ' (' + uuid+')')
        this.hadError = true;
    }
}

export const sav2json = functions.https.onRequest((request, response) => {
    cors(options)(request, response, () => {

        if ((typeof request.body) !== 'object') {
            console.log(request);
            let error: Error = {
                type: 'error',
                text: 'wrong request type: ' + (typeof request.body)

            };
            response.send(JSON.stringify(error));
            return;
        }

        new Sav2Json(request, response).transform();

    });
});

