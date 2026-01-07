// Debugging: Start execution
console.log("Main.js started");

try {
    // Check if libraries are loaded
    if (typeof THREE === 'undefined') throw new Error("Three.js not loaded");
    if (typeof gsap === 'undefined') throw new Error("GSAP not loaded");
    if (typeof ScrollTrigger === 'undefined') {
        console.warn("ScrollTrigger global not found, checking gsap.ScrollTrigger");
    }

    // Ensure ScrollTrigger is registered
    // Try to get ScrollTrigger from global or gsap object
    const ScrollTriggerPlugin = window.ScrollTrigger || gsap.ScrollTrigger;
    if (!ScrollTriggerPlugin) throw new Error("ScrollTrigger failed to load");

    gsap.registerPlugin(ScrollTriggerPlugin);

    // --- SCENE SETUP ---
    const canvas = document.querySelector('#webgl');
    if (!canvas) throw new Error("Canvas #webgl not found");

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
    // Switched to Standard Material for maximum compatibility
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0x444444,
        roughness: 0.4,
        metalness: 0.3,
        emissive: 0x220044,
        emissiveIntensity: 0.5
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.castShadow = true;
    core.receiveShadow = true;
    productGroup.add(core);

    // 2. Outer Abstract Rings (The "Field")
    const ringGeo = new THREE.TorusGeometry(1.2, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6 });
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
        size: 0.04,
        color: 0x88ccff,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Directional Light (Sun-like) - Always hits the object
    const mainLight = new THREE.DirectionalLight(0xffaa00, 3);
    mainLight.position.set(2, 2, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const blueLight = new THREE.PointLight(0x0044ff, 3);
    blueLight.position.set(-2, -1, 2);
    scene.add(blueLight);

    // Rim light for edge definition
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

    console.log("Main.js initialization complete");

} catch (error) {
    console.error("Critical error in main.js:", error);
    // Visual error reporting
    const errDiv = document.createElement('div');
    errDiv.style.position = 'fixed';
    errDiv.style.top = '10px';
    errDiv.style.left = '10px';
    errDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    errDiv.style.color = 'white';
    errDiv.style.padding = '20px';
    errDiv.style.zIndex = '10000';
    errDiv.style.borderRadius = '5px';
    errDiv.innerHTML = `<h3>Application Error</h3><p>${error.message}</p><small>Check console for details</small>`;
    document.body.appendChild(errDiv);
}
