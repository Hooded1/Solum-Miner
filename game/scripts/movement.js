var Direction = {
  None : 0,
  N : 1,
  NE : 2,
  E : 3,
  SE : 4,
  S : 5,
  SW : 6,
  W : 7,
  NW : 8,
}

var boostVelocity = 750;
var normalVelocity = 50;

function getVelocity(direction) {

  var velocity = Keys.Boost ? boostVelocity : normalVelocity;
  var diagonal = velocity / Math.sqrt(2);

  var result = { X: 0, Y: 0 };

  switch (direction) {
    case Direction.N:
      result.Y = velocity * -1;
      break;
    case Direction.E:
      result.X = velocity;
      break;
    case Direction.S:
      result.Y = velocity;
      break;
    case Direction.W:
      result.X = velocity * -1;
      break;
    case Direction.NE:
      result.X = diagonal;
      result.Y = diagonal * -1;
      break;
    case Direction.SE:
      result.X = diagonal;
      result.Y = diagonal;
      break;
    case Direction.SW:
      result.X = diagonal * -1;
      result.Y = diagonal;
      break;
    case Direction.NW:
      result.X = diagonal * -1;
      result.Y = diagonal * -1;
      break;
  }

  return result;
}

function getRotation(direction, current) {
  var rotation = current;

  switch (direction) {
    case Direction.N:
      rotation = 0;
      break;
    case Direction.E:
      rotation = Math.PI / 2;
      break;
    case Direction.S:
      rotation = Math.PI;
      break;
    case Direction.W:
      rotation = Math.PI * (6 / 4);
      break;
    case Direction.NE:
      rotation = Math.PI / 4;
      break;
    case Direction.SE:
      rotation = Math.PI * (3 / 4);
      break;
    case Direction.SW:
      rotation = Math.PI * (5 / 4);
      break;
    case Direction.NW:
      rotation = Math.PI * (7 / 4);
      break;
  }

  return rotation;
}

function getDirection() {
  if (Keys.Right) {
    if (Keys.Down) {
      return Direction.SE;
    } else if (Keys.Up) {
      return Direction.NE;
    }
    return Direction.E;
  } else if (Keys.Left) {
    if (Keys.Down) {
      return Direction.SW;
    } else if (Keys.Up) {
      return Direction.NW;
    }
    return Direction.W;
  } else if (Keys.Down) {
    if (Keys.Right) {
      return Direction.SE;
    } else if (Keys.Left) {
      return Direction.SW;
    }
    return Direction.S;
  } else if (Keys.Up) {
    if (Keys.Right) {
      return Direction.NE;
    } else if (Keys.Left) {
      return Direction.NW;
    }
    return Direction.N;
  }

  return Direction.None;
}

function performMovement(player, direction) {

  player.rotation = getRotation(direction, player.rotation);
  
  var velocity = getVelocity(direction);

  player.setVelocity(0);
  player.setVelocityY(velocity.Y);
  player.setVelocityX(velocity.X);
}