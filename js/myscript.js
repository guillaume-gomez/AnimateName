var camera, scene, renderer;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, - 400, 600 );

    var controls = new THREE.OrbitControls( camera );
    controls.target.set( 0, 0, 0 );
    controls.update();

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xd0d0d0 );

    const loader = new THREE.FontLoader();
    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

        const color = 0x006699;

        const shapes = font.generateShapes( "hello world", 100 );
        const geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        
        const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        const position = {x: xMid, y: 0, z: 0};
       
        const lineText = writeText(color, geometry, shapes, position);

        scene.add( lineText );

    } ); //end load function

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

} // end init

function writeText(color, geometry, shapes, position) {
    const matDark = new THREE.LineBasicMaterial( {
            color: color,
            side: THREE.DoubleSide
        } );

        const matLite = new THREE.MeshBasicMaterial( {
            color: color,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        } );

        geometry.translate(position.x, position.y, position.z );

        // make shape ( N.B. edge view not visible )

        const text = new THREE.Mesh( geometry, matLite );
        text.position.z = - 150;
        scene.add( text );

        // make line shape ( N.B. edge view remains visible )

        let holeShapes = [];

        for ( let i = 0; i < shapes.length; i ++ ) {

            const shape = shapes[ i ];

            if ( shape.holes && shape.holes.length > 0 ) {

                for ( let j = 0; j < shape.holes.length; j ++ ) {

                    const hole = shape.holes[ j ];
                    holeShapes.push( hole );

                }

            }

        }

        shapes.push.apply( shapes, holeShapes );

        const lineText = new THREE.Object3D();

        for ( let i = 0; i < shapes.length; i ++ ) {
            const shape = shapes[ i ];

            const points = shape.getPoints();
            let geometry = new THREE.BufferGeometry().setFromPoints( points );

            geometry.translate(position.x, position.y, position.z );

            const lineMesh = new THREE.Line( geometry, matDark );
            lineText.add( lineMesh );
        }
    return lineText;
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    renderer.render( scene, camera );

}

