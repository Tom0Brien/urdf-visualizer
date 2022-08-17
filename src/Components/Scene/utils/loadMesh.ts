import { Mesh, MeshPhongMaterial } from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import {
  Collada,
  ColladaLoader,
} from 'three/examples/jsm/loaders/ColladaLoader';
import type { LoadingManager, BufferGeometry, Object3D } from 'three';

function loadSTL(
  manager: LoadingManager,
  onComplete: (obj: Object3D, err?: ErrorEvent) => void,
  fileURL: string
): void {
  new STLLoader(manager).load(
    fileURL,
    (result: BufferGeometry): void => {
      const material = new MeshPhongMaterial();
      const mesh = new Mesh(result, material);
      onComplete(mesh);
    },
    null,
    (err: ErrorEvent): void => {
      onComplete(null, err);
    }
  );
}

function loadDAE(
  manager: LoadingManager,
  onComplete: (obj: Object3D, err?: ErrorEvent) => void,
  fileURL: string
): void {
  new ColladaLoader(manager).load(
    fileURL,
    (result: Collada): void => {
      onComplete(result.scene);
    },
    null,
    (err: ErrorEvent): void => {
      onComplete(null, err);
    }
  );
}

export { loadSTL, loadDAE };
