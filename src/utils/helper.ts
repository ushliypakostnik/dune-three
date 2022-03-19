// Modules Helper
//////////////////////////////////////////////////////

import * as THREE from 'three';

// Constants
import {
  Names,
  Textures,
  Audios,
  DESIGN,
  OBJECTS,
  CAN_BUILD,
  BUILDS,
} from '@/utils/constants';

// Types
import type {
  Texture,
  Vector3,
  MeshStandardMaterial,
  Mesh,
  Group,
  BoxBufferGeometry,
  PlaneBufferGeometry,
  BoxGeometry,
} from 'three';
import type { Store } from 'vuex';
import type { State } from '@/store';
import type {
  ISelf,
  StaticModules,
  StaticSimpleModules,
  StaticModelModules,
} from '@/models/modules';
import type { TObjectField } from '@/models/store';
import type { TPosition, TPositions } from '@/models/utils';
import type { TObject } from '@/models/store';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// Utils
import {
  getRepeatByName,
  getGridKey,
  isNotStartPlates,
  coordsFromVector,
  getIsLoopByName,
  getGridDiffByName,
} from '@/utils/utilities';

export default class Helper {
  // Private working variables
  private _is = false;
  private _number = 0;
  private _counter = 0;
  private _item: Mesh | Group = new THREE.Mesh();
  private _position: TPosition = { x: 0, z: 0 };
  private _positions: TPositions = [];
  private _array: string[] = [];

  // Objects
  private _object?: TObject;
  private _objects: TObjectField = [];
  private _objects2: TObjectField = [];

  // Utils
  public material: MeshStandardMaterial = new THREE.MeshStandardMaterial();
  public map!: Texture;
  public geometry!: PlaneBufferGeometry | BoxGeometry;

  // Functions

  // Помощник прелодера
  public loaderDispatchHelper(store: Store<State>, field: string): void {
    store
      .dispatch('preloader/preloadOrBuilt', field)
      .then(() => {
        store.dispatch('preloader/isAllLoadedAndBuilt');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Помощник загрузки и установки текстур
  public setMapHelper(self: ISelf, name: Names | Textures): Texture {
    this._number = getRepeatByName(name);
    this.map = self.assets.textureLoader.load(
      `./images/textures/${name}.jpg`,
      () => {
        self.render();
        this.loaderDispatchHelper(self.store, `${name}IsLoaded`);
      },
    );
    this.map.repeat.set(this._number, this._number);
    this.map.wrapS = this.map.wrapT = THREE.RepeatWrapping;
    this.map.encoding = THREE.sRGBEncoding;

    return this.map;
  }

  // Помощник загрузки звуков
  public setAudioHelper(self: ISelf, name: Audios): void {
    self.assets.audioLoader.load(`./audio/${name}.mp3`, (buffer) => {
      self.audio.addAudioToHero(self, buffer, name, getIsLoopByName(name));
      this.loaderDispatchHelper(self.store, `${name}IsLoaded`);

      // Ветер
      if (name === Audios.wind) {
        this._is = self.store.getters['layout/isPause'];
        if (!this._is) {
          /* self.listener.context.resume().then(() => {
            console.log('Playback resumed successfully');
          }); */
          self.audio.startHeroSound(Audios.wind);
        }
      }
    });
  }

  public traverseHelper(self: ISelf, model: GLTF): GLTF {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model.scene.traverse((child: any) => {
      if (child.isMesh) {
        if (child.name.includes(Textures.concrette)) {
          child.material = self.assets.getMaterial(Textures.concrette);
        } else if (child.name.includes(Textures.metall2)) {
          child.material = self.assets.getMaterial(Textures.metall2);
        } else if (child.name.includes(Textures.metall)) {
          child.material = self.assets.getMaterial(Textures.metall);
        } else if (child.name.includes(Textures.glass)) {
          child.material = self.assets.getMaterial(Textures.glass);
        } else if (child.name.includes(Textures.hole)) {
          child.material = self.assets.getMaterial(Textures.hole);
        }
      }
    });

    return model;
  }

  // Помощник инициализации множественного модуля
  public initModulesHelper(
    self: ISelf,
    that: StaticModules | StaticModelModules,
  ): void {
    this._objects = [...self.store.getters['objects/objects'][that.name]];
    if (
      self.store.getters['objects/isStart'] &&
      (that.name === Names.plates || that.name === Names.command) // Плиты и командный пункт - есть на старте
    ) {
      DESIGN.START[that.name].forEach((item: TPosition) => {
        that.initItem(self, item, true);
      });
      self.store.dispatch('objects/saveObjects', {
        name: that.name,
        objects: this._objects,
      });
    } else {
      this._objects2 = [];
      this._objects.forEach((item: TObject) => {
        that.initItem(self, { x: item.data.x, z: item.data.z }, false);
      });
      self.store.dispatch('objects/saveObjects', {
        name: that.name,
        objects: this._objects2,
      });
    }

    // Прелоадер
    this.loaderDispatchHelper(self.store, `${that.name}IsBuild`);
  }

  // Помощник сохранения объекта
  private _saveItemHelper(name: Names, position: TPosition, id: string): void {
    this._objects.push({
      name,
      id,
      data: {
        x: position.x,
        z: position.z,
        r: 0,
        health: 100,
      },
    });
  }

  // Помощник перезагрузки объекта
  private _updateItemHelper(
    name: Names,
    position: TPosition,
    id: string,
  ): void {
    this._objects2.push({
      name,
      id,
      data: {
        x: position.x,
        z: position.z,
        r: 0,
        health: 100,
      },
    });
  }

  // Общее после инита
  private _afterInit(
    self: ISelf,
    name: Names,
    position: TPosition,
    isStart: boolean,
  ): void {
    // Если дефолтная инициализация или добавление нового объекта - сохраняем объект
    // если перезагрузка - обновляем uuid
    if (isStart) this._saveItemHelper(name, position, this._item.uuid);
    else this._updateItemHelper(name, position, this._item.uuid);

    this._item.name = name;
    self.scene.add(this._item);

    if (OBJECTS[name].size / DESIGN.CELL === 1) {
      self.store.dispatch('objects/setField', {
        field: 'grid',
        value: {
          name,
          position,
        },
      });
    } else {
      this._number = getGridDiffByName(name);
      for (let x = -1 * this._number; x <= this._number; ++x) {
        for (let z = -1 * this._number; z <= this._number; ++z) {
          self.store.dispatch('objects/setField', {
            field: 'grid',
            value: {
              name,
              position: { x: position.x + x, z: position.z + z },
            },
          });
        }
      }
    }
  }

  // Помощник инициализации одного простого объекта
  public initItemHelper(
    self: ISelf,
    name: Names,
    geometry: BoxBufferGeometry,
    material: MeshStandardMaterial,
    position: TPosition,
    isStart: boolean,
  ): void {
    this._item = new THREE.Mesh(geometry, material.clone());

    this._number = getGridDiffByName(name);
    this._item.position.x = (position.x + -1 * this._number) * DESIGN.CELL;
    this._item.position.z = (position.z + -1 * this._number) * DESIGN.CELL;

    if (name !== Names.plates)
      this._item.position.y =
        OBJECTS[Names.plates].positionY + OBJECTS[Names.plates].size + 1;
    else this._item.position.y = OBJECTS[Names.plates].positionY;

    this._afterInit(self, name, position, isStart);
  }

  // Помощник инициализации одного объекта из модели
  public initItemFromModelHelper(
    self: ISelf,
    name: Names,
    model: GLTF,
    position: TPosition,
    isStart: boolean,
  ): void {
    this._item = model.scene.clone();
    this._item.scale.set(0.5, 0.5, 0.5);

    this._number = name !== Names.command ? getGridDiffByName(name) : 0;
    this._item.position.x = (position.x + -1 * this._number) * DESIGN.CELL;
    this._item.position.z = (position.z + -1 * this._number) * DESIGN.CELL;
    this._item.position.y = OBJECTS[Names.plates].positionY;

    this._afterInit(self, name, position, isStart);
  }

  // Проверки

  // Есть ли плита на координатах?
  private _isNameOnCoords(self: ISelf, name: Names): boolean {
    if (
      Object.prototype.hasOwnProperty.call(
        self.store.getters['objects/grid'],
        getGridKey({ x: this._position.x, z: this._position.z }),
      )
    )
      return [
        ...self.store.getters['objects/grid'][
          getGridKey({ x: this._position.x, z: this._position.z })
        ],
      ].includes(name);
    return false;
  }

  // Есть ли постройка на координатах?
  private _isBuildNotOnCoords(self: ISelf): boolean {
    if (
      Object.prototype.hasOwnProperty.call(
        self.store.getters['objects/grid'],
        getGridKey({ x: this._position.x, z: this._position.z }),
      )
    )
      this._array = [
        ...self.store.getters['objects/grid'][
          getGridKey({ x: this._position.x, z: this._position.z })
        ],
      ];

    this._is = true;
    BUILDS.forEach((build) => {
      if (this._array.includes(build) && this._is) this._is = false;
    });
    return this._is;
    return true;
  }

  // Помощник добавления объекта
  private _add(self: ISelf, that: StaticModules | StaticSimpleModules): void {
    this._number = self.store.getters['layout/cash'];
    self.store.dispatch('layout/setField', {
      field: 'cash',
      value: this._number - OBJECTS[that.name].price,
    });
    that.initItem(self, this._position, true);
    self.store.dispatch('objects/saveObjects', {
      name: that.name,
      objects: this._objects,
    });
    self.helper._isNewBuildingAvailableHelper(self, that.name);
  }

  // Все ли плиты есть и нет нигде построек?
  private _isAllPlatesAndNotBuilds(
    self: ISelf,
    vector: Vector3,
    name: Names,
  ): boolean {
    this._is = true;
    this._number = getGridDiffByName(name);

    for (let x = -1 * this._number; x <= this._number; ++x) {
      for (let z = -1 * this._number; z <= this._number; ++z) {
        if (this._is) {
          this._position = coordsFromVector(vector);
          this._position.x += x;
          this._position.z += z;

          if (
            !(
              this._isNameOnCoords(self, Names.plates) &&
              this._isBuildNotOnCoords(self)
            )
          )
            this._is = false;
        }
      }
    }
    return this._is;
  }

  // На каких местах можно положить плиты?
  private _getCanPlateBuildArray(self: ISelf, vector: Vector3): TPositions {
    this._positions = [];
    for (let x = -1; x < 2; ++x) {
      for (let z = -1; z < 2; ++z) {
        this._position = coordsFromVector(vector);
        this._position.x += x;
        this._position.z += z;
        if (
          !this._isNameOnCoords(self, Names.plates) &&
          this._isNameOnCoords(self, Names.sands)
        )
          this._positions.push({ x: this._position.x, z: this._position.z });
      }
    }
    return this._positions;
  }

  // Можно ли добавить этот новый объект сюда?
  public isCanAddItemHelper(
    self: ISelf,
    vector: Vector3,
    name: Names,
  ): boolean {
    this._objects = [...self.store.getters['objects/objects'][name]];
    this._number = self.store.getters['layout/cash'];

    if (name === Names.plates) {
      this._positions = this._getCanPlateBuildArray(self, vector);
      if (
        this._positions.length > 0 &&
        this._positions.length * OBJECTS[Names.plates].price <= this._number
      )
        this._is = true;
      else this._is = false;
    } else {
      if (OBJECTS[name].price <= this._number) {
        this._position = coordsFromVector(vector);
        if (OBJECTS[name].size / DESIGN.CELL === 1) {
          if (
            this._isNameOnCoords(self, Names.plates) &&
            this._isBuildNotOnCoords(self)
          )
            this._is = true;
          else this._is = false;
        } else {
          if (this._isAllPlatesAndNotBuilds(self, vector, name))
            this._is = true;
          else this._is = false;
        }
      }
    }

    return this._is;
  }

  // Помощник добавления объекта
  public addItemHelper(
    self: ISelf,
    that: StaticSimpleModules | StaticModules,
    vector: Vector3,
  ): void {
    this._objects = [...self.store.getters['objects/objects'][that.name]];

    if (that.name === Names.plates) {
      this._positions = this._getCanPlateBuildArray(self, vector);
      if (this._positions.length > 0) {
        this._positions.forEach((position) => {
          this._position.x = position.x;
          this._position.z = position.z;
          this._add(self, that);
        });
      }
    } else {
      if (OBJECTS[that.name].size / DESIGN.CELL === 1) {
        if (
          this._isNameOnCoords(self, Names.plates) &&
          this._isBuildNotOnCoords(self)
        )
          this._add(self, that);
      } else {
        if (this._isAllPlatesAndNotBuilds(self, vector, that.name))
          this._add(self, that);
      }
    }
  }

  // Продажа зданий
  public sellHelper(self: ISelf, items: string[], name: Names): void {
    this._objects = [...self.store.getters['objects/objects'][name]];

    // Если плиты - убираем стартовые
    if (name === Names.plates) {
      items.forEach((id) => {
        this._object = this._objects.find((object) => object.id === id);
        if (
          this._object &&
          isNotStartPlates({ x: this._object.data.x, z: this._object.data.z })
        )
          this._array.push(this._object.id);
      });
    } else this._array = items;

    this._objects2 = [];
    this._counter = 0;
    this._array.forEach((item) => {
      this._item = self.scene.getObjectByProperty('uuid', item) as Mesh;
      if (this._item) {
        self.scene.remove(this._item);
        ++this._counter;

        this._object = this._objects.find((object) => object.id === item);
        if (this._object) {
          self.store.dispatch('objects/sellObject', {
            name,
            x: this._object.data.x,
            z: this._object.data.z,
          });
        }
      }
    });
    this._objects.forEach((object) => {
      if (!this._array.includes(object.id)) this._objects2.push(object);
    });

    this._number = self.store.getters['layout/cash'];
    self.store.dispatch('layout/setField', {
      field: 'cash',
      value: this._number + OBJECTS[name].price * this._counter,
    });
    self.store.dispatch('objects/saveObjects', {
      name,
      objects: this._objects2,
    });
    self.store.dispatch('game/setField', {
      field: 'isSelected',
      value: false,
    });
    self.store.dispatch('game/setField', {
      field: 'isSell',
      value: false,
    });
  }

  // Доступна ли новая постройка?
  private _isNewBuildingAvailableHelper(self: ISelf, name: Names): void {
    this._number = self.store.getters['layout/buildStatus'];
    this._is = this._number === CAN_BUILD.indexOf(name) + 1;
    if (this._is) {
      self.store.dispatch('layout/setField', {
        field: 'buildStatus',
        value: ++this._number,
      });
    }
  }
}
