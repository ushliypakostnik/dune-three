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
import { objectCoordsHelper, getRepeatByName } from '@/utils/utilities';

// Modules
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class Helper {
  // Private working variables
  private _is = false;
  private _number = 0;
  private _item: Mesh | Group = new THREE.Mesh();
  // private _positions: TPositions = [];
  private _position: TPosition = { x: 0, z: 0 };

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
    // self.logger.log('Helper', 'initModulesHelper', self.objects, that.name);

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
  public saveItemHelper(name: string, item: TPosition, id: number): void {
    // self.logger.log('Helper', 'saveItemHelper', self.objects);
    this._objects.push({
      id,
      name: name,
      x: item.x,
      z: item.z,
      r: 0,
      health: 100,
    });
  }

  // Помощник инициализации одного простого объекта
  public initItemHelper(
    self: ISelf,
    name: Names,
    geometry: BoxBufferGeometry,
    material: MeshLambertMaterial,
    item: TPosition,
    isStart: boolean,
  ): void {
    this._item = new THREE.Mesh(geometry, material);
    this._item.position.x = item.x * DESIGN.CELL;
    this._item.position.z = item.z * DESIGN.CELL;
    if (name !== Names.plates)
      this._item.position.y =
        OBJECTS[Names.plates].positionY + OBJECTS[Names.plates].size + 1;
    else this._item.position.y = OBJECTS[Names.plates].positionY;
    this._item.name = name;
    self.scene.add(this._item);

    // Если стартовая инициализация или добавление нового объекта - сохраняем объект
    if (isStart) this.saveItemHelper(name, item, this._item.id);
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
    this._item.position.x = item.x * DESIGN.CELL;
    this._item.position.z = item.z * DESIGN.CELL;
    this._item.position.y = OBJECTS[Names.plates].positionY;
    this._item.name = name;
    self.scene.add(this._item);

    // Если стартовая инициализация или добавление нового объекта - сохраняем объект
    if (isStart) this.saveItemHelper(name, item, this._item.id);
  }

  // Проверки

  // Есть ли плита на координатах?
  public isPlateOnCoords(self: ISelf): boolean {
    this._objects = [...self.store.getters['objects/objects'][Names.plates]];
    return !!this._objects.find(
      (object) =>
        object.x === this._position.x && object.z === this._position.z,
    );
  }

  // Есть ли постройка на координатах?
  public isBuildNotOnCoords(self: ISelf): boolean {
    this._is = true;
    CAN_BUILD.filter((name) => name !== Names.plates).forEach((name) => {
      this._objects = [...self.store.getters['objects/objects'][name]];
      if (this._objects?.length > 0) {
        this._is = this._objects.every(
          (object) =>
            !(object.x === this._position.x && object.z === this._position.z),
        );
      }
    });
    return this._is;
  }

  // Помощник добавления объекта
  public addItemHelper(
    self: ISelf,
    that: StaticModules,
    vector: Vector3,
  ): void {
    this._position = objectCoordsHelper(vector);
    self.logger.log('Helper', 'addItemHelper', that.name, this._position);
    if (
      (that.name === Names.plates && !this.isPlateOnCoords(self)) ||
      (that.name !== Names.plates &&
        this.isPlateOnCoords(self) &&
        this.isBuildNotOnCoords(self))
    ) {
      this._objects = [...self.store.getters['objects/objects'][that.name]];
      that.initItem(self, this._position, true);
      self.store.dispatch('objects/saveObjects', {
        name: that.name,
        objects: this._objects,
      });
    } else {
      if (that.name === Names.plates && this.isPlateOnCoords(self))
        self.logger.log('Helper', 'Тут плита уже есть!!!');
      else if (that.name !== Names.plates && !this.isPlateOnCoords(self))
        self.logger.log('Helper', 'Тут плиты нет!!!');
      else if (that.name !== Names.plates && !this.isBuildNotOnCoords(self)) {
        self.logger.log('Helper', 'Тут уже есть строение!!!');
      }
    }
  }

  // Доступна ли новая постройка?
  public isNewBuildingAvailableHelper(self: ISelf, name: Names): void {
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
