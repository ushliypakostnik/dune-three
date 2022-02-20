<template>
  <div id="scene" class="scene" :class="isSelection && 'scene--selection'" />
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';

import * as THREE from 'three';

// Constants
import { DESIGN, OBJECTS, SELECTABLE_OBJECTS } from '@/utils/constants';

// Types
import type { ISelf } from '@/models/modules';
import type {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Mesh,
  Vector2,
  Vector3,
  Raycaster,
  Intersection,
  Object3D,
  Event,
  /*, Clock */
} from 'three';
import type { SelectionBox } from 'three/examples/jsm/interactive/SelectionBox';
import type { SelectionHelper } from 'three/examples/jsm/interactive/SelectionHelper';

// Modules
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';
import Logger from '@/utils/logger';
import Helper from '@/utils/helper';

// import AudioBus from '@/components/Three/Scene/AudioBus';
// import EventsBus from '@/components/Three/Scene/EventsBus';
import World from '@/components/Three/Scene/World';

// Utils
import {
  distance2D,
  getGeometryByName,
  getPositionYByName,
} from '@/utils/utilities';

// Three examples/jsm modules
import { SelectionBox as Selection } from '@/components/Three/Modules/Interactive/SelectionBox';
import { SelectionHelper as SHelper } from '@/components/Three/Modules/Interactive/SelectionHelper';

// Stats
import Stats from 'three/examples/jsm/libs/stats.module';

export default defineComponent({
  name: 'Scene',

  setup() {
    const store = useStore(key);

    // Core

    let container: HTMLElement;

    let camera: PerspectiveCamera = new THREE.PerspectiveCamera();

    let scene: Scene = new THREE.Scene();

    let renderer: WebGLRenderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    // let clock: Clock = new THREE.Clock();
    // let delta: number;

    // Controls

    let controls: MapControls = new MapControls(camera, renderer.domElement);
    let selection: SelectionBox;
    let shelper: SelectionHelper;
    let isSelection = ref(false);
    let isCreate = ref(false);
    let pointer: Vector2 = new THREE.Vector2();
    let raycaster: Raycaster = new THREE.Raycaster();
    let intersects: Intersection<Object3D<Event>>[];
    let intersect: Intersection<Object3D<Event>>;
    let plane: Mesh = new THREE.Mesh();
    let box: Mesh = new THREE.Mesh();
    let vector: Vector3 = new THREE.Vector3();
    let distance = 0;
    let setCreate: (event: MouseEvent) => void;

    // Logger helper
    let logger: Logger = new Logger();
    let helper: Helper = new Helper();

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

    // Store getters
    const isPause = computed(() => store.getters['layout/isPause']);
    const activeBuild = computed(() => store.getters['layout/activeBuild']);

    // Stats
    let stats = Stats();

    // Go!
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
      shelper = new SHelper(selection, renderer, 'selection');

      // Create

      // Plane
      plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(
          OBJECTS.sand.radius * 10,
          OBJECTS.sand.radius * 10,
          OBJECTS.sand.radius / 10,
          OBJECTS.sand.radius / 10,
        ),
        new THREE.MeshLambertMaterial({ visible: false }),
      );
      plane.rotation.x = -Math.PI / 2;
      plane.position.set(0, OBJECTS.sand.positionY + 0.5, 0);
      plane.name = 'plane';
      scene.add(plane);

      // Create pointer
      box = new THREE.Mesh(
        getGeometryByName(activeBuild.value),
        new THREE.MeshLambertMaterial({
          color: DESIGN.COLORS.pointer,
          opacity: 0.5,
          transparent: true,
        }),
      );
      box.visible = false;
      box.position.set(
        DESIGN.CELL / 2,
        getPositionYByName(activeBuild.value),
        DESIGN.CELL / 2,
      );
      scene.add(box);

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

      // Modules
      world.init(self);

      container.appendChild(stats.dom);

      // First render
      onWindowResize();
      render();
    };

    // Controls update
    change = () => {
      // Не выпускаем камеру слишком далеко
      distance = distance2D(0, 0, camera.position.x, camera.position.z);
      if (distance > DESIGN.SIZE / 2) {
        camera.position.x *= DESIGN.SIZE / distance / 2;
        camera.position.z *= DESIGN.SIZE / distance / 2;
      }

      // TODO: для оптимизации было бы прикольно орагнизовать debouncing - чтобы вызывалось только один раз!!!
      store.dispatch('layout/setField', {
        field: 'controls',
        value: {
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
        },
      });

      render();
    };

    // Клавиша клавиатуры нажата
    onKeyDown = (event) => {
      switch (event.keyCode) {
        case 32: // Shift
          event.preventDefault();
          if (!isPause.value && controls.enabled && !isCreate.value) {
            controls.enabled = false;
            isSelection.value = true;
          }
          break;
        case 9: // Tab
          event.preventDefault();
          if (!isPause.value && controls.enabled && !isSelection.value) {
            controls.enabled = false;
            isCreate.value = true;
            box.visible = true;
            store.dispatch('layout/setField', {
              field: 'isDesignPanel',
              value: true,
            });
          }
          break;
        default:
          break;
      }
    };

    // Клавиша клавиатуры отпущена
    onKeyUp = (event) => {
      switch (event.keyCode) {
        case 27: // Esc
          store.dispatch('layout/setField', {
            field: 'isPause',
            value: !isPause.value,
          });
          break;
        case 32: // Shift
          event.preventDefault();
          if (!isPause.value && !controls.enabled && !isCreate.value) {
            controls.enabled = true;
            isSelection.value = false;
          }
          break;
        case 9: // Tab
          event.preventDefault();
          if (!isPause.value && !controls.enabled && !isSelection.value) {
            controls.enabled = true;
            isCreate.value = false;
            box.visible = false;
            store.dispatch('layout/setField', {
              field: 'isDesignPanel',
              value: false,
            });
          }
          break;
        default:
          break;
      }
    };

    // Помощник контрола конструктора
    setCreate = (event) => {
      pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      intersects = raycaster.intersectObjects([plane], false);
    };

    // Следим за активным объектом для постройки
    watch(
      () => store.getters['layout/activeBuild'],
      (value) => {
        box.geometry = getGeometryByName(value);
        box.position.y = getPositionYByName(value);
      },
    );

    // Нажатие на курсор мыши
    onPointerDown = (event) => {
      // Режим конструктора
      if (isCreate.value) {
        // Курсор не на панели?
        if (event.clientX / window.innerWidth < 77 / 100) {
          setCreate(event);

          if (intersects.length > 0) {
            intersect = intersects[0];

            switch (event.button) {
              case 0:
                if (intersect.face) {
                  vector.copy(intersect.point).add(intersect.face.normal);
                  vector
                    .divideScalar(DESIGN.CELL)
                    .floor()
                    .multiplyScalar(DESIGN.CELL)
                    .addScalar(DESIGN.CELL / 2);

                  world.add(self, activeBuild.value, vector);
                }
                break;

              /* case 2:
                // console.log('Нажата правая кнопка.');
                break; */
            }
          }
        }
      } else if (isSelection.value) {
        // Режим выделения объектов
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
      }
    };

    // Перемещение мыши
    onPointerMove = (event) => {
      // Режим конструктора
      if (isCreate.value) {
        // Курсор на панели?
        if (event.clientX / window.innerWidth > 77 / 100) {
          box.visible = false;
        } else {
          box.visible = true;
          setCreate(event);

          if (intersects.length > 0) {
            intersect = intersects[0];
            if (intersect.face) {
              box.position.copy(intersect.point).add(intersect.face.normal);
              box.position
                .divideScalar(DESIGN.CELL)
                .floor()
                .multiplyScalar(DESIGN.CELL);
              box.position.y = getPositionYByName(activeBuild.value);
            }
          }
        }
      } else if (isSelection.value && shelper.isDown) {
        // Режим выделения объектов
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
      // Utils
      logger,
      helper,

      // Core
      store,
      scene,
      render,
    };

    onMounted(() => {
      init();
      animate();
    });

    return {
      isSelection,
      isCreate,
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
  background-color rgba($colors.bird, $opacites.jazz)
</style>
