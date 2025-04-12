const config = {
  galaxyCount: 8,
  starCount: 5000,
  cameraDistance: 120,
  fogDensity: 0.0003,
  rotationSpeed: 0.002,
  bloomStrength: 1.5,
  bloomRadius: 0.4,
  bloomThreshold: 0.8,
};
const i18n = {
  pt: {
    title: "UNIVERSO NEON",
    loading: "INICIALIZANDO...",
    types: ["ESPIRAL", "ELÍPTICA", "IRREGULAR"],
    "info-type": "TIPO: ",
    "info-distance": "DISTÂNCIA: ",
    "info-stars": "ESTRELAS: ",
    "distance-unit": " ANOS-LUZ",
    "stars-unit": " BILHÕES",
  },
  en: {
    title: "NEON UNIVERSE",
    loading: "INITIALIZING...",
    types: ["SPIRAL", "ELLIPTICAL", "IRREGULAR"],
    "info-type": "TYPE: ",
    "info-distance": "DISTANCE: ",
    "info-stars": "STARS: ",
    "distance-unit": " LIGHT YEARS",
    "stars-unit": " BILLION",
  },
  zh: {
    title: "霓虹宇宙",
    loading: "初始化...",
    types: ["螺旋", "椭圆", "不规则"],
    "info-type": "类型: ",
    "info-distance": "距离: ",
    "info-stars": "恒星: ",
    "distance-unit": " 光年",
    "stars-unit": " 十亿",
  },
};
const galaxyNames = {
  pt: ["VIA LÁCTEA", "ANDROMEDA", "SOMBRERO", "REDEMOINHO", "CATAVENTO"],
  en: ["MILKY WAY", "ANDROMEDA", "SOMBRERO", "WHIRLPOOL", "PINWHEEL"],
  zh: ["银河系", "仙女座", "草帽", "涡状", "风车"],
};
let scene, camera, renderer, controls, composer;
let galaxies = [];
let galaxyMeshes = [];
let currentLanguage = "pt";
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
function init() {
  createScene();
  createCamera();
  createRenderer();
  createControls();
  createLights();
  createGalaxies();
  createStars();
  setupEventListeners();
  setTimeout(() => {
    document.getElementById("loading-screen").style.opacity = "0";
    setTimeout(() => {
      document.getElementById("loading-screen").style.display = "none";
    }, 500);
  }, 2000);

  animate();
}
function createScene() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000022, config.fogDensity);
  const bgGradient = new THREE.TextureLoader().load(
    "data:image/png;base64,..."
  );
  scene.background = bgGradient;
}
function createCamera() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.z = config.cameraDistance;
}
function createRenderer() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);
}
function createControls() {
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 0.8;
  controls.minDistance = 40;
  controls.maxDistance = 400;
}
function createLights() {
  const ambientLight = new THREE.AmbientLight(0x001133);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0x6600ff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  for (let i = 0; i < 4; i++) {
    const hue = 0.7 + Math.random() * 0.2;
    const color = new THREE.Color().setHSL(hue, 0.9, 0.6);
    const light = new THREE.PointLight(color, 1.5, 80);
    light.position.set(
      Math.random() * 200 - 100,
      Math.random() * 200 - 100,
      Math.random() * 200 - 100
    );
    scene.add(light);
  }
}
function createGalaxies() {
  galaxyMeshes = [];
  for (let i = 0; i < config.galaxyCount; i++) {
    const size = 3 + Math.random() * 3;
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const hue = 0.7 + Math.random() * 0.2;
    const color = new THREE.Color().setHSL(hue, 0.9, 0.6);
    const material = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.3,
      shininess: 50,
      specular: 0xffffff,
      flatShading: true,
    });
    const galaxy = new THREE.Mesh(geometry, material);
    const radius = 80 + Math.random() * 60;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    galaxy.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );
    const galaxyData = {
      mesh: galaxy,
      name: galaxyNames[currentLanguage][
        i % galaxyNames[currentLanguage].length
      ],
      type: i18n[currentLanguage]["types"][Math.floor(Math.random() * 3)],
      distance: Math.floor(Math.random() * 500 + 50),
      stars: Math.floor(Math.random() * 500 + 50),
      rotationSpeed: Math.random() * 0.005 + 0.001,
      color: color,
    };
    galaxies.push(galaxyData);
    galaxyMeshes.push(galaxy);
    scene.add(galaxy);
  }
}
function createStars() {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
  });
  const positions = [];
  const colors = [];
  for (let i = 0; i < config.starCount; i++) {
    const radius = 500;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions.push(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );
    const hue = Math.random() > 0.7 ? 0.7 + Math.random() * 0.2 : 0;
    const saturation = hue > 0 ? 0.8 : 0;
    const lightness = hue > 0 ? 0.6 : 0.9;
    const color = new THREE.Color().setHSL(hue, saturation, lightness);
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  material.vertexColors = true;
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);
}
function setupEventListeners() {
  window.addEventListener("resize", onWindowResize);
  document
    .getElementById("fullscreen-btn")
    .addEventListener("click", toggleFullscreen);
  document.addEventListener("click", onDocumentClick);
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      currentLanguage = this.getAttribute("data-lang");
      updateUI();
      refreshGalaxyNames();
    });
  });
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}
function onDocumentClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(galaxyMeshes);
  if (intersects.length > 0) {
    const galaxy = intersects[0].object;
    const galaxyData = galaxies.find((g) => g.mesh === galaxy);
    if (galaxyData) {
      updateGalaxyInfo(galaxyData);
      highlightGalaxy(galaxy);
    }
  } else {
    document.getElementById("galaxy-info").classList.add("hidden");
  }
}
function updateGalaxyInfo(galaxyData) {
  document.getElementById("galaxy-name").textContent = galaxyData.name;
  document.getElementById("galaxy-type").textContent =
    i18n[currentLanguage]["info-type"] + galaxyData.type;
  document.getElementById("galaxy-distance").textContent =
    i18n[currentLanguage]["info-distance"] +
    galaxyData.distance +
    i18n[currentLanguage]["distance-unit"];
  document.getElementById("galaxy-stars").textContent =
    i18n[currentLanguage]["info-stars"] +
    galaxyData.stars +
    i18n[currentLanguage]["stars-unit"];
  document.getElementById("galaxy-info").classList.remove("hidden");
}
function highlightGalaxy(galaxy) {
  galaxies.forEach((g) => {
    g.mesh.material.emissiveIntensity = 0.3;
    g.mesh.scale.set(1, 1, 1);
  });
  galaxy.material.emissiveIntensity = 1.0;
  galaxy.scale.set(1.2, 1.2, 1.2);
}
function updateUI() {
  document.getElementById("title").textContent = i18n[currentLanguage]["title"];
  document.getElementById("loading-text").textContent =
    i18n[currentLanguage]["loading"];
}
function refreshGalaxyNames() {
  galaxies.forEach((galaxy, index) => {
    galaxy.name =
      galaxyNames[currentLanguage][index % galaxyNames[currentLanguage].length];
  });
}
function animate() {
  requestAnimationFrame(animate);
  galaxies.forEach((galaxy) => {
    galaxy.mesh.rotation.x += galaxy.rotationSpeed * 0.5;
    galaxy.mesh.rotation.y += galaxy.rotationSpeed;
  });
  controls.update();
  renderer.render(scene, camera);
}
init();
