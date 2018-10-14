  var camera, scene, renderer, container;
  var light, pointLight, geometry, mesh;
  var uniforms, material;
  var heightmap, diffTexture, dispTexture;

  function start() {
    container = document.getElementById( 'container' );
    var sup2 = new SuperGif({ gif: document.getElementById('example2') } );
    sup2.load();
    llamacanvas = sup2.get_canvas();

    // --- WebGl render
    try {
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.autoClear = false;
        container.appendChild( renderer.domElement );
    }
    catch (e) {
        alert(e);
    }
    scene = new THREE.Scene();
    // --- Camera
    var fov = 15; // camera field-of-view in degrees
    var width = renderer.domElement.width;
    var height = renderer.domElement.height;
    var aspect = width / height; // view aspect ratio
    camera = new THREE.PerspectiveCamera( fov, aspect );
    camera.position.z = -600;
    camera.position.y = -800;
    camera.lookAt(scene.position);
    camera.updateMatrix();
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor =  0.25;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.enableKeys = false;
    controls.rotateSpeed = 3.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.addEventListener( 'change', render );
    // --- Lights

    pointLight = new THREE.PointLight( 0xffffff, 1.0 );
    scene.add( pointLight );
    pointLight.position.set(0, 100, -400);
    // MATERIAL
    material = new THREE.MeshStandardMaterial();
    material.map = new THREE.Texture( llamacanvas );
    material.displacementMap = material.map;
    // GEOMETRY
    geometry = new THREE.PlaneGeometry(256, 200, 256, 200);
    mesh = new THREE.Mesh( geometry, material);
    mesh.rotation.y = Math.PI;
    scene.add(mesh);

    setInterval("update()", 30);
    update();
  }

  function update() {
    material.map.needsUpdate = true;
    render();
    controls.update(); // trackball interaction
  }
  function render() {
    renderer.clear();
    renderer.render(scene, camera);
  }

  window.onload = function() {
    start();
    controls.update();
  }