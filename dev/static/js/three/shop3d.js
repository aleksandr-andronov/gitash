import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// Контейнер для рендера
const container = document.getElementById('shop3d-container');

// Сцена
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

// Камера
const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);

// Рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Орбитальные контролы
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

controls.minPolarAngle = Math.PI / 2;
controls.maxPolarAngle = Math.PI / 2;

controls.enableZoom = false;
controls.enablePan = false;


// Освещение
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Загрузка модели
const loader = new FBXLoader();
loader.load(
  'static/models/shop_model.fbx',
  (object) => {
    scene.add(object);

    // Получим bounding box модели
    const box = new THREE.Box3().setFromObject(object);
    console.log('box:', box)
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    console.log('Размеры модели:', size);
    console.log('Центр модели:', center);

    // Сместим камеру "у стены"
    camera.position.set(center.x, center.y + 2, center.z + size.z + 2);
    camera.lookAt(center);

    controls.target.copy(center);
    controls.update();
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% загружено');
  },
  (error) => {
    console.error('Ошибка загрузки FBX:', error);
  }
);


// Ресайз окна
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// Анимация
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};
animate();
