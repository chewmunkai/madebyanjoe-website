/* ANJOE — three.js product film
   A detailed glass dropper bottle (body + shoulders + neck collar + navy dropper
   cap + glass pipette + rubber bulb + wrapped ANJOE label) on a soft studio
   environment. Driven by scroll: rotates and drifts as you move through the
   ritual, with the liquid colour morphing per step. Exposes window.AnjoeHero. */
(function () {
  'use strict';

  var THREE = window.THREE;
  var TWO_PI = Math.PI * 2;
  var state = {
    renderer: null, scene: null, camera: null, group: null, vessel: null, liqMat: null,
    motes: null, raf: null, mouse: { x: 0, y: 0 }, target: { x: 0, y: 0 },
    t: 0, object: 'serum', reduced: false,
    progress: 0, progSmooth: 0, centering: 0,
    liquid: new THREE.Color('#EFB8CB'), liquidTarget: new THREE.Color('#EFB8CB'),
    envColors: ['#C9E7F2', '#FBFAF8', '#F7DCE4'],
  };

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

  // ---- soft studio environment from a vertical gradient + glints ----
  function makeEnvTexture(colors) {
    var c = document.createElement('canvas');
    c.width = 16; c.height = 256;
    var g = c.getContext('2d');
    var grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.0, colors[0]); grad.addColorStop(0.45, colors[1]); grad.addColorStop(1.0, colors[2]);
    g.fillStyle = grad; g.fillRect(0, 0, 16, 256);
    g.fillStyle = 'rgba(44,58,73,0.55)'; g.fillRect(0, 96, 16, 30);
    g.fillStyle = 'rgba(255,255,255,0.95)'; g.fillRect(0, 22, 16, 12);
    g.fillStyle = 'rgba(255,255,255,0.6)'; g.fillRect(0, 150, 16, 7);
    g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(0, 210, 16, 5);
    var tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace || tex.colorSpace;
    return tex;
  }
  function applyEnv(colors) {
    var pmrem = new THREE.PMREMGenerator(state.renderer);
    var envTex = makeEnvTexture(colors);
    state.scene.environment = pmrem.fromEquirectangular(envTex).texture;
    envTex.dispose(); pmrem.dispose();
  }

  // ---- wrapped paper label (canvas texture) ----
  function makeLabelTexture() {
    var c = document.createElement('canvas');
    c.width = 2048; c.height = 1024;
    var g = c.getContext('2d');
    g.fillStyle = '#FBFAF8'; g.fillRect(0, 0, c.width, c.height);
    // faint top/bottom hairlines across the wrap
    g.strokeStyle = 'rgba(44,58,73,0.18)'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(0, 60); g.lineTo(c.width, 60); g.moveTo(0, c.height - 60); g.lineTo(c.width, c.height - 60); g.stroke();
    // the design sits twice around the wrap so a front face always reads
    function block(cx) {
      g.textAlign = 'center';
      g.fillStyle = '#7B8794';
      g.font = '500 46px "Spline Sans Mono", monospace';
      g.fillText('S K I N   A C T I V A T I N G', cx, 250);
      g.fillStyle = '#2C3A49';
      g.font = '600 150px "Cinzel", serif';
      g.fillText('ANJOE', cx, 470);
      g.fillStyle = '#7B8794';
      g.font = '400 50px "Spline Sans Mono", monospace';
      g.fillText('RAW  BEAUTÉ', cx, 560);
      // blush rule
      g.strokeStyle = '#EFB8CB'; g.lineWidth = 5;
      g.beginPath(); g.moveTo(cx - 150, 630); g.lineTo(cx + 150, 630); g.stroke();
      g.fillStyle = '#51606E';
      g.font = '400 44px "Spline Sans Mono", monospace';
      g.fillText('ANTIOXIDANT  SERUM', cx, 730);
      g.font = '400 40px "Spline Sans Mono", monospace';
      g.fillStyle = '#7B8794';
      g.fillText('30 ML  ·  e 1.0 FL.OZ  ·  pH 5.5', cx, 800);
    }
    block(c.width * 0.25); block(c.width * 0.75);
    var tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace || tex.colorSpace;
    tex.anisotropy = 8;
    return tex;
  }

  function disposeTree(obj) {
    obj.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); });
    });
  }

  function glassMat() {
    return new THREE.MeshPhysicalMaterial({
      transmission: 0.74, thickness: 1.3, roughness: 0.09, ior: 1.46,
      metalness: 0, clearcoat: 1, clearcoatRoughness: 0.07,
      envMapIntensity: 1.4, color: new THREE.Color('#EAF4F9'),
      attenuationColor: new THREE.Color('#CFE6F1'), attenuationDistance: 1.8, side: THREE.FrontSide,
    });
  }
  function navyMat(rough) {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#2C3A49'), roughness: rough == null ? 0.55 : rough, metalness: 0.05,
      clearcoat: 0.2, clearcoatRoughness: 0.5, envMapIntensity: 0.12,
    });
  }

  // ---- detailed dropper bottle ----
  function buildDropper(slim) {
    var v = new THREE.Group();
    var R = slim ? 0.5 : 0.6;          // body radius
    var pts = [];
    function p(x, y) { pts.push(new THREE.Vector2(x, y)); }
    p(0.001, -1.12); p(R * 0.45, -1.14); p(R * 0.86, -1.12); p(R, -1.0);
    p(R, 0.42); p(R * 0.99, 0.56);     // body to shoulder start
    p(R * 0.62, 0.78); p(R * 0.40, 0.92); // sloped shoulder
    p(R * 0.36, 1.02); p(R * 0.36, 1.18); p(R * 0.37, 1.22); // neck
    var glassGeo = new THREE.LatheGeometry(pts, 128);
    glassGeo.computeVertexNormals();
    v.add(new THREE.Mesh(glassGeo, glassMat()));

    // liquid — flat meniscus fill
    var innerR = R - 0.05, fillY = 0.30, botY = -1.0;
    var liqGeo = new THREE.LatheGeometry([
      new THREE.Vector2(0.001, botY), new THREE.Vector2(innerR, botY),
      new THREE.Vector2(innerR, fillY), new THREE.Vector2(0.001, fillY)], 128);
    var liqMat = new THREE.MeshPhysicalMaterial({
      transmission: 0.12, thickness: 1.8, roughness: 0.18, ior: 1.4, metalness: 0,
      clearcoat: 0.5, clearcoatRoughness: 0.2, color: state.liquid.clone(),
      attenuationColor: state.liquid.clone(), attenuationDistance: 0.4, envMapIntensity: 0.8,
    });
    state.liqMat = liqMat;
    v.add(new THREE.Mesh(liqGeo, liqMat));

    // wrapped label
    var labelR = R + 0.004;
    var labelGeo = new THREE.CylinderGeometry(labelR, labelR, 0.62, 128, 1, true);
    var labelMat = new THREE.MeshStandardMaterial({ map: makeLabelTexture(), roughness: 0.62, metalness: 0, side: THREE.DoubleSide });
    var label = new THREE.Mesh(labelGeo, labelMat);
    label.position.y = -0.34;
    v.add(label);

    // neck collar ring (navy threaded base of dropper)
    var collarGeo = new THREE.CylinderGeometry(R * 0.42, R * 0.42, 0.30, 64);
    var collar = new THREE.Mesh(collarGeo, navyMat(0.45));
    collar.position.y = 1.30;
    v.add(collar);
    // subtle ribbed ring under collar
    var ringGeo = new THREE.TorusGeometry(R * 0.41, 0.025, 12, 64);
    var ring = new THREE.Mesh(ringGeo, navyMat(0.4));
    ring.rotation.x = Math.PI / 2; ring.position.y = 1.16;
    v.add(ring);

    // glass pipette tube descending into the liquid
    var tubeGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.7, 24);
    var tube = new THREE.Mesh(tubeGeo, glassMat());
    tube.position.y = 0.55;
    v.add(tube);

    // rubber bulb (rounded teat) on top — soft navy
    var bulbGeo = new THREE.SphereGeometry(0.18, 40, 28);
    bulbGeo.scale(1, 1.5, 1);
    var bulb = new THREE.Mesh(bulbGeo, new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#2C3A49'), roughness: 0.85, metalness: 0,
      clearcoat: 0, envMapIntensity: 0.06,
    }));
    bulb.position.y = 1.74;
    v.add(bulb);
    // bulb cap rim
    var rimGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.07, 48);
    var rim = new THREE.Mesh(rimGeo, navyMat(0.5));
    rim.position.y = 1.52;
    v.add(rim);

    return v;
  }

  function buildJar() {
    var v = new THREE.Group();
    var pts = [];
    function p(x, y) { pts.push(new THREE.Vector2(x, y)); }
    p(0.001, -0.78); p(0.78, -0.80); p(0.84, -0.66); p(0.86, 0.40);
    p(0.84, 0.58); p(0.80, 0.66); p(0.60, 0.70);
    var glassGeo = new THREE.LatheGeometry(pts, 128); glassGeo.computeVertexNormals();
    v.add(new THREE.Mesh(glassGeo, glassMat()));
    var liqMat = new THREE.MeshPhysicalMaterial({
      transmission: 0.1, thickness: 1.8, roughness: 0.25, ior: 1.4, color: state.liquid.clone(),
      attenuationColor: state.liquid.clone(), attenuationDistance: 0.4, envMapIntensity: 0.7,
    });
    state.liqMat = liqMat;
    v.add(new THREE.Mesh(new THREE.LatheGeometry([
      new THREE.Vector2(0.001, -0.66), new THREE.Vector2(0.8, -0.66),
      new THREE.Vector2(0.8, 0.34), new THREE.Vector2(0.001, 0.34)], 128), liqMat));
    var lid = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.86, 0.5, 96), navyMat(0.5));
    lid.position.y = 0.92; v.add(lid);
    var labelGeo = new THREE.CylinderGeometry(0.865, 0.865, 0.5, 128, 1, true);
    var label = new THREE.Mesh(labelGeo, new THREE.MeshStandardMaterial({ map: makeLabelTexture(), roughness: 0.6, side: THREE.DoubleSide }));
    label.position.y = -0.15; v.add(label);
    return v;
  }

  function buildBlob() {
    var v = new THREE.Group();
    var geo = new THREE.IcosahedronGeometry(0.95, 24);
    geo.userData.base = geo.attributes.position.array.slice(0);
    var blob = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({
      transmission: 1, thickness: 1.4, roughness: 0.05, ior: 1.34, metalness: 0,
      clearcoat: 0.6, clearcoatRoughness: 0.2, attenuationColor: state.liquid.clone(),
      attenuationDistance: 1.6, envMapIntensity: 1.2, color: new THREE.Color('#ffffff'),
    }));
    blob.name = 'blobMesh';
    state.liqMat = blob.material; // morph attenuation as the "liquid"
    blob._isBlobAtt = true;
    v.add(blob);
    return v;
  }

  function buildVessel() {
    if (state.vessel) { state.group.remove(state.vessel); disposeTree(state.vessel); }
    state.liqMat = null;
    var v;
    if (state.object === 'jar') v = buildJar();
    else if (state.object === 'blob') v = buildBlob();
    else v = buildDropper(state.object === 'dropper');
    state.vessel = v;
    state.group.add(v);
  }

  function buildMotes() {
    var N = 150, pos = new Float32Array(N * 3);
    for (var i = 0; i < N; i++) { pos[i*3]=(Math.random()-0.5)*9; pos[i*3+1]=(Math.random()-0.5)*6; pos[i*3+2]=(Math.random()-0.5)*4-1; }
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    state.motes = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.034, color: new THREE.Color('#A6C7D8'), transparent: true, opacity: 0.5, depthWrite: false }));
    state.scene.add(state.motes);
  }

  function init(canvas, opts) {
    opts = opts || {};
    state.reduced = !!opts.reduced;
    if (opts.liquid) { state.liquid.set(opts.liquid); state.liquidTarget.set(opts.liquid); }
    state.envColors = opts.envColors || state.envColors;
    state.object = opts.object || state.object;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (renderer.outputColorSpace !== undefined) renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    state.renderer = renderer;

    state.scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.1, 6.6); state.camera = camera;
    state.group = new THREE.Group(); state.scene.add(state.group);

    var key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(2, 3, 4); state.scene.add(key);
    var rim = new THREE.DirectionalLight(0xC9E7F2, 1.5); rim.position.set(-3, 1, -2); state.scene.add(rim);
    var fill = new THREE.DirectionalLight(0xF7DCE4, 0.8); fill.position.set(0, -2, 3); state.scene.add(fill);
    state.scene.add(new THREE.AmbientLight(0xffffff, 0.38));

    applyEnv(state.envColors);
    buildVessel();
    buildMotes();

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer);
    loop();
  }

  function resize() {
    var c = state.renderer.domElement;
    var w = c.clientWidth || (c.parentElement && c.parentElement.clientWidth);
    var h = c.clientHeight || (c.parentElement && c.parentElement.clientHeight);
    if (!w || !h) return;
    state.renderer.setSize(w, h, false);
    state.camera.aspect = w / h; state.camera.updateProjectionMatrix();
    state.wide = w > 900;
  }
  function onPointer(e) {
    state.target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    state.target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  function loop() {
    state.raf = requestAnimationFrame(loop);
    state.t += state.reduced ? 0 : 0.016;
    state.mouse.x += (state.target.x - state.mouse.x) * 0.05;
    state.mouse.y += (state.target.y - state.mouse.y) * 0.05;
    state.progSmooth += (state.progress - state.progSmooth) * 0.08;

    // liquid colour morph
    if (state.liqMat) {
      state.liquid.lerp(state.liquidTarget, 0.06);
      if (state.liqMat.color) state.liqMat.color.copy(state.liquid);
      if (state.liqMat.attenuationColor) state.liqMat.attenuationColor.copy(state.liquid);
    }

    var g = state.group, p = state.progSmooth;
    if (g) {
      // hero (p<~0.16): bottle parked right; through ritual it eases to centre + rotates
      var heroEnd = 0.16;
      var ritual = clamp01((p - heroEnd) / (1 - heroEnd));
      var baseX = state.wide ? lerp(1.05, 0.82, ritual) : 0;
      g.rotation.y = state.t * 0.12 + p * TWO_PI * 1.15 + state.mouse.x * 0.3;
      g.rotation.x = state.mouse.y * 0.1 + Math.sin(state.t * 0.5) * 0.03;
      g.rotation.z = lerp(-0.05, 0.0, ritual);
      g.position.y = Math.sin(state.t * 0.8) * 0.06 - Math.min(p, 0.16) * 1.0;
      g.position.x = baseX + state.mouse.x * 0.12;
      var s = lerp(1.0, 1.04, ritual) - Math.min(p, 0.16) * 0.25;
      g.scale.setScalar(Math.max(0.82, s));
    }

    if (state.object === 'blob' && state.vessel) {
      var mesh = state.vessel.getObjectByName('blobMesh');
      if (mesh) {
        var arr = mesh.geometry.attributes.position, base = mesh.geometry.userData.base;
        for (var i = 0; i < arr.count; i++) {
          var ix = i*3, bx = base[ix], by = base[ix+1], bz = base[ix+2];
          var n = Math.sin(bx*2+state.t*1.1)*0.06 + Math.cos(by*2.4+state.t*0.9)*0.06 + Math.sin(bz*2.2+state.t*1.3)*0.05;
          var len = Math.sqrt(bx*bx+by*by+bz*bz) || 1;
          arr.array[ix]=bx+(bx/len)*n; arr.array[ix+1]=by+(by/len)*n; arr.array[ix+2]=bz+(bz/len)*n;
        }
        arr.needsUpdate = true; mesh.geometry.computeVertexNormals();
      }
    }
    if (state.motes) {
      state.motes.rotation.y = state.t * 0.02;
      var mp = state.motes.geometry.attributes.position.array;
      for (var k = 1; k < mp.length; k += 3) { mp[k] += 0.0015; if (mp[k] > 3) mp[k] = -3; }
      state.motes.geometry.attributes.position.needsUpdate = true;
    }
    state.renderer.render(state.scene, state.camera);
  }

  // ---- public API ----
  function setObject(name) { state.object = name; if (state.scene) buildVessel(); }
  function setWash(envColors, liquid) {
    if (envColors) state.envColors = envColors;
    if (liquid) { state.liquidTarget.set(liquid); }
    if (state.scene && envColors) applyEnv(state.envColors);
  }
  function setScrollProgress(p) { state.progress = clamp01(p); }
  function setStepColor(hex) { if (hex) state.liquidTarget.set(hex); }

  window.AnjoeHero = { init: init, setObject: setObject, setWash: setWash, setScrollProgress: setScrollProgress, setStepColor: setStepColor };
})();
