// Generated by CoffeeScript 1.6.2
(function() {
  var cleanStyle, dirtyStyle, getRotation, getY, originalParent, styleFetcher, testDiv, testMaskew, testPresence, transformKey;

  styleFetcher = function(el) {
    return (function(style) {
      var k, v, _ref;

      _ref = window.getComputedStyle(el);
      for (k in _ref) {
        v = _ref[k];
        style[k] = v;
      }
      return function(key) {
        return style[key];
      };
    })({});
  };

  getRotation = function(el) {
    var _ref;

    return parseFloat((_ref = el.style[transformKey].match(/(-?\d+)deg/i)) != null ? _ref[0] : void 0);
  };

  getY = function(el) {
    var _ref;

    return parseFloat((_ref = el.style[transformKey].match(/translate3d\(\d+px\,\s?(-?\d+)px/i)) != null ? _ref[1] : void 0);
  };

  testPresence = function(el) {
    while (el = el.parentNode) {
      if (el === document) {
        return true;
      }
    }
    return false;
  };

  testDiv = document.createElement('div');

  testDiv.className = 'maskew-test';

  transformKey = (function() {
    var key, prefix, _i, _len, _ref;

    if (testDiv.style.transform != null) {
      return 'transform';
    }
    _ref = ['webkit', 'moz', 'o', 'ms', 'khtml'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      prefix = _ref[_i];
      if (testDiv.style[(key = prefix + 'Transform')] != null) {
        return key;
      }
    }
  })();

  testDiv.style.width = '200px';

  testDiv.style.height = '200px';

  testDiv.style.margin = '20px';

  testDiv.style.padding = '20px';

  testDiv.style.backgroundColor = '#fff';

  document.body.appendChild(testDiv);

  originalParent = testDiv.parentNode;

  cleanStyle = styleFetcher(testDiv);

  testMaskew = new Maskew(testDiv);

  dirtyStyle = styleFetcher(testMaskew._outerMask);

  describe('Maskew', function() {
    describe('#constructor()', function() {
      it('should return an instance of Maskew', function() {
        return expect(testMaskew instanceof Maskew).to.equal(true);
      });
      it('should insert an element into the document', function() {
        return expect(testPresence(testMaskew._outerMask)).to.equal(true);
      });
      it('should insert an element in the same place as the target', function() {
        return expect(testMaskew._outerMask.parentNode).to.equal(originalParent);
      });
      it('should create an element of the same dimensions', function() {
        expect(dirtyStyle('width')).to.equal(testDiv.clientWidth + 'px');
        return expect(dirtyStyle('height')).to.equal(testDiv.clientHeight + 'px');
      });
      return it('should create an element with the same margins and padding', function() {
        var margin, padding, side, _i, _len, _ref, _results;

        _ref = ['Top', 'Right', 'Bottom', 'Left'];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          side = _ref[_i];
          margin = 'margin' + side;
          padding = 'padding' + side;
          expect(dirtyStyle(margin)).to.equal(cleanStyle(margin));
          _results.push(expect(testMaskew._el.style[padding]).to.equal(cleanStyle(padding)));
        }
        return _results;
      });
    });
    describe('#skew()', function() {
      it('should skew an element to a given angle', function() {
        testMaskew.skew(20);
        return expect(getRotation(testMaskew._innerMask)).to.equal(20);
      });
      it('should keep inner contents upright', function() {
        return expect(getRotation(testMaskew._holder)).to.equal(-20);
      });
      it('should shift contents within the view mask based on angle', function() {
        expect(getY(testMaskew._innerMask)).to.equal(-72);
        testMaskew.skew(10);
        return expect(getY(testMaskew._innerMask)).to.equal(-39);
      });
      it('should narrow the mask width based on the given angle', function() {
        expect(parseInt(testMaskew._innerMask.style.width, 10)).to.equal(201);
        testMaskew.skew(30);
        return expect(parseInt(testMaskew._innerMask.style.width, 10)).to.equal(139);
      });
      it('should shorten the mask height based on the given angle', function() {
        expect(parseInt(testMaskew._outerMask.style.height, 10)).to.equal(139);
        testMaskew.skew(5);
        return expect(parseInt(testMaskew._outerMask.style.height, 10)).to.equal(220);
      });
      return it('should revert to 0 degrees when given a negative angle', function() {
        testMaskew.skew(-20);
        return expect(getRotation(testMaskew._innerMask)).to.equal(0);
      });
    });
    describe('#destroy()', function() {
      var el;

      el = testMaskew._outerMask;
      it('should remove the Maskew element from the document', function() {
        testMaskew.destroy();
        return expect(testPresence(el)).to.equal(false);
      });
      return it('should set all the object attributes to null', function() {
        var allNull;

        allNull = (function() {
          var k, v;

          for (k in testMaskew) {
            v = testMaskew[k];
            if (v !== null) {
              return false;
            }
          }
          return true;
        })();
        return expect(allNull).to.equal(true);
      });
    });
    return describe('#$.fn.maskew()', function() {
      var $testMaskew;

      $testMaskew = $('.maskew-test').maskew();
      it('should return a jQuery object', function() {
        return expect($testMaskew instanceof jQuery).to.equal(true);
      });
      it('should stash a reference to the Maskew instance in the data cache', function() {
        return expect($testMaskew.maskew()).to.equal($testMaskew.maskew());
      });
      it('should return its Maskew instance by calling it with no arguments', function() {
        return expect($testMaskew.maskew() instanceof Maskew).to.equal(true);
      });
      return it('should proxy Maskew methods as string arguments', function() {
        $testMaskew.maskew('skew', 5);
        expect(parseInt($testMaskew.maskew()._outerMask.style.height, 10)).to.equal(220);
        $testMaskew.maskew('setTouch', true);
        return expect($testMaskew.maskew()._outerMask.style.cursor).to.equal('ew-resize');
      });
    });
  });

}).call(this);
