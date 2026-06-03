
const canvas = document.getElementById('hero-3d-canvas');
if (!canvas) {
    console.error("Hero 3D Canvas not found!");
} else {
    init3DScene(canvas);
}

function init3DScene(canvas) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Responsive layout adjuster for 3D elements
    function adjustArtifactsLayout() {
        const aspect = window.innerWidth / window.innerHeight;
        // On narrow viewports (aspect < 1), scale objects down and bring them closer to center X
        const xFactor = aspect < 0.8 ? 0.35 : (aspect < 1.2 ? 0.65 : 1.0);
        const scaleFactor = aspect < 0.8 ? 0.55 : (aspect < 1.2 ? 0.75 : 1.0);
        
        artifacts.forEach(data => {
            data.group.position.x = (data.baseX + 2.5) * xFactor;
            data.group.scale.set(scaleFactor, scaleFactor, scaleFactor);
        });
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        adjustArtifactsLayout();
    });

    // Group to hold all objects for parallax
    const group = new THREE.Group();
    scene.add(group);

    // Premium Glass Material Settings
    const glassMaterialProps = {
        transmission: 0.95,
        opacity: 1,
        metalness: 0.1,
        roughness: 0.05,
        ior: 1.5,
        transparent: true
    };

    const artifacts = [];

    // Interactive Artifact Wrapper Function
    function createInteractiveArtifact(position, offset, speed, createGeometry) {
        const artifactGroup = new THREE.Group();
        artifactGroup.position.set(position[0] + 2.5, position[1], position[2]);
        
        createGeometry(artifactGroup);
        
        group.add(artifactGroup);
        
        const artifactData = {
            group: artifactGroup,
            baseX: position[0],
            baseY: position[1],
            baseZ: position[2],
            offset: offset,
            speed: speed,
            lift: 0,
            hovered: false,
            rotationX: Math.random() * Math.PI,
            rotationY: Math.random() * Math.PI
        };
        
        artifacts.push(artifactData);
        return artifactGroup;
    }

    // 1. Backend: Complex Wireframe Sphere (Right)
    createInteractiveArtifact([2.5, -1, -2], Math.PI / 1.5, 1.1, (parent) => {
        const outerGeo = new THREE.SphereGeometry(1.2, 32, 32);
        const outerMat = new THREE.MeshPhysicalMaterial({
            ...glassMaterialProps,
            color: new THREE.Color('#00e5ff'),
            emissive: new THREE.Color('#004d5e'),
            emissiveIntensity: 0.3,
            wireframe: true
        });
        const outerMesh = new THREE.Mesh(outerGeo, outerMat);
        
        const innerGeo = new THREE.SphereGeometry(0.5, 16, 16);
        const innerMat = new THREE.MeshPhysicalMaterial({ 
            ...glassMaterialProps, 
            color: new THREE.Color('#e0ffff'),
            emissive: new THREE.Color('#00e5ff'),
            emissiveIntensity: 0.1
        });
        const innerMesh = new THREE.Mesh(innerGeo, innerMat);
        
        parent.add(outerMesh);
        parent.add(innerMesh);
    });

    // 2. Design: Floating Icosahedron (Left)
    createInteractiveArtifact([-7.5, 2.0, -3], Math.PI / 4, 0.7, (parent) => {
        const icoGeo = new THREE.IcosahedronGeometry(1.2, 0);
        const icoMat = new THREE.MeshPhysicalMaterial({
            ...glassMaterialProps,
            color: new THREE.Color('#1de9b6'),
            emissive: new THREE.Color('#003d33'),
            emissiveIntensity: 0.3,
            wireframe: true
        });
        const icoMesh = new THREE.Mesh(icoGeo, icoMat);
        
        const innerGeo = new THREE.IcosahedronGeometry(0.5, 0);
        const innerMat = new THREE.MeshPhysicalMaterial({ 
            ...glassMaterialProps, 
            color: new THREE.Color('#e0fff8'),
            emissive: new THREE.Color('#1de9b6'),
            emissiveIntensity: 0.1
        });
        const innerMesh = new THREE.Mesh(innerGeo, innerMat);
        
        parent.add(icoMesh);
        parent.add(innerMesh);
    });

    // 3. Extra: Floating Torus Knot (Bottom Right)
    createInteractiveArtifact([4.0, -3.5, -4], Math.PI / 3, 0.9, (parent) => {
        const torusGeo = new THREE.TorusKnotGeometry(0.7, 0.2, 80, 12, 2, 3);
        const torusMat = new THREE.MeshPhysicalMaterial({
            ...glassMaterialProps,
            color: new THREE.Color('#00b8d4'),
            emissive: new THREE.Color('#003a44'),
            emissiveIntensity: 0.25,
            wireframe: true
        });
        const torusMesh = new THREE.Mesh(torusGeo, torusMat);
        parent.add(torusMesh);
    });

    // 4. Extra: Small Octahedron (Top Right)
    createInteractiveArtifact([5.0, 3.0, -3.5], Math.PI / 2, 1.3, (parent) => {
        const octGeo = new THREE.OctahedronGeometry(0.6, 0);
        const octMat = new THREE.MeshPhysicalMaterial({
            ...glassMaterialProps,
            color: new THREE.Color('#00e5ff'),
            emissive: new THREE.Color('#004d5e'),
            emissiveIntensity: 0.2,
            wireframe: true
        });
        const octMesh = new THREE.Mesh(octGeo, octMat);
        
        // Small solid core
        const coreGeo = new THREE.OctahedronGeometry(0.2, 0);
        const coreMat = new THREE.MeshPhysicalMaterial({ 
            ...glassMaterialProps, 
            color: new THREE.Color('#ffffff'),
            emissive: new THREE.Color('#00e5ff'),
            emissiveIntensity: 0.15
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        
        parent.add(octMesh);
        parent.add(coreMesh);
    });

    // 80 Drifting Data Bubbles (increased from 50)
    const particlesCount = 80;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);
    
    for (let i = 0; i < particlesCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 18;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
        sizes[i] = Math.random() * 0.04 + 0.02;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particlesMat = new THREE.PointsMaterial({
        color: 0x1de9b6,
        size: 0.05,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.8
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Secondary particles layer (cyan)
    const particles2Count = 40;
    const particles2Geo = new THREE.BufferGeometry();
    const positions2 = new Float32Array(particles2Count * 3);
    
    for (let i = 0; i < particles2Count; i++) {
        positions2[i * 3] = (Math.random() - 0.5) * 20;
        positions2[i * 3 + 1] = (Math.random() - 0.5) * 14;
        positions2[i * 3 + 2] = (Math.random() - 0.5) * 4 - 3;
    }
    particles2Geo.setAttribute('position', new THREE.BufferAttribute(positions2, 3));
    
    const particles2Mat = new THREE.PointsMaterial({
        color: 0x00e5ff,
        size: 0.03,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.5
    });
    const particles2 = new THREE.Points(particles2Geo, particles2Mat);
    scene.add(particles2);

    // Cinematic Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.15));

    const dirLight = new THREE.DirectionalLight(0x00e5ff, 2.5);
    dirLight.position.set(10, 10, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x1de9b6, 2);
    pointLight.position.set(-10, -10, -10);
    scene.add(pointLight);

    const spotLight = new THREE.SpotLight(0x00838f, 1.2, 0, 0.5, 1);
    spotLight.position.set(0, 10, 0);
    scene.add(spotLight);

    // Accent point light (warm)
    const accentLight = new THREE.PointLight(0x00b8d4, 1.5);
    accentLight.position.set(5, 5, 5);
    scene.add(accentLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        mouse.x = mouseX;
        mouse.y = mouseY;
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();
        
        // Smooth parallax
        group.rotation.y += (mouseX * 0.4 - group.rotation.y) * 0.04;
        group.rotation.x += (-mouseY * 0.4 - group.rotation.x) * 0.04;
        
        // Raycasting for hover effects
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(group.children, true);
        
        let hoveredObject = null;
        if (intersects.length > 0) {
            let object = intersects[0].object;
            while (object.parent && object.parent !== group) {
                object = object.parent;
            }
            hoveredObject = object;
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'auto';
        }
        
        // Animate artifacts with smooth damping
        artifacts.forEach(data => {
            if (data.group === hoveredObject) {
                data.lift += delta * 1.5;
            } else {
                data.lift += (0 - data.lift) * 0.04;
            }
            
            data.group.position.y = data.baseY + Math.sin(elapsedTime * data.speed + data.offset) * 0.25 + data.lift;
            
            data.rotationX += delta * 0.12;
            data.rotationY += delta * 0.18;
            data.group.rotation.x = data.rotationX;
            data.group.rotation.y = data.rotationY;
        });
        
        // Animate primary particles (floating up)
        particles.rotation.y += delta * 0.04;
        const pPositions = particles.geometry.attributes.position.array;
        for(let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            pPositions[i3 + 1] += delta * 0.25;
            if(pPositions[i3 + 1] > 6) {
                pPositions[i3 + 1] = -6;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Animate secondary particles (slow drift)
        particles2.rotation.y -= delta * 0.02;
        particles2.rotation.x += delta * 0.01;
        const p2Positions = particles2.geometry.attributes.position.array;
        for(let i = 0; i < particles2Count; i++) {
            const i3 = i * 3;
            p2Positions[i3 + 1] -= delta * 0.15;
            if(p2Positions[i3 + 1] < -7) {
                p2Positions[i3 + 1] = 7;
            }
        }
        particles2.geometry.attributes.position.needsUpdate = true;

        // Breathing light animation
        accentLight.intensity = 1.5 + Math.sin(elapsedTime * 0.8) * 0.5;
        
        renderer.render(scene, camera);
    }

    // Dynamic theme color update
    function updateThreeColors(isLight) {
        const color1 = new THREE.Color(isLight ? '#006064' : '#00e5ff');
        const color2 = new THREE.Color(isLight ? '#004d40' : '#1de9b6');
        const emissive1 = new THREE.Color(isLight ? '#00363a' : '#004d5e');
        const emissive2 = new THREE.Color(isLight ? '#00251a' : '#003d33');
        
        // Update particles colors
        particlesMat.color.set(isLight ? 0x004d40 : 0x1de9b6);
        particles2Mat.color.set(isLight ? 0x006064 : 0x00e5ff);
        
        // Update lights colors
        dirLight.color.set(isLight ? 0x00acc1 : 0x00e5ff);
        pointLight.color.set(isLight ? 0x00897b : 0x1de9b6);
        accentLight.color.set(isLight ? 0x0097a7 : 0x00b8d4);
        
        // Update materials inside our artifacts
        artifacts.forEach((artifact, index) => {
            artifact.group.traverse(child => {
                if (child.isMesh && child.material) {
                    if (index === 0 || index === 3) { // Cyan objects
                        if (child.material.wireframe) {
                            child.material.color.copy(color1);
                            child.material.emissive.copy(emissive1);
                        } else {
                            child.material.color.set(isLight ? '#e0f2f1' : '#e0ffff');
                            child.material.emissive.copy(color1);
                        }
                    } else if (index === 1) { // Emerald objects
                        if (child.material.wireframe) {
                            child.material.color.copy(color2);
                            child.material.emissive.copy(emissive2);
                        } else {
                            child.material.color.set(isLight ? '#e0f2f1' : '#e0fff8');
                            child.material.emissive.copy(color2);
                        }
                    } else { // Torus Knot
                        child.material.color.set(isLight ? '#005662' : '#00b8d4');
                        child.material.emissive.set(isLight ? '#002d33' : '#003a44');
                    }
                    child.material.needsUpdate = true;
                }
            });
        });
    }

    // Set initial colors based on current theme class on body
    const initialThemeIsLight = document.body.classList.contains('light-theme');
    updateThreeColors(initialThemeIsLight);

    // Listen to the custom themeChanged event
    document.addEventListener('themeChanged', (e) => {
        const isLight = e.detail.theme === 'light';
        updateThreeColors(isLight);
    });

    // Call layout adjuster on initial load
    adjustArtifactsLayout();

    animate();
}
