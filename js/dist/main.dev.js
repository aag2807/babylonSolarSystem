"use strict";

///  <reference path='./vendor/babylon.d.ts' />
var canvas = document.getElementById('canvas');
var engine = new BABYLON.Engine(canvas, true);

var createCamera = function createCamera(scene) {
  var camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 15, BABYLON.Vector3.Zero(), scene); //let user move camera;

  camera.attachControl(canvas);
  camera.lowerRadiusLimit = 6;
  camera.upperRadiusLimit = 20;
};

var createSun = function createSun(scene) {
  var sunMaterial = new BABYLON.StandardMaterial('sunmaterial', scene);
  sunMaterial.emissiveTexture = new BABYLON.Texture('../assets/images/sun.jpg', scene);
  sunMaterial.diffuseColor = BABYLON.Color3.Black();
  sunMaterial.specularColor = BABYLON.Color3.Black();
  var sun = BABYLON.MeshBuilder.CreateSphere('sun', {
    segments: 16,
    diameter: 4
  }, scene);
  sun.material = sunMaterial;
  var sunlight = new BABYLON.PointLight('sunlight', BABYLON.Vector3.Zero(), scene);
  sunlight.intensity = 1;
};

var createLight = function createLight(scene) {
  var light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.5;
  light.groundColor = new BABYLON.Color3(0, 0, 1);
};

var createPlanet = function createPlanet(scene) {
  var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
  var planetMaterial = new BABYLON.StandardMaterial('planetmaterial', scene);
  planetMaterial.diffuseTexture = new BABYLON.Texture('../assets/images/sand.png', scene);
  planetMaterial.specularColor = BABYLON.Color3.Black();
  var speeds = [0.01, -0.01, 0.02];

  var _loop = function _loop(i) {
    var planet = new BABYLON.MeshBuilder.CreateSphere("planet".concat(i), {
      segments: 16,
      diameter: 1
    }, scene);
    planet.position.x = 2 * i + 4;
    planet.material = planetMaterial;
    planet.orbit = {
      radius: planet.position.x,
      speed: speeds[i],
      angle: 0
    };
    scene.registerBeforeRender(function () {
      planet.position.x = planet.orbit.radius * Math.sin(planet.orbit.angle);
      planet.position.z = planet.orbit.radius * Math.cos(planet.orbit.angle);
      planet.orbit.angle += planet.orbit.speed;
    });
  };

  for (var i = 0; i < 3; i++) {
    _loop(i);
  }
};

var createSkybox = function createSkybox(scene) {
  var skyboxMaterial = new BABYLON.StandardMaterial('Skyboxmaterial', scene);
  skyboxMaterial.specularColor = BABYLON.Color3.Black();
  skyboxMaterial.diffuseColor = BABYLON.Color3.Black();
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('../assets/images/skybox/skybox', scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  var skybox = BABYLON.MeshBuilder.CreateBox('skybox', {
    size: 1000
  }, scene);
  skybox.infiniteDistance = true;
  skybox.material = skyboxMaterial;
};

var createShip = function createShip(scene) {
  BABYLON.SceneLoader.ImportMesh('', '../assets/models/', 'spaceCraft1.obj', scene, function (meshes) {
    console.log(meshes);
  });
};

var createScene = function createScene() {
  var scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color3.Black();
  createCamera(scene);
  createLight(scene);
  createSun(scene);
  createPlanet(scene);
  createSkybox(scene);
  createShip(scene);
  return scene;
};

var scene = createScene();
engine.runRenderLoop(function () {
  scene.render();
});