import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import * as dat from "lil-gui";

import * as core from "@theatre/core";
// import studio from "@theatre/studio";
import projectState from "../static/animations/cameraAnimation.json";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
gui.hide();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// objects group
const objectsGroup = new THREE.Group();
scene.add(objectsGroup);

// Axes helper
// const axesHelper = new THREE.AxesHelper(3);
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const matcapTexture = textureLoader.load(
  `/textures/matcaps/${Math.ceil(Math.random() * 5)}.png`
);

/**
 * Font
 */
const fontLoader = new FontLoader();

const material = new THREE.MeshMatcapMaterial({
  color: "pink",
  matcap: matcapTexture,
});

fontLoader.load("/fonts/font.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Rena", {
    font,
    size: 2,
    height: 0.2,
    curveSegments: 11,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 2,
  });
  textGeometry.computeBoundingBox();
  textGeometry.center();

  const text = new THREE.Mesh(textGeometry, material);
  objectsGroup.add(text);
});

/**
 * Donuts
 */

const donutGeometry = new THREE.TorusGeometry(0.9, 0.4, 32, 32);

for (let i = 0; i <= 300; i++) {
  const donut = new THREE.Mesh(donutGeometry, material);
  // Loop
  donut.position.set(
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 50
  );

  const randomScaleValue = Math.random();
  donut.scale.set(randomScaleValue, randomScaleValue, randomScaleValue);

  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;

  objectsGroup.add(donut);
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 2;
camera.position.y = 2;
camera.position.z = 4;
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

/**
 * Theatre
 */
// studio.initialize();

const project = core.getProject("Project", { state: projectState });
const sheet = project.sheet("Sheet");

const cameraAnim = sheet.object("Camera", {
  x: camera.position.x,
  y: camera.position.y,
  z: camera.position.z,
});

cameraAnim.onValuesChange((cameraAnim) => {
  camera.position.x = cameraAnim.x;
  camera.position.y = cameraAnim.y;
  camera.position.z = cameraAnim.z;
});

project.ready.then(() => {
  sheet.sequence.play({ range: [0, 2] }).then(() => {});
});
