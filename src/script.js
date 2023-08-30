import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import * as dat from "lil-gui";

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
const axesHelper = new THREE.AxesHelper(3);
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const particlesTexture = textureLoader.load(
  `/textures/particles/${Math.ceil(Math.random() * 12)}.png`
);

/**
 * Font
 */
const fontLoader = new FontLoader();

fontLoader.load("/fonts/font-1.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Freshta\n Jamil\n Kerrar", {
    font,
    size: 2,
    height: 0.2,
    curveSegments: 22,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 2,
  });
  textGeometry.computeBoundingBox();
  textGeometry.center();

  const textMaterial = new THREE.MeshBasicMaterial({
    color: "pink",
    blending: THREE.AdditiveBlending,
  });

  const text = new THREE.Mesh(textGeometry, textMaterial);
  objectsGroup.add(text);
});

/**
 * Particles
 */
const verticesNum = 10000;
const positionArray = new Float32Array(verticesNum * 3);
const colorArray = new Float32Array(verticesNum * 3);

for (let i = 0; i < positionArray.length; i++) {
  positionArray[i] = (Math.random() - 0.5) * 30;
  colorArray[i] = Math.random();
}

const particlesGeometry = new THREE.BufferGeometry();
const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
const colorAttribute = new THREE.BufferAttribute(colorArray, 3);
particlesGeometry.setAttribute("position", positionAttribute);
particlesGeometry.setAttribute("color", colorAttribute);

const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.size = 0.4;
particlesMaterial.sizeAttenuation = true;
particlesMaterial.color = new THREE.Color("pink");
particlesMaterial.alphaMap = particlesTexture;
particlesMaterial.transparent = true;
particlesMaterial.alphaTest = 0.15;
// particlesMaterial.vertexColors = true;
particlesMaterial.blending = THREE.AdditiveBlending;

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

console.log(particlesGeometry);

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
camera.position.x = 6;
camera.position.y = 4;
camera.position.z = 12;
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

  // Update partilces
  particles.position.x = Math.cos(elapsedTime * 0.25) * 5;
  particles.position.z = Math.sin(elapsedTime * 0.25) * 5;
  particles.position.y = Math.sin(elapsedTime) * 0.25;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
