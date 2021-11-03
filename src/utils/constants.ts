// Тут главный размер, относительно которого все по ширине,
// кроме того что должно быть адекватным росту по высоте
const size = (size: number) => {
  return size * 4000;
};

export const DESIGN = {
  V: '2.5851',
  BREAKPOINTS: {
    desktop: 1025,
  },
  COLORS: {
    white: 0xffffff,
    black: 0x000000,
    blue: 0x88ccff,
    purple: 0xa48ed8,
    purpleDark: 0x8267bf,
    purpleDarken: 0x413460,
  },
  GROUND_SIZE: size(1),
  CAMERA: {
    fov: 80,
    fog: 0xa48ed8,
  },
};

export const OBJECTS = {
  SAND: {
    radius: size(1),
    positionY: 0,
  },
  TANKS: {
    size: 5,
    quantity: 10,
  }
};
