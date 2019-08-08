import { modelConfig } from '@/definitions/models';
import { Color, MeshMatcapMaterial, Material, Texture } from 'three';
import { findActorByName } from '@/helpers/entityHelper';
import { Actor, ByteProperty, StructProperty } from 'satisfactory-json';

/**
 * Factory that creates and caches materials
 */
export default class ColorFactory {
  classColors: { [id: string]: Color };
  materials: { [id: string]: Material } = {};
  coloredMaterials: Material[] = [];
  matcap: Texture;
  selectedMaterial: Material;

  // properties
  showCustomPaints: boolean;

  constructor(
    matcap: Texture,
    showCustomPaints: boolean,
    classColors: { [id: string]: Color }
  ) {
    this.matcap = matcap;
    this.showCustomPaints = showCustomPaints;
    this.classColors = classColors;

    this.selectedMaterial = new MeshMatcapMaterial({
      color: 0xffffff,
      matcap: this.matcap
    });

    this.setupColoredMaterials();
    this.setupDefaultMaterials();
  }

  // setup to use the primary colors of painted buildings
  setupDefaultMaterials() {
    for (var prop in modelConfig) {
      var color;
      if (this.classColors[prop] !== undefined) {
        color = new Color(this.classColors[prop]);
      } else {
        color = new Color(modelConfig[prop].color);
      }

      this.materials[prop] = new MeshMatcapMaterial({
        color: color,
        matcap: this.matcap
      });
    }
  }

  setupColoredMaterials() {
    const defaultColors = [
      new Color('#fcb26b'),
      new Color('#73a9d2'),
      new Color('#dd7550'),
      new Color('#666375'),

      new Color('#e1e1e9'),
      new Color('#bfe798'),
      new Color('#f890e2'),
      new Color('#bbf6ec'),

      new Color('#b59c5e'),
      new Color('#f9ecd9'),
      new Color('#c490f9'),
      new Color('#84dbb8'),

      new Color('#f5f09e'),
      new Color('#97978f'),
      new Color('#b048aa'),
      new Color('#838283')
    ];

    // check the BuildableSubsystem -> mColorSlotsPrimary for changed colors
    const buildableSubsystem = findActorByName(
      'Persistent_Level:PersistentLevel.BuildableSubsystem'
    );
    if (buildableSubsystem !== undefined) {
      for (let i = 0; i < buildableSubsystem.entity.properties.length; i++) {
        const element = buildableSubsystem.entity.properties[
          i
        ] as StructProperty;
        if (element.name === 'mColorSlotsPrimary') {
          // this primary color was changed by the user
          defaultColors[element.index] = new Color(
            element.value.r / 255,
            element.value.g / 255,
            element.value.b / 255
          );
        }
      }
    }

    for (let i = 0; i < defaultColors.length; i++) {
      const color = defaultColors[i];

      this.coloredMaterials[i] = new MeshMatcapMaterial({
        color: color,
        matcap: this.matcap
      });
    }
  }

  createMaterial(actor: Actor): Material {
    if (this.showCustomPaints) {
      const isPaintable =
        modelConfig[actor.className] !== undefined
          ? modelConfig[actor.className].paintable
          : false;

      for (let i = 0; i < actor.entity.properties.length; i++) {
        const element = actor.entity.properties[i] as ByteProperty;
        if (element.name === 'mColorSlot') {
          if (!isPaintable) {
            console.warn('paintable should be true for: ' + actor.className);
            /*reportMessage(
              "paintable should be true for: " + actor.className
            );*/
          }
          return this.coloredMaterials[element.value.value!];
        }
      }

      // mColorSlot is not set if it is colored with material 0
      if (isPaintable) {
        return this.coloredMaterials[0];
      }
    }

    if (this.materials[actor.className] === undefined) {
      // fetch material based on class name
      return this.materials['undefined'];
    } else {
      return this.materials[actor.className];
    }
  }

  // TODO: Migrate everywhere to this method and then change it and remove the createMaterial one
  getColor(actor: Actor): Color {
    return (this.createMaterial(actor) as MeshMatcapMaterial).color;
  }

  getSelectedMaterial(): Material {
    return this.selectedMaterial;
  }
}
