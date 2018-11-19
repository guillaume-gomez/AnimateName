  let camera, scene, renderer, container;
  let light, pointLight;
  let materials = [];
  const WIDTH = 128;
  const HEIGHT = 128;
  
  function createImgTags() {
    const previewContainer = document.getElementById('previewContainer');
    //get the gif urls from the url params
    const url = new URL(window.location);
    const convertedParams = atob(url.searchParams.get("text"));
    const urls = JSON.parse(decodeURI(convertedParams)).data || ["https://media.giphy.com/media/nXxOjZrbnbRxS/giphy.gif"];
    console.log(urls)
    for(let i = 0; i < urls.length; i++) {
      createImgTag(previewContainer, `gif${i+1}`, urls[i]);
    }
    return urls.length;
  }

  function createImgTag(parent, id, url, className = "gifClass") {
    let img = document.createElement('img');
    img.src = url;
    img.id = id;
    img.width = WIDTH;
    img.height = HEIGHT;
    img.className = className;
   // img.rel['rubbable'] = '1';
   // img.rel['auto_play'] = '1';
    parent.appendChild(img);
  }

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

    const positions = setPositions(gifs.length);
    for(let i = 0; i < positions.length; i++) {
      gifs[i].load(() => {
        //gifs[i].get_canvas().width = WIDTH;
        //gifs[i].get_canvas().height = 64;
        const gifcanvas = gifs[i].get_canvas();
        // MATERIAL
        const material = new THREE.MeshStandardMaterial({
          color: 0xffffff
        });
        material.map = new THREE.Texture( gifcanvas );
        material.displacementMap = material.map;
        materials.push(material);
        // GEOMETRY
        const geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT, WIDTH, HEIGHT);
        const mesh = new THREE.Mesh( geometry, material);
        mesh.rotation.y = Math.PI;
        mesh.position.x = positions[i].x;
        mesh.position.y = positions[i].y;
        //mesh.position.z = getRandomInt(-500, -100);
        scene.add(mesh);
      });
    }

    setInterval("update()", 30);
    update();
  }

  function setPositions(nbItems) {
    let middle = (Math.round((nbItems / 2)) * WIDTH) - WIDTH/2;
    let positions = [];
    const offset = 5;
    switch(nbItems) {
      case 3:
        middle = WIDTH - WIDTH/2;
        for(let i = 0; i < 2; i++) {
          positions.push({x: - middle + ((WIDTH + offset) * i), y: 0, z: 0});
        }
        positions.push({x: 0, y: HEIGHT + offset, z:0});
      break;
      case 1:
      case 2:
        for(let i = 0; i < nbItems; i++) {
          positions.push({x: - middle + ((WIDTH + offset) * i), y: 0, z: 0});
        }
      break;
      default:
        const itemsByRow = 4;
        const rows = Math.round(nbItems / itemsByRow);
        let middleX = (Math.round((itemsByRow / 2)) * WIDTH) - WIDTH/2;
        let middleY = (Math.round((rows / 2)) * HEIGHT) - HEIGHT/2;
        for(let row = 0; row < rows; row++) {
          for(let column = 0; column < itemsByRow; column++) {
            positions.push({x: - middleX + ((WIDTH + offset) * column), y: - middleY + row * (HEIGHT + offset), z: 0});
          }
        }
        // todo
        // add the last gifs
      break
    }
    console.log(positions)
    return positions;
  }

  function update() {
    for(let i = 0; i < materials.length; i++) {
      materials[i].map.needsUpdate = true;
    }
    render();
    controls.update(); // trackball interaction
  }
  function render() {
    renderer.clear();
    renderer.render(scene, camera);
  }

  window.onload = function() {
    const nbImages = createImgTags();
    const loadFunction = () => {
      start();
      controls.update();
    }
    setTimeout(loadFunction, nbImages * 100);
  }
