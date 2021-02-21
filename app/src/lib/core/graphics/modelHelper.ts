import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { BufferGeometry, Group, Mesh } from 'three';

// singleton class that helps with loading all the models
class ModelHelper {
  requestedModels: Map<
    string,
    ((value: BufferGeometry | PromiseLike<BufferGeometry>) => void)[]
  > = new Map();
  loadedModels: Map<string, BufferGeometry> = new Map();

  loader = new GLTFLoader();

  loadModel(path: string): Promise<BufferGeometry> {
    return new Promise<BufferGeometry>((resolve, reject) => {
      if (this.loadedModels.has(path)) {
        // Model has already been loaded, directly resolve it
        resolve(this.loadedModels.get(path)!);
      } else {
        if (this.requestedModels.has(path)) {
          this.requestedModels.get(path)!.push(resolve);
        } else {
          // Unknown model -> actually load it
          this.requestedModels.set(path, [resolve]);
          this.loadRequestedModel(path);
        }
      }
    });
  }

  loadGroup(path: string): Promise<Group> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        gltf => {
          resolve(gltf.scene);
        },
        undefined, // TODO use the progress function as well?
        error => {
          console.error(error); // TODO global error
        }
      );
    });
  }

  // Load a model and resolve all promises that requested it
  private loadRequestedModel(path: string) {
    this.loader.load(
      path,
      gltf => {
        const geometry = (gltf.scene.children[0] as Mesh)
          .geometry as BufferGeometry;
        this.loadedModels.set(path, geometry);
        for (const resolveX of this.requestedModels.get(path)!) {
          resolveX(geometry);
        }
        this.requestedModels.delete(path);
      },
      undefined, // TODO use the progress function as well?
      error => {
        console.error(error); // TODO global error
      }
    );
  }
}

const modelHelper = new ModelHelper();
export { modelHelper };
