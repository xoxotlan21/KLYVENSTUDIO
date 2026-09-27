import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initNorthwoodMethod3D() {
  const methodSections = document.querySelectorAll('[data-nw-method-section]');
  if (!methodSections.length) return;

  methodSections.forEach(section => {
    setupMethodSection(section);
  });
}

function setupMethodSection(section) {
  const isEs = section.id.includes('-es');
  const canvas = section.querySelector('[data-3d-canvas]');
  const canvasWrap = section.querySelector('[data-3d-wrap]');
  const loader = section.querySelector('[data-3d-loader]');
  const hotspotsLayer = section.querySelector('[data-hotspots-layer]');
  const tooltip = section.querySelector('[data-hotspot-tooltip]');
  const tooltipStep = section.querySelector('[data-tooltip-step]');
  const tooltipTitle = section.querySelector('[data-tooltip-title]');
  const tooltipText = section.querySelector('[data-tooltip-text]');
  const tooltipClose = section.querySelector('.nw-tooltip-close');
  const panelKicker = section.querySelector('[data-panel-kicker]');
  const panelTitle = section.querySelector('[data-panel-title]');
  const panelDesc = section.querySelector('[data-panel-desc]');
  const stepItems = section.querySelectorAll('.nw-method-step-item');
  const timeBtns = section.querySelectorAll('.nw-time-btn, .nw-method-thumb-card');
  const zoomInBtn = section.querySelector('[data-action="zoom-in"]');
  const zoomOutBtn = section.querySelector('[data-action="zoom-out"]');
  const exploreBtn = section.querySelector('[data-action="explore-3d"]');

  if (!canvas || !canvasWrap) return;

  // Step Data
  const stepsData = {
    en: [
      {
        stepNum: '01',
        kicker: 'SELECTED STEP 01 / 04',
        title: 'Site Discovery',
        desc: 'We examine soil depth, wind conditions, and sightlines from inside every room of your residence before drawing a line.',
        camPos: { x: -11, y: 12, z: -10 },
        lookAt: { x: -5, y: 4, z: -3 }
      },
      {
        stepNum: '02',
        kicker: 'SELECTED STEP 02 / 04',
        title: '3D Concept Walkthrough',
        desc: 'Explore cinematic 3D renders at different hours of the day. Refine textures, shade and plant species before construction begins.',
        camPos: { x: -16, y: 15, z: 22 },
        lookAt: { x: 0, y: 1.2, z: 0 }
      },
      {
        stepNum: '03',
        kicker: 'SELECTED STEP 03 / 04',
        title: 'Artisan Craft',
        desc: 'Our dedicated master stonemasons and arborists construct dry-stacked limestone terraces, stairs, and pools with continuous supervision.',
        camPos: { x: -10, y: 7, z: 15 },
        lookAt: { x: -2.5, y: 1, z: 2 }
      },
      {
        stepNum: '04',
        kicker: 'SELECTED STEP 04 / 04',
        title: 'Seasonal Stewardship',
        desc: 'We foster your landscape’s ongoing maturity with seasonal pruning, microclimate care, and smart irrigation stewardship throughout the years.',
        camPos: { x: 9, y: 8, z: 16 },
        lookAt: { x: 3.5, y: 0.5, z: 1.5 }
      }
    ],
    es: [
      {
        stepNum: '01',
        kicker: 'PASO SELECCIONADO 01 / 04',
        title: 'Lectura del Terreno',
        desc: 'Analizamos la composición del suelo, vientos predominantes y la relación visual con cada ventana del hogar antes de trazar una sola línea.',
        camPos: { x: -11, y: 12, z: -10 },
        lookAt: { x: -5, y: 4, z: -3 }
      },
      {
        stepNum: '02',
        kicker: 'PASO SELECCIONADO 02 / 04',
        title: 'Concepto & Maqueta 3D',
        desc: 'Explora vistas cinemáticas del proyecto en distintos momentos del día. Ajusta texturas, sombras y especies botánicas antes de comenzar la obra.',
        camPos: { x: -16, y: 15, z: 22 },
        lookAt: { x: 0, y: 1.2, z: 0 }
      },
      {
        stepNum: '03',
        kicker: 'PASO SELECCIONADO 03 / 04',
        title: 'Construcción Artesanal',
        desc: 'Un equipo de canteros y maestros jardineros ejecuta terrazas de piedra seca, escaleras y espejos de agua con supervisión arquitectónica continua.',
        camPos: { x: -10, y: 7, z: 15 },
        lookAt: { x: -2.5, y: 1, z: 2 }
      },
      {
        stepNum: '04',
        kicker: 'PASO SELECCIONADO 04 / 04',
        title: 'Cuidado Estacional',
        desc: 'Acompañamos el crecimiento de las especies con podas estacionales, nutrición orgánica y afinación de riego inteligente para que el jardín madure con esplendor.',
        camPos: { x: 9, y: 8, z: 16 },
        lookAt: { x: 3.5, y: 0.5, z: 1.5 }
      }
    ]
  };

  const stepsList = isEs ? stepsData.es : stepsData.en;

  // Hotspot details
  const hotspotDetails = [
    {
      step: isEs ? 'PASO 01 · LECTURA DEL TERRENO' : 'STEP 01 · SITE DISCOVERY',
      title: isEs ? 'Suelo, Pendiente y Vientos' : 'Soil, Slope & Wind Dynamics',
      desc: isEs ? 'Muestreo estratigráfico del terreno y cálculo de presiones de viento costero para calcular la retención estructural de las terrazas.' : 'Stratigraphic soil core sampling and coastal wind analysis to engineer root anchoring and structural terrace retention.'
    },
    {
      step: isEs ? 'PASO 02 · CONCEPTO 3D' : 'STEP 02 · 3D CONCEPT',
      title: isEs ? 'Estudio Solar de 4 Estaciones' : 'Four-Season Solar Simulation',
      desc: isEs ? 'Simulación del recorrido solar y sombras proyectadas a lo largo de los 365 días del año para ubicar zonas de sombra y confort.' : 'Daylight and solar azimuth tracking across the year to position cantilevered pergolas, outdoor dining, and sunlight-dependent flora.'
    },
    {
      step: isEs ? 'PASO 03 · CONSTRUCCIÓN ARTESANAL' : 'STEP 03 · ARTISAN CRAFT',
      title: isEs ? 'Cantería en Piedra Caliza y Granito' : 'Dry-Stacked Limestone Masonry',
      desc: isEs ? 'Muros de contención con aparejo rústico tradicional, escaleras en losas monolíticas y drenajes franceses integrados.' : 'Traditional dry-stacked retaining walls, monolithic limestone stair treads, and sub-surface geotextile drainage systems.'
    },
    {
      step: isEs ? 'PASO 04 · CUIDADO ESTACIONAL' : 'STEP 04 · SEASONAL STEWARDSHIP',
      title: isEs ? 'Evolución Botánica y Riego Microclima' : 'Botanical Maturity & Smart Irrigation',
      desc: isEs ? 'Olivos centenarios podados esculturalmente, arbustos aromáticos nativos y microaspersión adaptada a la humedad ambiental.' : 'Sculptural heritage olive trees, drought-tolerant chaparral underplanting, and weather-synchronized low-voltage micro-drip irrigation.'
    }
  ];

  // Hotspot 3D world anchors
  const hotspotAnchors = [
    new THREE.Vector3(-6.5, 4.8, -3.8), // 0: Soil & Wind
    new THREE.Vector3(-1.2, 4.2, -1.8), // 1: Daylight Study
    new THREE.Vector3(-3.2, 1.1, 2.2),  // 2: Stone Construction
    new THREE.Vector3(4.2, -0.1, 2.4)   // 3: Plant Maturity
  ];

  // Setup Three.js Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070c08);
  scene.fog = new THREE.FogExp2(0x070c08, 0.024);

  const rect = canvasWrap.getBoundingClientRect();
  const width = rect.width || 800;
  const height = rect.height || 500;

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 200);
  camera.position.set(-16, 15, 22);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.target.set(0, 1.2, 0);
  controls.minDistance = 14;
  controls.maxDistance = 44;
  controls.maxPolarAngle = Math.PI / 2.05; // Never below ground level
  controls.minPolarAngle = 0.3;

  // Lighting System
  let isDusk = true; // Dusk by default

  const sunLight = new THREE.DirectionalLight(0xff7b42, 0.6);
  sunLight.position.set(-22, 12, -16);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 80;
  sunLight.shadow.camera.left = -20;
  sunLight.shadow.camera.right = 20;
  sunLight.shadow.camera.top = 20;
  sunLight.shadow.camera.bottom = -20;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  const hemiLight = new THREE.HemisphereLight(0x1a2e24, 0x070c08, 0.45);
  scene.add(hemiLight);

  // Night Point Lights (uplights, house interior, fire pit, pool)
  const duskLights = [];

  function addDuskLight(color, intensity, distance, pos) {
    const light = new THREE.PointLight(color, intensity, distance, 1.8);
    light.position.set(pos.x, pos.y, pos.z);
    scene.add(light);
    duskLights.push({ light, targetIntensity: intensity });
    return light;
  }

  // House interior glows
  addDuskLight(0xffd199, 2.2, 14, { x: -2, y: 4.5, z: -3 });
  addDuskLight(0xffb870, 1.8, 12, { x: 2, y: 4.8, z: -2 });

  // Fire hearth flickering light
  const fireLight = addDuskLight(0xff7722, 2.8, 10, { x: 1.5, y: 0.8, z: 2.2 });

  // Pool underwater turquoise glow
  addDuskLight(0x38bdf8, 1.4, 8, { x: -0.5, y: -0.2, z: 4.2 });

  // Garden step & tree uplights
  addDuskLight(0xffc27a, 1.2, 7, { x: -4.5, y: 1.8, z: 1.2 });
  addDuskLight(0xffc27a, 1.2, 7, { x: -3.8, y: 3.2, z: -1.5 });
  addDuskLight(0xffd499, 1.3, 7, { x: -6.2, y: 4.8, z: -2.8 });
  addDuskLight(0xffd499, 1.4, 8, { x: 3.8, y: 1.8, z: -1.2 });
  addDuskLight(0xffc27a, 1.1, 6, { x: 4.5, y: 0.4, z: 2.8 });

  // Build the Diorama Scene Model
  const dioramaGroup = new THREE.Group();
  scene.add(dioramaGroup);

  buildHillsideDiorama(dioramaGroup);

  // Hide loader once geometry is constructed
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => { loader.style.display = 'none'; }, 400);
  }

  // Camera Animation interpolation
  let isAnimatingCamera = false;
  let animStartCamPos = new THREE.Vector3();
  let animTargetCamPos = new THREE.Vector3();
  let animStartLookAt = new THREE.Vector3();
  let animTargetLookAt = new THREE.Vector3();
  let animStartTime = 0;
  const animDuration = 1000;

  function setStep(idx) {
    const data = stepsList[idx];
    if (!data) return;

    // Update bottom nav
    stepItems.forEach((btn, i) => {
      if (i === idx) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // Update right side panel
    if (panelKicker) panelKicker.textContent = data.kicker;
    if (panelTitle) panelTitle.textContent = data.title;
    if (panelDesc) panelDesc.textContent = data.desc;

    // Animate camera smoothly
    animStartCamPos.copy(camera.position);
    animTargetCamPos.set(data.camPos.x, data.camPos.y, data.camPos.z);
    animStartLookAt.copy(controls.target);
    animTargetLookAt.set(data.lookAt.x, data.lookAt.y, data.lookAt.z);
    animStartTime = performance.now();
    isAnimatingCamera = true;
  }

  // Day / Dusk Switching
  function setLightingMode(mode) {
    isDusk = mode === 'dusk';

    timeBtns.forEach(btn => {
      const isMatch = (btn.dataset.time === mode || btn.dataset.timeTrigger === mode);
      if (isMatch) {
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-checked', 'false');
      }
    });

    if (isDusk) {
      // Dusk atmosphere
      scene.background.set(0x070c08);
      scene.fog.color.set(0x070c08);
      scene.fog.density = 0.024;
      renderer.toneMappingExposure = 1.05;

      sunLight.color.set(0xff7b42);
      sunLight.intensity = 0.55;
      sunLight.position.set(-22, 10, -16);

      hemiLight.color.set(0x1a2e24);
      hemiLight.groundColor.set(0x070c08);
      hemiLight.intensity = 0.4;

      duskLights.forEach(item => {
        item.light.intensity = item.targetIntensity;
      });
    } else {
      // Daylight atmosphere
      scene.background.set(0x101b13);
      scene.fog.color.set(0x101b13);
      scene.fog.density = 0.016;
      renderer.toneMappingExposure = 1.25;

      sunLight.color.set(0xfff5e6);
      sunLight.intensity = 1.85;
      sunLight.position.set(18, 30, 16);

      hemiLight.color.set(0xd4eade);
      hemiLight.groundColor.set(0x425447);
      hemiLight.intensity = 0.95;

      duskLights.forEach(item => {
        item.light.intensity = 0.05; // Faded out in bright sunlight
      });
    }
  }

  // Initial lighting mode
  setLightingMode('dusk');

  // Event Listeners
  stepItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.stepIdx, 10);
      setStep(idx);
    });
  });

  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.time || btn.dataset.timeTrigger;
      if (mode) setLightingMode(mode);
    });
  });

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      controls.dollyIn(1.2);
      controls.update();
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      controls.dollyOut(1.2);
      controls.update();
    });
  }

  // Hotspots click interactions
  const hotspotEls = section.querySelectorAll('.nw-3d-hotspot');
  hotspotEls.forEach(el => {
    const idx = parseInt(el.dataset.hotspotId, 10);
    const pin = el.querySelector('.nw-hotspot-pin') || el;
    pin.addEventListener('click', e => {
      e.stopPropagation();
      showHotspotTooltip(idx);
      setStep(idx);
    });
  });

  function showHotspotTooltip(idx) {
    const detail = hotspotDetails[idx];
    if (!detail || !tooltip) return;

    if (tooltipStep) tooltipStep.textContent = detail.step;
    if (tooltipTitle) tooltipTitle.textContent = detail.title;
    if (tooltipText) tooltipText.textContent = detail.desc;
    tooltip.hidden = false;
  }

  if (tooltipClose) {
    tooltipClose.addEventListener('click', () => {
      if (tooltip) tooltip.hidden = true;
    });
  }

  // Explore the concept ↗ (Fullscreen modal)
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      openFullscreen3D();
    });
  }

  function openFullscreen3D() {
    canvasWrap.classList.toggle('is-expanded-view');
    setTimeout(() => {
      onResize();
    }, 250);
  }

  // Window Resize
  function onResize() {
    const r = canvasWrap.getBoundingClientRect();
    const w = r.width || 800;
    const h = r.height || 500;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', onResize);

  // Animation Loop
  let reqId;
  const tempVec = new THREE.Vector3();

  function animate(now) {
    reqId = requestAnimationFrame(animate);

    // Smooth Camera Animation
    if (isAnimatingCamera) {
      const elapsed = now - animStartTime;
      const progress = Math.min(elapsed / animDuration, 1);
      const ease = easeInOutCubic(progress);

      camera.position.lerpVectors(animStartCamPos, animTargetCamPos, ease);
      controls.target.lerpVectors(animStartLookAt, animTargetLookAt, ease);

      if (progress >= 1) {
        isAnimatingCamera = false;
      }
    }

    controls.update();

    // Fire flame flicker at dusk
    if (isDusk && fireLight) {
      fireLight.intensity = 2.4 + Math.sin(now * 0.012) * 0.4 + Math.cos(now * 0.02) * 0.2;
    }

    // Hotspot 2D Screen Projections
    if (hotspotsLayer && hotspotEls.length) {
      const w = canvasWrap.clientWidth;
      const h = canvasWrap.clientHeight;

      hotspotEls.forEach((el, i) => {
        const anchor = hotspotAnchors[i];
        if (!anchor) return;

        tempVec.copy(anchor);
        tempVec.project(camera);

        // Check if point is in front of camera
        const isBehind = tempVec.z > 1.0;
        if (isBehind) {
          el.style.display = 'none';
        } else {
          el.style.display = 'flex';
          const x = (tempVec.x * 0.5 + 0.5) * w;
          const y = (-(tempVec.y * 0.5) + 0.5) * h;
          el.style.transform = `translate(${x}px, ${y}px)`;
        }
      });
    }

    renderer.render(scene, camera);
  }

  animate(performance.now());
}

// Cubic Easing function
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ============================================================================
// Procedural California Hillside Diorama Generator
// ============================================================================
function buildHillsideDiorama(group) {
  const rockMaterial = new THREE.MeshStandardMaterial({
    color: 0x3d352c,
    roughness: 0.9,
    metalness: 0.08
  });

  const soilBedrockMaterial = new THREE.MeshStandardMaterial({
    color: 0x241d18,
    roughness: 0.95,
    metalness: 0.02
  });

  const limestoneMaterial = new THREE.MeshStandardMaterial({
    color: 0xaf9d88,
    roughness: 0.8,
    metalness: 0.05
  });

  const terracePatioMaterial = new THREE.MeshStandardMaterial({
    color: 0xc8baa8,
    roughness: 0.72,
    metalness: 0.06
  });

  const woodDeckMaterial = new THREE.MeshStandardMaterial({
    color: 0x5a3d28,
    roughness: 0.65,
    metalness: 0.1
  });

  const darkWoodMaterial = new THREE.MeshStandardMaterial({
    color: 0x221812,
    roughness: 0.5,
    metalness: 0.15
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xdff5eb,
    roughness: 0.1,
    transmission: 0.75,
    thickness: 0.8,
    transparent: true,
    opacity: 0.85
  });

  const interiorGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd9aa
  });

  const grassMaterial = new THREE.MeshStandardMaterial({
    color: 0x3d5038,
    roughness: 0.85,
    metalness: 0.02
  });

  const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x1b535e,
    roughness: 0.12,
    metalness: 0.35,
    transparent: true,
    opacity: 0.88
  });

  // 1. Cross-section Base Geological Earth Block
  const baseGeo = new THREE.BoxGeometry(18, 5, 16);
  const baseMesh = new THREE.Mesh(baseGeo, soilBedrockMaterial);
  baseMesh.position.set(0, -3.5, 0);
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // 2. Stepped Hillside Landscape Levels
  // Upper Level (Elevation Y = 2 to 4)
  const upperTerrain = new THREE.Mesh(
    new THREE.BoxGeometry(11, 3.5, 9),
    grassMaterial
  );
  upperTerrain.position.set(-2.5, 1.2, -3);
  upperTerrain.receiveShadow = true;
  upperTerrain.castShadow = true;
  group.add(upperTerrain);

  // High natural ridge on top left
  const highRidge = new THREE.Mesh(
    new THREE.DodecahedronGeometry(3.6, 1),
    rockMaterial
  );
  highRidge.scale.set(1.4, 0.8, 1.2);
  highRidge.position.set(-6.5, 3.8, -4.5);
  highRidge.castShadow = true;
  highRidge.receiveShadow = true;
  group.add(highRidge);

  // Mid Terrace (Elevation Y = 0.5 to 1.5)
  const midTerrace = new THREE.Mesh(
    new THREE.BoxGeometry(13, 2, 8),
    terracePatioMaterial
  );
  midTerrace.position.set(-0.5, 0.2, 1.2);
  midTerrace.receiveShadow = true;
  group.add(midTerrace);

  // Lower Pool Terrace (Elevation Y = -0.5 to 0.2)
  const lowerTerrace = new THREE.Mesh(
    new THREE.BoxGeometry(14, 1.2, 6.5),
    terracePatioMaterial
  );
  lowerTerrace.position.set(1, -0.6, 4.5);
  lowerTerrace.receiveShadow = true;
  group.add(lowerTerrace);

  // 3. Stacked Limestone Retaining Walls
  function createRetainingWall(w, h, d, x, y, z, ry = 0) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), limestoneMaterial);
    wall.position.set(x, y, z);
    wall.rotation.y = ry;
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);
    return wall;
  }

  // Upper retaining wall
  createRetainingWall(11.5, 1.6, 0.6, -1.8, 1.8, 1.2);
  // Mid retaining wall
  createRetainingWall(12.5, 1.4, 0.6, 0.2, 0.5, 3.8);
  // Side stepped wall
  createRetainingWall(5.5, 2.2, 0.6, -6.2, 1.2, 1.5, Math.PI / 2);

  // 4. Terraced Flagstone Stairs
  for (let i = 0; i < 6; i++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, 0.65), limestoneMaterial);
    step.position.set(-4.2, 0.3 + i * 0.28, 3.2 - i * 0.55);
    step.castShadow = true;
    step.receiveShadow = true;
    group.add(step);
  }

  // 5. Contemporary Residence Architecture
  const houseGroup = new THREE.Group();
  houseGroup.position.set(-0.8, 3.0, -3.2);

  // Main villa pavilion walls
  const houseBody = new THREE.Mesh(
    new THREE.BoxGeometry(7.8, 2.4, 4.8),
    darkWoodMaterial
  );
  houseBody.castShadow = true;
  houseBody.receiveShadow = true;
  houseGroup.add(houseBody);

  // Overhanging modern low-pitch roof
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(9.2, 0.35, 6.2),
    darkWoodMaterial
  );
  roof.position.set(0, 1.35, 0.2);
  roof.rotation.z = -0.06;
  roof.castShadow = true;
  houseGroup.add(roof);

  // Floor-to-ceiling glass panoramic facade
  const glassFacade = new THREE.Mesh(
    new THREE.BoxGeometry(7.4, 2.1, 0.15),
    glassMaterial
  );
  glassFacade.position.set(0, -0.05, 2.42);
  houseGroup.add(glassFacade);

  // Warm glowing interior ceiling/wall
  const interior = new THREE.Mesh(
    new THREE.BoxGeometry(7.0, 1.8, 3.8),
    interiorGlowMaterial
  );
  interior.position.set(0, 0, 0.3);
  houseGroup.add(interior);

  // House terrace deck
  const houseDeck = new THREE.Mesh(
    new THREE.BoxGeometry(8.6, 0.3, 3.0),
    woodDeckMaterial
  );
  houseDeck.position.set(0, -1.2, 3.6);
  houseDeck.receiveShadow = true;
  houseGroup.add(houseDeck);

  group.add(houseGroup);

  // 6. Pergola & Outdoor Fire Hearth Lounge
  const pergolaGroup = new THREE.Group();
  pergolaGroup.position.set(1.5, 0.5, 2.0);

  // Pergola vertical posts
  const postGeo = new THREE.BoxGeometry(0.25, 2.2, 0.25);
  const p1 = new THREE.Mesh(postGeo, darkWoodMaterial); p1.position.set(-2, 1.1, -1.5);
  const p2 = new THREE.Mesh(postGeo, darkWoodMaterial); p2.position.set(2, 1.1, -1.5);
  const p3 = new THREE.Mesh(postGeo, darkWoodMaterial); p3.position.set(-2, 1.1, 1.5);
  const p4 = new THREE.Mesh(postGeo, darkWoodMaterial); p4.position.set(2, 1.1, 1.5);
  pergolaGroup.add(p1, p2, p3, p4);

  // Roof slats
  for (let s = -1.8; s <= 1.8; s += 0.45) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.12, 0.18), darkWoodMaterial);
    slat.position.set(0, 2.2, s);
    slat.castShadow = true;
    pergolaGroup.add(slat);
  }

  // Outdoor sectional sofa (Ivory cushions)
  const sofaMat = new THREE.MeshStandardMaterial({ color: 0xded8cc, roughness: 0.8 });
  const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.4, 1.0), darkWoodMaterial);
  sofaBase.position.set(0, 0.2, -0.9);
  const sofaCushion = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.3, 0.9), sofaMat);
  sofaCushion.position.set(0, 0.45, -0.9);
  pergolaGroup.add(sofaBase, sofaCushion);

  // Circular Stone Fire Hearth (Fire Table)
  const fireBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 0.95, 0.55, 16),
    limestoneMaterial
  );
  fireBase.position.set(0, 0.28, 0.4);
  fireBase.castShadow = true;
  pergolaGroup.add(fireBase);

  // Glowing Flame Core inside fire table
  const flameMesh = new THREE.Mesh(
    new THREE.ConeGeometry(0.4, 0.45, 8),
    new THREE.MeshBasicMaterial({ color: 0xffaa33 })
  );
  flameMesh.position.set(0, 0.65, 0.4);
  pergolaGroup.add(flameMesh);

  group.add(pergolaGroup);

  // 7. Reflection Pool & Water Feature
  const poolGroup = new THREE.Group();
  poolGroup.position.set(-0.8, -0.35, 4.4);

  // Stone pool coping frame
  const poolFrame = new THREE.Mesh(
    new THREE.BoxGeometry(5.2, 0.4, 3.2),
    limestoneMaterial
  );
  poolFrame.castShadow = true;
  poolFrame.receiveShadow = true;
  poolGroup.add(poolFrame);

  // Translucent water surface
  const waterMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 2.6),
    waterMaterial
  );
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.position.y = 0.22;
  poolGroup.add(waterMesh);

  group.add(poolGroup);

  // 8. Sculptural Olive Trees
  function createOliveTree(x, y, z, scale = 1.0) {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, y, z);
    treeGroup.scale.set(scale, scale, scale);

    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x483a2e,
      roughness: 0.9,
      metalness: 0.05
    });
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x4f614a,
      roughness: 0.82,
      metalness: 0.02
    });

    // Gnarled twisted trunk
    const trunk1 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.35, 1.8, 8), trunkMat);
    trunk1.position.y = 0.9;
    trunk1.rotation.z = 0.12;
    trunk1.castShadow = true;
    treeGroup.add(trunk1);

    const trunk2 = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.4, 7), trunkMat);
    trunk2.position.set(0.2, 2.1, 0.1);
    trunk2.rotation.z = -0.25;
    treeGroup.add(trunk2);

    // Lush organic olive foliage clusters
    const cluster1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 1), leafMat);
    cluster1.position.set(0.3, 2.8, 0);
    cluster1.scale.set(1.3, 0.9, 1.2);
    cluster1.castShadow = true;

    const cluster2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 1), leafMat);
    cluster2.position.set(-0.8, 2.4, 0.4);
    cluster2.scale.set(1.1, 0.8, 1.0);
    cluster2.castShadow = true;

    const cluster3 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.0, 1), leafMat);
    cluster3.position.set(0.6, 2.5, -0.6);
    cluster3.scale.set(1.2, 0.8, 1.1);
    cluster3.castShadow = true;

    treeGroup.add(cluster1, cluster2, cluster3);
    group.add(treeGroup);
  }

  // Olive Tree placements across the terraces
  createOliveTree(-5.2, 2.8, -1.8, 1.15); // Upper left grove
  createOliveTree(-2.5, 3.2, -4.8, 0.95); // Behind house
  createOliveTree(4.2, 1.2, -2.5, 1.25);  // Upper right vista
  createOliveTree(5.4, 0.2, 1.8, 1.1);   // Mid terrace right
  createOliveTree(-5.8, 0.6, 2.5, 0.85);  // Lower terrace left

  // 9. Native California Shrubs, Lavender & Agaves
  const shrubMat = new THREE.MeshStandardMaterial({ color: 0x3e5539, roughness: 0.85 });
  const lavenderMat = new THREE.MeshStandardMaterial({ color: 0x585a6e, roughness: 0.85 });
  const agaveMat = new THREE.MeshStandardMaterial({ color: 0x486b5e, roughness: 0.75 });

  function addShrub(x, y, z, s = 0.5, mat = shrubMat) {
    const shrub = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), mat);
    shrub.position.set(x, y + s * 0.5, z);
    shrub.scale.set(1.1, 0.75, 1.0);
    shrub.castShadow = true;
    group.add(shrub);
  }

  // Scattered native bushes along stone edges
  addShrub(-2.2, 1.8, 0.8, 0.55, lavenderMat);
  addShrub(-0.8, 1.8, 0.9, 0.45, shrubMat);
  addShrub(1.4, 1.8, 0.7, 0.5, lavenderMat);
  addShrub(3.2, 1.8, 0.8, 0.6, shrubMat);
  addShrub(-4.8, 0.5, 3.4, 0.55, agaveMat);
  addShrub(3.8, 0.5, 3.6, 0.5, agaveMat);
  addShrub(2.5, -0.4, 4.6, 0.45, lavenderMat);
  addShrub(-3.5, -0.4, 4.8, 0.55, shrubMat);

  // 10. Miniature Architectural Bollard Lights
  const bollardMat = new THREE.MeshStandardMaterial({ color: 0x1f2620, roughness: 0.5 });
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffe2b3 });

  function addBollard(x, y, z) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.35, 6), bollardMat);
    post.position.set(x, y + 0.17, z);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), bulbMat);
    bulb.position.set(x, y + 0.32, z);
    group.add(post, bulb);
  }

  addBollard(-3.2, 0.5, 2.8);
  addBollard(-2.5, 1.0, 1.8);
  addBollard(-1.8, 1.8, 1.4);
  addBollard(0.8, 0.5, 3.4);
  addBollard(3.4, 0.5, 2.8);
}
