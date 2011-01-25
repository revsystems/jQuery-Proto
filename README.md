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

Requires [jQuery](http://jquery.com) and a plugin you've written! jQuery-Proto is not a stand-alone plugin; 
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
        
        // a function that can be called whenever the classoh is accessed via jQuery
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
    
    
## Options

The following options let you change the names of variables that are utilized by jQuery-Proto. 
It is recommended that you only change them if you are using a class pattern that interferes 
with their operation.

** id ** (String, required, default "id")

The name of the public variable assigned to the class on creation denoting a unique ID. 
If you need to remove your plugin from an object, you should call 
$(this.elem).removeData(this.id) in your destructor.

** elem ** (String, required, default "elem")

The name of the public variable assigned to the class on creation, which is a reference 
to the DOM element context. e.g. If you used $("div#my_select").sb(), this.elem
would point to <div id="my_select"></div>.

** init ** (String, required, default "init")

The name of your constructor.

** access ** (String, optional, default "access")

The name of the public function that should be called every time your class 
is accessed through the jQuery plugin. This function allows you to update 
internal variables, if necessary, before any public methods are called or 
public variables are set.


## Leveraging [Ben Alman's jQuery getObject plugin](http://benalman.com/projects/jquery-getobject-plugin/)

If you want to leverage $.getObject and $.setObject, it needs to 
be included before jquery.proto.js:

    <script type="text/javascript" src="jquery.ba-getobject.min.js"></script>
    <script type="text/javascript" src="jquery.proto.js"></script>

With that done, get.and.set.objects.deeply = true, as the plugin says.
We can do things like:

    $("select").sb("a.very.deep.set.option", true);
    console.log($("select").sb("a.very.deep.set.option"));

    
## Using the [John Resig's Simple Javascript Inheritance](http://ejohn.org/blog/simple-javascript-inheritance/) framework

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
    
Personally, I prefer using the function-as-class pattern (explained in the Usage section) because 
it lets you specify local variables. As you can see above, constantly repeating "this" can get 
clunky and complicated (the context changes often with jQuery), and users can reference functions 
that should be private, like $("select").sb("myUtility"). 

Nevertheless, users may find the inheritance pattern useful, so support is included.


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