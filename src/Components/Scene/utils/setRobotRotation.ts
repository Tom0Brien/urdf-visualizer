import type { URDFRobot } from 'urdf-loader';

function setRobotRotation(
  robot: URDFRobot,
  x: number,
  y: number,
  z: number
): void {
  robot.rotation.x = x;
  robot.rotation.y = y;
  robot.rotation.z = z;
}

export default setRobotRotation;
