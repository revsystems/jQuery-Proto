# jQuery-Proto

Tired of polluting the jQuery namespace with multiple functions for 
the same plugin? Sick of excessive trigger handling? You want a 
slicker API for your work, so use jQuery-Proto. It allows you to 
link a javascript Class to a jQuery object and access its methods 
with sweet and sugary jQuery syntax.


## Demo

[jQuery-SelectBox](https://github.com/revsystems/jQuery-SelectBox) uses 
jQuery-Proto. If you scroll to the bottom of jquery.sb.js, you'll see 
its public methods and init function.

You can also see [a new plugin called jQuery-Bounds utilizing it](http://dl.dropbox.com/u/124192/websites/jqueryproto/bounds.html).


## Features

* Makes your plugin's API easier to use
* Saves you filesize and time when you make a new plugin
* Works with the function-as-class model
* Works with [John Resig's Simple Javascript Inheritance](http://ejohn.org/blog/simple-javascript-inheritance/) model
* Leverages [Ben Alman's jQuery getObject plugin](http://benalman.com/projects/jquery-getobject-plugin/) if it's available


## Compatibility

  jQuery-Proto has been tested in the following browsers:
  
  * Firefox 3.6.12
  * Google Chrome 7.0.517.44
  * IE7 (via IE9 beta)
  * IE8 (via IE9 beta)
  * IE9 beta
  
  It requires [jQuery version 1.3.x](http://jquery.com) and up.

  
## Usage

Requires [jQuery](http://jquery.com) and something you've created! jQuery-Proto is not standalone; 
it's meant to be leveraged by other plugins!

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>
    <script type="text/javascript" src="jquery.proto.js"></script>
    
Now that you can leverage jQuery-Proto, create a javascript class:

    function SelectBox() {
      
        // private variable
        var $sb,
            something;
        
        // the constructor
        this.init = function(param1, param2) {
            var $original = $(this.elem);
            $sb = $("<div>...</div>");
            $sb.click(myUtility);
            something = "hello";
            ...
        }
        
        // a function that can be called whenever the class is accessed via jQuery
        this.access = function(funcName, param) {
            console.log(funcName + " is being executed with a param value of " + param);
            console.log("Now actually execute " + funcName);
        };
        
        // private internal function
        function myUtility() {
            ...
        }
        
        // public function
        this.refresh = function( when ) {
            ...
        };
        
        this.getSomething = function() {
            return something;
        };
        
        this.isKindaCool = undefined;
        
        this.destroy = function() {
            $sb.remove();
            $(this.elem).removeData("sb");
        };
        
    }
    
Now that we have our class, we can make it a jQuery plugin:

    $.proto("sb", SelectBox);
    
Your plugin has been created! Now you can use it in a variety of ways.

    // initialize the plugin
    $("select").sb();
    
    // call a public function for sb
    $("select").append("<option>I'm new</option>").sb("refresh", "now");
    
    // get a value
    console.log($("select").sb("getSomething"));
    
    // set a public variable
    $("select").sb("isKindaCool", true);
    
    // get a public variable
    console.log($("select").sb("isKindaCool"));
    
    // destroy and unlink sb
    $("select").sb("destroy");
    
    
## Options

    The following options let you change the names of variables that are utilized 
    by jQuery-Proto.  It is recommended that you only change them if you are using 
    a class pattern that interferes with their operation.

** elem ** (String, required, default "elem")

    The name of the public variable assigned to the class on creation, which is a 
    reference to the DOM element context. e.g. If you used $("div#my_select").sb(), 
    this.elem would point to &lt;div id="my_select"&gt;&lt;/div&gt;.

** init ** (String, required, default "init")

The name of your constructor.

** access ** (String, optional, default "access")

    The name of the public function that should be called every time your class 
    is accessed through the jQuery plugin. This function allows you to update 
    internal variables, if necessary, before any public methods are called or 
    public variables are set.
    
** instantAccess ** (boolean, default false)

    When set to true, it is assumed the constructor has no arguments. This lets us 
    treat the first call as both a constructor and an access. jQuery-Bounds (in the demo)
    uses this. We can call `$("target").bounds("left")` instead of `$("target").bounds().bounds("left")`.


## Leveraging [Ben Alman's jQuery getObject plugin](http://benalman.com/projects/jquery-getobject-plugin/)

If you want to leverage $.getObject and $.setObject, it needs to 
be included before jquery.proto.js:

    <script type="text/javascript" src="jquery.ba-getobject.min.js"></script>
    <script type="text/javascript" src="jquery.proto.js"></script>

With that done, get.and.set.objects.deeply = true, as the plugin says.
We can do things like:

    $("select").sb("a.very.deep.set.option", true);
    console.log($("select").sb("a.very.deep.set.option"));

    
## Using [John Resig's Simple Javascript Inheritance](http://ejohn.org/blog/simple-javascript-inheritance/) framework

Classes are always functions, but frameworks like Simple Javascript Inheritance or Prototype.js 
create them from the more generic javascript Object {}. jQuery-Proto works with this pattern.

    var SelectBox = WidgetBase.extend({
    
        $sb: undefined,
        
        init: function() {
            this._super();
            this.$sb = $(this.elem);
            this.$sb = $("<div>...</div>");
            this.$sb.click(this.myUtility);
            ...
        },
        
        access: function() {
            ...
        },
        
        myUtility: function() {
            ...
        },
        
        refresh: function() {
            ...
        },
        
        getSomething: function() {
            ...
        },
        
        isKindaCool: undefined
        
    });
    
Personally, I prefer using the prototype pattern (explained in the Usage section) because 
it lets you specify local variables. As you can see above, constantly repeating "this" can get 
clunky and complicated (the context changes often with jQuery), and users can reference functions 
that should be private, like $("select").sb("myUtility"). 

Nevertheless, users may find the inheritance pattern useful, so support is included.

In either case, if better performance is needed, then you should try to reduce the use of closures 
and assign member functions to the prototype.


## Troubleshooting

Models like Javascript Simple Inheritance create a class in the following form:

    function MyClass() {
        function init( options ) {
            // initialization magic here...
        }
        init.apply(this, options);
    }

This presents a problem for jQuery-Proto because it calls new MyClass(), then applies 
the init function immediately. If we let this happen, it will be executed twice, potentially with 
different parameters and variables. We get around this by suppressing the init function's 
first invocation.

jQuery-Proto identifies the Simple Class Inheritance pattern by the existence of the
_super property on the object. So if you run into unexpected behavior or you're using a class pattern I 
haven't seen, you may have problems. If you do, let me know! Maybe I can modify jQuery-Proto 
so it works for you.