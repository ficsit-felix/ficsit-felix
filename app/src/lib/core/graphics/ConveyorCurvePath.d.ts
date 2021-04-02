import { Curve, CurvePath, Vector } from 'three';

export class ConveyorCurvePath<T extends Vector> extends CurvePath<T> {
  add(curve: Curve<T>): void;
}
