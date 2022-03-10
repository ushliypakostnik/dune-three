// Modules Helper
//////////////////////////////////////////////////////

import * as THREE from 'three';

// Constants
import { Names, Textures, DESIGN, OBJECTS, CAN_BUILD } from '@/utils/constants';

// Types
import type {
  Texture,
  Vector3,
  MeshLambertMaterial,
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
  StaticModelModules,
} from '@/models/modules';
import type { TObjectField } from '@/models/store';
import type { TPosition /* TPositions */ } from '@/models/utils';
import type { TObject } from '@/models/store';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// Utils
import {
  objectCoordsHelper,
  getRepeatByName,
  getGridKey,
} from '@/utils/utilities';

// Modules
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class Helper {
  // Private working variables
  private _is = false;
  private _number = 0;
  private _array = [];
  // private _object = {};
  private _item: Mesh | Group = new THREE.Mesh();
  private _position: TPosition = { x: 0, z: 0 };
  // private _positions: TPositions = [];

  // Objects
  private _objects: TObjectField = [];

  // Utils
  public _material: MeshLambertMaterial = new THREE.MeshLambertMaterial();
  public _map!: Texture;
  public _geometry!: PlaneBufferGeometry | BoxGeometry;

  // Loaders
  public GLTFLoader: GLTFLoader;

  constructor() {
    this.GLTFLoader = new GLTFLoader();
  }

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
    this._map = new THREE.TextureLoader().load(
      `./images/textures/${name}.jpg`,
      () => {
        self.render();
        this.loaderDispatchHelper(self.store, `${name}IsLoaded`);
      },
    );
    this._map.repeat.set(this._number, this._number);
    this._map.wrapS = this._map.wrapT = THREE.RepeatWrapping;
    this._map.encoding = THREE.sRGBEncoding;

    return this._map;
  }

  public traverseHelper(self: ISelf, model: GLTF): GLTF {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model.scene.traverse((child: any) => {
      if (child.isMesh) {
        if (child.name.includes(Textures.concrette)) {
          child.material = self.assets.getMaterial(Textures.concrette);
        } else if (child.name.includes(Textures.metall)) {
          child.material = self.assets.getMaterial(Textures.metall);
        } else if (child.name.includes(Textures.glass)) {
          child.material = self.assets.getMaterial(Textures.glass);
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
    self.logger.log('Helper', 'initModulesHelper', that.name, this._objects);

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
      this._objects.forEach((item: TObject) => {
        that.initItem(self, item, false);
      });
    }

    // Прелоадер
    this.loaderDispatchHelper(self.store, `${that.name}IsBuild`);
  }

  // Помощник сохранения объекта
  private _saveItemHelper(name: Names, item: TPosition, id: number): void {
    this._objects.push({
      name,
      id,
      x: item.x,
      z: item.z,
      r: 0,
      health: 100,
    });
  }

  // Общее после инита
  private _afterInit(
    self: ISelf,
    name: Names,
    position: TPosition,
    isStart: boolean,
  ): void {
    this._item.name = name;
    self.scene.add(this._item);

    // Если стартовая инициализация или добавление нового объекта - сохраняем объект
    if (isStart) this._saveItemHelper(name, position, this._item.id);

    if (OBJECTS[name].size / DESIGN.CELL === 1) {
      self.store.dispatch('objects/setField', {
        field: 'grid',
        value: {
          name,
          position,
        },
      });
    } else {
      for (
        let x = -1 * Math.floor(OBJECTS[name].size / (DESIGN.CELL * 2));
        x <= Math.floor(OBJECTS[name].size / (DESIGN.CELL * 2));
        ++x
      ) {
        for (
          let z = -1 * Math.floor(OBJECTS[name].size / (DESIGN.CELL * 2));
          z <= Math.floor(OBJECTS[name].size / (DESIGN.CELL * 2));
          ++z
        ) {
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
    material: MeshLambertMaterial,
    position: TPosition,
    isStart: boolean,
  ): void {
    self.logger.log('Helper', 'initItemHelper', position);
    this._item = new THREE.Mesh(geometry, material.clone());
    this._item.position.x = position.x * DESIGN.CELL;
    this._item.position.z = position.z * DESIGN.CELL;
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
    item: TPosition,
    isStart: boolean,
  ): void {
    this._item = model.scene.clone();
    this._item.scale.set(0.5, 0.5, 0.5);
    this._item.position.x = item.x * DESIGN.CELL;
    this._item.position.z = item.z * DESIGN.CELL;
    this._item.position.y = OBJECTS[Names.plates].positionY;

    this._afterInit(self, name, item, isStart);
  }

  // Проверки

  // Есть ли плита на координатах?
  private _isPlateOnCoords(self: ISelf): boolean {
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
      ].includes(Names.plates);
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
      return (
        [
          ...self.store.getters['objects/grid'][
            getGridKey({ x: this._position.x, z: this._position.z })
          ],
        ].length < 2
      );
    return true;
  }

  // Помощник добавления объекта
  private _add(self: ISelf, that: StaticModules): void {
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
    for (
      let x = -1 * Math.floor(OBJECTS[name].size / (DESIGN.CELL * 2));
      x <= Math.floor(OBJECTS[name].size / (DESIGN.CELL * 2));
      ++x
    ) {
      for (
        let z = -1 * Math.floor(OBJECTS[name].size / (DESIGN.CELL * 2));
        z <= Math.floor(OBJECTS[name].size / (DESIGN.CELL * 2));
        ++z
      ) {
        if (this._is) {
          this._position = objectCoordsHelper(vector);
          this._position.x += x;
          this._position.z += z;
          if (this._isPlateOnCoords(self) && this._isBuildNotOnCoords(self))
            this._is = false;
        }
      }
    }
    return this._is;
  }

  public addItemHelper(
    self: ISelf,
    that: StaticModules,
    vector: Vector3,
  ): void {
    this._position = objectCoordsHelper(vector);
    self.logger.log('Helper', 'addItemHelper', that.name, this._position);
    if (
      (that.name === Names.plates && !this._isPlateOnCoords(self)) ||
      (that.name !== Names.plates &&
        this._isPlateOnCoords(self) &&
        this._isBuildNotOnCoords(self))
    ) {
      this._objects = [...self.store.getters['objects/objects'][that.name]];

      if (that.name === Names.plates) {
        self.logger.log(
          'Helper',
          'addItemHelper',
          'Проверяем позиции для 9ти плит!!!',
        );
        for (let x = -1; x < 2; ++x) {
          for (let z = -1; z < 2; ++z) {
            this._position = objectCoordsHelper(vector);
            this._position.x += x;
            this._position.z += z;
            if (!this._isPlateOnCoords(self)) this._add(self, that);
            else
              self.logger.log(
                'Helper',
                'addItemHelper',
                'Не хватает плит или есть строения!!!',
              );
          }
        }
      } else {
        if (OBJECTS[that.name].size / DESIGN.CELL === 1) this._add(self, that);
        else {
          if (this._isAllPlatesAndNotBuilds(self, vector, that.name))
            this._add(self, that);
        }
      }
    } else {
      if (that.name === Names.plates && this._isPlateOnCoords(self))
        self.logger.log('Helper', 'addItemHelper', 'Тут плита уже есть!!!');
      else if (that.name !== Names.plates && !this._isPlateOnCoords(self))
        self.logger.log('Helper', 'addItemHelper', 'Тут плиты нет!!!');
      else if (that.name !== Names.plates && !this._isBuildNotOnCoords(self)) {
        self.logger.log('Helper', 'addItemHelper', 'Тут уже есть строение!!!');
      }
    }
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
