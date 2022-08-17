import { MathUtils, Vector3 } from 'three';
import type { PerspectiveCamera } from 'three';

function scaleInView(
  sizeToFitOnScreen: number,
  boxSize: number,
  boxCenter: Vector3,
  camera: PerspectiveCamera
): void {
  const quarterFovY = MathUtils.degToRad(camera.fov * 0.25);
  const distance = sizeToFitOnScreen / Math.tan(quarterFovY);

  // Compute a unit vector that points in the direction the camera is now
  // in the xz plane from the center of the box
  const direction = new Vector3()
    .subVectors(camera.position, boxCenter)
    .multiply(new Vector3(1, 1, 1))
    .normalize();

  // Move the camera to a position distance units way from the center
  // in whatever direction the camera was from the center already
  camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

  // Pick some near and far values for the frustum that
  // will contain the box.
  camera.near = boxSize / 100;
  camera.far = boxSize * 100;

  camera.updateProjectionMatrix();

  // Point the camera to look at the center of the box
  camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}

export default scaleInView;
