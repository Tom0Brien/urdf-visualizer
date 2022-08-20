import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  AmbientLight,
  PCFSoftShadowMap,
  Object3D,
  Box3,
  Vector3,
  MathUtils,
  LoadingManager,
} from 'three';

import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import URDFLoader, { URDFRobot } from 'urdf-loader';

import { jointInfosStore, selectedUpAxisStore } from '../../stores';
import type { JointInfo } from '../../types';
import getFileNameFromPath from './utils/getFileNameFromPath';
import scaleInView from './utils/scaleInView';
import { loadSTL, loadDAE } from './utils/loadMesh';
import setRobotRotation from './utils/setRobotRotation';
import * as axes from '../../constants/axes';

const URDF_FILE_PATH = '../urdf/panda/panda_arm.urdf';

/*

THREE.js
   Y
   |
   |
   .-----X
 ／
Z

ROS URDf
       Z
       |   X
       | ／
 Y-----.

*/

let scene: Scene;
let camera: PerspectiveCamera;
let renderer: WebGLRenderer;
let manager: LoadingManager;
let loader: URDFLoader;
let robot: URDFRobot;
let controls: OrbitControls;
let box: Box3;

function createScene(canvasEl: HTMLCanvasElement): void {
  init(canvasEl);
  render();
}

function init(canvasEl: HTMLCanvasElement): void {
  // *** Initialize three.js scene ***

  scene = new Scene();

  const fov = 45;
  const aspectRatio = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 100;
  camera = new PerspectiveCamera(fov, aspectRatio, near, far);
  camera.position.set(2, 2, 2);

  renderer = new WebGLRenderer({ antialias: true, canvas: canvasEl });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  // Lighting
  var lights = [];
  lights[0] = new THREE.PointLight(0x304ffe, 1, 0);
  lights[1] = new THREE.PointLight(0xffffff, 1, 0);
  lights[2] = new THREE.PointLight(0xffffff, 1, 0);
  lights[0].position.set(0, 200, 0);
  lights[1].position.set(100, 200, 100);
  lights[2].position.set(-100, -200, -100);
  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);

  // Background
  scene.background = new THREE.Color(0xF1F5F9); //0x263238

  // Grid
  const size = 100;
  const divisions = 100;
  const gridHelper = new THREE.GridHelper( size, divisions ); 
  scene.add( gridHelper );

  // Axes Helper
  var helper = new THREE.AxesHelper(2);
  var colors = helper.geometry.attributes.color;
  colors.setXYZ(0, 1, 0, 0);
  colors.setXYZ(1, 1, 0, 0);
  colors.setXYZ(2, 0, 0, 1);
  colors.setXYZ(3, 0, 0, 1);
  colors.setXYZ(4, 0, 1, 0);
  colors.setXYZ(5, 0, 1, 0);
  scene.add(helper);
  
  // Allow user to rotate around the robot.
  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1;

  // *** Load URDF ***

  manager = new LoadingManager();
  loader = new URDFLoader(manager);
  loadRobot();

  // *** Resize the contents of the canvas on window resize.

  window.addEventListener('resize', onResize);
}

// *** Render the scene onto the screen ***

function render(): void {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

function loadRobot(url = URDF_FILE_PATH, files?: Record<string, File>): void {
  if (robot) removeOldRobotFromScene();

  const filesHaveBeenUploaded = files !== undefined;
  if (filesHaveBeenUploaded) {
    loader.loadMeshCb = (
      path: string,
      manager: LoadingManager,
      onComplete: (obj: Object3D, err?: ErrorEvent) => void
    ): void => {
      const { fileName, fileExtension } = getFileNameFromPath(path);
      const fileURL = URL.createObjectURL(files[fileName]);

      switch (fileExtension) {
        case 'stl':
          loadSTL(manager, onComplete, fileURL);
          break;
        case 'dae':
          loadDAE(manager, onComplete, fileURL);
          break;
        default:
          throw new Error('Mesh format not supported');
      }
    };
  }

  loader.load(url, (result: URDFRobot): void => {
    console.log(result);
    robot = result;
  });

  // Wait until all geometry has been loaded, then add
  // the robot to the scene.
  manager.onLoad = (): void => {
    // Center the robot
    // robot.translateOnAxis(0, 0, 0);
    // robot.position.copy(new Vector3(0.0, 0.0, 0.0));
    // Traverse the robot and cast shadow
    robot.traverse((c: Object3D): void => {
      // if (c instanceof Mesh) {
      //   c.material.color.set(0xffd324);
      // }
      c.castShadow = true;
    });

    // Pass each joint's limits and initial degree to `Interface`.
    jointInfosStore.update(updateJointInfos);

    selectedUpAxisStore.update((): string => axes.Z);

    // Updates the global transform of the object and its descendants.
    robot.updateMatrixWorld(true);

    scene.add(robot);
  };
}

function removeOldRobotFromScene(): void {
  const name = scene.getObjectByName(robot.name);
  scene.remove(name);
  box = null;
  selectedUpAxisStore.update((): string => '');
}

function rotateJoints(jointInfos: JointInfo[]): void {
  if (!robot) return;

  const { joints } = robot;
  const jointNames = Object.keys(joints);
  jointNames.forEach((jointName: string, idx: number): void => {
    const { degree } = jointInfos[idx];
    joints[jointName].setJointValue(MathUtils.degToRad(degree));
  });
}

function updateJointInfos(): JointInfo[] {
  return Object.keys(robot.joints).map((jointName: string) => {
    const { lower, upper } = robot.joints[jointName].limit;
    const lowerDegree = Number(MathUtils.radToDeg(Number(lower)).toFixed());
    const upperDegree = Number(MathUtils.radToDeg(Number(upper)).toFixed());
    const jointHasLimit = lowerDegree !== 0 || upperDegree !== 0;

    return {
      name: jointName,
      lower: jointHasLimit ? lowerDegree : -180,
      upper: jointHasLimit ? upperDegree : 180,
      degree: 0,
    };
  });
}

function rotateRobotOnUpAxisChange(selectedUpAxis: string): void {
  if (!robot || selectedUpAxis === '') return;

  switch (selectedUpAxis) {
    case axes.X:
      setRobotRotation(robot, 0, 0, Math.PI / 2);
      break;
    case axes.NEGATIVE_X:
      setRobotRotation(robot, 0, 0, -Math.PI / 2);
      break;
    case axes.Y:
      setRobotRotation(robot, 0, 0, 0);
      break;
    case axes.NEGATIVE_Y:
      setRobotRotation(robot, Math.PI, 0, 0);
      break;
    case axes.Z:
      setRobotRotation(robot, -Math.PI / 2, 0, 0);
      break;
    case axes.NEGATIVE_Z:
      setRobotRotation(robot, Math.PI / 2, 0, 0);
      break;
    default:
      throw new Error('Should not reach here');
  }

  // If we set camera position and orbit controls' target
  // before the robot is initially rotated, robot will appear
  // off center and orbit controls will not behave correctly.
  if (!box) {
    // Create a bounding box of robot.
    box = new Box3().setFromObject(robot);

    const boxSize = box.getSize(new Vector3()).length();
    const boxCenter = box.getCenter(new Vector3());

    // robot.position.x -= box.min.y;

    scaleInView(boxSize * 0.5, boxSize, boxCenter, camera);

    controls.target.y = boxCenter.y;
    controls.update();
  }
}

function onResize(): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
}

export default createScene;
export { rotateJoints, loadRobot, rotateRobotOnUpAxisChange };
