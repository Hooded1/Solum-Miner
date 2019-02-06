"use strict"

var MaterialType = {
  None: "None",
  Dirt: "Dirt",
  Grass: "Grass",
  Water: "Water",
  Sand: "Sand",
  Rock: "Rock",
  Iron: "Iron",
  Oil: "Oil",
  Mud: "Mud",
  Path: "Path"
}

class Material {
  constructor(type, hardness, quantity) {
    this.type = type || MaterialType.None;
    this.hardness = hardness || 0;
    this.quantity = quantity || 0;
    this.image = undefined;
  }
}

class Chunk {
  constructor(width, height) {
    this.x = 0;
    this.y = 0;

    this.blocks = [];
    this.width = width;
    this.height = height;

    for (var x = 0; x < width; x++) {
      this.blocks[x] = [];

      for (var y = 0; y < height; y++) {
        this.blocks[x][y] = new Material(MaterialType.Dirt);
      }
    }
  }

  clone() {
    var chunk = new Chunk(this.width, this.height);
    chunk.x = this.x;
    chunk.y = this.y;
    chunk.blocks = this.blocks;
    return chunk;
  }
}