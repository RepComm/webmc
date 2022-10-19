
interface BlockDef {
  /**unique id of the block definition*/
  id: string;
  textures: {
    north: string;
    south: string;
    east: string;
    west: string;
    top: string;
    bottom: string;
    sides: string;
    all: string;
  },
  displayName: string;
}

interface BlockDefJson {
  blocks: Array<BlockDef>;
}

interface XYZDef {
  x: number;
  y: number;
  z: number;
}

interface FlatTexMeshDef {
  texture: string;
  origin: XYZDef;
  size: XYZDef;
  transparencyCutoff: number;
}

interface ObjDef {
  model: string;
}

interface CubeDef {
  min: XYZDef;
  size: XYZDef;
}

interface ItemDef {
  id: string;
  renderType: "flattexmesh"|"obj"|"cubes";
  flattexmesh: FlatTexMeshDef;
  obj: ObjDef;
  cubes: Array<CubeDef>;
}

interface ItemDefJson {
  items: Array<ItemDef>;
}


