<template>
  <div id="scene" class="scene" :class="isSelection && 'scene--selection'" />
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';

import * as THREE from 'three';

// Constants
import {
  Names,
  Colors,
  Audios,
  DESIGN,
  OBJECTS,
  PSEUDO,
  CAN_BUILD,
  SELECTABLE_OBJECTS,
} from '@/utils/constants';

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
  Clock,
  AudioListener,
} from 'three';

// Modules
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';
import Helper from '@/utils/helper';
import Assets from '@/utils/assets';
import Events from '@/utils/events';
import AudioBus from '@/utils/audio';
import { SelectionBox } from 'three/examples/jsm/interactive/SelectionBox';
import { SelectionHelper } from 'three/examples/jsm/interactive/SelectionHelper';

// import AudioBus from '@/components/Scene/AudioBus';
// import EventsBus from '@/components/Scene/EventsBus';
import World from '@/components/Scene/World';

// Utils
import {
  distance2D,
  getGeometryByName,
  getPositionYByName,
  isNotStartPlates,
  coordsFromVector,
} from '@/utils/utilities';

// Stats
import Stats from 'three/examples/jsm/libs/stats.module';

export default defineComponent({
  name: 'Scene',

  setup() {
    const store = useStore(key);

    // Core

    let container: HTMLElement;

    let camera: PerspectiveCamera = new THREE.PerspectiveCamera();
    let listener: AudioListener = new THREE.AudioListener();

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
    let selected = [];
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
    let clock: Clock = new THREE.Clock(false);
    let time = 0;
    let build: Mesh = new THREE.Mesh();
    let is = true;
    let is2 = false;

    // Helpers
    let helper: Helper = new Helper();
    let assets: Assets = new Assets();
    let events: Events = new Events();
    let audio: AudioBus = new AudioBus();

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
    const isBuildingClock = computed(
      () => store.getters['game/isBuildingClock'],
    );

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

      // Audio listener
      camera.add(listener);

      // Scene
      scene.background = new THREE.Color(Colors.blue);
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
      selection = new SelectionBox(camera, scene);
      shelper = new SelectionHelper(selection, renderer, 'selection');

      // Create

      // Plane
      plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(
          OBJECTS.sand.radius * 10,
          OBJECTS.sand.radius * 10,
          OBJECTS.sand.radius / 10,
          OBJECTS.sand.radius / 10,
        ),
        new THREE.MeshStandardMaterial({ visible: false }),
      );
      plane.rotation.x = -Math.PI / 2;
      plane.position.set(0, OBJECTS.sand.positionY + 0.5, 0);
      plane.name = 'plane';
      scene.add(plane);

      // Create pointer
      box = new THREE.Mesh(
        activeBuild.value === Names.plates
          ? getGeometryByName('build')
          : getGeometryByName(activeBuild.value),
        new THREE.MeshStandardMaterial({
          color: Colors.pointer,
          opacity: 0.5,
          transparent: true,
        }),
      );
      box.visible = false;
      box.position.set(
        DESIGN.CELL / 2,
        activeBuild.value === Names.plates
          ? getPositionYByName('build')
          : getPositionYByName(activeBuild.value),
        DESIGN.CELL / 2,
      );
      scene.add(box);

      // Create building place
      build = new THREE.Mesh(
        activeBuild.value === Names.plates
          ? getGeometryByName('build')
          : getGeometryByName(activeBuild.value),
        new THREE.MeshStandardMaterial({
          color: Colors.build,
        }),
      );
      build.visible = false;
      build.position.copy(box.position);
      build.position.y +=
        CAN_BUILD.includes(activeBuild.value) &&
        activeBuild.value !== Names.plates
          ? 50
          : 0;
      scene.add(build);

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
      assets.init(self);
      audio.init(self);
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

    // Следим за паузой
    watch(
      () => store.getters['layout/isPause'],
      (value) => {
        if (value) {
          events.pause();
          if (isBuildingClock.value && clock.running) clock.stop();
        } else {
          events.start(self);
        }
        audio.toggle(value);
      },
    );

    // Следим за активным объектом для постройки
    watch(
      () => store.getters['layout/activeBuild'],
      (value) => {
        if (value === Names.plates) {
          box.geometry = getGeometryByName('build');
          box.position.y = getPositionYByName('build');
        } else {
          box.geometry = getGeometryByName(value);
          if (value === Names.walls) box.position.y = getPositionYByName(value);
          else box.position.y = getPositionYByName(value) + 20;
        }

        build.geometry = box.geometry;
        build.position.copy(box.position);

        self.audio.replayHeroSound(Audios.zero);
      },
    );

    // Следим за кнопкой продажи объектов
    watch(
      () => store.getters['game/isSell'],
      (value) => {
        if (value) {
          is = false;
          CAN_BUILD.forEach((build) => {
            selected = selection.collection
              .filter(
                (item) =>
                  item.name === build || item.name === `${PSEUDO}${build}`,
              )
              .map((item) => {
                return item.uuid;
              });
            if (selected.length > 0) {
              if (!is) is = true;
              world.sell(self, selected, build);
              self.audio.replayHeroSound(Audios.sell);
            }
          });
          if (is) self.events.messagesByIdDispatchHelper(self, 'buildingsSold');
        }
      },
    );

    // Следим за энергией
    const energy = computed(() => store.getters['layout/energy']);
    const energyNeed = computed(() => store.getters['layout/energyNeed']);
    let isEnergyMessage = false;
    watch(
      () => store.getters['layout/energy'],
      (value) => {
        if (value < energyNeed.value) {
          if (!isEnergyMessage) {
            self.events.messagesByIdDispatchHelper(self, 'buildStations');
            isEnergyMessage = true;
            setTimeout(() => {
              isEnergyMessage = false;
            }, 0);
          }
        }
      },
    );
    watch(
      () => store.getters['layout/energyNeed'],
      (value) => {
        if (energy.value < value) {
          if (!isEnergyMessage) {
            self.events.messagesByIdDispatchHelper(self, 'buildStations');
            isEnergyMessage = true;
            setTimeout(() => {
              isEnergyMessage = false;
            }, 0);
          }
        }
      },
    );

    // Следим за энергией
    const food = computed(() => store.getters['layout/food']);
    const foodNeed = computed(() => store.getters['layout/foodNeed']);
    let isFoodMessage = false;
    watch(
      () => store.getters['layout/energy'],
      (value) => {
        if (value < foodNeed.value) {
          if (!isFoodMessage) {
            self.events.messagesByIdDispatchHelper(self, 'buildPlants');
            isFoodMessage = true;
            setTimeout(() => {
              isFoodMessage = false;
            }, 0);
          }
        }
      },
    );
    watch(
      () => store.getters['layout/foodNeed'],
      (value) => {
        if (food.value < value) {
          if (!isFoodMessage) {
            self.events.messagesByIdDispatchHelper(self, 'buildPlants');
            isFoodMessage = true;
            setTimeout(() => {
              isFoodMessage = false;
            }, 0);
          }
        }
      },
    );

    // Нажатие на курсор мыши
    onPointerDown = (event) => {
      // Режим конструктора
      if (isCreate.value && !isBuildingClock.value) {
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
                  vector.x -= DESIGN.CELL / 2;
                  vector.z -= DESIGN.CELL / 2;

                  if (world.isCanAdd(self, vector, activeBuild.value)) {
                    store.dispatch('game/setField', {
                      field: 'buildingProgress',
                      value: 0,
                    });
                    store.dispatch('game/setField', {
                      field: 'isBuildingClock',
                      value: true,
                    });
                    build.position.copy(box.position);
                    box.visible = false;
                    build.visible = true;
                    self.audio.startHeroSound(Audios.build);
                  } else
                    self.events.messagesByIdDispatchHelper(
                      self,
                      'impossibleToBuild',
                    );
                  if (!isBuildingClock.value)
                    self.audio.replayHeroSound(Audios.zero);
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
            item.material.emissive.set(Colors.black);

          // Pseudo
          if (item.name.includes(PSEUDO) && !item.name.includes(Names.command))
            item.visible = false;
        }

        selection.startPoint.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
          0.5,
        );

        store.dispatch('game/setField', {
          field: 'isSelected',
          value: false,
        });
      }
    };

    // Перемещение мыши
    onPointerMove = (event) => {
      // Режим конструктора
      if (isCreate.value && !isBuildingClock.value) {
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
              box.position.y =
                activeBuild.value === Names.plates
                  ? getPositionYByName('build')
                  : getPositionYByName(activeBuild.value);
              if (
                activeBuild.value !== Names.plates &&
                activeBuild.value !== Names.walls
              )
                box.position.y += 20;
            }
          }
        }
      } else if (isSelection.value && shelper.isDown) {
        // Режим выделения объектов
        for (let i = 0; i < selection.collection.length; i++) {
          if (SELECTABLE_OBJECTS.includes(selection.collection[i].name))
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            selection.collection[i].material.emissive.set(Colors.black);

          // Pseudo
          if (
            selection.collection[i].name.includes(PSEUDO) &&
            !selection.collection[i].name.includes(Names.command)
          )
            selection.collection[i].visible = false;
        }

        selection.endPoint.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
          0.5,
        );

        selected = selection.select();
        if (selected.length > 0) {
          is2 = false;
          for (let i = 0; i < selected.length; i++) {
            is =
              selected[i].name === Names.plates &&
              !isNotStartPlates(coordsFromVector(selected[i].position))
                ? false
                : true;

            if (SELECTABLE_OBJECTS.includes(selected[i].name) && is) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              selected[i].material.emissive.set(Colors.selection);
              if (!is2) is2 = true;
            }

            // Pseudo
            if (
              selected[i].name.includes(PSEUDO) &&
              !selected[i].name.includes(Names.command)
            ) {
              selected[i].visible = true;
              if (!is2) is2 = true;
            }

            if (is2)
              store.dispatch('game/setField', {
                field: 'isSelected',
                value: true,
              });
          }
        } else {
          store.dispatch('game/setField', {
            field: 'isSelected',
            value: false,
          });
        }
      }
    };

    animate = () => {
      if (!isPause.value) {
        events.animate(self);
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

      // Счетчик строительства
      if (isBuildingClock.value) {
        if (!clock.running) clock.start();

        time += clock.getDelta();

        if (time > OBJECTS[activeBuild.value].time) {
          clock.stop();
          time = 0;
          store.dispatch('game/setField', {
            field: 'buildingProgress',
            value: 0,
          });
          store.dispatch('game/setField', {
            field: 'isBuildingClock',
            value: false,
          });
          build.visible = false;
          if (isCreate.value) box.visible = true;

          world.add(self, vector, activeBuild.value);

          self.events.messagesByIdDispatchHelper(self, 'buildDone');
          self.audio.pauseHeroSound(Audios.build);
          self.audio.replayHeroSound(Audios.add);
        } else if (time !== 0) {
          store.dispatch('game/setField', {
            field: 'buildingProgress',
            value: (time * 100) / OBJECTS[activeBuild.value].time,
          });
        }
      }
    };

    let self: ISelf = {
      // Utils
      helper,
      assets,
      events,
      audio,

      // Core
      store,
      scene,
      listener,
      render,
    };

    onMounted(() => {
      init();
      animate();

      // audio.toggle(isPause.value);
    });

    return {
      isSelection,
      isCreate,
    };
  },
});
</script>

<style lang="stylus">
.scene
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  width 100vw
  height: 100vh

  &--selection
    cursor pointer

    .selection
      display block

.selection
  display none
  position: fixed
  z-index 99999
  border 1px solid $colors.bird
  background-color rgba($colors.bird, $opacites.jazz)
</style>
