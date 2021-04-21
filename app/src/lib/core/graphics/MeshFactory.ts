import { modelConfig } from '@lib/definitions/models';
import {
  getProperty,
  isAdjustableJumpPad,
  isConveyorLift,
  isFloodlightPole,
  isLadder,
  isPipeSupport
} from '@lib/graphics/entityHelper';
import { applyRotation, applyTranslation } from '@lib/graphics/meshHelper';
import { modelHelper } from '@lib/graphics/modelHelper';
import { Actor, StructProperty } from 'satisfactory-json';
import { BoxBufferGeometry, MathUtils, Mesh, Vector3 } from 'three';
import ColorFactory from './ColorFactory';
import GeometryFactory from './GeometryFactory';

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

  createMesh(actor: Actor): Promise<MeshResult> {
    // create multiple meshes for conveyor lift
    if (isConveyorLift(actor)) {
      return this.addConveyorLift(actor);
    }
    if (isPipeSupport(actor)) {
      return this.addPipeSupport(actor);
    }
    if (isLadder(actor)) {
      return this.addLadder(actor);
    }
    if (isAdjustableJumpPad(actor)) {
      return this.addAdjustableJumpPad(actor);
    }
    if (isFloodlightPole(actor)) {
      return this.addFloodlightPole(actor);
    }

    return new Promise((resolve, reject) => {
      this.geometryFactory
        .createGeometry(actor)
        .then(result => {
          const mesh = new Mesh(
            result.geometry,
            this.materialFactory.createMaterial(actor)
          );

          mesh.userData = { pathName: actor.pathName };
          resolve({
            mesh,
            instance: result.instance
          });
        })
        .catch(reject);
    });
  }

  addConveyorLift(actor: Actor): Promise<MeshResult> {
    return new Promise((resolve, reject) => {
      // add other parts to conveyor lift
      modelHelper
        .loadModel('/models/ConveyorLift_Bottom.glb')
        .then(bottomGeometry => {
          modelHelper
            .loadModel('/models/ConveyorLift_Top.glb')
            .then(topGeometry => {
              const material = this.materialFactory.createMaterial(actor);

              // whether the role of top and bottom are reversed does not seem to depend on the mIsReversed property, but on the sign of the z coordinate of the translation
              let topPartTranslationZ = 0;
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

              const mesh = new Mesh(
                isReversed ? topGeometry : bottomGeometry,
                material
              );

              const topMesh = new Mesh(
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
                        elem.value.x,
                        elem.value.y,
                        elem.value.z,
                        elem.value.w
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
              const middleMesh = new Mesh(middleGeometry, material);
              middleMesh.position.x = -60;
              middleMesh.position.z = topPartTranslationZ / 2;
              mesh.add(middleMesh);

              mesh.userData = { pathName: actor.pathName };

              resolve({
                mesh,
                instance: undefined
              });
            });
        });
    });
  }

  addPipeSupport(actor: Actor): Promise<MeshResult> {
    return new Promise((resolve, reject) => {
      modelHelper
        .loadModel('/models/' + modelConfig[actor.className].model)
        .then(ringGeometry => {
          const material = this.materialFactory.createMaterial(actor);

          // read length from mLength property and substract 100 to get length of support beam only (75 for mLength 175)
          const length =
            parseInt((getProperty(actor, 'mLength')?.value ?? '0') + '') -
              100 ?? 0;

          const verticalAngle =
            parseInt(
              (getProperty(actor, 'mVerticalAngle')?.value ?? '0') + ''
            ) ?? 0;

          const mesh = new Mesh(undefined, material);

          // move the ring geometry to the correct position and angle it correctly
          const ringMesh = new Mesh(ringGeometry);

          ringMesh.position.z = length;
          ringMesh.quaternion.setFromAxisAngle(
            new Vector3(0, -1, 0),
            MathUtils.DEG2RAD * verticalAngle
          );
          mesh.add(ringMesh);

          // create support beam and position it correctly
          const supportGeometry = new BoxBufferGeometry(24, 24, length);
          const supportMesh = new Mesh(supportGeometry);
          supportMesh.position.z = length / 2;
          mesh.add(supportMesh);

          mesh.userData = { pathName: actor.pathName };

          resolve({
            mesh,
            instance: undefined
          });
        });
    });
  }

  addLadder(actor: Actor): Promise<MeshResult> {
    return new Promise((resolve, reject) => {
      modelHelper.loadModel('/models/Ladder.glb').then(ladderGeometry => {
        const material = this.materialFactory.createMaterial(actor);

        const numSegments = parseInt(
          (getProperty(actor, 'mNumSegments')?.value ?? '0') + ''
        );

        const mesh = new Mesh(ladderGeometry, material);

        for (let i = 1; i < numSegments; i++) {
          const segmentMesh = new Mesh(ladderGeometry);
          segmentMesh.position.z = 200 * i;
          mesh.add(segmentMesh);
        }

        mesh.userData = { pathName: actor.pathName };

        resolve({
          mesh,
          instance: undefined
        });
      });
    });
  }

  addAdjustableJumpPad(actor: Actor): Promise<MeshResult> {
    return new Promise((resolve, reject) => {
      modelHelper
        .loadModel('/models/JumpPadBottom.glb')
        .then(bottomGeometry => {
          const material = this.materialFactory.createMaterial(actor);

          modelHelper.loadModel('/models/JumpPadTop.glb').then(topGeometry => {
            const launchAngle = parseInt(
              (getProperty(actor, 'mLaunchAngle')?.value ?? '0') + ''
            );

            const mesh = new Mesh(bottomGeometry, material);
            const topMesh = new Mesh(topGeometry);
            topMesh.rotation.x = (90 - launchAngle) * MathUtils.DEG2RAD;
            // move to anchor point
            topMesh.position.set(0, -155, 70);
            mesh.add(topMesh);

            mesh.userData = { pathName: actor.pathName };

            resolve({
              mesh,
              instance: undefined
            });
          });
        });
    });
  }

  addFloodlightPole(actor: Actor): Promise<MeshResult> {
    return new Promise((resolve, reject) => {
      modelHelper
        .loadModel('/models/FloodLightTower.glb')
        .then(poleGeometry => {
          const material = this.materialFactory.createMaterial(actor);

          modelHelper
            .loadModel('/models/FloodLight.glb')
            .then(lightGeometry => {
              const fixtureAngle = parseInt(
                (getProperty(actor, 'mFixtureAngle')?.value ?? '50') + ''
              );

              const mesh = new Mesh(poleGeometry, material);
              const lightMesh = new Mesh(lightGeometry);
              lightMesh.rotation.y = -fixtureAngle * MathUtils.DEG2RAD;
              // move to anchor point
              lightMesh.position.set(0, 0, 3400);
              mesh.add(lightMesh);

              mesh.userData = { pathName: actor.pathName };

              resolve({
                mesh,
                instance: undefined
              });
            });
        });
    });
  }
}
