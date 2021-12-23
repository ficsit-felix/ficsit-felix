import {
  isModClassName,
  modelConfig,
  Paintable
} from '@lib/definitions/models';
import { findActorByName } from '@lib/graphics/entityHelper';
import { Actor, ByteProperty, StructProperty } from 'satisfactory-json';
import { Color, Material, MeshMatcapMaterial, Texture } from 'three';

/**
 * Factory that creates and caches materials
 */
export default class ColorFactory {
  classColors: { [id: string]: string };
  materials: { [id: string]: Material } = {};
  coloredMaterials: Material[] = [];
  matcap: Texture;
  selectedMaterial: Material;

  // properties
  showCustomPaints: boolean;

  constructor(
    matcap: Texture,
    showCustomPaints: boolean,
    classColors: { [id: string]: string }
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
    for (const prop in modelConfig) {
      let color;
      if (this.classColors[prop] !== undefined) {
        color = new Color(this.classColors[prop]);
      } else {
        color = new Color(modelConfig[prop].color).convertSRGBToLinear();
      }

      this.materials[prop] = new MeshMatcapMaterial({
        color: color,
        matcap: this.matcap
      });
    }
  }

  setupColoredMaterials() {
    const defaultColors = [
      /* eslint-disable */
      new Color(0.952941, 0.301969, 0.066667), // swatch 0, factory buildings
      new Color(0.149017, 0.392157, 0.654902), // swatch 1 to...
      new Color(0.8     , 0.203922, 0.074510),
      new Color(0.125490, 0.129412, 0.184314),

      new Color(0.745098, 0.764706, 0.807843),
      new Color(0.498039, 0.729412, 0.286275),
      new Color(1,        0.349020, 0.792157),
      new Color(0.450980, 0.874510, 0.843137),

      new Color(0.490196, 0.329412, 0.101961),
      new Color(0.956862, 0.843137, 0.682353),
      new Color(0.584314, 0.329412, 0.980392),
      new Color(0.200000, 0.639216, 0.486275),

      new Color(0.925490, 0.843137, 0.321569),
      new Color(0.305882, 0.309804, 0.266667),
      new Color(0.470588, 0.098039, 0.415686),
      new Color(0.223529, 0.223529, 0.223529), // ...swatch 15, normal swatches

      new Color(0.109804, 0.109804, 0.109804), // swatch 16, ficsit-foundations
      new Color(0.952941, 0.301961, 0.066667), // swatch 17, pipes
      new Color(1,        1,        1) //         swatch 18, concrete foundations/walls
    ]; /* eslint-enable */

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

        // New array of Linear colors are used from save version 28 on
        if (element.name === 'mColorSlots_Data') {
          for (let j = 0; j < element.value.values.length; j++) {
            const color = element.value.values[j].properties[0].value; // primary color
            defaultColors[j] = new Color(color.r, color.g, color.b);
          }

          break;
        }
        // Linear colors are used from save version 23 on
        if (element.name === 'mColorSlotsPrimary_Linear') {
          for (let j = 0; j < element.value.values.length; j++) {
            const color = element.value.values[j];
            defaultColors[j] = new Color(color.r, color.g, color.b);
          }

          break;
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
      const isPaintable: Paintable =
        modelConfig[actor.className] !== undefined
          ? modelConfig[actor.className].paintable
          : Paintable.FALSE;

      let ignorecolorslots = false;
      for (let i = 0; i < actor.entity.properties.length; i++) {
        const element = actor.entity.properties[i] as ByteProperty;
        if (element.name === 'mCustomizationData') {
          const custom = actor.entity.properties[i] as StructProperty;
          if (custom.value.properties.length > 0) {
            const props = custom.value.properties[0];
            if (props.name === 'SwatchDesc') {
              const swatchdesc = props.value.pathName.match(
                /\/Game.*\/SwatchDesc_(.*)\.Swatch.*/s
              );
              ignorecolorslots = true;
              if (swatchdesc.length == 2) {
                swatchdesc[1] = swatchdesc[1].replace(
                  'FoundationOverride',
                  'Slot16'
                );
                swatchdesc[1] = swatchdesc[1].replace('Concrete', 'Slot18');
                swatchdesc[1] = swatchdesc[1].replace('Slot', '');

                if (swatchdesc[1] === 'Custom') {
                  const props1 = custom.value.properties[1];
                  let r = 0;
                  let g = 0;
                  let b = 0;
                  if (props1 !== undefined) {
                    // totally black prim and sec colors if undefined
                    if (props1.name === 'OverrideColorData') {
                      if (props1.value.properties[0].name === 'PrimaryColor') {
                        // primary is not black
                        r = props1.value.properties[0].value.r;
                        g = props1.value.properties[0].value.g;
                        b = props1.value.properties[0].value.b;
                      }
                    }
                  }

                  // TODO cache Custom materials and only create one material for each unique color
                  const color = new Color(r, g, b);
                  return new MeshMatcapMaterial({
                    color: color,
                    matcap: this.matcap
                  });
                } else {
                  if (isPaintable !== Paintable.FALSE) {
                    return this.coloredMaterials[swatchdesc[1]];
                  }
                }
              }
            }
          }
        }
      }

      for (
        let i = 0;
        !ignorecolorslots && i < actor.entity.properties.length;
        i++
      ) {
        const element = actor.entity.properties[i] as ByteProperty;
        if (element.name === 'mColorSlot') {
          if (
            isPaintable === Paintable.FALSE &&
            !isModClassName(actor.className)
          ) {
            // console.warn('paintable should be true for: ' + actor.className);
            /*reportMessage(
              "paintable should be true for: " + actor.className
            );*/
          }
          // always use modelcolor for non-paintables
          if (isPaintable !== Paintable.FALSE) {
            return this.coloredMaterials[element.value.value!];
          }
        }
      }

      // mColorSlot is not set if it is colored with material 0, but sometimes it is :)
      if (isPaintable === Paintable.TRUE) {
        return this.coloredMaterials[0];
      }
      // u5 exposed 3 more defaultswatches, which now are used instead of Paintable.NOTSLOT0 for older saves
      else if (isPaintable === Paintable.SLOT16) {
        return this.coloredMaterials[16];
      } else if (isPaintable === Paintable.SLOT17) {
        return this.coloredMaterials[17];
      } else if (isPaintable === Paintable.SLOT18) {
        return this.coloredMaterials[18];
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
