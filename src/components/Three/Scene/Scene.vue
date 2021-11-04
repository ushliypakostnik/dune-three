<template>
  <div id="scene" class="scene" />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import * as THREE from 'three';

// Constants
import { DESIGN, OBJECTS } from '@/utils/constants';

// Types
import { ISelf } from '@/models/modules';
import { PerspectiveCamera, Scene, WebGLRenderer /*, Clock */ } from 'three';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';

// Modules
// import AudioBus from '@/components/Three/Scene/AudioBus';
// import EventsBus from '@/components/Three/Scene/EventsBus';
import World from '@/components/Three/Scene/World';

// Utils
import { distance2D } from '@/utils/utilities';

// Stats
import Stats from 'three/examples/jsm/libs/stats.module';

export default defineComponent({
  name: 'Scene',

  setup() {
    let container: HTMLElement;

    let camera: PerspectiveCamera = new THREE.PerspectiveCamera();

    let scene: Scene = new THREE.Scene();

    let renderer: WebGLRenderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    let controls: MapControls = new MapControls(camera, renderer.domElement);
    let distance: number;

    // let clock: Clock = new THREE.Clock();
    // let delta: number;

    // Variables
    // let x: Vector3 = new THREE.Vector3(1, 0, 0);
    // let z: Vector3 = new THREE.Vector3(0, 0, 1);

    // Modules
    let world = new World();

    // Functions
    let init: () => void;
    let animate: () => void;
    let render: () => void;
    let change: () => void;
    let onWindowResize: () => void;

    // Stats
    let stats = Stats();

    init = () => {
      // Core

      container = document.getElementById('scene') as HTMLElement;

      // Camera

      camera = new THREE.PerspectiveCamera(
        DESIGN.CAMERA.fov,
        container.clientWidth / container.clientHeight,
        0.1,
        OBJECTS.SAND.radius,
      );

      camera.position.x = 0;
      camera.position.y = 150;
      camera.position.z = 400;

      // Scene

      scene.background = new THREE.Color(DESIGN.COLORS.blue);
      scene.fog = new THREE.Fog(
        DESIGN.CAMERA.fog,
        OBJECTS.SAND.radius / 50,
        OBJECTS.SAND.radius * 1.5,
      );

      self.scene = scene;
      self.render = render;

      // Renderer

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
      scene.add(camera);

      // Controls
      controls = new MapControls(camera, renderer.domElement);
      controls.minDistance = 50;
      controls.maxDistance = 750;
      controls.minPolarAngle = -0.15;
      controls.maxPolarAngle = Math.PI / 3;

      controls.addEventListener('change', change);
      controls.update();

      onWindowResize();
      // Listeners
      window.addEventListener(
        'resize',
        onWindowResize,
        false,
      );

      // Modules
      world.init(self);

      container.appendChild(stats.dom);

      // First render
      render();
    };

    change = () => {
      // Не выпускаем камеру слишком далеко
      distance = distance2D(0, 0, camera.position.x, camera.position.z);
      if (distance > OBJECTS.SAND.radius) {
        camera.position.x *= OBJECTS.SAND.radius / distance;
        camera.position.z *= OBJECTS.SAND.radius / distance;
      }

      render();
    };

    animate = () => {
      // delta = clock.getDelta();

      stats.update();

      world.animate(self);

      render();

      requestAnimationFrame(animate);
    };

    onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();;

      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    render = () => {
      renderer.render(scene, camera);
      // console.log('Renderer info: ', renderer.info.memory.geometries, renderer.info.memory.textures, renderer.info.render);
    };

    let self: ISelf = {
      scene,
      render,
    };

    onMounted(() => {
      init();
      animate();
    });

    return {
      onWindowResize,
    };
  },
});
</script>

<style scoped lang="stylus">
// @import "~/src/stylus/_stylebase.styl";

.scene
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  width 100vw
  height: 100vh
</style>
