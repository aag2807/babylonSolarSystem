/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/main.js":
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

///  <reference path='./vendor/babylon.d.ts' />
const canvas = document.getElementById('canvas');
const engine = new BABYLON.Engine(canvas, true);

const createCamera = scene => {
  const camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 15, BABYLON.Vector3.Zero(), scene); //let user move camera;

  camera.attachControl(canvas);
  camera.lowerRadiusLimit = 6;
  camera.upperRadiusLimit = 20;
};

const createSun = scene => {
  const sunMaterial = new BABYLON.StandardMaterial('sunmaterial', scene);
  sunMaterial.emissiveTexture = new BABYLON.Texture('../assets/images/sun.jpg', scene);
  sunMaterial.diffuseColor = BABYLON.Color3.Black();
  sunMaterial.specularColor = BABYLON.Color3.Black();
  const sun = BABYLON.MeshBuilder.CreateSphere('sun', {
    segments: 16,
    diameter: 4
  }, scene);
  sun.material = sunMaterial;
  const sunlight = new BABYLON.PointLight('sunlight', BABYLON.Vector3.Zero(), scene);
  sunlight.intensity = 1;
};

const createLight = scene => {
  const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.5;
  light.groundColor = new BABYLON.Color3(0, 0, 1);
};

const createPlanet = (scene, x = 4) => {
  const planetMaterial = new BABYLON.StandardMaterial('planetmaterial', scene);
  planetMaterial.diffuseTexture = new BABYLON.Texture('../assets/images/sand.png', scene);
  planetMaterial.specularColor = BABYLON.Color3.Black();
  const speeds = [0.01, -0.01, 0.02];

  for (let i = 0; i < 3; i++) {
    const planet = new BABYLON.MeshBuilder.CreateSphere(`planet${i}`, {
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
    scene.registerBeforeRender(() => {
      planet.position.x = planet.orbit.radius * Math.sin(planet.orbit.angle);
      planet.position.z = planet.orbit.radius * Math.cos(planet.orbit.angle);
      planet.orbit.angle += planet.orbit.speed;
    });
  }
};

const createSkybox = scene => {
  const skyboxMaterial = new BABYLON.StandardMaterial('Skyboxmaterial', scene);
  skyboxMaterial.specularColor = BABYLON.Color3.Black();
  skyboxMaterial.diffuseColor = BABYLON.Color3.Black();
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('../assets/images/skybox/skybox', scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  const skybox = BABYLON.MeshBuilder.CreateBox('skybox', {
    size: 1000
  }, scene);
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

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map