// -----------------------------------------------------------------------
//  gama
//  Copyright 2015 Jan Břečka. All Rights Reserved.
//
//  This program is free software. You can redistribute and/or modify it
//  in accordance with the terms of the accompanying license agreement.
// -----------------------------------------------------------------------

var R = require('ramda');

/**
 * A practical math/geometry library for functional JavaScript, based on Ramda.
 *
 * @exports gama
 */
var gama = exports;

var sortAsc = R.sort(function(a, b) {
  return a - b;
});

//----------------------------------------------
// factories

/**
 * Creates an object representing point.
 *
 * @func
 * @category Function
 * @param {Number} x
 * @param {Number} y
 * @param {Point}
 * @example
 * 
 * gama.Point(1, 2)// -> {x: 1, y: 2}
 */
gama.Point = function(x, y) {
  return {
    x: x,
    y: y
  };
};

/**
 * Creates an object representing vector.
 *
 * @func
 * @category Function
 * @param {Number|Point} x
 * @param {Number|Point} y
 * @param {Vector}
 * @example
 * 
 * gama.Vector(1, 2)// -> {x: 1, y: 2}
 * gama.Vector(gama.Point(1, 2), gama.Point(3, 4))// -> {x: 2, y: 2}
 */
gama.Vector = R.op(function(x, y) {
  if (gama.isPoint(x) && gama.isPoint(y)) {
    return gama.subtract(x, y);
  }

  return {
    x: x,
    y: y
  };
});

/**
 * Creates an object representing rectangle.
 *
 * @func
 * @category Function
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @param {Rectangle}
 * @example
 * 
 * gama.Rectangle(1, 2, 3, 4)// -> {x: 1, y: 2, width: 3, height: 4}
 */
gama.Rectangle = function(x, y, width, height) {
  return {
    x: x,
    y: y,
    width: width,
    height: height
  };
};

/**
 * Creates an object representing polygon.
 *
 * @func
 * @category Function
 * @param {Array} vertices List of vertices.
 * @param {Polygon}
 * @example
 * 
 * // triangle
 * gama.Polygon([gama.Point(1, 2), gama.Point(2, 3), gama.Point(1, 3)])
 */
gama.Polygon = function(vertices) {
  return {
    vertices: vertices
  };
};

/**
 * Creates an object representing circle.
 *
 * @func
 * @category Function
 * @param {Point} position
 * @param {Number} radius
 * @param {Circle}
 * @example
 * 
 * gama.Circle(gama.Point(1, 2), 2)
 */
gama.Circle = function(position, radius) {
  return {
    position: position,
    radius: radius
  };
};

/**
 * Creates a list representing matrix.
 *
 * @func
 * @category Function
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 * @param {Number} d
 * @param {Number} tx
 * @param {Number} ty
 * @param {Matrix}
 * @example
 * 
 * gama.Matrix(1, 2, 3, 4, 5, 6)// -> [1, 2, 3, 4, 5, 6]
 */
gama.Matrix = function(a, b, c, d, tx, ty) {
  return [a, b, c, d, tx, ty];
};

/**
 * Creates an object representing empty matrix.
 *
 * @func
 * @category Function
 * @param {Matrix}
 * @example
 * 
 * gama.EmptyMatrix()// -> [1, 0, 0, 1, 0, 0]
 */
gama.EmptyMatrix = function() {
  return gama.Matrix(1, 0, 0, 1, 0, 0);
};

//----------------------------------------------
// deg/rad conversion

var PI2 = 2 * Math.PI;

/**
 * Converts degrees to radians.
 *
 * @func
 * @category Function
 * @param {Number}
 * @return {Number}
 */
gama.deg2rad = function(rotation) {
  return rotation * PI2 / 360;
};

/**
 * Converts radians to degrees.
 *
 * @func
 * @category Function
 * @param {Number}
 * @return {Number}
 */
gama.rad2deg = function(rotation) {
  return rotation * 360 / PI2;
};

//----------------------------------------------
// points/vectors

/**
 * Checks whether given value is point (contains x and y properties).
 *
 * @func
 * @category Function
 * @param {Object}
 * @return {Boolean}
 * @example
 * 
 * gama.isPoint(gama.Vector(1, 2))// -> true
 * gama.isPoint(gama.Point(1, 2))// -> true
 * gama.isPoint({x: 1, y: 2})// -> true
 * gama.isPoint('s')// -> false
 */
gama.isPoint = R.and(R.has('x'), R.has('y'));

/**
 * Checks whether given value is vector (contains x and y properties).
 *
 * @func
 * @category Function
 * @param {Object}
 * @return {Boolean}
 * @example
 * 
 * gama.isVector(gama.Point(1, 2))// -> true
 * gama.isVector(gama.Vector(1, 2))// -> true
 * gama.isVector({x: 1, y: 2})// -> true
 * gama.isVector('s')// -> false
 */
gama.isVector = gama.isPoint;

/**
 * Adds the coordinates of a point|vector (an object that contains x and y properties)
 * to the coordinates of b point|vector (an object that contains x and y properties)
 * to create a new point.
 * 
 * @func
 * @category Function
 * @param {Point|Vector} a
 * @param {Point|Vector} b
 * @return {Point|Vector}
 */
gama.add = R.op(function(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
});

/**
 * Subtracts the coordinates of b point|vector (an object that contains x and y properties)
 * from the coordinates of a point|vector (an object that contains x and y properties)
 * to create a new point.
 * 
 * @func
 * @category Function
 * @param {Point|Vector} a
 * @param {Point|Vector} b
 * @return {Point|Vector}
 */
gama.subtract = R.op(function(a, b) {
  return {
    x: b.x - a.x,
    y: b.y - a.y
  };
});

//----------------------------------------------
// point

/**
 * Rotates point around another point by given angle.
 *
 * @func
 * @category Function
 * @param {Point} point
 * @param {Point} around
 * @param {Number} angle in rads
 * @return {Point}
 */
gama.rotatePoint = R.curry(function(point, around, angle) {
  return gama.Point(
    (point.x - around.x) * Math.cos(angle) - (point.y - around.y) * Math.sin(angle) + around.x,
    (point.x - around.x) * Math.sin(angle) + (point.y - around.y) * Math.cos(angle) + around.y
  );
});

/**
 * Calculates the distance between two points.
 *
 * @func
 * @category Function
 * @param {Point} a
 * @param {Point} b
 * @return {Number}
 */
gama.distance2 = R.op(function(a, b) {
  return gama.vectorLength2(gama.subtract(a, b));
});

/**
 * Calculates the distance between two points.
 *
 * @func
 * @category Function
 * @param {Point} a
 * @param {Point} b
 * @return {Number}
 */
gama.distance = R.op(function(a, b) {
  return Math.sqrt(gama.distance2(a, b));
});

//----------------------------------------------
// vectors

/**
 * Generates a normal vector.
 *
 * @func
 * @category Function
 * @param {Vector}
 * @return {Vector}
 */
gama.normal = function(vector) {
  return gama.Vector(vector.y, -vector.x);
};

/**
 * Caclulates the dot product of two vectors.
 *
 * @func
 * @category Function
 * @param {Vector} a
 * @param {Vector} b
 * @return {Number}
 */
gama.dot = R.curry(function(a, b) {
  return a.x * b.x + a.y * b.y;
});

/**
 * Caclulates angle between two vectors.
 *
 * @func
 * @category Function
 * @param {Vector} a
 * @param {Vector} b
 * @return {Number} cos
 */
gama.angle = R.op(function(a, b) {
  return gama.dot(a, b) / (gama.vectorLength(a) * gama.vectorLength(b));
});

/**
 * Generates a unit vector.
 *
 * @func
 * @category Function
 * @param {Vector} vector
 * @return {Vector}
 */
gama.unit = function(vector) {
  var t = gama.vectorLength(vector);
  return gama.Vector(vector.x / t, vector.y / t);
};

/**
 * Caclulates the length of a vector. This me
 *
 * @func
 * @category Function
 * @param {Vector}
 * @return {Number}
 */
gama.vectorLength2 = function(vector) {
  return vector.x * vector.x + vector.y * vector.y;
};

/**
 * Caclulates the length of a vector.
 *
 * @func
 * @category Function
 * @param {Vector}
 * @return {Number}
 */
gama.vectorLength = function(vector) {
  return Math.sqrt(gama.vectorLength2(vector));
};

/**
 * Negates the components of a vector.
 *
 * @param {Vector} vector
 * @return {Vector}
 */
gama.negate = function(vector) {
  return gama.Vector(-vector.x, -vector.y);
};

/**
 * Multiplies the components of a vector by a scalar value or another vector.
 *
 * @func
 * @category Function
 * @param {Number|Vector}
 * @return {Vector}
 * @example
 *
 * gama.scaleVector(2)(gama.Vector(1, 2))// -> gama.Vector(2, 4)
 * gama.scaleVector(gama.Vector(3, 1))(gama.Vector(1, 2))// -> gama.Vector(3, 2)
 */
gama.scaleVector = R.op(function(by, vector) {
  if (gama.isVector(by)) {
    return gama.Vector(vector.x * by.x, vector.y * by.y);
  }

  return gama.Vector(vector.x * by, vector.y * by);
});

//----------------------------------------------
// polygon

var minX = R.pipe(R.map(R.prop('x')), R.min);
var minY = R.pipe(R.map(R.prop('y')), R.min);
var maxX = R.pipe(R.map(R.prop('x')), R.max);
var maxY = R.pipe(R.map(R.prop('y')), R.max);

/**
 * Returns the top left vertex of polygon's bounding box.
 *
 * @func
 * @category Function
 * @param {Polygon}
 * @return {Point}
 */
gama.polygonMinVertex = function(polygon) {
  return gama.Point(
    minX(polygon.vertices),
    minY(polygon.vertices)
  );
};

/**
 * Returns the bottom right vertex of polygon's bounding box.
 *
 * @func
 * @category Function
 * @param {Polygon}
 * @return {Point}
 */
gama.polygonMaxVertex = function(polygon) {
  return gama.Point(
    maxX(polygon.vertices),
    maxY(polygon.vertices)
  );
};

/**
 * Returns bounding box.
 *
 * @func
 * @category Function
 * @param {Polygon}
 * @return {Rectangle}
 */
gama.polygonBoundingBox = function(polygon) {
  var min = gama.polygonMinVertex(polygon);
  var max = gama.polygonMaxVertex(polygon);

  return gama.Rectangle(
    min.x,
    min.y,
    max.x - min.x,
    max.y - min.y
  );
};

/**
 * Generates axes. It returns as many axes as a polygon has vertices.
 *
 * @func
 * @category Function
 * @param {Polygon}
 * @param {Array} List of vectors.
 */
gama.polygonAxes = R.pipe(
  R.prop('vertices'),
  R.map.idx(function(vertex, i, vertices) {
    return gama.normal(gama.Vector(
      vertices[i],
      vertices[(i + 1) % vertices.length]
    ));
  })
);

//----------------------------------------------
// collision detections

/**
 * Projects vertex to axis.
 *
 * @func
 * @category Function
 * @param {Vector} axis
 * @param {Point} vertex
 * @param {Point}
 */
gama.projectPointToAxis = R.op(function(axis, vertex) {
  var t = (vertex.x * axis.x + vertex.y * axis.y) / (axis.x * axis.x + axis.y * axis.y);
  return gama.Point(t * axis.x, t * axis.y);
});

/**
 * Checks whether two projections overlap.
 *
 * @func
 * @category Function
 * @param {Array} a
 * @param {Array} b
 * @param {Boolean}
 */
gama.projectionsOverlap = R.op(function(a, b) {
  return R.head(b) <= R.last(a) && R.last(b) >= R.head(a);
});

var projectPolygonToAxis = R.op(
  R.pipe(
    R.useWith(R.map, R.converge(R.pipe, gama.projectPointToAxis, gama.dot), R.prop('vertices')), 
    sortAsc
  )
);

/**
 * Checks whether point lies inside rectangle.
 *
 * @func
 * @category Function
 * @param {Point} point
 * @param {Rectangle} rectangle
 * @param {Boolean}
 */
gama.testPointRectangle = R.op(function(point, rectangle) {
  return point.x >= rectangle.x && point.x <= rectangle.x + rectangle.width && point.y >= rectangle.y && point.y <= rectangle.y + rectangle.height;
});

/**
 * Checks whether point lies inside circle.
 *
 * @func
 * @category Function
 * @param {Point} point
 * @param {Circle} circle
 * @param {Boolean}
 */
gama.testPointCircle = R.op(function(point, circle) {
  return gama.distance(circle.position, point) <= circle.radius;
});

/**
 * Checks whether two circles overlap.
 *
 * @func
 * @category Function
 * @param {Circle} a
 * @param {Circle} b
 * @param {Boolean}
 */
gama.testCircleCircle = R.curry(function(a, b) {
  return gama.distance(a.position, b.position) <= a.radius + b.radius;
});

/**
 * Checks whether two polygons overlap.
 *
 * @func
 * @category Function
 * @param {Polygon} a
 * @param {Polygon} b
 * @param {Boolean}
 */
gama.testPolygonPolygon = R.curry(function(a, b) {
  var axes = R.union(gama.polygonAxes(a), gama.polygonAxes(b));

  return !R.some(function(axis) {
    var project = projectPolygonToAxis(axis);

    return !gama.projectionsOverlap(
      project(a),
      project(b)
    );
  })(axes);
});
