// Import Three.js and GSAP from CDN (loaded via script tags in HTML)
// This will use the global THREE and gsap variables

const { ScrollTrigger } = gsap;
gsap.registerPlugin(ScrollTrigger);

// --- SCENE SETUP ---
const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);
scene.fog = new THREE.FogExp2(0x050505, 0.05);

// --- CAMERA ---
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 6;

// --- RENDERER ---
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// --- OBJECTS (The "Product") ---
const productGroup = new THREE.Group();
scene.add(productGroup);

// 1. Core Sphere (The "Brain")
const coreGeo = new THREE.SphereGeometry(0.8, 64, 64);
const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    roughness: 0.1,
    metalness: 0.8,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    emissive: 0x220033,
    emissiveIntensity: 0.2
});
const core = new THREE.Mesh(coreGeo, coreMat);
core.castShadow = true;
core.receiveShadow = true;
productGroup.add(core);

// 2. Outer Abstract Rings (The "Field")
const ringGeo = new THREE.TorusGeometry(1.2, 0.02, 16, 100);
const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
const ring1 = new THREE.Mesh(ringGeo, ringMat);
const ring2 = new THREE.Mesh(ringGeo, ringMat);
const ring3 = new THREE.Mesh(ringGeo, ringMat);

ring1.rotation.x = Math.PI / 2;
ring2.rotation.x = Math.PI / 2; ring2.rotation.y = Math.PI / 3;
ring3.rotation.x = Math.PI / 2; ring3.rotation.y = -Math.PI / 3;

productGroup.add(ring1, ring2, ring3);

// 3. Floating Particles around
const particlesCount = 200;
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
}
const particlesGeo = new THREE.BufferGeometry();
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({
    size: 0.03,
    color: 0x88ccff,
    transparent: true,
    opacity: 0.4,
    sizeAttenuation: true
});
const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
scene.add(particlesMesh);

// --- LIGHTS ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const mainSpot = new THREE.SpotLight(0xffaa00, 5);
mainSpot.position.set(2, 2, 5);
mainSpot.angle = Math.PI / 6;
mainSpot.penumbra = 0.5;
mainSpot.castShadow = true;
scene.add(mainSpot);

const blueLight = new THREE.PointLight(0x0044ff, 3);
blueLight.position.set(-2, -1, 2);
scene.add(blueLight);

const rimLight = new THREE.SpotLight(0xffffff, 5);
rimLight.position.set(0, 5, -5);
rimLight.lookAt(productGroup.position);
scene.add(rimLight);

// --- MOUSE MOVEMENT INTERACTION ---
const cursor = { x: 0, y: 0 };
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / window.innerWidth - 0.5;
    cursor.y = event.clientY / window.innerHeight - 0.5;
});

// --- SCROLL ANIMATION (GSAP) ---
camera.position.set(0, 0, 6);
productGroup.rotation.set(0, 0, 0);

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".content",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5
    }
});

// Timeline Steps
tl.to(productGroup.rotation, { x: 0.5, y: 1.5, z: 0.2, duration: 2 }, "s1")
    .to(productGroup.position, { x: -1.5, z: 1, duration: 2 }, "s1")
    .to(coreMat, { emissiveIntensity: 0.5, emissive: 0x0011ff, duration: 2 }, "s1");

tl.to(productGroup.rotation, { x: -0.5, y: 3.5, z: -0.2, duration: 2 }, "s2")
    .to(productGroup.position, { x: 1.5, y: 0.2, z: 2, duration: 2 }, "s2")
    .to(ringMat, { opacity: 0.8, color: 0x00ffff, duration: 2 }, "s2");

tl.to(productGroup.rotation, { x: 0, y: Math.PI * 2, z: 0, duration: 2 }, "s3")
    .to(productGroup.position, { x: 0, y: 0, z: 0, duration: 2 }, "s3")
    .to(coreMat, { emissive: 0xffffff, emissiveIntensity: 0.8, duration: 1 }, "s3")
    .to(ring1.scale, { x: 2, y: 2, duration: 2 }, "s3")
    .to(ring2.scale, { x: 2.2, y: 2.2, duration: 2 }, "s3")
    .to(ring3.scale, { x: 2.4, y: 2.4, duration: 2 }, "s3");

// --- TEXT REVEAL ANIMATION ---
const sections = document.querySelectorAll('.section');
sections.forEach((section) => {
    gsap.to(section, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play reverse play reverse"
        }
    });
});

// --- ANIMATION LOOP ---
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = clock.getDelta();

    // Rings rotation independently
    ring1.rotation.z = elapsedTime * 0.2;
    ring2.rotation.z = -elapsedTime * 0.15;
    ring3.rotation.z = elapsedTime * 0.1;

    // Mouse Parallax
    const parallaxX = cursor.x * 0.5;
    const parallaxY = -cursor.y * 0.5;

    camera.position.x += (parallaxX - camera.position.x) * 0.05;
    camera.position.y += (parallaxY - camera.position.y) * 0.05;

    // Particles slow drift
    particlesMesh.rotation.y = elapsedTime * 0.05;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();

// --- RESIZE ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
