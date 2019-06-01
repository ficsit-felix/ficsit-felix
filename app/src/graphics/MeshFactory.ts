import { BoxBufferGeometry, Mesh } from "three";

import { isConveyorLift } from "@/helpers/entityHelper";

import { modelHelper } from "@/helpers/modelHelper";
import GeometryFactory from "./GeometryFactory";
import MaterialFactory from "./MaterialFactory";
import { Actor, StructProperty } from "satisfactory-json";
import { applyRotation, applyTranslation } from "@/helpers/meshHelper";

export default class MeshFactoy {
  geometryFactory: GeometryFactory;
  materialFactory: MaterialFactory;

  constructor(
    geometryFactory: GeometryFactory,
    materialFactory: MaterialFactory
  ) {
    this.geometryFactory = geometryFactory;
    this.materialFactory = materialFactory;
  }

  createMesh(actor: Actor, i: number): Promise<Mesh> {
    // create multiple meshes for conveyor lift
    if (isConveyorLift(actor)) {
      return this.addConveyorLift(actor, i);
    }

    return new Promise((resolve, reject) => {
      this.geometryFactory
        .createGeometry(actor)
        .then(geometry => {
          var mesh = new Mesh(
            geometry,
            this.materialFactory.createMaterial(actor)
          );

          mesh.userData = { id: i };
          resolve(mesh);
        })
        .catch(reject);
    });
  }

  addConveyorLift(actor: Actor, index: number): Promise<Mesh> {
    return new Promise((resolve, reject) => {
      // add other parts to conveyor lift
      modelHelper
        .loadModel("/models/ConveyorLift_Bottom.glb")
        .then(bottomGeometry => {
          modelHelper
            .loadModel("/models/ConveyorLift_Top.glb")
            .then(topGeometry => {
              const material = this.materialFactory.createMaterial(actor);

              // wether the role of top and bottom are reversed does not seem to depend on the mIsReversed property, but on the sign of the z coordinate of the translation
              var topPartTranslationZ = 0;
              for (let i = 0; i < actor.entity!.properties.length; i++) {
                const element = actor.entity!.properties[i] as StructProperty;
                if (element.name === "mTopTransform") {
                  for (let i = 0; i < element.value.properties.length; i++) {
                    const elem = element.value.properties[i];
                    if (elem.name === "Translation") {
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

              for (let i = 0; i < actor.entity!.properties.length; i++) {
                const element = actor.entity!.properties[i] as StructProperty;
                if (element.name === "mTopTransform") {
                  for (let i = 0; i < element.value.properties.length; i++) {
                    const elem = element.value.properties[i];
                    if (elem.name === "Rotation") {
                      applyRotation(topMesh, [
                        elem.value.a,
                        elem.value.b,
                        elem.value.c,
                        elem.value.d
                      ]);
                    } else if (elem.name === "Translation") {
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

              mesh.userData = { id: index };

              resolve(mesh);
            });
        });
    });
  }
}
