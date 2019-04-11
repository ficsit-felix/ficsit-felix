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
  collected: ObjectReference[];
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
