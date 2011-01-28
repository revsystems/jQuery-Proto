(function( $ ) {

    function Bounds() {
        var $e, $local, $ctx,
            _top, _right, _bottom, _left;
                
        this.init = function() {
            
            // initialize elements
            $e = $(this.elem);
            $local = $e.parents().filter(function() {
                return !!$(this).css("position").match(/absolute|relative|fixed/i);
            }).filter(":first");
            $ctx = $("body");
            
            // initialize 
            _top = $e.offset().top;
            _left = $e.offset().left;
            _bottom = _top + $e.height();
            _right = _left + $e.width();
            
            this._abs = {
              top: $e.offset().top,
              left: $e.offset().left,
              bottom: $e.offset().top + $e.height(),
              right: $e.offset().left + $e.width()
            };
            
        };
        
        /*
         * get coordinates: x - ctx.x
         * display coordinates: x - local.x
         * set coordinates: x + ctx.x
         * 
         * internally store absolute positions
         *    -get functions return the offset from the ctx
         *    -set functions assume offsets from the ctx
         *    -display css is set to be accurate within the ctx
         */
        
        // adjusts the css to display correctly even when top/bottom or left/right are inverted
        function normalize() {
            $e.css({
                top: (_top > _bottom ? _bottom : _top) - $local.offset().top,
                left: (_left > _right ? _right : _left) - $local.offset().left,
                width: Math.abs(_right - _left),
                height: Math.abs(_bottom - _top)
            });
        }
        
        function makeAccessor( value ) {
          var self = this;
          self[value] = function( n, dontNormalize ) {
            var offsetParam = value.match(/top|bottom/) ? "top" : "left";
            if(n !== undefined) {
                self._abs[value] = $ctx.offset()[offsetParam] + n;
                if(!dontNormalize) { normalize(); }
                return this;
            } else {
                return self._abs[value] - $ctx.offset()[offsetParam];
            }
          };
        }
        
        this.top = function( y, dontNormalize ) {
            if(y !== undefined) {
                _top = $ctx.offset().top + y;
                if(!dontNormalize) { normalize(); }
                return this;
            } else {
                return _top - $ctx.offset().top;
            }
        };
        
        this.right = function( x, dontNormalize ) {
            if(x !== undefined) {
                _right = $ctx.offset().left + x;
                if(!dontNormalize) { normalize(); }
                return this;
            } else {
                return _right - $ctx.offset().left;
            }
        };
        
        this.bottom = function( y, dontNormalize ) {
            if(y !== undefined) {
                _bottom = $ctx.offset().top + y;
                if(!dontNormalize) { normalize(); }
                return this;
            } else {
                return _bottom - $ctx.offset().top;
            }
        };
        
        this.left = function( x, dontNormalize ) {
            if(x !== undefined) {
                _left = $ctx.offset().left + x;
                if(!dontNormalize) { normalize(); }
                return this;
            } else {
                return _left - $ctx.offset().left;
            }
        };
        
        this.rect = function( r ) {
            if(r !== undefined) {
                if(r.top) { this.top(new Number(r.top), true); }
                if(r.right) { this.right(new Number(r.right), true); }
                if(r.bottom) { this.bottom(new Number(r.bottom), true); }
                if(r.left) { this.left(new Number(r.left), true); }
                normalize();
            } else {
                return {
                    top: this.top(),
                    right: this.right(),
                    bottom: this.bottom(),
                    left: this.left()
                };
            }
        };
        
        function moveTo(x, y) {
          var diff;
          if(x != null) {
            diff = _left - $ctx.offset().left - x;
            this.left(this.left() - diff, true);
            this.right(this.right() - diff, true);
          }
          if(y != null) {
            diff = _top - $ctx.offset().top - y;
            this.top(this.top() - diff, true);
            this.bottom(this.bottom() - diff, true);
          }
          normalize();
        }
        
        this.moveTo = function() {
          var args = arguments;
          if(args.length == 1 && args[0].length) {
            moveTo.call(this, args[0].x, args[0].y);
          } else {
            moveTo.call(this, args[0], args[1]);
          }
        };
        
        this.center = function() {
            return {
                x: (this.right() + this.left()) / 2,
                y: (this.bottom() + this.top()) / 2
            };
        };
        
        this.origin = function() {
            if(arguments.length === 0) {
                return $ctx;
            } else {
                $ctx = $(arguments[0]);
            }
        };
    }
    
    $.proto("bounds", Bounds, {
        instantAccess: true
    });

}(jQuery));