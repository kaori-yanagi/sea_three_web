import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";
import skyImage from "./textures/sky.jpg";
const gui = new dat.GUI({width: 300 });

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const skyTexture = textureLoader.load(skyImage);
scene.background = skyTexture;
//最終的にシーンにバックイメージとしてのこせばいい3

// Geometry
//const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

//海を大きくする

const geometry = new THREE.PlaneGeometry(9, 9, 512, 512);

//color  epthColor surfaceColor globalに使えるように
const colorObject = {};
colorObject.depthColor = "#bff9e8";
colorObject.surfaceColor = "#66c1f9";




// Material
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    uWaveLength: { value: 0.38},
    uFrequency: {value: new THREE.Vector2(6.6, 3.5) },
    //時間の経過とともに値をかえていきたい
    uTime: { value: 0 },
    uWaveSpeed: { value: 0.75 },
    uDepthColor: {value: new THREE.Color(colorObject.depthColor)},
    uSurfaceColor: {value: new THREE.Color(colorObject.surfaceColor)},
    //初期値のようなものどこにもってくるのか
    uColorOffset:　{ value: 0.03 },
    //色に掛け算
    uColorMutiplier: { value: 9.0 },

    //vertexshaderのしんぷく
    uSmallWaveElevation: {value: 0.15},
    uSmallWaveFrequency: {value: 3.0},
    uSmallWaveSpeed: { value: 0.2 },
  },
});

//デバッグ

gui
.add(material.uniforms.uWaveLength, "value")
.min(0)
.max(1)
.step(0.001)
.name("uWaveLength");

gui
// uFrequency: {value: new THREE.Vector2(5.0, 2.5) },の50を変える事ができる

.add(material.uniforms.uFrequency.value, "x")
.min(0)
.max(10)
.step(0.001)
.name("uFrequencyX");

gui
// uFrequency: {value: new THREE.Vector2(5.0, 2.5) },の25を変える事ができる

.add(material.uniforms.uFrequency.value, "y")
.min(0)
.max(10)
.step(0.001)
.name("uFrequencyY");


gui
// uFrequency: {value: new THREE.Vector2(5.0, 2.5) },の25を変える事ができる

.add(material.uniforms.uWaveSpeed, "value")
.min(0)
.max(4)
.step(0.001)
.name("uWaveSpeed");

gui
// uFrequency: {value: new THREE.Vector2(5.0, 2.5) },の25を変える事ができる

.add(material.uniforms.uColorOffset, "value")
.min(0)
.max(1)
.step(0.001)
.name("uColorOffset");

gui
// uFrequency: {value: new THREE.Vector2(5.0, 2.5) },の25を変える事ができる

.add(material.uniforms.uColorMutiplier, "value")
.min(0)
.max(10)
.step(0.001)
.name("uColorMutiplier");


gui
// 
.add(material.uniforms.uSmallWaveElevation, "value")
.min(0)
.max(1)
.step(0.001)
.name("uSmallWaveElevation");

gui
// 
.add(material.uniforms.uSmallWaveFrequency, "value")
.min(0)
.max(30)
.step(0.001)
.name("uSmallWaveFrequency");


gui
// 
.add(material.uniforms.uSmallWaveSpeed, "value")
.min(0)
.max(4)
.step(0.001)
.name("uSmallWaveSpeed");



gui.addColor(colorObject, "depthColor").onChange(() => {
  material.uniforms.uDepthColor.value.set(colorObject.depthColor);
});


gui.addColor(colorObject, "surfaceColor").onChange(() => {
  material.uniforms.uSurfaceColor.value.set(colorObject.surfaceColor);
});


//guiデバックを隠す

gui.show(false);




// Mesh
const mesh = new THREE.Mesh(geometry, material);
 mesh.rotation.x = -Math.PI / 2;
scene.add(mesh);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
// camera.position.set(0.2, 0.7, 0.7);
//今回は0
camera.position.set(0, 0.23, 0);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const animate = () => {
  //時間取得
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;

  //カメラを円周上に周回させる 早いので遅らせる* 0.17
// camera.position.x = Math.sin(elapsedTime * 0.17) * 1.5;
// camera.position.z = Math.cos(elapsedTime * 0.17) * 1.5;
camera.position.x = Math.sin(elapsedTime * 0.17) * 3.0;
camera.position.z = Math.cos(elapsedTime * 0.17) * 3.0;


//0,0,0原点を見ている
// camera.lookAt(0, 0, 0);
// camera.lookAt(Math.cos(elapsedTime), 0, 0);
camera.lookAt(Math.cos(elapsedTime), Math.sin(elapsedTime)* 0.5, Math.sin(elapsedTime)) * 0.4;


  // controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

//
animate();
