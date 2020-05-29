import { Mesh, Vector3, Quaternion, Euler, Matrix4 } from 'three';
import { Actor } from 'satisfactory-json';
import { isPowerLine, isSpline } from './entityHelper';

/*
 * Unreal coordinate system:
 * right:   y
 * forward: x
 * up:      z
 *
 * three.js coordinate system (after setting the up vector to (0,0,1)):
 * right:   x
 * forward: y
 * up:      z
 *
 *
 */

const up = new Vector3(0, 0, 1);
const rotate90 = new Quaternion().setFromEuler(new Euler(0, 0, Math.PI / 2));
const rotateNeg90 = new Quaternion().setFromEuler(
  new Euler(0, 0, -Math.PI / 2)
);

export function applyTranslation(mesh: Mesh, translation: number[]) {
  // switched around to convert from Unreal coordinate system (XYZ left-handed) to three.js coordinate system (XZY right-handed)
  mesh.position.x = translation[1];
  mesh.position.y = translation[0];
  mesh.position.z = translation[2];
}

export function applyRotation(mesh: Mesh, rotation: number[]) {
  mesh.setRotationFromQuaternion(
    new Quaternion(-rotation[1], -rotation[0], -rotation[2], rotation[3])
  );
}

export function applyScale(mesh: Mesh, scale: number[]) {
  // TODO are those on the correct axes? Or do the need to be switched like the positions
  mesh.scale.x = scale[0];
  mesh.scale.y = scale[1];
  mesh.scale.z = scale[2];
}

export function updateActorMeshTransform(mesh: Mesh, actor: Actor) {
  applyTranslation(mesh, actor.transform.translation);

  const quat = new Quaternion(
    -actor.transform.rotation[1],
    -actor.transform.rotation[0],
    -actor.transform.rotation[2],
    actor.transform.rotation[3]
  );

  if (isSpline(actor)) {
    mesh.setRotationFromQuaternion(quat);
  } else if (isPowerLine(actor)) {
    mesh.setRotationFromQuaternion(new Quaternion()); // identity
  } else {
    mesh.setRotationFromQuaternion(quat.multiply(rotate90));
  }

  applyScale(mesh, actor.transform.scale3d);
}

export function applyMeshTransformToActor(mesh: Mesh, actor: Actor): Actor {
  // TODO need to clone, else change is not detected?
  // find more intelligent way
  const clone = Object.assign({}, actor);
  // switched to accord for coordinate system change!
  clone.transform.translation[1] = mesh.position.x;
  clone.transform.translation[0] = mesh.position.y;
  clone.transform.translation[2] = mesh.position.z;

  // TODO directly apply this rotation on the quaternion so we don't need to reverse it afterwards
  let quat;

  if (isSpline(actor)) {
    // TODO conveyor belt coordinates are given without rotation?
    quat = mesh.quaternion;
  } else if (isPowerLine(actor)) {
    quat = new Quaternion();
  } else {
    quat = mesh.quaternion.multiply(rotateNeg90);
  }

  clone.transform.rotation[0] = -quat.y;
  clone.transform.rotation[1] = -quat.x;
  clone.transform.rotation[2] = -quat.z;
  clone.transform.rotation[3] = quat.w;

  clone.transform.scale3d[0] = mesh.scale.x;
  clone.transform.scale3d[1] = mesh.scale.y;
  clone.transform.scale3d[2] = mesh.scale.z;
  return clone;
}
