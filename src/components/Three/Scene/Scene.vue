<template>
  <div id="scene" class="scene" :class="isSelection && 'scene--selection'" />
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';

import * as THREE from 'three';

// Constants
import { DESIGN, SELECTABLE_OBJECTS } from '@/utils/constants';

// Types
import { ISelf } from '@/models/modules';
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  MeshLambertMaterial,
  Mesh,
  /*, Clock */
} from 'three';
import { SelectionBox } from 'three/examples/jsm/interactive/SelectionBox';
import { SelectionHelper } from 'three/examples/jsm/interactive/SelectionHelper';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';
import { TPosition, TPositions } from '@/models/utils';
import { TObjectField } from '@/models/store';

// Modules
// import AudioBus from '@/components/Three/Scene/AudioBus';
// import EventsBus from '@/components/Three/Scene/EventsBus';
import World from '@/components/Three/Scene/World';

// Utils
import { distance2D } from '@/utils/utilities';

// Three
import { SelectionBox as Selection } from '@/components/Three/Modules/Interactive/SelectionBox';
import { SelectionHelper as Helper } from '@/components/Three/Modules/Interactive/SelectionHelper';

// Stats
import Stats from 'three/examples/jsm/libs/stats.module';

export default defineComponent({
  name: 'Scene',

  setup() {
    const store = useStore(key);

    let container: HTMLElement;

    let camera: PerspectiveCamera = new THREE.PerspectiveCamera();

    let scene: Scene = new THREE.Scene();

    let renderer: WebGLRenderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    let controls: MapControls = new MapControls(camera, renderer.domElement);
    let selection: SelectionBox;
    let helper: SelectionHelper;
    let isSelection = ref(false);

    // Utils and wokrking variables

    // let clock: Clock = new THREE.Clock();
    // let delta: number;
    // let x: Vector3 = new THREE.Vector3(1, 0, 0);
    // let z: Vector3 = new THREE.Vector3(0, 0, 1);

    let distance = 0;
    let rotate = 0;
    let material: MeshLambertMaterial = new THREE.MeshLambertMaterial();
    let mesh: Mesh = new THREE.Mesh();
    let clone: Mesh = new THREE.Mesh();
    let positions: TPositions = [];
    let position: TPosition = { x: 0, z: 0 };
    let objects: TObjectField = [];

    // Modules
    let world = new World();

    // Functions
    let init: () => void;
    let animate: () => void;
    let render: () => void;
    let change: () => void;
    let onWindowResize: () => void;
    let onKeyDown: (event: KeyboardEvent) => void;
    let onKeyUp: (event: KeyboardEvent) => void;
    let onPointerDown: (event: MouseEvent) => void;
    let onPointerMove: (event: MouseEvent) => void;
    // let onPointerUp: (event: MouseEvent) => void;

    // Store getters
    const isPause = computed(() => store.getters['layout/isPause']);

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
        DESIGN.SIZE * 0.75,
      );

      // Scene
      scene.background = new THREE.Color(DESIGN.COLORS.blue);
      scene.fog = new THREE.Fog(
        DESIGN.CAMERA.fog,
        DESIGN.SIZE / 100,
        DESIGN.SIZE * 0.75,
      );
      self.scene = scene;
      self.render = render;

      // Renderer
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.shadowMap.enabled = false;
      // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
      scene.add(camera);

      // Controls
      controls = new MapControls(camera, renderer.domElement);
      controls.minDistance = 50;
      controls.maxDistance = 750;
      controls.minPolarAngle = -0.15;
      controls.maxPolarAngle = Math.PI / 3;

      controls.addEventListener('change', change);

      if (!store.getters['layout/controls'].camera.x) {
        camera.position.x = 0;
        camera.position.y = 150;
        camera.position.z = 400;
      } else {
        camera.position.x = store.getters['layout/controls'].camera.x;
        camera.position.y = store.getters['layout/controls'].camera.y;
        camera.position.z = store.getters['layout/controls'].camera.z;
        controls.target.x = store.getters['layout/controls'].target.x;
        controls.target.y = store.getters['layout/controls'].target.y;
        controls.target.z = store.getters['layout/controls'].target.z;
      }

      controls.update();

      // Selection
      selection = new Selection(camera, scene);
      helper = new Helper(selection, renderer, 'selection');

      onWindowResize();

      // Listeners
      window.addEventListener('resize', onWindowResize, false);
      document.addEventListener('keydown', (event) => onKeyDown(event), false);
      document.addEventListener('keyup', (event) => onKeyUp(event), false);
      document.addEventListener(
        'pointerdown',
        (event) => onPointerDown(event),
        false,
      );
      document.addEventListener(
        'pointermove',
        (event) => onPointerMove(event),
        false,
      );
      /* document.addEventListener(
        'pointerup',
        (event) => onPointerUp(event),
        false,
      ); */

      // Modules
      world.init(self);

      container.appendChild(stats.dom);

      // First render
      render();
    };

    change = () => {
      // Не выпускаем камеру слишком далеко
      distance = distance2D(0, 0, camera.position.x, camera.position.z);
      if (distance > DESIGN.SIZE / 2) {
        camera.position.x *= DESIGN.SIZE / distance / 2;
        camera.position.z *= DESIGN.SIZE / distance / 2;
      }

      // TODO: для оптимизации было бы прикольно орагнизовать debouncing - чтобы вызывалось только один раз!!!
      store.dispatch('layout/saveControls', {
        camera: {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
        },
        target: {
          x: controls?.target.x,
          y: controls?.target.y,
          z: controls?.target.z,
        },
      });

      render();
    };

    onKeyDown = (event) => {
      switch (event.keyCode) {
        case 32: // Shift
          event.preventDefault();
          if (controls.enabled) {
            controls.enabled = false;
            isSelection.value = true;
          }
          break;
        default:
          break;
      }
    };

    onKeyUp = (event) => {
      switch (event.keyCode) {
        case 27: // Esc
          store.dispatch('layout/togglePause', !isPause.value);
          break;
        case 32: // Shift
          event.preventDefault();
          if (!controls.enabled) {
            controls.enabled = true;
            isSelection.value = false;
          }
          break;
        default:
          break;
      }
    };

    onPointerDown = (event) => {
      for (const item of selection.collection) {
        if (SELECTABLE_OBJECTS.includes(item.name))
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          item.material.emissive.set(DESIGN.COLORS.black);
      }

      selection.startPoint.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5,
      );
    };

    onPointerMove = (event) => {
      if (!controls.enabled && helper.isDown) {
        for (let i = 0; i < selection.collection.length; i++) {
          if (SELECTABLE_OBJECTS.includes(selection.collection[i].name))
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            selection.collection[i].material.emissive.set(DESIGN.COLORS.black);
        }

        selection.endPoint.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
          0.5,
        );

        const allSelected = selection.select();
        for (let i = 0; i < allSelected.length; i++) {
          if (SELECTABLE_OBJECTS.includes(selection.collection[i].name))
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            allSelected[i].material.emissive.set(DESIGN.COLORS.selection);
        }
      }
    };

    /* onPointerUp = (event) => {
      if (helper.isDown) {
        for (let i = 0; i < selection.collection.length; i++) {
          if (SELECTABLE_OBJECTS.includes(selection.collection[i].name))
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            selection.collection[i].material.emissive.set(DESIGN.COLORS.black);
        }

        selection.endPoint.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
          0.5,
        );

        const allSelected = selection.select();
        for (let i = 0; i < allSelected.length; i++) {
          if (SELECTABLE_OBJECTS.includes(selection.collection[i].name))
            console.log('3333333333333333333333', allSelected[i]);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          allSelected[i].material.emissive.set(DESIGN.COLORS.selection);
        }
      }
    }; */

    animate = () => {
      // delta = clock.getDelta();

      if (!isPause.value) {
        world.animate(self);

        render();
      }

      stats.update();

      requestAnimationFrame(animate);
    };

    onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    render = () => {
      renderer.render(scene, camera);
      // console.log('Renderer info: ', renderer.info.memory.geometries, renderer.info.memory.textures, renderer.info.render);
    };

    let self: ISelf = {
      store,
      scene,
      render,
      distance,
      rotate,
      material,
      mesh,
      clone,
      positions,
      position,
      objects,
    };

    onMounted(() => {
      init();
      animate();
    });

    return {
      isSelection,
    };
  },
});
</script>

<style lang="stylus">
@import "~/src/stylus/_stylebase.styl";

.scene
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  width 100vw
  height: 100vh

  &--selection
    .selection
      display block

.selection
  display none
  position: fixed
  z-index 99999
  border 1px solid $colors.bird
  background-color rgba($colors.bird, $opacites.jazz )
</style>
