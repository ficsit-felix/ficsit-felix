import { isModClassName, modelConfig } from '@lib/definitions/models';
import { reportException, reportMessage } from '@lib/errorReporting';
import { ConveyorCurvePath } from '@lib/graphics/ConveyorCurvePath.js';
import {
  findActorByName,
  findComponentByName,
  getProperty,
  isConveyorBelt,
  isLightsControlPanel,
  isPipe,
  isPowerLine,
  isPowerPoleWallDouble,
  isPowerSwitch,
  isRailroadTrack,
} from '@lib/graphics/entityHelper';
import { modelHelper } from '@lib/graphics/modelHelper';
import { Actor, ArrayProperty, ObjectProperty } from 'satisfactory-json';
import {
  BoxBufferGeometry,
  BufferGeometry,
  CubicBezierCurve3,
  ExtrudeBufferGeometry,
  LineCurve3,
  Quaternion,
  Shape,
  TubeBufferGeometry,
  Vector3,
} from 'three';

interface GeometryResult {
  geometry: BufferGeometry;
  instance: string | undefined;
}

// Different geometries for splines
enum SplineType {
  ConveyorBelt,
  RailroadTrack,
  Pipe,
}

/**
 * Factory that creates and caches geometry
 */
export default class GeometryFactory {
  geometries: { [id: string]: GeometryResult } = {};
  // properties
  showModels: boolean;
  conveyorBeltResolution: number;

  constructor(showModels: boolean, conveyorBeltResolution: number) {
    this.showModels = showModels;
    this.conveyorBeltResolution = conveyorBeltResolution;
  }

  createGeometry(actor: Actor): Promise<GeometryResult> {
    let className = actor.className;

    return new Promise((resolve, reject) => {
      const resolveWithBox = () => {
        if (this.geometries['box'] === undefined) {
          let boxSize = 400;
          if (
            actor.className ===
            '/Game/FactoryGame/Resource/BP_ItemPickup_Spawnable.BP_ItemPickup_Spawnable_C'
          ) {
            boxSize /= actor.transform.scale3d[0];
          }
          // 800 is size of foundations
          this.geometries['box'] = {
            geometry: this.createBoxGeometry(boxSize),
            instance: 'box',
          };
        }
        resolve(this.geometries['box']);
      };

      if (!this.showModels) {
        // return single sized cube
        resolveWithBox();
        return;
      }

      // special cases for geometry
      if (isConveyorBelt(actor)) {
        resolve({
          geometry: this.createSplineGeometry(actor, SplineType.ConveyorBelt),
          instance: undefined,
        });
        return;
      }
      if (isRailroadTrack(actor)) {
        resolve({
          geometry: this.createSplineGeometry(actor, SplineType.RailroadTrack),
          instance: undefined,
        });
        return;
      }
      if (isPowerLine(actor)) {
        const geom = this.createPowerLineGeometry(actor);
        if (geom !== undefined) {
          resolve(geom);
        } else {
          // Show broken power lines as boxes
          resolveWithBox();
          //reject('Could not create power line geometry');
        }

        return;
      }
      if (isPipe(actor)) {
        resolve({
          geometry: this.createSplineGeometry(actor, SplineType.Pipe),
          instance: undefined,
        });
        return;
      }

      if (
        actor.className ===
        '/Game/FactoryGame/Buildable/Factory/ConveyorPole/Build_ConveyorPole.Build_ConveyorPole_C'
      ) {
        // Conveyor Pole
        const poleMesh = getProperty(actor, 'mPoleMesh') as ObjectProperty;
        if (poleMesh !== undefined) {
          switch (poleMesh.value.pathName) {
            case '/Game/FactoryGame/Buildable/Factory/ConveyorPole/Mesh/ConveyorPole_01_static.ConveyorPole_01_static':
              break;
            case '/Game/FactoryGame/Buildable/Factory/ConveyorPole/Mesh/ConveyorPole_02_static.ConveyorPole_02_static':
              className =
                '/Game/FactoryGame/Buildable/Factory/ConveyorPole/Build_ConveyorPole.Build_ConveyorPole_2';
              break;
            case '/Game/FactoryGame/Buildable/Factory/ConveyorPole/Mesh/ConveyorPole_03_static.ConveyorPole_03_static':
              className =
                '/Game/FactoryGame/Buildable/Factory/ConveyorPole/Build_ConveyorPole.Build_ConveyorPole_3';
              break;
            case '/Game/FactoryGame/Buildable/Factory/ConveyorPole/Mesh/ConveyorPole_04_static.ConveyorPole_04_static':
              className =
                '/Game/FactoryGame/Buildable/Factory/ConveyorPole/Build_ConveyorPole.Build_ConveyorPole_4';
              break;
          }
        }
      }

      if (this.geometries[className] === undefined) {
        if (
          modelConfig[className] !== undefined &&
          modelConfig[className].model !== ''
        ) {
          modelHelper
            .loadModel('/models/' + modelConfig[className].model)
            .then((geometry) => {
              this.geometries[className] = {
                geometry,
                instance: '/models/' + modelConfig[className].model,
              };
              resolve(this.geometries[className]);
            });
        } else {
          if (
            modelConfig[className] === undefined &&
            !isModClassName(className)
          ) {
            console.error('missing model definition: ' + className);
            reportMessage('missing model definition: ' + className);
          }

          // 800 is size of foundations
          let boxSize = 200;
          if (
            className ===
            '/Game/FactoryGame/Resource/BP_ItemPickup_Spawnable.BP_ItemPickup_Spawnable_C'
          ) {
            boxSize = 2;
          }
          this.geometries[className] = {
            geometry: this.createBoxGeometry(boxSize),
            instance: className,
          };
          resolve(this.geometries[className]);
        }
      } else {
        resolve(this.geometries[className]);
      }
    });
  }

  /**
   *
   * @param actor
   * @param splineType
   */
  createSplineGeometry(actor: Actor, splineType: SplineType): BufferGeometry {
    const splineData = getProperty(actor, 'mSplineData') as ArrayProperty;
    //actor.entity.properties[0]; // TODO actually search for mSplineData as it might not be the first

    const splinePoints = splineData.value.values.length;

    const extrudePath = new ConveyorCurvePath<Vector3>();

    let lastLoc = null;
    let lastLeave = null;

    for (let i = 0; i < splinePoints; i++) {
      const splinePoint = splineData.value.values[i];
      const location = splinePoint.properties[0]; // TODO make sure this is Location
      const arriveTangent = splinePoint.properties[1]; // TODO make sure this is arriveTangent
      const leaveTangent = splinePoint.properties[2]; // TODO make sure this is leaveTangent

      if (lastLoc != null) {
        // If two spline points are very near to each other, ignore the first one
        // This should prevent twirls as described in https://github.com/ficsit-felix/ficsit-felix/issues/42
        const sqrDist =
          (location.value.x - lastLoc.value.x) *
            (location.value.x - lastLoc.value.x) +
          (location.value.y - lastLoc.value.y) *
            (location.value.y - lastLoc.value.y) +
          (location.value.z - lastLoc.value.z) *
            (location.value.z - lastLoc.value.z);
        if (sqrDist < 0.1) {
          continue;
        }

        // TODO find out how exactly to use arriveTangent and leaveTangent
        // I'm still not 100% sure, how the tangents in Unreal are calculated. The division by three is still a guess and based on the first answer here: https://answers.unrealengine.com/questions/330317/which-algorithm-is-used-for-spline-components-in-u.html#
        extrudePath.add(
          new CubicBezierCurve3(
            new Vector3(lastLoc.value.y, lastLoc.value.x, lastLoc.value.z),
            new Vector3(
              lastLoc.value.y + lastLeave.value.y / 3,
              lastLoc.value.x + lastLeave.value.x / 3,
              lastLoc.value.z + lastLeave.value.z / 3
            ),
            new Vector3(
              location.value.y - arriveTangent.value.y / 3,
              location.value.x - arriveTangent.value.x / 3,
              location.value.z - arriveTangent.value.z / 3
            ),
            new Vector3(location.value.y, location.value.x, location.value.z)
          )
        );
      }

      lastLoc = location;
      lastLeave = leaveTangent;
    }

    const shape = new Shape();

    switch (splineType) {
      case SplineType.Pipe:
        return new TubeBufferGeometry(
          extrudePath,
          splinePoints * this.conveyorBeltResolution,
          75,
          this.conveyorBeltResolution * 3,
          false
        ); // TODO more parameters

      // The other two types use the ExtrudeBufferGeometry with different shapes
      case SplineType.ConveyorBelt:
        // Conveyor Belt rectangle
        const length = 38;
        const width = 180;

        shape.moveTo(-length / 2, -width / 2);
        shape.lineTo(-length / 2, width / 2);
        shape.lineTo(length / 2, width / 2);
        shape.lineTo(length / 2, -width / 2);
        shape.lineTo(-length / 2, -width / 2);
        break;
      case SplineType.RailroadTrack:
        // Railroad Track trapezoid
        const bottomWidth = 520;
        const topWidth = 150;
        const height = 130;

        shape.moveTo(0, -bottomWidth / 2);
        shape.lineTo(0, bottomWidth / 2);
        shape.lineTo(-height, topWidth / 2);
        shape.lineTo(-height, -topWidth / 2);
        shape.lineTo(0, -bottomWidth / 2);
        break;
      default:
        throw new Error(`Unknown spline type ${splineType}`);
    }

    const extrudeSettings = {
      // TODO find better values for this?
      curveSegments: (splinePoints * this.conveyorBeltResolution) / 2,
      steps: splinePoints * this.conveyorBeltResolution,
      bevelEnabled: false,
      extrudePath: extrudePath,
    };

    return new ExtrudeBufferGeometry(shape, extrudeSettings);
  }

  createPowerLineGeometry(actor: Actor): GeometryResult | undefined {
    const sourceConnection = findComponentByName(
      actor.entity.extra.sourcePathName
    );
    if (sourceConnection === undefined) {
      // TODO error
      console.warn(
        'source connection "' +
          actor.entity.extra.sourcePathName +
          '" of power line "' +
          actor.pathName +
          '" not found.'
      );
      return;
    }
    const targetConnection = findComponentByName(
      actor.entity.extra.targetPathName
    );
    if (targetConnection === undefined) {
      // TODO error
      console.warn(
        'target connection "' +
          actor.entity.extra.targetPathName +
          '" of power line "' +
          actor.pathName +
          '" not found.'
      );
      return;
    }

    const source = findActorByName(sourceConnection.outerPathName);
    if (source === undefined) {
      // TODO error
      console.warn(
        'source "' +
          sourceConnection.outerPathName +
          '" of power line "' +
          actor.pathName +
          '" not found.'
      );
      return;
    }

    const target = findActorByName(targetConnection.outerPathName);
    if (target === undefined) {
      // TODO error
      console.warn(
        'target "' +
          targetConnection.outerPathName +
          '" of power line ' +
          actor.pathName +
          ' not found.'
      );
      return;
    }
    let sourceOffset = { x: 0, y: 0, z: 0 };
    if (
      modelConfig[source.className] != undefined &&
      modelConfig[source.className].powerLineOffset !== undefined
    ) {
      sourceOffset = modelConfig[source.className].powerLineOffset!;

      // Invert offset for second connection to PowerPoleWallDouble,
      // PowerSwitch and LightsControlPanel
      if (
        ((isPowerPoleWallDouble(source) || isPowerSwitch(source)) &&
          sourceConnection.pathName.endsWith('2')) ||
        (isLightsControlPanel(source) &&
          sourceConnection.pathName.includes('Downstream'))
      ) {
        sourceOffset = {
          x: -sourceOffset.x,
          y: sourceOffset.y,
          z: isLightsControlPanel(source)
            ? sourceOffset.z + 30
            : sourceOffset.z,
        };
      }

      const transformedSourceOffset = new Vector3(
        sourceOffset.y,
        sourceOffset.x,
        sourceOffset.z
      ).applyQuaternion(
        new Quaternion(
          -source.transform.rotation[1],
          -source.transform.rotation[0],
          -source.transform.rotation[2],
          source.transform.rotation[3]
        )
      );
      sourceOffset = {
        x: transformedSourceOffset.x,
        y: transformedSourceOffset.y,
        z: transformedSourceOffset.z,
      };
    } else if (!isModClassName(source.className)) {
      console.error('No power line offset for ' + source.className);
      reportException('No power line offset for ' + source.className);
    }
    let targetOffset = { x: 0, y: 0, z: 0 };
    if (
      modelConfig[target.className] !== undefined &&
      modelConfig[target.className].powerLineOffset !== undefined
    ) {
      targetOffset = modelConfig[target.className].powerLineOffset!;
      // Invert offset for second connection to PowerPoleWallDouble,
      // PowerSwitch and LightsControlPanel
      if (
        ((isPowerPoleWallDouble(target) || isPowerSwitch(target)) &&
          targetConnection.pathName.endsWith('2')) ||
        (isLightsControlPanel(target) &&
          targetConnection.pathName.includes('Downstream'))
      ) {
        targetOffset = {
          x: -targetOffset.x,
          y: targetOffset.y,
          z: isLightsControlPanel(target)
            ? targetOffset.z + 30
            : targetOffset.z,
        };
      }

      const transformedTargetOffset = new Vector3(
        targetOffset.y,
        targetOffset.x,
        targetOffset.z
      ).applyQuaternion(
        new Quaternion(
          -target.transform.rotation[1],
          -target.transform.rotation[0],
          -target.transform.rotation[2],
          target.transform.rotation[3]
        )
      );
      targetOffset = {
        x: transformedTargetOffset.x,
        y: transformedTargetOffset.y,
        z: transformedTargetOffset.z,
      };
    } else if (!isModClassName(target.className)) {
      console.error('No power line offset for ' + target.className);
      reportException('No power line offset for ' + target.className);
    }

    const extrudePath = new LineCurve3(
      new Vector3(
        source.transform.translation[1] -
          actor.transform.translation[1] +
          sourceOffset.x,
        source.transform.translation[0] -
          actor.transform.translation[0] +
          sourceOffset.y,
        source.transform.translation[2] -
          actor.transform.translation[2] +
          sourceOffset.z
      ),
      new Vector3(
        target.transform.translation[1] -
          actor.transform.translation[1] +
          targetOffset.x,
        target.transform.translation[0] -
          actor.transform.translation[0] +
          targetOffset.y,
        target.transform.translation[2] -
          actor.transform.translation[2] +
          targetOffset.z
      )
    );

    const extrusionSegments = 1;
    const radius = 10;
    const radiusSegments = 3;
    const closed = false;

    return {
      geometry: new TubeBufferGeometry(
        extrudePath,
        extrusionSegments,
        radius,
        radiusSegments,
        closed
      ),
      instance: undefined,
    };
  }

  createBoxGeometry(size: number): BoxBufferGeometry {
    return new BoxBufferGeometry(size, size, size);
  }
}
