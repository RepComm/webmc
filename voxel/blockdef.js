export let BlockType;
/**Block.data0*/

(function (BlockType) {
  BlockType[BlockType["AIR"] = 0] = "AIR";
  BlockType[BlockType["STONE"] = 1] = "STONE";
  BlockType[BlockType["DIRT"] = 2] = "DIRT";
  BlockType[BlockType["GRASS"] = 3] = "GRASS";
  BlockType[BlockType["UNKNOWN"] = 4] = "UNKNOWN";
})(BlockType || (BlockType = {}));

export let BlockShape;
/**Block.data1*/

(function (BlockShape) {
  BlockShape[BlockShape["BLOCK"] = 0] = "BLOCK";
  BlockShape[BlockShape["STAIR"] = 1] = "STAIR";
  BlockShape[BlockShape["SLAB"] = 2] = "SLAB";
  BlockShape[BlockShape["RAMP"] = 3] = "RAMP";
})(BlockShape || (BlockShape = {}));

export let VariantBlockFacing;

(function (VariantBlockFacing) {
  VariantBlockFacing[VariantBlockFacing["NORTH"] = 0] = "NORTH";
  VariantBlockFacing[VariantBlockFacing["SOUTH"] = 1] = "SOUTH";
  VariantBlockFacing[VariantBlockFacing["EAST"] = 2] = "EAST";
  VariantBlockFacing[VariantBlockFacing["WEST"] = 3] = "WEST";
})(VariantBlockFacing || (VariantBlockFacing = {}));

export let ModifierBlockFacing;

(function (ModifierBlockFacing) {
  ModifierBlockFacing[ModifierBlockFacing["UPRIGHT"] = 0] = "UPRIGHT";
  ModifierBlockFacing[ModifierBlockFacing["SIDEWAYS"] = 1] = "SIDEWAYS";
  ModifierBlockFacing[ModifierBlockFacing["UPSIDEDOWN"] = 2] = "UPSIDEDOWN";
})(ModifierBlockFacing || (ModifierBlockFacing = {}));

export let VariantSlabPlacement;

(function (VariantSlabPlacement) {
  VariantSlabPlacement[VariantSlabPlacement["TOP"] = 0] = "TOP";
  VariantSlabPlacement[VariantSlabPlacement["MIDDLE"] = 1] = "MIDDLE";
  VariantSlabPlacement[VariantSlabPlacement["BOTTOM"] = 2] = "BOTTOM";
})(VariantSlabPlacement || (VariantSlabPlacement = {}));

export let ModifierSlabPlacement;

(function (ModifierSlabPlacement) {
  ModifierSlabPlacement[ModifierSlabPlacement["UPRIGHT"] = 0] = "UPRIGHT";
  ModifierSlabPlacement[ModifierSlabPlacement["NORTHSOUTH"] = 1] = "NORTHSOUTH";
  ModifierSlabPlacement[ModifierSlabPlacement["EASTWEST"] = 2] = "EASTWEST";
})(ModifierSlabPlacement || (ModifierSlabPlacement = {}));

export const BlockTextureSlot = {
  UP: 0,
  MAIN: 0,
  SIDE: 1,
  NORTH: 1,
  SOUTH: 2,
  EAST: 3,
  WEST: 4,
  DOWN: 5
};