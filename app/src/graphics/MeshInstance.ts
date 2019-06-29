import { Material, UniformsLib, Geometry, Color, Vector3, Quaternion } from "three";

// patch the THREE instance
import * as THREE from "three";
import index from "three-instanced-mesh";
const InstancedMesh = index(THREE);


// patch matcap shaders
// TODO do this only once?


export default class MeshInstance {
  private material: Material;
  private instancedMesh?: typeof InstancedMesh;
  private geometry: Geometry;

  constructor(material: Material, geometry: Geometry) {
    this.material = material;
    this.geometry = geometry;
  }


  private createInstancedMesh() {
      

      //material that the geometry will use
      var material2 = new THREE.MeshBasicMaterial({ color: 0xffffff });
      //the instance group
      this.instancedMesh = new InstancedMesh(
        this.geometry, 
        this.material,
        10000, //instance count
        true, //is it dynamic
        true, //does it have color
        false //uniform scale, if you know that the placement function will not do a non-uniform scale, this will optimize the shader
      );

      
      var _v3 = new Vector3();
      var _q = new Quaternion();

      for (var i = 0; i < 10000; i++) {
        this.instancedMesh.setQuaternionAt(i, _q);
        this.instancedMesh.setPositionAt(
          i,
          _v3.set(
            Math.random() * 100000,
            Math.random() * 100000,
            Math.random() * 10000
          )
        );
        this.instancedMesh.setScaleAt(
          i,
          _v3.set(
            Math.random() * 100 + 10,
            Math.random() * 100 + 10,
            Math.random() * 100 + 10
          )
        );
        this.instancedMesh.setColorAt(i, new Color(Math.random() * 0xffffff));
      }

  }
}
