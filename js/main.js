///  <reference path='./vendor/babylon.d.ts' />

const canvas = document.getElementById('canvas');

const engine = new BABYLON.Engine(canvas, true);

const createCamera = (scene) => {
    const camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 15, BABYLON.Vector3.Zero(), scene);
    //let user move camera;
    camera.attachControl(canvas);
    camera.lowerRadiusLimit = 6;
    camera.upperRadiusLimit = 20;
};

const createSun = (scene) => {
    const sunMaterial = new BABYLON.StandardMaterial('sunmaterial', scene);
    sunMaterial.emissiveTexture = new BABYLON.Texture('../assets/images/sun.jpg', scene);
    sunMaterial.diffuseColor = BABYLON.Color3.Black();
    sunMaterial.specularColor = BABYLON.Color3.Black();

    const sun = BABYLON.MeshBuilder.CreateSphere(
        'sun',
        {
            segments: 16,
            diameter: 4,
        },
        scene
    );
    sun.material = sunMaterial;

    const sunlight = new BABYLON.PointLight('sunlight', BABYLON.Vector3.Zero(), scene);
    sunlight.intensity = 1;
};

const createLight = (scene) => {
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.5;
    light.groundColor = new BABYLON.Color3(0, 0, 1);
};

const createPlanet = (scene, x = 4) => {
    const planetMaterial = new BABYLON.StandardMaterial('planetmaterial', scene);
    planetMaterial.diffuseTexture = new BABYLON.Texture('../assets/images/sand.png', scene);
    planetMaterial.specularColor = BABYLON.Color3.Black();

    const speeds = [0.01,-0.01, 0.02]
    for (let i = 0; i < 3; i++) {
        const planet = new BABYLON.MeshBuilder.CreateSphere(
            `planet${i}`,
            {
                segments: 16,
                diameter: 1,
            },
            scene
        );
        planet.position.x = (2 * i) + 4;

        planet.material = planetMaterial;
        planet.orbit = {
            radius: planet.position.x,
            speed: speeds[i],
            angle: 0,
        };

        scene.registerBeforeRender(() => {
            planet.position.x = planet.orbit.radius * Math.sin(planet.orbit.angle);
            planet.position.z = planet.orbit.radius * Math.cos(planet.orbit.angle);
            planet.orbit.angle += planet.orbit.speed;
        });
    }

};

const createSkybox = (scene) => {
    const skyboxMaterial = new BABYLON.StandardMaterial('Skyboxmaterial', scene);
    skyboxMaterial.specularColor = BABYLON.Color3.Black();
    skyboxMaterial.diffuseColor = BABYLON.Color3.Black();
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('../assets/images/skybox/skybox', scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

    const skybox = BABYLON.MeshBuilder.CreateBox(
        'skybox',
        {
            size: 1000,
        },
        scene
    );

    skybox.infiniteDistance = true;

    skybox.material = skyboxMaterial;
};

const createScene = () => {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = BABYLON.Color3.Black();

    createCamera(scene);

    createLight(scene);

    createSun(scene);

    createPlanet(scene);

    createSkybox(scene);

    return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});
