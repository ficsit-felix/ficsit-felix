import { AmbientLight } from 'three';
import Object3D from './Object3D';

export default {
  name: 'AmbientLight',
  mixins: [Object3D],

  beforeMount() {
    this.obj = new AmbientLight('#eee');
  }
};
