  let camera, scene, renderer, container;
  let light, pointLight, geometry, mesh;
  let uniforms, material;
  let heightmap, diffTexture, dispTexture;

  function start() {
    container = document.getElementById( 'container' );
    gifs = [];
    gifItems = document.getElementsByClassName('gifClass');
    //load gifs from the dom
    for(let i = 0; i < gifItems.length ; i++) {
      gifs[i] = new SuperGif({ gif: gifItems[i] } );
    }

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

    const fov = 15;
    const width = renderer.domElement.width;
    const height = renderer.domElement.height;
    const aspect = width / height; // view aspect ratio
    camera = new THREE.PerspectiveCamera( fov, aspect );
    camera.position.z = -600;
    camera.position.y = -800;
    camera.lookAt(scene.position);
    camera.updateMatrix();
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor =  0.25;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableKeys = false;
    controls.rotateSpeed = 3.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.addEventListener( 'change', render );

    // --- Lights
    pointLight = new THREE.PointLight( 0xffffff, 1.0 );
    scene.add( pointLight );
    pointLight.position.set(0, 100, -800);

    console.log(gifs.length)
    for(let i = 0; i < 1; i++) {
      console.log(gifs[i])
      gifs[i].load();
      const gifcanvas = gifs[i].get_canvas();
      // MATERIAL
      material = new THREE.MeshStandardMaterial();
      material.map = new THREE.Texture( gifcanvas );
      material.displacementMap = material.map;
      // GEOMETRY
      geometry = new THREE.PlaneGeometry(64, 50, 64, 50);
      mesh = new THREE.Mesh( geometry, material);
      mesh.rotation.y = Math.PI;
      mesh.position.x = 0 + (100 * i);
      //mesh.position.y = positions[i].y;
      //mesh.position.z = positions[i].z;
      scene.add(mesh);
    }

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