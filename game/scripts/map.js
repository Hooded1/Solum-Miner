var _mapEnvironment = MapEnvironment = {

  initialize: (scene) => {
    _mapEnvironment.scene = scene;
    _mapEnvironment.processing = new Processing();

    var blockWidth = 64;
    var blockHeight = 64;

    var chunkWidth = 64;
    var chunkHeight = 64;

    var mapWidth = 4;
    var mapHeight = 4;

    _mapEnvironment.map.blockWidth = blockWidth;
    _mapEnvironment.map.blockHeight = blockHeight;

    _mapEnvironment.map.width = mapWidth;
    _mapEnvironment.map.height = mapHeight;

    _mapEnvironment.map.chunkWidth = chunkWidth;
    _mapEnvironment.map.chunkHeight = chunkHeight;

    var worldWidth = mapWidth * chunkWidth * blockWidth;
    var worldHeight = mapHeight * chunkHeight * blockHeight;

    //scene.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    //scene.physics.world.setBounds(0, 0, worldWidth, worldHeight);
  },

  scene: undefined,

  processing: undefined,

  chunks: [],

  chunkChanged: true,

  map: {
    width: 0,
    height: 0,
    chunkWidth: 0,
    chunkHeight: 0,
    blockWidth: 0,
    blockHeight: 0,
  },

  position: {
    x: 0,
    y: 0,
    chunkX: 0,
    chunkY: 0,
  },

  generateChunks: (seed) => {
    _mapEnvironment.processing.noiseSeed(seed);

    _mapEnvironment.chunks = [];

    for (var cx = 0; cx < _mapEnvironment.map.width; cx++) {
      _mapEnvironment.chunks[cx] = [];

      for (var cy = 0; cy < _mapEnvironment.map.height; cy++) {

        var chunk = _mapEnvironment.generateEmptyChunk();
        _mapEnvironment.chunks[cx][cy] = chunk;

        _mapEnvironment.generateChunkBlocks(chunk, cx, cy, _mapEnvironment.generateTerrainBlocks);
      }
    }
  },

  generateChunkBlocks: (chunk, x, y, chunkFunction) => {
    for (var bx = 0; bx < _mapEnvironment.map.chunkWidth; bx++) {
      for (var by = 0; by < _mapEnvironment.map.chunkHeight; by++) {

        var noiseX = ((x * _mapEnvironment.map.chunkWidth) + bx) / 10;
        var noiseY = ((y * _mapEnvironment.map.chunkHeight) + by) / 10;

        var value = _mapEnvironment.processing.noise(noiseX, noiseY);

        chunkFunction(chunk, bx, by, value);
      }
    }
  },

  generateTerrainBlocks: (chunk, x, y, value) => {
    if (value < 0.35) {
      chunk[x][y] = new Material(MaterialType.Water);
    } else if (value < 0.375) {
      chunk[x][y] = new Material(MaterialType.Mud);
    } else if (value > 0.55) {
      chunk[x][y] = new Material(MaterialType.Grass);
    }
  },

  generateResourceBlocks: (chunk, x, y, value) => {

  },

  generateEmptyChunk: () => {
    var chunk = [];

    for (var x = 0; x < _mapEnvironment.map.chunkWidth; x++) {
      chunk[x] = [];

      for (var y = 0; y < _mapEnvironment.map.chunkHeight; y++) {
        chunk[x][y] = new Material(MaterialType.Dirt);
      }
    }

    return chunk;
  },

  // update scene
  updateChunks: () => {
    if (_mapEnvironment.chunkChanged == false) return;
    _mapEnvironment.chunkChanged = false;

    var chunk = _mapEnvironment.chunks[_mapEnvironment.position.chunkX][_mapEnvironment.position.chunkY];
    _mapEnvironment.updateChunk(chunk, 0, 0);


  },

  updateChunk: (chunk, x, y) => {
    for (var bx = 0; bx < _mapEnvironment.map.chunkWidth; bx++) {
      for (var by = 0; by < _mapEnvironment.map.chunkHeight; by++) {
        var block = chunk[bx][by];

        var mapX = x + (bx * _mapEnvironment.map.blockWidth);
        var mapY = y + (by * _mapEnvironment.map.blockWidth);

        block.image = _mapEnvironment.scene.add.image(mapX, mapY, 'materials', block.type);
        block.image.scaleX = 4.1;
        block.image.scaleY = 4.1;
      }
    }
  }
}