import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// 📌 DOM и Offcanvas
const container = document.getElementById('shop3d-container');
const dotsContainer = document.getElementById('dots-container');
const placeholder = document.querySelector('.shop3d-placeholder');
const productOffcanvas = new bootstrap.Offcanvas('#productOffcanvas');

// 📌 Scene, Camera, Groups
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 0);

const yawGroup = new THREE.Group();
const pitchGroup = new THREE.Group();
pitchGroup.add(camera);
yawGroup.add(pitchGroup);
scene.add(yawGroup);

yawGroup.position.set(-1, 2, -2);

// 📌 Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// 📌 Lights
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

// 📌 Raycaster и Mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// 📌 Textures
const textureLoader = new THREE.TextureLoader();
const markerTexture = textureLoader.load('../../static/models/ellipse.png');
const markerHoverTexture = textureLoader.load('../../static/models/ellipse-hover.png');

// 📌 GLTF Loader с DRACO
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.177.0/examples/jsm/libs/draco/');
loader.setDRACOLoader(dracoLoader);

// 📌 Маркеры, Товары
const markers = [];
const productsInScene = [];

let hoveredMarker = null;
let clickHandled = false;

// 📌 Управление мышью (вращение камеры)
let isMouseDown = false, prevMouseX = 0, prevMouseY = 0;
let yaw = 0, pitch = 0;
let targetYaw = 0;
const sensitivity = 0.002;
const pitchLimit = Math.PI / 2 - 0.1;
let mouseDownX = 0, mouseDownY = 0;
const clickMoveThreshold = 5;

// 🎛️ Управление мышью
renderer.domElement.addEventListener('mousedown', e => {
  if (e.button === 0) {
    isMouseDown = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;

    mouseDownX = e.clientX;
    mouseDownY = e.clientY;
  }
});

renderer.domElement.addEventListener('mouseup', e => {
  if (e.button === 0) {
    isMouseDown = false;

    const moveDistance = Math.hypot(e.clientX - mouseDownX, e.clientY - mouseDownY);
    if (moveDistance > clickMoveThreshold) {
      clickHandled = true;
    }
  }
});

renderer.domElement.addEventListener('mousemove', e => {
  if (!isMouseDown) return;
  const deltaX = e.clientX - prevMouseX;
  const deltaY = e.clientY - prevMouseY;

  yaw -= deltaX * sensitivity;
  pitch -= deltaY * sensitivity;

  pitch = THREE.MathUtils.clamp(pitch, -pitchLimit, pitchLimit);
  targetYaw = yaw;

  prevMouseX = e.clientX;
  prevMouseY = e.clientY;
});



// 📱 Управление touch (вращение камеры на мобильных)
let isTouching = false, prevTouchX = 0, prevTouchY = 0;
let touchStartX = 0, touchStartY = 0;

renderer.domElement.addEventListener('touchstart', e => {
  if (e.touches.length === 1) {
    isTouching = true;
    const touch = e.touches[0];
    prevTouchX = touch.clientX;
    prevTouchY = touch.clientY;

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }
}, { passive: false });

renderer.domElement.addEventListener('touchmove', e => {
  if (!isTouching || e.touches.length !== 1) return;

  e.preventDefault(); // отключаем скролл страницы при свайпе по сцене

  const touch = e.touches[0];
  const deltaX = touch.clientX - prevTouchX;
  const deltaY = touch.clientY - prevTouchY;

  yaw -= deltaX * sensitivity;
  pitch -= deltaY * sensitivity;

  pitch = THREE.MathUtils.clamp(pitch, -pitchLimit, pitchLimit);
  targetYaw = yaw;

  prevTouchX = touch.clientX;
  prevTouchY = touch.clientY;
}, { passive: false });

renderer.domElement.addEventListener('touchend', e => {
  if (!isTouching) return;
  isTouching = false;

  const moveDistance = Math.hypot(
    prevTouchX - touchStartX,
    prevTouchY - touchStartY
  );
  if (moveDistance > clickMoveThreshold) {
    clickHandled = true;
  }
}, { passive: false });





// 📌 Наведение на маркеры
renderer.domElement.addEventListener('mousemove', event => {
  if (isMouseDown) return;
  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(markers);
  if (intersects.length > 0) {
    const hovered = intersects[0].object;
    if (hoveredMarker !== hovered) {
      if (hoveredMarker) {
        hoveredMarker.material.map = hoveredMarker.userData.baseTexture;
        hoveredMarker.material.needsUpdate = true;
      }
      hovered.material.map = hovered.userData.hoverTexture;
      hovered.material.needsUpdate = true;
      hoveredMarker = hovered;
    }
  } else if (hoveredMarker) {
    hoveredMarker.material.map = hoveredMarker.userData.baseTexture;
    hoveredMarker.material.needsUpdate = true;
    hoveredMarker = null;
  }
});

// 📌 Клик по маркерам и товарам
renderer.domElement.addEventListener('click', e => {
  if (clickHandled) {
    clickHandled = false;
    return;
  }

  mouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  // Проверяем только маркеры
  const navIntersects = raycaster.intersectObjects(markers);
  if (navIntersects.length > 0) {
    yawGroup.position.set(navIntersects[0].object.position.x, yawGroup.position.y, navIntersects[0].object.position.z);
    return;
  }

  // Больше не проверяем клики по товарам
});


// 📌 Resize
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// 📌 Анимация
const worldPosition = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);

  yaw += (targetYaw - yaw) * 0.1;
  yawGroup.rotation.y = yaw;
  pitchGroup.rotation.x = pitch;

  renderer.render(scene, camera);

  productsInScene.forEach(product => {
    product.getWorldPosition(worldPosition);
    worldPosition.project(camera);

    const x = (worldPosition.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
    const y = (-worldPosition.y * 0.5 + 0.5) * renderer.domElement.clientHeight;

    product.userData.dotElement.style.left = `${x}px`;
    product.userData.dotElement.style.top = `${y}px`;

    const visible = worldPosition.z < 1;
    product.userData.dotElement.style.display = visible ? 'flex' : 'none';
  });
}



// Создание точек

function createDotForProduct(productMesh) {
  const dot = document.createElement('div');
  dot.className = 'shop3d-dot';
  dot.innerHTML = '<span></span>';
  dotsContainer.appendChild(dot);

  // связать dot → product
  dot.dataset.productName = productMesh.userData.name;

  // связать product → dot
  productMesh.userData.dotElement = dot;

  // добавить обработчик клика
  dot.addEventListener('click', (e) => {
    e.stopPropagation(); // чтобы клик не уходил дальше
    console.log('Клик по точке для товара:', productMesh.userData.name);
    productOffcanvas.show();
  });
}



// 📌 Загрузка магазина
function loadShop() {
  loader.load('/static/models/shop_model.glb', gltf => {
    const shopModel = gltf.scene;
    const box = new THREE.Box3().setFromObject(shopModel);
    const center = new THREE.Vector3();
    box.getCenter(center);
    shopModel.position.x -= center.x;
    shopModel.position.z -= center.z;
    scene.add(shopModel);
    console.log('Магазин загружен.');
    loadProducts();
  }, xhr => console.log(`Загрузка магазина: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`),
    err => console.error('Ошибка загрузки магазина:', err));
}

// 📌 Загрузка товаров
function loadProducts() {
  fetch('/static/js/json/products.json')
    .then(r => r.json())
    .then(products => {
      products.forEach(p => {
        loader.load(`/static/models/shoes/${p.model}`, gltf => {
          const item = gltf.scene;
          item.scale.set(0.2, 0.2, 0.2);
          item.position.set(p.position.x, p.position.y, p.position.z);
          item.rotation.set(
            THREE.MathUtils.degToRad(p.rotation.x),
            THREE.MathUtils.degToRad(p.rotation.y),
            THREE.MathUtils.degToRad(p.rotation.z)
          );
          item.userData.name = p.name;
          scene.add(item);
          productsInScene.push(item);
          createDotForProduct(item);
        }, undefined, err => console.error(`Ошибка загрузки товара ${p.model}:`, err));
      });
    })
    .catch(err => console.error('Ошибка загрузки списка товаров:', err));
}

// 📌 Создание маркера
function createMarker(x, z) {
  const geometry = new THREE.CircleGeometry(0.6, 32);
  const material = new THREE.MeshBasicMaterial({ map: markerTexture, transparent: true, side: THREE.DoubleSide });
  const circle = new THREE.Mesh(geometry, material);
  circle.rotation.x = -Math.PI / 2;
  circle.position.set(x, 0.01, z);
  circle.userData = { baseTexture: markerTexture, hoverTexture: markerHoverTexture };
  scene.add(circle);
  markers.push(circle);
}

// 📌 Обработка кнопок
document.getElementById('turnLeft').addEventListener('click', () => {
  targetYaw += Math.PI / 2;
});

document.getElementById('turnRight').addEventListener('click', () => {
  targetYaw -= Math.PI / 2;
});

// 📌 Добавление маркеров
[[2,-3] ].forEach(([x,z]) => createMarker(x,z));

// 📌 Запуск
loadShop();
animate();