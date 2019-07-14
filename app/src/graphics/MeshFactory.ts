import { BoxBufferGeometry, Mesh, Material } from 'three';

import { isConveyorLift } from '@/helpers/entityHelper';

import { modelHelper } from '@/helpers/modelHelper';
import GeometryFactory from './GeometryFactory';
import ColorFactory from './ColorFactory';
import { Actor, StructProperty } from 'satisfactory-json';
import { applyRotation, applyTranslation } from '@/helpers/meshHelper';

export interface MeshResult {
  mesh: Mesh;

  // key of the mesh instance if instanced, undefined if not
  instance: string | undefined;
  // TODO: pass the color
}

export default class MeshFactoy {
  geometryFactory: GeometryFactory;
  materialFactory: ColorFactory;

  constructor(geometryFactory: GeometryFactory, materialFactory: ColorFactory) {
    this.geometryFactory = geometryFactory;
    this.materialFactory = materialFactory;
  }

  createMesh(actor: Actor, i: number): Promise<MeshResult> {
    // create multiple meshes for conveyor lift
    if (isConveyorLift(actor)) {
      return this.addConveyorLift(actor, i);
    }

    return new Promise((resolve, reject) => {
      this.geometryFactory
        .createGeometry(actor)
        .then(result => {
          var mesh = new Mesh(
            result.geometry,
            this.materialFactory.createMaterial(actor)
          );

          mesh.userData = { id: i, pathName: actor.pathName };
          resolve({
            mesh,
            instance: result.instance
          });
        })
        .catch(reject);
    });
  }

  addConveyorLift(actor: Actor, index: number): Promise<MeshResult> {
    return new Promise((resolve, reject) => {
      // add other parts to conveyor lift
      modelHelper
        .loadModel('/models/ConveyorLift_Bottom.glb')
        .then(bottomGeometry => {
          modelHelper
            .loadModel('/models/ConveyorLift_Top.glb')
            .then(topGeometry => {
              const material = this.materialFactory.createMaterial(actor);

              // wether the role of top and bottom are reversed does not seem to depend on the mIsReversed property, but on the sign of the z coordinate of the translation
              var topPartTranslationZ = 0;
              for (let i = 0; i < actor.entity.properties.length; i++) {
                const element = actor.entity.properties[i] as StructProperty;
                if (element.name === 'mTopTransform') {
                  for (let i = 0; i < element.value.properties.length; i++) {
                    const elem = element.value.properties[i];
                    if (elem.name === 'Translation') {
                      topPartTranslationZ = elem.value.z;
                    }
                  }
                }
              }
              const isReversed = topPartTranslationZ < 0;

              var mesh = new Mesh(
                isReversed ? topGeometry : bottomGeometry,
                material
              );

              var topMesh = new Mesh(
                isReversed ? bottomGeometry : topGeometry,
                material
              );

              for (let i = 0; i < actor.entity.properties.length; i++) {
                const element = actor.entity.properties[i] as StructProperty;
                if (element.name === 'mTopTransform') {
                  for (let i = 0; i < element.value.properties.length; i++) {
                    const elem = element.value.properties[i];
                    if (elem.name === 'Rotation') {
                      applyRotation(topMesh, [
                        elem.value.r,
                        elem.value.g,
                        elem.value.b,
                        elem.value.a
                      ]);
                    } else if (elem.name === 'Translation') {
                      applyTranslation(topMesh, [
                        elem.value.x,
                        elem.value.y,
                        elem.value.z
                      ]);
                    }
                  }
                }
              }

              mesh.add(topMesh);

              // Fake the middle part of the conveyor lift
              const middleGeometry = new BoxBufferGeometry(
                38,
                180,
                topPartTranslationZ > 0
                  ? topPartTranslationZ
                  : -topPartTranslationZ
              );
              var middleMesh = new Mesh(
                middleGeometry,
                this.materialFactory.createMaterial(actor)
              );
              middleMesh.position.x = -60;
              middleMesh.position.z = topPartTranslationZ / 2;
              mesh.add(middleMesh);

              mesh.userData = { id: index, pathName: actor.pathName };

              resolve({
                mesh,
                instance: undefined
              });
            });
        });
    });
  }
}
