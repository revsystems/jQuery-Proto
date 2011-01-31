/*
jQuery-Proto

Tired of polluting the jQuery namespace with multiple functions for 
the same plugin? Sick of excessive trigger handling? You want a 
slicker API for your work, so use jQuery-Proto. It allows you to 
link a class to a jQuery object, and access its methods with sugary
jQuery syntax.

This product includes software developed 
by RevSystems, Inc (http://www.revsystems.com/) and its contributors

Please see the accompanying LICENSE.txt for licensing information.
  
  
    Define a new class with an init function, e.g.:
    function SelectBox() {
      
          // private variable
          var $sb;
          
          // the constructor
          this.init = function(param1, param2) {
                var $original = $(this.elem);
                $sb = $("<div>...</div>");
                $sb.click(myUtility)
                etc...
          }
          
          // a function that can be called whenever the classoh is accessed via jQuery
          this.access = function(funcName, param) {
                console.log(funcName + " is being executed with a param value of " + param);
                console.log("Now actually execute " + funcName);
          };
          
          // private internal function
          function myUtility() {
                ...
          }
          
          // object oriented function
          this.publicFunction = function() {
                ...
          };
    }



    Use jQuery-Proto to associate your class to a jQuery function:
    -------------------------
    $.proto("sb", SelectBox);
    -------------------------


    Create your object, associate it with elements:
    $(".targets").sb();
    
    
    Access the object's functions through an interface:
    $("#element").sb("refresh");
    
    
    Do jQuery chaining with setters:
    $("#element").sb("refresh").doSomethingElseForElement();
    
    
    Get data using a getter
    var usesTie = $("#element").sb("options", "useTie");
    
    
    Return the object itself:
    $("#element").sb();
    
    
*/

(function( $ ) {
    var aps = Array.prototype.slice;
    $.proto = function() {
        var name = arguments[0],    // The name of the jQuery function that will be called
            clazz = arguments[1],   // A reference to the class that you are associating
            klazz = clazz,          // A version of clazz with a delayed constructor
            extOpt = {},            // used to extend clazz with a variable name for the init function
            undefined;              // safety net
        
        opts = $.extend({
            elem: "elem",           // the property name on the object that will be set to the current jQuery context
            access: "access",       // the name of the access function to be set on the object
            init: "init",           // the name of the init function to be set on the object
            instantAccess: false    // when true, treat all args as access args (ignore constructor args) and allow construct/function call at the same time
        }, arguments[2]);
        
        if(clazz._super) {
            extOpt[opts.init] = function(){};
            klazz = clazz.extend(extOpt);
        }
        
        $.fn[name] = function() {
            var result, args = arguments;
                
            $(this).each(function() {
                var $e = $(this),
                    obj = $e.data(name),
                    isNew = !obj;
                
                // if the object is not defined for this element, then construct
                if(isNew) {
                    
                    // create the new object and restore init if necessary
                    obj = new klazz();
                    if(clazz._super) {
                      obj[opts.init] = clazz.prototype.init;
                    }
                    
                    // set the elem property and initialize the object
                    obj[opts.elem] = $e[0];
                    if(obj[opts.init]) {
                        obj[opts.init].apply(obj, opts.instantAccess ? [] : aps.call(args, 0));
                    }
                    
                    // associate it with the element
                    $e.data(name, obj);
                    
                }
                
                // if it is defined or we allow instant access, then access
                if(!isNew || opts.instantAccess) {
                  
                    // call the access function if it exists (allows lazy loading)
                    if(obj[opts.access]) {
                        obj[opts.access].apply(obj, aps.call(args, 0));
                    }
                    
                    // do something with the object
                    if(args.length > 0) {
                    
                        if($.isFunction(obj[args[0]])) {
                        
                            // use the method access interface
                            result = obj[args[0]].apply(obj, aps.call(args, 1));
                            
                        } else if(args.length === 1) {
                          
                            // just retrieve the property (leverage deep access with getObject if we can)
                            if($.getObject) {
                              result = $.getObject(args[0], obj);
                            } else {
                              result = obj[args[0]];
                            }
                            
                        } else {
                          
                            // set the property (leverage deep access with setObject if we can)
                            if($.setObject) {
                              $.setObject(args[0], args[1], obj);
                            } else {
                              obj[args[0]] = args[1];
                            }
                            
                        }
                        
                    } else if(result === undefined) {
                    
                        // return the first object if there are no args
                        result = $e.data(name);
                        
                    }
                }
            });
            
            // chain if no results were returned from the clazz's method (it's a setter)
            if(result === undefined) {
              return $(this);
            }
            
            // return the first result if not chaining
            return result;
        };
    };
    
}(jQuery));