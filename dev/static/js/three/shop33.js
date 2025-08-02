import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



// Получаем контейнер
const container = document.getElementById('shop3d-container');

// Создаем сцену
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

// Камера (на уровне глаз)
const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);
camera.position.set(0, 262, 0); // высота "человека"

// Рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Свет
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Контейнер управления камерой (для поворота вокруг y и x)
const controlsGroup = new THREE.Group();
controlsGroup.position.copy(camera.position);
controlsGroup.add(camera);
scene.add(controlsGroup);

// Переменные для контроля мыши
let isMouseDown = false;
let prevMouseX = 0;
let prevMouseY = 0;
let yaw = 0;
let pitch = 0;

// Чувствительность
const sensitivity = 0.002;

// Обработчики мыши
renderer.domElement.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
        isMouseDown = true;
        prevMouseX = event.clientX;
        prevMouseY = event.clientY;
    }
});

renderer.domElement.addEventListener('mouseup', (event) => {
    if (event.button === 0) {
        isMouseDown = false;
    }
});

renderer.domElement.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
        const deltaX = event.clientX - prevMouseX;
        const deltaY = event.clientY - prevMouseY;

        yaw -= deltaX * sensitivity;
        pitch -= deltaY * sensitivity;

        const pitchLimit = Math.PI / 2 - 0.1;
        pitch = Math.max(-pitchLimit, Math.min(pitchLimit, pitch));

        controlsGroup.rotation.y = yaw;
        camera.rotation.x = pitch;

        prevMouseX = event.clientX;
        prevMouseY = event.clientY;
    }
});

// 📦 Загрузка GLB модели
const loader = new GLTFLoader();
loader.load(
    'static/models/shop_model.glb', // путь к твоему .glb файлу
    (gltf) => {
        const model = gltf.scene;

        model.traverse((child) => {
            if (child.isMesh) {


                const mat = child.material;

            }
        });

        const modelGroup = new THREE.Group();
        modelGroup.add(model);
        modelGroup.rotation.x = -Math.PI / 2;

        // Вычисляем габариты
        const box = new THREE.Box3().setFromObject(modelGroup);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);
        const min = box.min;

        console.log('Размеры:', size);
        console.log('Центр:', center);
        console.log('Минимум:', min);

        // Центрируем по X и Z, поднимаем по Y
        modelGroup.position.x -= center.x;
        modelGroup.position.z -= center.z;
        modelGroup.position.y -= min.y;

        scene.add(modelGroup);

        console.log('Добавлено объектов в сцену:', scene.children);

        // 📌 Камеру ставим на уровень 1.7 от пола
        const floorLevel = 0;
        const eyeHeight = 1.7;
        controlsGroup.position.set(0, floorLevel + eyeHeight, 0);

        console.log('Камера установлена на:', controlsGroup.position);
        console.log('camera.position:', camera.position);
        console.log('controlsGroup.position:', controlsGroup.position);
    },
    (xhr) => {
        console.log(`Загрузка: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Ошибка при загрузке GLB:', error);
    }
);

// Анимация
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
