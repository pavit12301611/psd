// ================================================================
// THREE.JS + WAVE CANVAS — Enhanced Background Motion
// ================================================================

let particlesMesh;

function initThreeJS() {
    const canvas = document.querySelector('#canvas3d');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, powerPreference:'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    const isMobile = window.innerWidth < 768;

    // === Main Particle Galaxy ===
    const count = isMobile ? 1500 : 5000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const vel = new Float32Array(count); // for wave motion

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const r = Math.random() * 12 + 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i3+1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i3+2] = r * Math.cos(phi);

        const c = Math.random();
        if (c < 0.4) { col[i3]=0.91; col[i3+1]=0.27; col[i3+2]=0.37; }       // #e94560
        else if (c < 0.7) { col[i3]=0.96; col[i3+1]=0.65; col[i3+2]=0.14; }   // #f5a623
        else { col[i3]=0; col[i3+1]=0.82; col[i3+2]=1; }                        // #00d2ff

        vel[i] = Math.random() * 2 + 0.5;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
        size: isMobile ? 0.025 : 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
    });

    particlesMesh = new THREE.Points(geom, mat);
    scene.add(particlesMesh);

    // === Ambient dust ===
    const dustCount = isMobile ? 500 : 2000;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i++) dustPos[i] = (Math.random()-0.5) * 40;
    const dustGeom = new THREE.BufferGeometry();
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ size:0.006, color:0xe94560, transparent:true, opacity:0.25, blending:THREE.AdditiveBlending, depthWrite:false });
    const dustMesh = new THREE.Points(dustGeom, dustMat);
    scene.add(dustMesh);

    // === Orbit rings ===
    for (let r = 0; r < 3; r++) {
        const ringGeom = new THREE.RingGeometry(4+r*2.5, 4.02+r*2.5, 128);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xe94560, transparent:true, opacity:0.04+r*0.01, side:THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = Math.PI/2 + r*0.3;
        ring.rotation.y = r*0.5;
        scene.add(ring);
    }

    // Mouse
    let mx=0, my=0, tmx=0, tmy=0;
    document.addEventListener('mousemove', e => {
        tmx = (e.clientX/window.innerWidth-0.5)*2;
        tmy = (e.clientY/window.innerHeight-0.5)*2;
    });

    // Scroll-based depth
    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.pageYOffset; }, { passive:true });

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.002;

        mx += (tmx-mx)*0.05;
        my += (tmy-my)*0.05;

        // Animate particle positions for wave effect
        const positions = geom.attributes.position.array;
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3+1] += Math.sin(time*vel[i] + positions[i3]*0.5) * 0.002;
        }
        geom.attributes.position.needsUpdate = true;

        particlesMesh.rotation.y = time*0.3 + mx*0.3;
        particlesMesh.rotation.x = my*0.15;
        particlesMesh.rotation.z = Math.sin(time)*0.08;

        dustMesh.rotation.y = -time*0.15;
        dustMesh.rotation.x = Math.sin(time*0.3)*0.05;

        // Scroll-based zoom
        const scrollScale = 1 + scrollY * 0.0003;
        particlesMesh.scale.set(scrollScale, scrollScale, scrollScale);

        // Breathing
        const breathe = 1 + Math.sin(time*2)*0.02;
        dustMesh.scale.set(breathe, breathe, breathe);

        renderer.render(scene, camera);
    }
    animate();

    let rt;
    window.addEventListener('resize', () => {
        clearTimeout(rt);
        rt = setTimeout(() => {
            camera.aspect = window.innerWidth/window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, 100);
    });
}

// ================================================================
// MATRIX RAIN
// ================================================================
function initMatrixRain() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width=window.innerWidth; canvas.height=window.innerHeight; };
    resize();

    const chars = 'PAVITSINGH01アカサタ<>{}[]∆∑Ωπ√∫≈≠∞';
    const fs = 14;
    let cols = Math.floor(canvas.width/fs);
    let drops = Array(cols).fill(0).map(()=>Math.floor(Math.random()*canvas.height/fs));

    function draw() {
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.font = fs+'px monospace';
        for (let i=0; i<drops.length; i++) {
            const c = chars[Math.floor(Math.random()*chars.length)];
            const b = Math.random();
            ctx.fillStyle = b>0.95 ? '#ffffff' : b>0.8 ? '#e94560' : `rgba(233,69,96,${0.3+b*0.5})`;
            ctx.fillText(c, i*fs, drops[i]*fs);
            if (drops[i]*fs>canvas.height && Math.random()>0.975) drops[i]=0;
            drops[i]++;
        }
    }
    setInterval(draw, 45);
    window.addEventListener('resize', () => {
        resize();
        cols = Math.floor(canvas.width/fs);
        drops = Array(cols).fill(0).map(()=>Math.floor(Math.random()*canvas.height/fs));
    });
}

// ================================================================
// WAVE CANVAS — Animated sine waves in the background
// ================================================================
function initWaveCanvas() {
    const canvas = document.getElementById('waveCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = 300;
    }
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    const waves = [
        { amplitude:40, frequency:0.015, speed:0.02, color:'rgba(233,69,96,0.3)', offset:0 },
        { amplitude:30, frequency:0.02, speed:0.015, color:'rgba(245,166,35,0.2)', offset:50 },
        { amplitude:25, frequency:0.025, speed:0.025, color:'rgba(0,210,255,0.15)', offset:100 },
        { amplitude:20, frequency:0.01, speed:0.01, color:'rgba(233,69,96,0.1)', offset:150 }
    ];

    function drawWaves() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        waves.forEach(w => {
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);
            for (let x=0; x<=canvas.width; x+=2) {
                const y = w.offset + w.amplitude * Math.sin(x*w.frequency + t*w.speed*60);
                ctx.lineTo(x, y);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.closePath();
            ctx.fillStyle = w.color;
            ctx.fill();
        });
        t += 0.016;
        requestAnimationFrame(drawWaves);
    }
    drawWaves();
}