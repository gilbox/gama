var expect = require('chai').expect;
var gama = require('../src/gama');

describe('gama.multiplyMatrix', function() {

  it('multiplies two matrices', function() {
    var a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var b = [4, 2, 8, 10, 12, 4, 4, 5, 9];
    expect(gama.multiplyMatrix(a, b)).to.be.eql([68, 82, 96, 86, 112, 138, 87, 105, 123]);
  });

});
