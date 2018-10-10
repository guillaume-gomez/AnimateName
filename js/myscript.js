var starViewer = {

  // variables
  camera: false,
  controls: false,
  scene: false,
  renderer: false,
  container: false,
  textlabels: [],

  onReady() {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0x651fff);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 500;

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor =  0.25;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.enableKeys = false;

    //find text from the url
    const url = new URL(window.location);
    const textToDisplay = JSON.parse(url.searchParams.get("text")).lyrics || ["example"];
    // world
    var geometry = new THREE.CylinderGeometry(0, 1, 1, 1, 1);

    for (let i = 0; i < textToDisplay.length; i++) {

      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff
      });

      let mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = getRandomInt(-500, 500);
      mesh.position.y = getRandomInt(-150, 150);
      mesh.position.z = getRandomInt(-500, -100);
      mesh.updateMatrix();
      mesh.matrixAutoUpdate = false;
      //this.scene.add(mesh);

      const addText = () => {
        const fontSize = getRandomInt(14, 22);
        //const rotationAngle = getRandomInt(0, 360);
        let text = this.createTextLabel(i * 90, fontSize);
        text.setHTML(textToDisplay[i]);
        text.setParent(mesh);
        this.textlabels.push(text);
        this.container.appendChild(text.element);
      }

      setTimeout(addText, i * 500);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.render();
    }
    animate();
  },

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  },

  render() {
    for(let i = 0; i < this.textlabels.length; i++) {
      this.textlabels[i].updatePosition();
    }
    this.renderer.render(this.scene, this.camera);
  },

  createTextLabel(rotationAngle, fontSize) {
    var div = document.createElement('div');
    div.className = 'text-label';
    div.style.position = 'absolute';
    div.style.fontSize = `${fontSize}px`;

    div.style.width = 100;
    div.style.height = 100;
    div.style.top = -1000;
    div.style.left = -1000;
    div.style.transform = `rotate(${rotationAngle}deg)`;

    var _this = this;

    return {
      element: div,
      parent: false,
      position: new THREE.Vector3(0,0,0),
      setHTML(html) {
        this.element.innerHTML = html;
      },
      setParent(threejsobj) {
        this.parent = threejsobj;
      },
      updatePosition() {
        if(parent) {
          this.position.copy(this.parent.position);
        }

        var coords2d = this.get2DCoords(this.position, _this.camera);
        this.element.style.left = coords2d.x + 'px';
        this.element.style.top = coords2d.y + 'px';
      },
      get2DCoords(position, camera) {
        var vector = position.project(camera);
        vector.x = (vector.x + 1)/2 * window.innerWidth;
        vector.y = -(vector.y - 1)/2 * window.innerHeight;
        return vector;
      }
    };
  }
};

starViewer.container = document.getElementById('container');
starViewer.onReady();
window.addEventListener('resize', function() {
  starViewer.onResize();
}, false);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}