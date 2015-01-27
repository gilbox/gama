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

/**
 * @param {Array} List.
 * @return {Array} Sorted list.
 */
var sortAsc = R.sort(function(a, b) {
  return a - b;
});

/**
 * @param {Array} list
 * @return {Array} rotated list
 * @example
 *
 * rotateList([0, 1, 2])// -> [1, 2, 0]
 */
var rotateList = R.converge(R.append, R.head, R.tail);

//----------------------------------------------
// factories

/**
 * Creates an object representing point.
 *
 * @func
 * @category Function
 * @param {Number} x
 * @param {Number} y
 * @return {Point}
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
 * @return {Vector}
 * @example
 * 
 * gama.Vector(1, 2)// -> {x: 1, y: 2}
 * gama.Vector(gama.Point(1, 2), gama.Point(3, 4))// -> {x: 2, y: 2}
 */
gama.Vector = R.op(function(x, y) {
  return R.cond(
    [R.pipe(R.prop('x'), gama.isPoint), R.pipe(R.props(['x', 'y']), R.apply(gama.subtract))],
    [R.alwaysTrue, R.identity]
  )({
    x: x,
    y: y
  });
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
 * @return {Rectangle}
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
 * @return {Polygon}
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
 * @return {Circle}
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
 * Creates a list representing 3x3 matrix.
 *
 * @func
 * @category Function
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 * @param {Number} d
 * @param {Number} tx
 * @param {Number} ty
 * @return {Matrix}
 * @example
 * 
 * gama.Matrix(1, 2, 3, 4, 5, 6)// -> [1, 2, 0, 3, 4, 0, 5, 6, 1]
 */
gama.Matrix = function(a, b, c, d, tx, ty) {
  return [a, b, 0, c, d, 0, tx, ty, 1];
};

/**
 * Creates a list representing empty 3x3 matrix.
 *
 * @func
 * @category Function
 * @return {Matrix}
 * @example
 * 
 * gama.EmptyMatrix()// -> [1, 0, 0, 0, 1, 0, 0, 0, 1]
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

/**
 * Caclulates the length of a vector. This me
 *
 * @func
 * @category Function
 * @param {Vector}
 * @return {Number}
 */
gama.length2 = function(vector) {
  return vector.x * vector.x + vector.y * vector.y;
};

/**
 * Caclulates the length of a vector.
 *
 * @func
 * @category Function
 * @param {Vector}
 * @return {Number}
 */
gama.length = R.pipe(
  gama.length2,
  Math.sqrt
);

/**
 * Calculates the distance between two points.
 *
 * @func
 * @category Function
 * @param {Point} a
 * @param {Point} b
 * @return {Number}
 */
gama.distance2 = R.op(
  R.pipe(
    gama.subtract,
    gama.length2
  )
);

/**
 * Calculates the distance between two points.
 *
 * @func
 * @category Function
 * @param {Point} a
 * @param {Point} b
 * @return {Number}
 */
gama.distance = R.op(
  R.pipe(
    gama.distance2,
    Math.sqrt
  )
);

/**
 * Applies transformation matrix on given point.
 *
 * @param {Matrix} matrix
 * @param {Point} point
 * @return {Point}
 */
gama.transformPoint = R.op(function(matrix, point) {
  return gama.Point(
    matrix[0] * point.x + matrix[3] * point.y + matrix[6],
    matrix[1] * point.x + matrix[4] * point.y + matrix[7]
  );
});

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
  return gama.dot(a, b) / (gama.length(a) * gama.length(b));
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
  var t = gama.length(vector);
  return gama.Vector(vector.x / t, vector.y / t);
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
gama.scaleVector = R.op(
  R.useWith(
    function(a, b) { return gama.Vector(a.x * b.x, a.y * b.y); },
    R.cond(
      [gama.isVector, R.identity],
      [R.alwaysTrue,  function(scalar) { return gama.Vector(scalar, scalar); }]
    ),
    R.identity
  )
);

//----------------------------------------------
// matrix

/**
 * Multiplies two matrices.
 *
 * @param {Vector} vector
 * @param {Matrix} matrix
 * @return {Matrix}
 */
gama.multiply = R.op(function(a, b) {
  return [
    b[0] * a[0] + b[1] * a[3] + b[2] * a[6],
    b[0] * a[1] + b[1] * a[4] + b[2] * a[7],
    b[0] * a[2] + b[1] * a[5] + b[2] * a[8],
    b[3] * a[0] + b[4] * a[3] + b[5] * a[6],
    b[3] * a[1] + b[4] * a[4] + b[5] * a[7],
    b[3] * a[2] + b[4] * a[5] + b[5] * a[8],
    b[6] * a[0] + b[7] * a[3] + b[8] * a[6],
    b[6] * a[1] + b[7] * a[4] + b[8] * a[7],
    b[6] * a[2] + b[7] * a[5] + b[8] * a[8]
  ];
});

/**
 * Translates the matrix.
 *
 * @param {Vector} vector
 * @param {Matrix} matrix
 * @return {Matrix}
 */
gama.translate = R.op(function(vector, matrix) {
  var transformation = gama.Matrix(1, 0, 0, 1, vector.x, vector.y);
  return gama.multiply(matrix, transformation);
});

/**
 * Applies a scaling transformation to the matrix.
 *
 * @param {Vector} vector
 * @param {Matrix} matrix
 * @return {Matrix}
 */
gama.scale = R.curry(function(vector, matrix) {
  var transformation = gama.Matrix(vector.x, 0, 0, vector.y, 0, 0);
  return gama.multiply(matrix, transformation);
});

/**
 * Applies a rotation transformation to the matrix.
 *
 * @param {Number} angle
 * @param {Matrix} matrix
 * @return {Matrix}
 */
gama.rotate = R.op(function(angle, matrix) {
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  var transformation = gama.Matrix(cos, sin, -sin, cos, 0, 0);
  return gama.multiply(matrix, transformation);
});

/**
 * Applies a rotation transformation to the matrix.
 *
 * @param {Number} angle
 * @param {Point} point
 * @param {Matrix} matrix
 * @return {Matrix}
 */
gama.rotateAboutPoint = R.curry(function(angle, point, matrix) {
  return R.pipe(
    gama.translate(point),
    gama.rotate(angle),
    gama.translate(gama.negate(point))
  )(matrix);
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
gama.minVertex = function(polygon) {
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
gama.maxVertex = function(polygon) {
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
gama.boundingBox = function(polygon) {
  var min = gama.minVertex(polygon);
  var max = gama.maxVertex(polygon);

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
 * @return {Array} List of vectors.
 */
gama.axes = R.pipe(
  R.prop('vertices'),
  R.converge(
    R.zip,
    R.identity,
    rotateList
  ),
  R.map(R.apply(gama.Vector))
);

/**
 * Applies transformation matrix on given polygon.
 *
 * @func
 * @category Function
 * @param {Matrix} matrix
 * @param {Polygon} polygon
 * @return {Point}
 */
gama.transformPolygon = R.op(
  R.pipe(
    R.useWith(
      R.map,
      gama.transformPoint,
      R.prop('vertices')
    ),
    R.of,
    R.apply(gama.Polygon)
  )
);

/**
 * Checks whether given polygon is concave.
 *
 * @func
 * @category Function
 * @param {Polygon}
 * @return {Boolean}
 */
gama.isConcave = R.pipe(
  gama.axes,
  R.converge(
    R.zip,
    R.identity,
    R.pipe(R.identity, rotateList)
  ),
  R.map(R.apply(gama.dot)),
  R.and(
    R.some(R.gt(0)),
    R.some(R.lt(0))
  )
);

/**
 * Checks whether given polygon is convex.
 *
 * @func
 * @category Function
 * @param {Polygon}
 * @return {Boolean}
 */
gama.isConvex = R.not(gama.isConcave);

/**
 * Creates polygon from given rectangle.
 * 
 * @func
 * @category Function
 * @param {Rectangle}
 * @return {Polygon}
 */ 
gama.rectangle2polygon = function(rectangle) {
  return gama.Polygon([
    gama.Point(rectangle.x, rectangle.y),
    gama.Point(rectangle.x + rectangle.width, rectangle.y),
    gama.Point(rectangle.x + rectangle.width, rectangle.y + rectangle.height),
    gama.Point(rectangle.x, rectangle.y + rectangle.height)
  ]);
};

//----------------------------------------------
// collision detections

/**
 * Projects vertex to axis.
 *
 * @func
 * @category Function
 * @param {Vector} axis
 * @param {Point} vertex
 * @return {Point}
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
 * @return {Boolean}
 */
gama.projectionsOverlap = R.op(function(a, b) {
  return R.head(b) <= R.last(a) && R.last(b) >= R.head(a);
});

/**
 * @param {Vector} axis
 * @param {Polygon} polygon
 * @return {Array} projection
 */
var projectPolygonToAxis = R.op(
  R.pipe(
    R.useWith(
      R.map,
      R.converge(
        R.pipe,
        gama.projectPointToAxis,
        gama.dot
      ),
      R.prop('vertices')
    ),
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
 * @return {Boolean}
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
 * @return {Boolean}
 */
gama.testPointCircle = R.op(function(point, circle) {
  return gama.distance(circle.position, point) <= circle.radius;
});

/**
 * Checks whether point lies inside polygon.
 *
 * @func
 * @category Function
 * @param {Point} point
 * @param {Polygon} polygon
 * @return {Boolean}
 */
gama.testPointPolygon = R.op(
  R.useWith(
    R.pipe(
      function(point, vertices) {
        return R.map(function(v) {
          var vertex = v[1];
          var prevVertex = v[0];

          return ((vertex.y > point.y) != (prevVertex.y > point.y)) &&
            (point.x <= (prevVertex.x - vertex.x) * (point.y - vertex.y) / (prevVertex.y - vertex.y) + vertex.x);
        })(vertices);
      },
      R.reduce(function(a, b) { return b ? !a : a; }, false)
    ),
    R.identity,
    R.pipe(
      R.prop('vertices'),
      R.converge(
        R.zip,
        R.identity,
        R.pipe(R.identity, rotateList)
      )
    )
  )
);

/**
 * Checks whether two circles overlap.
 *
 * @func
 * @category Function
 * @param {Circle} a
 * @param {Circle} b
 * @return {Boolean}
 */
gama.testCircleCircle = R.curry(function(a, b) {
  return gama.distance(a.position, b.position) <= a.radius + b.radius;
});

/**
 * Checks whether two polygons overlap. Works only for two convex polygons.
 *
 * @func
 * @category Function
 * @param {Polygon} a
 * @param {Polygon} b
 * @return {Boolean}
 */
gama.testPolygonPolygon = R.curry(function(a, b) {
  var axes = R.union(gama.axes(a), gama.axes(b));

  return !R.some(function(axis) {
    var project = projectPolygonToAxis(gama.negate(axis));

    return !gama.projectionsOverlap(
      project(a),
      project(b)
    );
  })(axes);
});
