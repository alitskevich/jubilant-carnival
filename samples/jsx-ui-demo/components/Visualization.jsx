import ui from 'jsx-ui';

const THREE = window.THREE;

export default class Visualization extends ui.Component {

    //////////////////////
    // View
    /////////////////////
    componentDidMount() {

        super.componentDidMount();

        const container = this.refs.container;

        var size = container.clientHeight || 400;

        var SCREEN_WIDTH = size;//container.clientWidth;
        var SCREEN_HEIGHT = size;//container.clientWidth;

        var camera, scene;
        var renderer;

        var character;
        var controls;

        var mouseX = 0, mouseY = 0;

        var windowHalfX = size / 2;
        var windowHalfY = size / 2;

        var clock = new THREE.Clock();

        var gui, skinConfig, morphConfig;

        document.addEventListener('mousemove', onDocumentMouseMove, false);

        init.call(this);
        animate();

        function init() {

            camera = new THREE.PerspectiveCamera(65, 1, 1, 100000);
            camera.position.set(2000, 4300, 4300);
            5
            this.scene = scene = new THREE.Scene();

            // LIGHTS

            var light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(0, 140, 500);
            light.position.multiplyScalar(1.1);
            light.color.setHSL(0.6, 0.075, 1);
            scene.add(light);

            //

            var light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(500, 1000, -1000);
            scene.add(light);

            // RENDERER

            renderer = new THREE.WebGLRenderer({antialias: true});
            renderer.setClearColor(0x2e2e2e);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
            container.appendChild(renderer.domElement);

            // CHARACTER

            character = new THREE.UCSCharacter();
            character.onLoadComplete2222 = function () {
                console.log("Load Complete");
                console.log(character.numSkins + " skins and " + character.numMorphs + " morphtargets loaded.");
                gui = new THREE.dat.GUI();
                setupSkinsGUI();
                setupMorphsGUI();
                gui.width = 300;
                gui.open();
            };

            // cylinder
            if (this.props.cylinder) {

                var skin = THREE.ImageUtils.loadTexture(this.props.cylinder);

                var geometry = new THREE.CylinderGeometry(1000, 1000, 5000, 100, 5, true, -3.14 / 2);
                var material = new THREE.MeshBasicMaterial({map: skin});
                var cylinder = new THREE.Mesh(geometry, material);
                cylinder.position.set(0, 2000, 0);
                scene.add(cylinder);
            }

            //
            //// sphere
            //var skin2 = THREE.ImageUtils.loadTexture("/png/spherical.png");
            //var geometry = new THREE.SphereGeometry( 1200, 320, 320, 3.14 );
            //var material = new THREE.MeshBasicMaterial( {map:skin2} );
            //var sphere = new THREE.Mesh( geometry, material );
            //
            //light.position.set(500, 500,12000);
            //scene.add( sphere );

            var config = {
                "baseUrl": "/png/UCS/",
                "character": "umich_ucs.js",
                "skins": ["Asian_Male.jpg", "Black_Female.jpg", "Caucasion_Female.jpg", "Caucasion_Male.jpg", "Highlighted_Muscles.jpg", "Indian_Male.jpg"],
                "morphs": ["Obesity", "Femininity", "Musculature", "Age", "Skinniness"],
                "x": 0,
                "y": -500,
                "z": -300,
                "s": 30
            };
            character.loadParts(config);
            scene.add(character.root);

            //window.addEventListener('resize', onWindowResize, false);

            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.center.set(0, 3000, 0);

            controls.addEventListener('change', render);

        }

        function setupSkinsGUI() {

            var skinGui = gui.addFolder("Skins");

            skinConfig = {
                wireframe: false
            };

            var skinCallback = function (index) {
                return function () {
                    character.setSkin(index);
                };
            };

            for (var i = 0; i < character.numSkins; i++) {
                var name = character.skins[i].name;
                skinConfig[name] = skinCallback(i);
            }

            for (var i = 0; i < character.numSkins; i++) {
                skinGui.add(skinConfig, character.skins[i].name);
            }

            skinGui.open();

        }

        function setupMorphsGUI() {

            var morphGui = gui.addFolder("Morphs");

            morphConfig = {};

            var morphCallback = function (index) {
                return function () {
                    character.updateMorphs(morphConfig);
                }
            };

            for (var i = 0; i < character.numMorphs; i++) {
                var morphName = character.morphs[i];
                morphConfig[morphName] = 0;
            }

            for (var i = 0; i < character.numMorphs; i++) {
                morphGui.add(morphConfig, character.morphs[i]).min(0).max(100).onChange(morphCallback(i));
            }

            morphGui.open();

        }

        function onWindowResize() {

            windowHalfX = SCREEN_WIDTH / 2;
            windowHalfY = SCREEN_HEIGHT / 2;

            camera.aspect = container.clientHeight / container.clientHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(container.clientHeight, container.clientHeight);

        }

        function onDocumentMouseMove(event) {

            mouseX = ( event.clientX - windowHalfX ) * 10;
            mouseY = ( event.clientY - windowHalfY ) * 10;

        }

        function animate() {

            requestAnimationFrame(animate);

            controls.update();

            render();

        }

        function render() {

            var delta = 0.75 * clock.getDelta();

            // update skinning
            character.mixer.update(delta);
            if (size != container.clientHeight) {
                size = container.clientHeight
                renderer.setSize(size, size);
            }
            renderer.render(scene, camera);

        }
    }

    render() {

        const height = this.props.height || 300;

        return (
            <div ref="container" style={{height, marginLeft:'auto', display:'flex', alignItems:'center'}}>

            </div>

        );
    }

}

