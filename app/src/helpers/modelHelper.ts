import { GLTFLoader } from "@/js/GLTFLoader";
import * as THREE from "three";

// singleton class that helps with loading all the models
class ModelHelper {
  isLoading = false;
  requestedModels: Map<
    string,
    ((
      value?:
        | THREE.BufferGeometry
        | PromiseLike<THREE.BufferGeometry>
        | undefined
    ) => void)[]
  > = new Map();
  loadedModels: Map<string, THREE.BufferGeometry> = new Map();

  loader = new GLTFLoader();

  loadModel(path: string): Promise<THREE.BufferGeometry> {
    return new Promise((resolve, reject) => {
      if (this.loadedModels.has(path)) {
        // console.log("got model already");
        resolve(this.loadedModels.get(path));
      } else {
        // console.log("requesting model");
        if (this.requestedModels.has(path)) {
          // put request into
          this.requestedModels.get(path)!.push(resolve);
        } else {
          this.requestedModels.set(path, [resolve]);
        }
        if (!this.isLoading) {
          this.loadMore();
        }
      }
    });
  }

  loadScene(path: string): Promise<THREE.Scene> {
    return new Promise((resolve, reject) => {
    this.loader.load(
      path,
      gltf => {
        resolve(gltf.scene);
      },
      undefined, // TODO use the progress function as well?
      error => {
        console.error(error); // TODO global error
        this.isLoading = false;
      }
    );
    });
  }

  loadMore() {
    this.loadFrame().then(() => {
      requestAnimationFrame(this.loadMore.bind(this));
    });
  }

  // loads one model at a time
  // returns true if it needs to load more models
  loadFrame(): Promise<void> {
    this.isLoading = true;
    return new Promise((resolve, reject) => {
      const next = this.requestedModels.keys().next();
      if (!next.done) {
        const model = next.value;
        this.loader.load(
          model,
          gltf => {
            let geometry = (gltf.scene.children[0] as THREE.Mesh)
              .geometry as THREE.BufferGeometry;
            this.loadedModels.set(model, geometry);
            console.log("loaded model");
            for (let resolveX of this.requestedModels.get(model)!) {
              resolveX(geometry);
            }
            this.requestedModels.delete(model);
            resolve();
          },
          undefined, // TODO use the progress function as well?
          error => {
            console.error(error); // TODO global error
            this.isLoading = false;
          }
        );
      } else {
        this.isLoading = false;
      }
    });
  }
}

let modelHelper = new ModelHelper();
export { modelHelper };
