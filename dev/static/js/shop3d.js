console.log(THREE)




// (() => {
//   // Сцена, камера, рендер
//   const scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//   camera.position.set(0, 0, 0);

//   const renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   document.querySelector('.shop3d-content').appendChild(renderer.domElement);

//   // Панорамное изображение
//   const textureLoader = new THREE.TextureLoader();
//   textureLoader.load('./static/images/content/test-3d.png', (texture) => {
//     const geometry = new THREE.SphereGeometry(500, 60, 40);
//     geometry.scale(-1, 1, 1); // чтобы текстура была внутри сферы
//     const material = new THREE.MeshBasicMaterial({ map: texture });
//     const sphere = new THREE.Mesh(geometry, material);
//     scene.add(sphere);
//   });

//   // Управление камерой
//   const controls = new THREE.OrbitControls(camera, renderer.domElement);
//   controls.enableZoom = false;
//   controls.enablePan = false;
//   controls.rotateSpeed = 0.3;
//   controls.minPolarAngle = Math.PI / 3;
//   controls.maxPolarAngle = Math.PI / 1.5;

//   // Точки перемещения
//   const points = [];
//   const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

//   const createPoint = (x, y, z) => {
//     const geometry = new THREE.CircleGeometry(5, 32);
//     const mesh = new THREE.Mesh(geometry, pointMaterial);
//     mesh.position.set(x, y, z);
//     mesh.rotation.x = -Math.PI / 2;
//     scene.add(mesh);
//     points.push(mesh);
//   };

//   // Координаты белых кругов (приблизительные, можно скорректировать по месту)
//   createPoint(50, -2, -400);
//   createPoint(-100, -2, -300);
//   createPoint(100, -2, -250);

//   // Raycaster для клика по точкам
//   const raycaster = new THREE.Raycaster();
//   const mouse = new THREE.Vector2();

//   function onClick(event) {
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

//     raycaster.setFromCamera(mouse, camera);
//     const intersects = raycaster.intersectObjects(points);

//     if (intersects.length > 0) {
//       const point = intersects[0].object;
//       const targetPos = point.position.clone().normalize().multiplyScalar(0.01); // мини-смещение к точке

//       gsap.to(camera.position, {
//         duration: 1,
//         x: targetPos.x,
//         y: targetPos.y,
//         z: targetPos.z
//       });
//     }
//   }

//   window.addEventListener('click', onClick, false);

//   // Анимация
//   function animate() {
//     requestAnimationFrame(animate);
//     controls.update();
//     renderer.render(scene, camera);
//   }
//   animate();

//   // Адаптация под окно
//   window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//   });
// })();
