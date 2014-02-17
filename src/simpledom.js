/**
 * A super-simple DOM helper lib.
 *
 * @author Mike Botsko
 *
 * Contains methods useful for basic DOM manipulation, built to
 * mimic jQuery - developers who are familiar with jQuery will
 * have no trouble adapting to this.
 *
 * Works with all browser versions of the past few years.
 */
(function (window,undefined){

  var _$ = window.$;

  var simpleDOM = function(selector){
    return new simpleDOMEngine(selector);
  };

  /**
   * Returns $ to its original value in case
   * we're trampling the variable
   *
   * Returns a clean instance of our application
   * for your own variable.
   *
   * @return {object}
   */
  simpleDOM.noConflict = function(){
    if ( window.$ === window.simpleDOM ){
      window.$ = _$;
    }
    return window.simpleDOM;
  };

  // Wrapping object of any passed selector
  var simpleDOMEngine = function(selector){

    this._raw_selector = selector;

    var _matches = [];
    if( typeof selector === "object" ){
        _matches = [selector];
    }
    else if( typeof selector === "function" ){
      this.ready(selector);
    }
    else if( typeof selector === "string" ){
      if( 'querySelectorAll' in document ){
        _matches = document.querySelectorAll(this._raw_selector);
      }
      // For IE7. Won't actually use css selectors but this is better than
      // falling over and dying.
      else {
        if( selector.indexOf("#") === 0 ){
          _matches = [ document.getElementById( selector.replace('#','') ) ];
        } else {
          _matches = [ document.getElementsByTagName( selector ) ];
        }
      }
    }
    return this;
  };

  simpleDOMEngine.prototype = {

    // store selector
    _raw_selector: false,

    /**
     * Returns a wrapper instance of a single
     * element.
     * @param k
     * @returns {*}
     */
    get: function(k){
        return new simpleDOMEngine(this[k]);
    },

    /**
     * Iterates every matching element and applies
     * a function
     * @param  {[type]} closure [description]
     * @return {[type]}         [description]
     */
    each: function( closure ){
      if( typeof closure !== "function" ) return false;
      for( var n = 0, l = this.length; n < l; n++ ){
        closure.call(this[n],n);
      }
      return this;
    },

    /**
     * Execute function when the document has loaded
     * @param  {[type]} closure [description]
     * @return {[type]}         [description]
     */
    ready: function( closure ){
      if( typeof closure !== "function" ) return;
      window.document.onreadystatechange = function(){
        if (window.document.readyState == "complete" || window.document.readyState == "loaded"){
          closure();
        }
      };
    },

    /**
     * Returns an array of existing classes for an element
     * @param  {[type]} elem [description]
     * @return {[type]}      [description]
     */
    getClasses: function( elem ){
      return (elem.className !== "" ? elem.className.split(' ') : []);
    },
    /**
     * Adds a new CSS class to each element
     *
     * @param className
     * @returns simpleDOM
     */
    addClass: function( className ){
      for( var n = 0, l = this.length; n < l; n++ ){
        var classes = this.getClasses(this[n]);
        classes.push(className);
        this[n].className = classes.join(' ');
      }
      return this;
    },
    /**
     * Removes a CSS class name from an element
     * @param className
     * @returns simpleDOM
     */
    removeClass: function( className ){
      var regex = new RegExp('(?:^|\\s)'+className+'(?!\\S)');
      for( var n = 0, l = this.length; n < l; n++ ){
        this[n].className = this[n].className.replace( regex , '' );
      }
      return this;
    },
    /**
     * Determine if an element has a CSS class name.
     *
     * @todo Only works for the first element matched by
     * the selector. Will not currently work on subsequent
     * elements
     *
     * @param className
     * @returns boolean
     */
    hasClass: function( className ){
      var regex = new RegExp('(?:^|\\s)'+className+'(?!\\S)');
      if( this.length >= 1 ){
        return this[0].className.match( regex ) || false;
      }
      return false;
    },

    /**
     * Binds eventHandler of eventType to all elements
     * matching selector.
     *
     * @param eventType
     * @param eventHandler
     * @returns simpleDOM
     */
    bind: function( eventType, eventHandler ){
      for( var n = 0, l = this.length; n < l; n++ ){
        var eventElem = this[n];
        if(eventElem.addEventListener){
          eventElem.addEventListener(eventType, eventHandler, false);
        } else {
          eventElem.attachEvent('on'+eventType, eventHandler);
        }
      }
      return this;
    },
    /**
     * Unbinds an event from all elements matching selector.
     *
     * @param eventType
     * @param eventHandler
     * @returns {*}
     */
    unbind: function( eventType, eventHandler ){

      for( var n = 0, l = this.length; n < l; n++ ){
        var eventElem = this[n];
        if(eventElem.removeEventListener){
          eventElem.removeEventListener(eventType, eventHandler, false);
        } else {
          eventElem.detachEvent('on'+eventType, eventHandler);
        }
      }
      return this;
    },

    /**
     * Set css attribute values
     *
     * @param att
     * @param val
     * @returns simpleDOM
     */
    css: function( att, val ){
      for( var n = 0, l = this.length; n < l; n++ ){
        this[n].style[att] = val;
      }
      return this;
    },
    /**
     * Short-cut for hiding an element
     *
     * @returns simpleDOM
     */
    hide: function(){
      this.css('display', 'none');
      return this;
    },
    /**
     * Short-cut for showing a hidden element
     *
     * @returns simpleDOM
     */
    show: function(){
      this.css('display', 'block');
      return this;
    },

    /**
     * Returns the current value of an HTML attribute
     * If second argument provided, it will set the value
     * or remove the attribute if the value is empty.
     *
     * @param attr
     * @returns {string}
     */
    attr: function( attr, value ){
      // @todo needs iteration
      if( value === undefined ){
        return this[0].getAttribute(attr);
      } else {
        var hasAttr = false;
        if( 'hasAttribute' in this[0] ){
          hasAttr = this[0].hasAttribute(attr)
        } else {
          hasAttr = !(this[0][attr] === undefined);
        }
        if( hasAttr ){
          if( value === '' ){
            this[0].removeAttribute(attr);
          } else {
            this[0].setAttribute(attr,value);
          }
        } else {
          var newAttr = document.createAttribute(attr);
          newAttr.value = val;
          this[0].setAttributeNode(newAttr);
        }
      }
      return this;
    }
  };

  // map!
  window.simpleDOM = simpleDOM;
  window.$ = window.simpleDOM;

})(this);