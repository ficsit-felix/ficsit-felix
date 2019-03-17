import { MeshPhongMaterial, Mesh } from "three";
import Object3D from "./Object3D";

export default {
  extends: Object3D,

  props: ["color", "object", "geometry", "index", "material"],

  /*watch: {
    object: {
      immediate: true,
      handler(val) {
      }
    }
  },*/

  beforeMount() {
    /*this.material = new MeshPhongMaterial({
      color: "#ffffff", //this.color,
      shininess: 150,
      specular: 0x222222
    });*/
    this.obj = new Mesh(this.geometry, this.material);
    this.obj.castShadow = true;
    this.obj.receiveShadow = true;

    this.obj.position.x = this.object.transform.translation[0];
    this.obj.position.y = this.object.transform.translation[1];
    this.obj.position.z = this.object.transform.translation[2];

    this.obj.quaternion.x = this.object.transform.rotation[0];
    this.obj.quaternion.y = this.object.transform.rotation[1];
    this.obj.quaternion.z = this.object.transform.rotation[2];
    this.obj.quaternion.w = this.object.transform.rotation[3];

    var scaleMultiplier = 1;
    switch (this.object.className) {
      case "/Game/FactoryGame/Resource/BP_ResourceNode.BP_ResourceNode_C":
        scaleMultiplier = 0.15;
        break;
    }

    this.obj.scale.x = this.object.transform.scale3d[0] * scaleMultiplier;
    this.obj.scale.y = this.object.transform.scale3d[1] * scaleMultiplier;
    this.obj.scale.z = this.object.transform.scale3d[2] * scaleMultiplier;
    // console.log(this.obj.id);
    this.obj.userData = {
        id: this.object.id
    }
  }
};
