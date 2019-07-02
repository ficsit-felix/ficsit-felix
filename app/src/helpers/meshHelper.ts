import { Mesh } from "three";
import { Actor } from "satisfactory-json";
import { isConveyorBelt, isPowerLine, isRailroadTrack } from "./entityHelper";

export function applyTranslation(mesh: Mesh, translation: number[]) {
  // switched around to convert from Unreal coordinate system (XYZ left-handed) to three.js coordinate system (XZY right-handed)
  mesh.position.x = translation[1];
  mesh.position.y = translation[0];
  mesh.position.z = translation[2];
}

export function applyRotation(mesh: Mesh, rotation: number[]) {
  mesh.quaternion.x = rotation[0];
  mesh.quaternion.y = rotation[1];
  mesh.quaternion.z = -rotation[2];
  mesh.quaternion.w = rotation[3];
}

export function applyScale(mesh: Mesh, scale: number[]) {
  // TODO are those on the correct axes? Or do the need to be switched like the positions
  mesh.scale.x = scale[0];
  mesh.scale.y = scale[1];
  mesh.scale.z = scale[2];
}

export function updateActorMeshTransform(mesh: Mesh, actor: Actor) {
  applyTranslation(mesh, actor.transform.translation);
  if (
    !isConveyorBelt(actor) &&
    !isRailroadTrack(actor) &&
    !isPowerLine(actor)
  ) {
    applyRotation(mesh, actor.transform.rotation);
    mesh.rotateZ(1.5708); // 90 deg in radians
  } else {
    // TODO conveyor belt coordinates are given without rotation?
    applyRotation(mesh, [0, 0, 0, 1]);
  }

  applyScale(mesh, actor.transform.scale3d);
}
