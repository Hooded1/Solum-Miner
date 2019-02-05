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