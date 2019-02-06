var _mapEnvironment = MapEnvironment = {

  initialize: (scene) => {
    _mapEnvironment.scene = scene;
    _mapEnvironment.processing = new Processing();

    var blockWidth = 64;
    var blockHeight = 64;

    var chunkWidth = 8;
    var chunkHeight = 8;

    var mapWidth = 64;
    var mapHeight = 64;

    _mapEnvironment.map.blockWidth = blockWidth;
    _mapEnvironment.map.blockHeight = blockHeight;

    _mapEnvironment.map.width = mapWidth;
    _mapEnvironment.map.height = mapHeight;

    _mapEnvironment.map.chunkWidth = chunkWidth;
    _mapEnvironment.map.chunkHeight = chunkHeight;

    var worldWidth = mapWidth * chunkWidth * blockWidth;
    var worldHeight = mapHeight * chunkHeight * blockHeight;

    _mapEnvironment.map.totalWidth = worldWidth;
    _mapEnvironment.map.totalHeight = worldHeight;

    //scene.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    //scene.physics.world.setBounds(0, 0, worldWidth, worldHeight);
  },

  scene: undefined,

  processing: undefined,

  chunks: [],

  loadedChunks: [],

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
    if (seed) {
      _mapEnvironment.processing.noiseSeed(seed);
    }

    _mapEnvironment.chunks = [];

    for (var cx = 0; cx < _mapEnvironment.map.width; cx++) {
      _mapEnvironment.chunks[cx] = [];

      for (var cy = 0; cy < _mapEnvironment.map.height; cy++) {

        var chunk = new Chunk(_mapEnvironment.map.chunkWidth, _mapEnvironment.map.chunkHeight);
        _mapEnvironment.chunks[cx][cy] = chunk;

        chunk.x = cx * _mapEnvironment.map.chunkWidth * _mapEnvironment.map.blockWidth;
        chunk.y = cy * _mapEnvironment.map.chunkHeight * _mapEnvironment.map.blockHeight;

        _mapEnvironment.generateChunkBlocks(chunk, cx, cy, _mapEnvironment.generateTerrainBlocks);
      }
    }
  },

  generateChunkBlocks: (chunk, x, y, chunkFunction) => {
    for (var bx = 0; bx < _mapEnvironment.map.chunkWidth; bx++) {
      for (var by = 0; by < _mapEnvironment.map.chunkHeight; by++) {

        var noiseX = ((x * _mapEnvironment.map.chunkWidth) + bx) / 25;
        var noiseY = ((y * _mapEnvironment.map.chunkHeight) + by) / 25;

        var value = _mapEnvironment.processing.noise(noiseX, noiseY);

        chunkFunction(chunk, bx, by, value);
      }
    }
  },

  generateTerrainBlocks: (chunk, x, y, value) => {
    if (value < 0.35) {
      chunk.blocks[x][y] = new Material(MaterialType.Water);
    } else if (value < 0.375) {
      chunk.blocks[x][y] = new Material(MaterialType.Mud);
    } else if (value > 0.55) {
      chunk.blocks[x][y] = new Material(MaterialType.Grass);
    }
  },

  generateResourceBlocks: (chunk, x, y, value) => {

  },

  updatePosition: (x, y) => {
    _mapEnvironment.position.x = x;
    _mapEnvironment.position.y = y;

    var chunkX = Math.floor(x / _mapEnvironment.map.chunkWidth);
    var chunkY = Math.floor(y / _mapEnvironment.map.chunkHeight);

    if (chunkX != _mapEnvironment.position.chunkX || chunkY != _mapEnvironment.position.chunkY) {
      _mapEnvironment.position.chunkX = chunkX;
      _mapEnvironment.position.chunkY = chunkY;

      _mapEnvironment.updateChunks();
    }
  },

  // update scene
  updateChunks: () => {

    for (var i = 0; i < _mapEnvironment.loadedChunks.length; i++) {
      _mapEnvironment.destroyChunk(_mapEnvironment.loadedChunks[i]);
    }

    var loadedChunks = [];
    var centerChunk = _mapEnvironment.chunks[_mapEnvironment.position.chunkX][_mapEnvironment.position.chunkY];

    for (var x = _mapEnvironment.position.chunkX - 1; x <= _mapEnvironment.position.chunkX + 1; x++) {
      for (var y = _mapEnvironment.position.chunkY - 1; y <= _mapEnvironment.position.chunkY + 1; y++) {

        var cx = x;
        var cy = y;

        var offsetTop = false;
        var offsetLeft = false;
        var offsetRight = false;
        var offsetBottom = false;

        if (cx < 0) {
          cx += _mapEnvironment.map.width;
          offsetLeft = true;
        }
        if (cx >= _mapEnvironment.map.width) {
          cx -= _mapEnvironment.map.width;
          offsetRight = true;
        }

        if (cy < 0) {
          cy += _mapEnvironment.map.height;
          offsetTop = true;
        }
        if (cy >= _mapEnvironment.map.height) {
          cy -= _mapEnvironment.map.height;
          offsetBottom = true;
        }

        var chunk = _mapEnvironment.chunks[cx][cy];

        var hasOffset = (offsetTop || offsetBottom || offsetLeft || offsetRight);

        if (hasOffset) {
          chunk = chunk.clone();

          var chunkWidth = _mapEnvironment.map.chunkWidth * _mapEnvironment.map.blockWidth;
          var chunkHeight = _mapEnvironment.map.chunkHeight * _mapEnvironment.map.blockHeight;

          if (offsetLeft) {
            chunk.x = centerChunk.x - chunkWidth;
          }
          if (offsetRight) {
            chunk.x += centerChunk.x + chunkWidth;
          }

          if (offsetTop) {
            chunk.y = centerChunk.y - chunkHeight;
          }
          if (offsetBottom) {
            chunk.y = centerChunk.y + chunkHeight;
          }
        }

        loadedChunks.push(chunk);
        
        _mapEnvironment.updateChunk(chunk);
      }
    }

    _mapEnvironment.loadedChunks = loadedChunks;
  },

  updateChunk: (chunk) => {

    for (var bx = 0; bx < _mapEnvironment.map.chunkWidth; bx++) {
      for (var by = 0; by < _mapEnvironment.map.chunkHeight; by++) {
        var block = chunk.blocks[bx][by];

        var mapX = chunk.x + (bx * _mapEnvironment.map.blockWidth);
        var mapY = chunk.y + (by * _mapEnvironment.map.blockWidth);

        block.image = _mapEnvironment.scene.add.image(mapX, mapY, 'materials', block.type);

        var scaleX = _mapEnvironment.map.blockWidth / block.image.width;
        var scaleY = _mapEnvironment.map.blockHeight / block.image.height;

        block.image.scaleX = scaleX;
        block.image.scaleY = scaleY;
      }
    }
  },

  destroyChunk: (chunk) => {

    for (var cx = 0; cx < _mapEnvironment.map.chunkWidth; cx++) {
      for (var cy = 0; cy < _mapEnvironment.map.chunkHeight; cy++) {

        var block = chunk.blocks[cx][cy];

        if (block.image) {
          block.image.destroy();
        }
      }
    }
  }
}