function Jquery(selector) {
    this[_toArray] = function(collection) {
        const length = collection.length;
        const result = new Array(length);
        for (let i = 0; i < length; i++) {
            result[i] = collection[i]
        }
        return result
    };
    this[_querySelector] = function(selector, context) {
        if (/^[.#]?[\w-]*$/.test(selector)) {
            if (selector[0] === '#') {
                const element = (context.getElementById ? context : document).getElementById(selector.slice(1));
                return element ? [element] : []
            }
            if (selector[0] === '.') {
                return context.getElementsByClassName(selector.slice(1))
            }
            return context.getElementsByTagName(selector)
        }
        return context.querySelectorAll(selector)
    };
    this[_timeout] = null;

    function createDocument(html) {
        if (/^<(\w+)\s*\/?>(?:<\/\1>|)$/.test(html))
            return [document.createElement(RegExp.$1)];
        const elements = [];
        const container = document.createElement('div');
        const children = container.childNodes;
        container.innerHTML = html;
        for (let i = 0, l = children.length; i < l; i++)
            elements.push(children[i]);
        return elements
    }

    function _selector(selector, context) {
        if (typeof selector === "function")
            return $(document).ready(selector);
        context = context ? context : document;
        let collection, extSelector;
        let indexSelectors = [new RegExp(":eq+\\(\\d+\\)"), new RegExp(":gt+\\(\\d+\\)"), new RegExp(":lt+\\(\\d+\\)"), new RegExp(":even"), new RegExp(":odd"), new RegExp(":first"), new RegExp(":last")];
        if (!selector)
            collection = document.querySelectorAll(null);
        else if (selector instanceof Jquery)
            return selector.el;
        else if (typeof selector !== 'string')
            collection = selector.nodeType || selector === window ? [selector] : selector;
        else if (/^\s*<(\w+|!)[^>]*>/.test(selector))
            collection = createDocument(selector);
        else {
            let target_index;
            indexSelectors.map(function(value, index) {
                if (value.test(selector)) {
                    target_index = index;
                    extSelector = value.exec(selector);
                    selector = selector.split(extSelector)[0]
                }
            });
            context = typeof context === 'string' ? document.querySelector(context) : context.length ? context[0] : context;
            if (/^[.#]?[\w-]*$/.test(selector)) {
                if (selector[0] === '#') {
                    const element = (context.getElementById ? context : document).getElementById(selector.slice(1));
                    return element ? [element] : []
                }
                else if (selector[0] === '.') {
                    collection = context.getElementsByClassName(selector.slice(1))
                }
                else
                    collection = context.getElementsByTagName(selector)
            }
            else
                collection = context.querySelectorAll(selector);
            if (extSelector) {
                let new_collection = [];
                extSelector = parseInt(extSelector[0].replace(/^\D+/g, ''));
                const length = collection.length;
                const result = new Array(length);
                for (let i = 0; i < length; i++) {
                    result[i] = collection[i]
                }
                result.forEach(function(value, index) {
                    if (target_index === 0 && index === extSelector)
                        new_collection.push(value);
                    else if (target_index === 1 && extSelector <= index)
                        new_collection.push(value);
                    else if (target_index === 2 && extSelector >= index)
                        new_collection.push(value);
                    else if (target_index === 3 && index % 2 === 0)
                        new_collection.push(value);
                    else if (target_index === 4 && index % 2 === 1)
                        new_collection.push(value);
                    else if (target_index === 5 && index === 0)
                        new_collection.push(value);
                    else if (target_index === 6 && index === this[_toArray](collection).length - 1)
                        new_collection.push(value)
                });
                collection = new_collection
            }
        }
        return collection
    }
    this.el = _selector(selector);
    // this[_toArray](this.el).forEach(function(value, index) {
    //     that[index] = value
    // })
}
/**
 * Selects all elements with given selector.
 * @function $
 * @param {string | HTMLElement} selector
 * @example $("*") // Select all elements in document
 * @example $(".class") // Selects all elements with the given class.
 * @example $("#id") // Selects a element with the given id.
 * @example $("[name=”value”]") // Selects elements that have the specified attribute with a value exactly equal to a certain value.
 * @example $("[name]") // Selects elements that have the specified attribute, with any value.
 * @example $(".class:eq(index)") // Select the element at index n within the matched set.
 * @example $(".class:gt(index)") // Select all elements at an index greater than index within the matched set.
 * @example $(".class:lt(index)") // Select all elements at an index less than index within the matched set.
 * @example $(".class:odd") // Selects odd elements, zero-indexed.
 * @example $(".class:even") // Selects even elements, zero-indexed.
 */
const $ = function(selector) {
    return new Jquery(selector)
}, _toArray = Symbol('toArray'), _querySelector = Symbol('querySelector'),
    _timeout = Symbol('timeout'), getHandlers = function(element) {
        if (!element.bind_events)
            element.bind_events = unusedKeys.length === 0 ? ++handler_id : unusedKeys.pop()
        return handlers[element.bind_events] || (handlers[element.bind_events] = [])
    }, clearHandlers = function(element) {
        if (handlers[element.bind_events]) {
            handlers[element.bind_events] = null;
            element.bind_events = null;
            unusedKeys.push(element.bind_events)
        }
    },
    getSideNav = function(element) {
    if (!element.sidenav) {
        element.sidenav = unusedKeys.length === 0 ? ++sideNav_id : unusedKeys.pop()
    }
    const key = element.sidenav;
    return sideNav[key] || (sideNav[key] = [])
};
let sideNav_id = 1, sideNav = {}, handler_id = 1, handlers = {}, unusedKeys = [];
Jquery.prototype = {
    constructor: Jquery,
    /**
     * This will also be an instance member, Observable#save.
     * @memberof $#
     * @param {function} handler
     * @example $(document).ready(function(){
     *     ...
     * })
     */
    ready: function(handler) {
        if (/complete|loaded|interactive/.test(document.readyState) && document.body)
            handler();
        else {
            document.addEventListener('DOMContentLoaded', handler, !1);
            document.getElementsByTagName("html")[0].style.visibility = "visible";
        }
        return this
    },
    /**
     * Get the descendants of each element in the current set of matched elements, filtered by a selector, jQuery object, or element. Selector can be use same as selectors
     * @memberof $#
     * @param {string | HTMLElement} selector
     * @example $(".class").find(selector)
     * @return $
     */
    find: function(selector) {
        let nodes = [];
        const that = this;
        this[_toArray]((this.el)).forEach(function(value) {
            that[_toArray](that[_querySelector](selector, value)).forEach(function(child) {
                if (nodes.indexOf(child) === -1) {
                    nodes.push(child)
                }
            })
        });
        return $(nodes)
    },
    map: function(callback) {
        this[_toArray](this.el).map(callback)
    },
    forEach: function(callback) {
        this[_toArray](this.el).forEach(callback)
    },
    filter: function(callback) {
        return $(this[_toArray](this.el).filter(callback))
    },
    each: function(callback) {
        this[_toArray](this.el).forEach(callback)
    },
    some: function(callback) {
        return this[_toArray](this.el).some(callback)
    },
    pop: function() {
        return $(this[_toArray](this.el).pop())
    },
    shift: function() {
        return $(this[_toArray](this.el).shift())
    },
    /**
     * Get the index of the first element in the set of matched elements.
     * @memberof $#
     * @param {HTMLElement | $} element
     * @example $(".class").push(element) // Add an element to the current set of matched elements.
     * @example $(".class").push($(".class")) // Add elements as Jquery ($) object to the current set of matched elements.
     * @return {$}
     */
    push: function(element) {
        const that=this;
        let arr=this[_toArray](that.el);
        if(element instanceof Jquery){
            this[_toArray](element.el).forEach(function(value){
                arr.push(value);
            });
            return $(arr)
        }
        else if(element instanceof Node) {
            arr.push(element);
            return $(arr)
        }
        else
            console.error("Element must be instance of Jquery object or HTML node element!.")

    },
    reverse: function() {
        return $(this[_toArray](this.el).reverse())
    },
    /**
     * Get the index of the first element in the set of matched elements.
     * @memberof $#
     * @example $(".class").index()
     * @return {number}
     */
    index: function() {
        let element = this[_toArray](this.el)[0];
        if (!element) {
            return -1;
        }
        var currentElement = element,
            index = 0;

        while(currentElement.previousElementSibling) {
            index++;
            currentElement = currentElement.previousElementSibling;
        }
        return index
    }, // add
    /**
     * Adds the specified class(es) to each element in the set of matched elements.
     * @memberof $#
     * @param {string} className
     * @example $(".class").addClass(className)
     * @return $
     */
    addClass: function(className) {
        this[_toArray](this.el).forEach(function(value) {
            if (value.className.split(" ").indexOf(className) === -1)
                value.className += " "+className
        });
        return this
    },
    /**
     * Determine whether any of the matched elements are assigned the given class.
     * @memberof $#
     * @param {string} className
     * @example $(".class").hasClass(className)
     * @return {boolean}
     */
    hasClass: function(className) {
        return this[_toArray](this.el).some(function(value) {
            return value.className.split(" ").indexOf(className) > -1
        })
    },
    /**
     * Remove a single class or multiple classes from each element in the set of matched elements.
     * @memberof $#
     * @param {string} className
     * @example $(".class").removeClass(className)
     * @return {$}
     */
    removeClass: function(className) {
        this[_toArray](this.el).forEach(function(value) {
            if (value.className.split(" ").indexOf(className) > -1)
                value.className = value.className.replace(new RegExp("(?:^|\\s+)" + className + "(?:\\s+|$)", "g"), " ")
        });
        return this
    },
    /**
     * Add or remove one or more classes from each element in the set of matched elements, depending on either the class’s presence or the value of the state argument.
     * @memberof $#
     * @param {string} className
     * @example $(".class").toggleClass(className)
     * @return {$}
     */
    toggleClass: function(className) {
        this[_toArray](this.el).forEach(function(value) {
            if (value.className.split(" ").indexOf(className) > -1)
                value.className = value.className.replace(new RegExp("(?:^|\\s+)" + className + "(?:\\s+|$)", "g"), "");
            else value.className = value.className ? [value.className, className].join(' ') : className
        });
        return this
    },
    /**
     * @memberof $#
     * @param {string} val
     * @example $(".class").val(val) // Set the given value of the all elements in the set of matched elements.
     * @example $(".class").val() // Get the current value of the first element in the set of matched elements.
     * @return {$ | string}
     */
    val: function(val) {
        if (val) {
            this[_toArray](this.el).forEach(function(value) {
                value.value = val
            });
            return this
        } else return this.el[0].value
    },
    /**
     * Add or remove one or more classes from each element in the set of matched elements, depending on either the class’s presence or the value of the state argument.
     * @memberof $#
     * @param {string} prop
     * @param val
     * @example $(".class").prop(prop) // Get the value of a property for the first element in the set of matched elements.
     * @example $(".class").prop(prop, val) // Set a property for the set of matched elements.
     * @return {$ | string}
     */
    prop: function(prop, val) {
        if (val) {
            this[_toArray](this.el).forEach(function(value) {
                value[prop] = val
            });
            return this
        }
        else if(this.el[0])
            return this.el[0][prop]
    },
    /**
     * @memberof $#
     * @param {string} html
     * @example $(".class").html(html) // Set the html contents of the all elements in the set of matched elements.
     * @example $(".class").html() // Get the html contents of the first element in the set of matched elements.
     * @return {$ | string}
     */
    html: function(html) {
        if (html) {
            this[_toArray](this.el).forEach(function(value) {
                value.innerHTML = html
            });
            return this
        } else return this[_toArray](this.el)[0].innerHTML
    },
    /**
     * @memberof $#
     * @param {string} attr
     * @param val
     * @example $(".class").attr(attr, val) // Set the value of an attribute for the all elements in the set of matched elements.
     * @example $(".class").attr(attr) // Get the value of an attribute for the first element in the set of matched elements.
     * @return {$ | string}
     */
    attr: function(attr, val) {
        if (val) {
            this[_toArray](this.el).forEach(function(value) {
                value.setAttribute(attr, val)
            });
            return this
        } else return this.el[0].getAttribute(attr)
    },
    /**
     * @memberof $#
     * @param {string} key
     * @param val
     * @example $(".class").data(key, val) // Store arbitrary data associated with the matched elements.
     * @example $(".class").data(attr) // Return arbitrary data associated with the first element in the jQuery collection, as set by data() or by an HTML5 data-* attribute.
     * @example $(".class").data() // Return all the data stores of the first element in the set of matched elements.
     * @return {$ | string}
     */
    data: function(key, val) {
        if(key){
            if (val) {
                this[_toArray](this.el).forEach(function(value) {
                    value.dataset[key] = val
                });
                return this
            } else return this.el[0].dataset[key]
        }
        else
            return this.el[0].dataset
    },
    /**
     * @memberof $#
     * @param {string} text
     * @example $(".class").text(text) // Set the text contents of the all elements in the set of matched elements.
     * @example $(".class").text() // Get the text contents of the first element in the set of matched elements.
     * @return {$ | string}
     */
    text: function(text) {
        if (text) {
            this[_toArray](this.el).forEach(function(value) {
                value.textContent = text
            });
            return this
        } else return this.el[0].textContent
    },
    /**
     * @memberof $#
     * @param {string} attr
     * @example $(".class").removeAttr(attr) // Remove an attribute from each element in the set of matched elements.
     * @return {$ | string}
     */
    removeAttr: function(attr) {
        this[_toArray](this.el).forEach(function(value) {
            value.removeAttribute(attr)
        });
        return this
    },
    /**
     * @memberof $#
     * @param {string | object} key
     * @param value
     * @example $(".class").css(key, value) // Set the computed style properties for all elements in the set of matched elements.
     * @example $(".class").css(key) // Get the computed style properties for the first element in the set of matched elements.
     * @example $(".class").css({
     *      propertyName1:propertyValue1,
     *      propertyName2:propertyValue2
     *}) // Set the computed style properties for all elements in the set of matched elements.
     * @return {$ | string | $}
     */
    css: function(key, value) {
        let prop, val;
        const that = this;
        let styleProps = [];
        if (typeof key === 'string') {
            if (typeof value === 'undefined')
                return window.getComputedStyle(that[_toArray](that.el)[0]).getPropertyValue(key);
            styleProps = {};
            styleProps[key] = value
        }
        else if (typeof key === 'object') {
            styleProps = key;
            for (prop in styleProps) {
                val = styleProps[prop];
                delete styleProps[prop];
                styleProps[prop.replace(/-([\da-z])/gi, function(matches, letter) {
                    return letter.toUpperCase()
                })] = val
            }
        }
        for (prop in styleProps) {
            that[_toArray](that.el).forEach(function(value) {
                try {
                    window.getComputedStyle(that[_toArray](that.el)[0]).setProperty(prop,value);
                }
                catch (err){
                    value.style[prop] = styleProps[prop]
                }
            })
        }
        return this
    },
    /**
     * @memberof $#
     * @example $(".class").offset() // Get the current coordinates of the first element, or set the coordinates of every element, in the set of matched elements, relative to the document.
     * @return {object} // {width: width, height: height, left: left, top: top}
     */
    offset: function () {
        return {
            width: parseFloat(this[_toArray](this.el)[0].offsetWidth),
            height: parseFloat(this[_toArray](this.el)[0].offsetHeight),
            left: parseFloat(this[_toArray](this.el)[0].offsetLeft),
            top: parseFloat(this[_toArray](this.el)[0].offsetTop)
        }
    },
    /**
     * @memberof $#
     * @param {HTMLElement} element
     * @example $(".class").append(element) // Insert content, specified by the parameter, to the end of each element in the set of matched elements.
     * @return {$}
     */
    append: function(element) {
        const that = this;
        that[_toArray](that.el).forEach(function(value) {
            if (value instanceof Node) {
                if (typeof element === 'string'){
                    value.insertAdjacentHTML('beforeend', element)
                }
                else {
                    if (element instanceof Node)
                        value.appendChild(element);
                    else {
                        let elements = element instanceof NodeList ? that[_toArray](element) : element;
                        elements.forEach(function(value2) {
                            value.appendChild(value2);
                        })
                    }
                }
            }
        });
        return this
    },
    /**
     * @memberof $#
     * @param {HTMLElement} element
     * @example $(".class").appendTo(element) // Insert every element in the set of matched elements to the end of the target.
     * @return {$}
     */
    appendTo: function(element) {
        $(element).append(this.el);
        return this
    },
    /**
     * @memberof $#
     * @param {HTMLElement} element
     * @example $(".class").after(element) // Insert content, specified by the parameter, after each element in the set of matched elements.
     * @return {$}
     */
    after: function(element) {
        const that = this;
        this[_toArray](this.el).forEach(function(value) {
            if (value instanceof Node) {
                if (typeof element === 'string')
                    value.insertAdjacentHTML('afterend', element);
                else {
                    if (element instanceof Node)
                        value.parentNode.insertBefore(element, value.nextSibling);
                    else {
                        const elements = element instanceof NodeList ? that[_toArray](element) : element;
                        elements.forEach(function(value2) {
                            value.parentNode.insertBefore(value2, value.nextSibling)
                        })
                    }
                }
            }
        });
        return this
    },
    /**
     * @memberof $#
     * @param {HTMLElement} element
     * @example $(".class").before(element) // Insert content, specified by the parameter, before each element in the set of matched elements.
     * @return {$}
     */
    before: function(element) {
        const that = this;
        this[_toArray](this.el).forEach(function(value) {
            if (value instanceof Node) {
                if (typeof element === 'string') {
                    value.insertAdjacentHTML('beforebegin', element)
                } else {
                    if (element instanceof Node)
                        value.parentNode.insertBefore(element, value);
                    else {
                        const elements = element instanceof NodeList ? that[_toArray](element) : element;
                        elements.forEach(function(value2) {
                            value.parentNode.insertBefore(value2, value)
                        })
                    }
                }
            }
        });
        return this
    },
    /**
     * @memberof $#
     * @param {HTMLElement} element
     * @example $(".class").prepend(element) // Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
     * @return {$}
     */
    prepend: function(element) {
        const that = this;
        this[_toArray](this.el).forEach(function(value) {
            if (value instanceof Node) {
                if (typeof element === 'string')
                    value.insertAdjacentHTML('afterbegin', element);
                else {
                    if (element instanceof Node)
                        value.insertBefore(element, value.firstChild);
                    else {
                        const elements = element instanceof NodeList ? that[_toArray](element) : element;
                        elements.forEach(function(value2) {
                            value.insertBefore(value2, value.firstChild)
                        })
                    }
                }
            }
        });
        return this
    },
    /**
     * @memberof $#
     * @example $(".class").clone() // Create a deep copy of the set of matched elements.
     * @return {HTMLElement}
     */
    clone: function() {
        let clones = [];
        this[_toArray](this.el).forEach(function(value) {
            clones.push(value.cloneNode(!0))
        });
        return $(clones)
    },
    /**
     * @memberof $#
     * @example $(".class").empty() // Remove all child nodes and text content of the set of matched elements from the DOM.
     * @return {$}
     */
    empty: function() {
        this[_toArray](this.el).forEach(function(value) {
            value.innerHTML = ""
        });
        return this
    },
    /**
     * @memberof $#
     * @example $(".class").remove() // Remove the set of matched elements from the DOM.
     * @return {$}
     */
    remove: function() {//check
        for(let i = 0; i< this.el.length; i++){
            // this.el[i].parentNode.removeChild(this.el[i])
            this.el[i].remove();
        }
        return this
    },
    /**
     * Attach a handler to an event(s) for the elements.
     * @memberof $#
     * @param {string | array} eventNames
     * @param {function} handler
     * @param {boolean} once // default: false
     * @example $(".class").on("click", handler)
     * @return {$}
     */
    on: function(eventNames, handler, once) {
        const that = this;
        let parts, namespace;
        eventNames.split(' ').forEach(function(eventName) {
            parts = eventName.split('.');
            eventName = parts[0] || null;
            namespace = parts[1] || null;
            that[_toArray](that.el).forEach(function(element) {
                if (once) {
                    const listener = handler;
                    handler = function(event) {
                        listener.call(element, event);
                        that.off(eventNames, handler)
                    }
                }
                element.addEventListener(eventName, handler, !1);
                getHandlers(element).push({
                    eventName: eventName,
                    handler: handler,
                    namespace: namespace
                })
            })
        });
        return this
    },
    /**
     * Remove an event(s) handler.
     * @memberof $#
     * @param {string | array} eventNames
     * @param {function} handler
     * @example $(".class").off("click")
     * @return {$}
     */
    off: function(eventNames, handler) {
        const that = this;
        let parts, namespace, handlers;
        eventNames.split(' ').forEach(function(eventName) {
            parts = eventName.split('.');
            eventName = parts[0] || null;
            namespace = parts[1] || null;
            that[_toArray](that.el).forEach(function(element) {
                handlers = getHandlers(element);
                let filteredHandlers = handlers.filter(function(item) {
                    return ((!eventName || item.eventName === eventName) && (!namespace || item.namespace === namespace) && (!handler || item.handler === handler))
                });
                filteredHandlers.forEach(function(item) {
                    element.removeEventListener(item.eventName, item.handler, !1);
                    handlers.splice(handlers.indexOf(item), 1)
                });
                if (!eventName && !namespace && !handler) {
                    clearHandlers(element)
                } else if (handlers.length === 0) {
                    clearHandlers(element)
                }
            })
        });
        return this
    },
    /**
     * Remove an event(s) handler.
     * @memberof $#
     * @param {string | array} eventNames
     * @param {function} handler
     * @example $(".class").unbind("click", handler)
     * @return {$}
     */
    unbind: function(eventNames, handler) {
        this.off(eventNames, handler)
    },
    /**
     * Attach a handler to an event(s) for the elements. The handler is executed at most once per element per event type.
     * @memberof $#
     * @param {string | array} eventNames
     * @param {function} handler
     * @example $(".class").one("click", handler)
     * @return {$}
     */
    one: function(eventNames, handler) {
        this.on(eventNames, handler, 1)
    },
    /**
     * Execute all handlers and behaviors attached to the matched elements for the given event types.
     * @memberof $#
     * @param {string | array} eventNames
     * @param {object} options
     * @example $(".class").trigger("click", options)
     * @return {$}
     */
    trigger: function(eventNames, options) {
        let event;
        const that = this;
        eventNames.split(' ').forEach(function(eventName) {
            if (window.CustomEvent) {
                event = new CustomEvent(eventName, options)
            } else {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent(eventName, !0, !0, options)
            }
            that[_toArray](that.el).forEach(function(element) {
                element.dispatchEvent(event)
            })
        });
        return this
    },
    /**
     * Bind one or two handlers to the matched elements, to be executed when the mouse pointer enters and leaves the elements.
     * @memberof $#
     * @param {function} onMouseOver
     * @param {function} onMouseOut
     * @example $(".class").hover(onMouseOver, onMouseOut)
     * @return {$}
     */
    hover: function (onMouseOver, onMouseOut) {
        this.on("mouseover", onMouseOver);
        this.on("mouseout", onMouseOut);
        return this
    },
    /**
     * Bind an event handler to the “submit” JavaScript event, or trigger that event on an element.
     * @memberof $#
     * @param {function} handler
     * @example $(".class").submit(handler)
     * @return {$}
     */
    submit: function(handler) {
        return this.on("submit", handler)
    },
    /**
     * Resets the values of all elements in the matched forms
     * @memberof $#
     * @example $(".class").reset()
     * @return {$}
     */
    reset: function() {
        this[_toArray](this.el).forEach(function(val) {
            if(val.tagName === "FORM")
                val.reset()
        });
        return this
    },
    /**
     * @memberof $#
     * @param {string | HTMLElement} selector
     * @example $(".class").children(selector) // Get the children of each element filtered by given selector in the set of matched elements.
     * @example $(".class").children() // Get the children of each element in the set of matched elements.
     * @return {$}
     */
    children: function(selector) {
        const that = this;
        let children = [];
        let BreakException = {};
        this[_toArray](this.el).forEach(function(value) {
            let childNodes = value.querySelectorAll("*");
            childNodes.forEach(function(value2) {
                if (selector) {
                    try {
                        that[_toArray]($(selector).el).forEach(function(value3) {
                            if (value3.isEqualNode(value2)) {
                                children.push(value2.cloneNode(!0));
                                throw BreakException
                            }
                        })
                    } catch (e) {
                        if (e !== BreakException) throw e
                    }
                } else children.push(value2.cloneNode(!0))
            })
        });
        return $(children)
    },
    /**
     * @memberof $#
     * @param {string | HTMLElement} selector
     * @example $(".class").parents(selector) // Get the ancestors of each element filtered by given selector in the current set of matched elements.
     * @example $(".class").parents() // Get the ancestors of each element in the current set of matched elements.
     * @return {$}
     */
    parents: function(selector) {
        const that = this;
        let parents = [];
        let BreakException = {};
        this[_toArray](this.el).forEach(function(value) {
            value = value.parentNode;
            while (value) {
                if (selector) {
                    try {
                        that[_toArray]($(selector).el).forEach(function(value2) {
                            if (!parents.includes(value) && !["HTML", "#document", "BODY"].includes(value.nodeName) && value2.isEqualNode(value)) {
                                parents.push(value);
                                throw BreakException
                            }
                        })
                    } catch (e) {
                        if (e !== BreakException) throw e
                    }
                } else if (!parents.includes(value) && !["HTML", "#document", "BODY"].includes(value.nodeName))
                    parents.push(value);
                value = value.parentNode
            }
        });
        return $(parents)
    },
    /**
     * @memberof $#
     * @param {string | HTMLElement} selector
     * @example $(".class").siblings(selector) // Get the siblings of each element filtered by given selector in the set of matched elements.
     * @example $(".class").siblings() // Get the siblings of each element in the set of matched elements.
     * @return {$}
     */
    siblings: function(selector) {
        const that = this;
        let siblings = [];
        let BreakException = {};
        this[_toArray](this.parent().children().el).forEach(function(value) {
            if (selector) {
                try {
                    that[_toArray]($(selector).el).forEach(function(value2) {
                        if (!siblings.includes(value) && !["HTML", "#document", "BODY"].includes(value.nodeName) && value2.isEqualNode(value)) {
                            siblings.push(value);
                            throw BreakException
                        }
                    })
                } catch (e) {
                    if (e !== BreakException) throw e
                }
            } else if (!siblings.includes(value) && !["HTML", "#document", "BODY"].includes(value.nodeName))
                siblings.push(value)
        });
        return $(siblings)
    },
    /**
     * @memberof $#
     * @param {string | HTMLElement} selector
     * @example $(".class").parent(selector) // Get the parent of each element filtered by given selector in the current set of matched elements.
     * @example $(".class").parent() // Get the parent of each element in the current set of matched elements.
     * @return {$}
     */
    parent: function(selector) {
        const that = this;
        let parent = [];
        let BreakException = {};
        this[_toArray](this.el).forEach(function(value) {
            value = value.parentNode;
            if (selector) {
                try {
                    that[_toArray]($(selector).el).forEach(function(value2) {
                        if (!parent.includes(value) && !["HTML", "#document", "BODY"].includes(value.nodeName) && value2.isEqualNode(value)) {
                            parent.push(value);
                            throw BreakException
                        }
                    })
                } catch (e) {
                    if (e !== BreakException) throw e
                }
            } else {
                if (!parent.includes(value) && !["HTML", "#document", "BODY"].includes(value.nodeName))
                    parent.push(value)
            }
        });
        return $(parent)
    },
    /**
     * @memberof $#
     * @param {string | HTMLElement} selector
     * @example $(".class").closest(selector) // For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * @return {$}
     */
    closest: function(selector) {
        function _closest(el, selector) {
            let matchesFn;
            ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function(fn) {
                if (typeof document.body[fn] == 'function') {
                    matchesFn = fn;
                    return !0
                }
                return !1
            });
            let parent;
            while (el) {
                parent = el.parentElement;
                if (parent && parent[matchesFn](selector)) {
                    return parent
                }
                el = parent
            }
            return null
        }
        selector = selector ? selector : "";
        let closest = [];
        this[_toArray](this.el).forEach(function(value) {
            if (_closest(value, selector))
                closest.push(_closest(value, selector))
        });
        return $(closest)
    },
    /**
     * Encode a set of form elements as a string for submission.
     * @memberof $#
     * @example $(".class").serialize()
     * @return {string}
     */
    serialize: function() {
        let form = this[_toArray](this.el)[0];
        if (!form || form.nodeName !== "FORM") {
            console.error("serialize only used for form elements!");
            return
        }
        let i, j, q = [];
        for (i = form.elements.length - 1; i >= 0; i = i - 1) {
            if (form.elements[i].name === "") {
                continue
            }
            switch (form.elements[i].nodeName) {
                case 'INPUT':
                    switch (form.elements[i].type) {
                        case 'text':
                        case 'tel':
                        case 'email':
                        case 'hidden':
                        case 'password':
                        case 'button':
                        case 'reset':
                        case 'submit':
                            q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                            break;
                        case 'checkbox':
                        case 'radio':
                            if (form.elements[i].checked) {
                                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value))
                            }
                            break
                    }
                    break;
                case 'file':
                    break;
                case 'TEXTAREA':
                    q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                    break;
                case 'SELECT':
                    switch (form.elements[i].type) {
                        case 'select-one':
                            q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                            break;
                        case 'select-multiple':
                            for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                                if (form.elements[i].options[j].selected) {
                                    q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value))
                                }
                            }
                            break
                    }
                    break;
                case 'BUTTON':
                    switch (form.elements[i].type) {
                        case 'reset':
                        case 'submit':
                        case 'button':
                            q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                            break
                    }
                    break
            }
        }
        return q.join("&")
    },
    /**
     * Display the matched elements by fading them to opaque and visibility.
     * @memberof $#
     * @param {number} time // animation time as miliseconds
     * @param {function} callback // callback function fired when animation is done
     * @example $(".class").fadeIn(time, callback)
     * @return {$}
     */
    fadeIn: function(time, callback) {
        time = time ? time/10 : 50;
        this[_toArray](this.el).forEach(function (el) {
            el.style.opacity = 0;
            el.style.visibility = "visible";
            (function fade() {
                let val = parseFloat(el.style.opacity);
                if (!((val += .01) > 1)) {
                    el.style.opacity = val;
                    setTimeout(function(){
                        fade()
                    }, time);
                }
                else {
                    typeof callback === "function" ? callback(el) : "";
                    return this;
                }
            })();
        });
    },
    /**
     * Hide the matched elements by fading them to opaque and visibility.
     * @memberof $#
     * @param {number} time // animation time as miliseconds
     * @param {function} callback // callback function fired when animation is done
     * @example $(".class").fadeOut(time, callback)
     * @return {$}
     */
    fadeOut: function(time, callback) {
        time = time ? time/10 : 50;
        this[_toArray](this.el).forEach(function (el) {
            el.style.opacity = 1;
            (function fade() {
                if ((el.style.opacity-=.01) < 0) {
                    el.style.visibility = "hidden";
                    typeof callback === "function" ? callback(el) : "";
                    return this;
                } else {
                    setTimeout(function(){
                        fade()
                    }, time);
                }
            })();
        });
    },
    /**
     * Show the matched elements by fading them to opaque and visibility.
     * @memberof $#
     * @param {number} time // animation time as miliseconds
     * @param {string} direction // "left" for left to right, "top" for top to bottom
     * @example $(".class").show(time, direction)
     * @return {$}
     */
    show: function (time, direction) {
        time = time ? time : 0;
        this[_toArray](this.el).forEach(function (el) {
            el.style.visibility = "visible"
            el.style.position = "relative";
            el.style.transition = "all " + time + "s linear";
            if(direction === "left")
                el.style.left = $(el).attr("old");
            else if(direction === "top")
                el.style.top = $(el).attr("old");
            clearInterval(this[_timeout]);
            this[_timeout] = setInterval(function(){
                clearInterval(this[_timeout]);
                $(el).removeAttr("old");
                $(el).removeClass("hidden");
                el.style.transition = "";
            }, (time+0.2)*1000);
        });
        return this;
    },
    /**
     * Hide the matched elements by fading them to opaque and visibility.
     * @memberof $#
     * @param {number} time // animation time as miliseconds
     * @param {string} direction // "left" for left to right, "top" for top to bottom
     * @example $(".class").hide(time, direction)
     * @return {$}
     */
    hide: function (time, direction) {
        time = time ? time : 0;
        this[_toArray](this.el).forEach(function (el) {
            el.style.position = "relative";
            el.style.transition = "all " + time + "s linear";
            let pos = {
                left: el.parentNode.getBoundingClientRect().left - el.getBoundingClientRect().left,
                top: el.parentNode.getBoundingClientRect().top - el.getBoundingClientRect().top,
                height: el.parentNode.getBoundingClientRect().top + el.getBoundingClientRect().height,
                width: el.parentNode.getBoundingClientRect().left + el.getBoundingClientRect().width
            };
            if(direction === "left"){
                el.style.left = pos.left + "px";
                $(el).attr("old",pos.left+"px");
                el.style.left = "-" + pos.width + "px";
            }
            else if(direction === "top"){
                el.style.top = pos.top + "px";
                $(el).attr("old",pos.top + "px");
                el.style.top = "-" + pos.height + "px";
            }
            if(el.className.split(" ").indexOf("hidden") < 0)
                el.className += " hidden";
            clearInterval(this[_timeout]);
            this[_timeout] = setInterval(function(){
                clearInterval(this[_timeout]);
                el.style.visibility = "hidden";
                el.style.transition = "";
            }, (time+0.2)*1000);
        });
    },
    /**
     * Toggle the matched elements by fading them to opaque and visibility.
     * @memberof $#
     * @param {number} time // animation time as miliseconds
     * @param {string} direction // "left" for left to right, "top" for top to bottom
     * @example $(".class").toggle(time, direction)
     * @return {$}
     */
    toggle: function (time, direction) {
        time = time ? time : 0;
        this[_toArray](this.el).forEach(function (el) {
            if(direction === "left"){
                el.style.left = el.parentNode.getBoundingClientRect().left - el.getBoundingClientRect().left + "px";
            }
            else if(direction === "top"){
                el.style.top = el.parentNode.getBoundingClientRect().top - el.getBoundingClientRect().top + "px";
            }
            if($(el).hasClass("hidden"))
                $(el).show(time, direction);
            else
                $(el).hide(time, direction);
        });
    },
    modal: function (action) {
        if(action){
            this[_toArray](this.el).forEach(function (el) {
                if(action.toLowerCase() === 'open')
                    el.style.visibility = "visible";
                if(action.toLowerCase() === 'close')
                    el.style.visibility = "hidden";
            })
        }
        return this
    },
    sideNav: function (options) {
        const that = this;
        const onFocusOut = function(ev) {
            if(!$(ev.target).parents(options.target).el.length && !$(ev.target).is(that))
                $(that.el).sideNav("close");
        };
        const onTransitionEnd = function(ev){
            if($(this).attr("data-sideNavOpen") === "false")
                options.onClose && options.onClose($(options.target + ":eq(0)"));
        };
        if(typeof options === "object") {
            options.open = false;
            options.time = options.time ? options.time : 0;
            options.menuWidth = options.menuWidth ? options.menuWidth : 250;
            let pos = {position: "fixed", height: "100vh", width: options.menuWidth+"px", transition: "all "+options.time+"s ease-out"};
            pos.left = 0;
            pos.top = 0;
            pos.zIndex = 1000;
            pos.display = "";
            pos.visibility = "visible";
            options.edge = (options.edge && options.edge.toLowerCase() === "right") ? "right" : "left";
            if(options.edge.toLowerCase() === "left") {
                pos.transform = "translateX(-100%)";
            }
            else if(options.edge.toLowerCase() === "right") {
                pos.right = 0;
                pos.left = "auto";
                pos.transform = "translateX(100%)";
                document.getElementsByTagName("body")[0].style.overflowX = "hidden";
            }
            $(options.target).css(pos);
            if(!options.closeOnClick) {
                $(options.target).on("click mousedown", function (ev) {
                    if (["LI", "IMG"].indexOf(ev.target.tagName) > -1)
                        $(that.el).sideNav("close");
                });
            }
            that[_toArray](that.el).forEach(function (element) {
                getSideNav(element).push(options);
                element.sideNavHandler = function () {
                    $(element).sideNav("toggle");
                };
                $(element).on("click", element.sideNavHandler);
            });
            $(options.target).on("transitionend", onTransitionEnd);
        }
        else{
            let action = options;
            $(document).unbind("mousedown",onFocusOut); // check
            that[_toArray](that.el).forEach(function (element) {
                options = getSideNav(element)[0];
                if(options){
                    if(action.toLowerCase() === "toggle"){
                        action = options.open ? "close" : "open";
                    }
                    if(action.toLowerCase() === "destroy") {//ToDo: remove???
                        $(element).off("click",element.sideNavHandler);
                        $(document).off("mousedown",onFocusOut);
                        $(document).off("transitionend",onTransitionEnd);
                        sideNav[element.sidenav] = null;
                        element.sidenav = null;
                        element.sideNavHandler = null;
                    }
                    else if(action.toLowerCase() === "open") {
                        if (["left", "right"].indexOf(options.edge) > -1) {
                            $(options.target).css({transform: "translateX(0%)"});
                        }
                        options.onOpen && options.onOpen($(options.target + ":eq(0)"));
                        options.open = true;
                        getSideNav(element)[0] = options;
                        $(options.target).attr("data-sideNavOpen","true");
                        $(document).on("mousedown",onFocusOut); // check
                    }
                    else if(action.toLowerCase() === "close") {
                        if (options.edge === "left") {
                            $(options.target).css({transform: "translateX(-100%)"});
                        }
                        else if (options.edge === "right") {
                            $(options.target).css({transform: "translateX(100%)"});
                        }
                        options.open = false;
                        getSideNav(element)[0] = options;
                        $(options.target).attr("data-sideNavOpen","false");
                    }
                }
            })
        }
        return this
    },
    is: function (selector){
        const that = this;
        if(typeof selector === "function")
            that[_toArray](that.el).forEach(function (el, i) {
                selector(el, i)
        });
        else if (selector instanceof Node) {
            let same = false;
            that[_toArray](that.el).some(function (el, i) {
                if(selector.isSameNode(el)){
                    same=true;
                }
            });
            return same
        }
        else if (selector instanceof Jquery) {
            let same = false;
            that[_toArray](selector.el).some(function (el1, i) {
                that[_toArray](that.el).some(function (el2, i) {
                    if(el1.isSameNode(el2)){
                        same=true;
                    }
                });
            });
            return same
        }
        else {
            return that[_toArray](that.el).some(function (el, i) {
                if (/^[.#]?[\w-]*$/.test(selector)) {
                    if (selector[0] === '#') {
                        const element = document.getElementById(selector.slice(1));
                        return el.isSameNode(element)
                    }
                    if (selector[0] === '.') {
                        const elements = document.getElementsByClassName(selector.slice(1));
                        return $.inArray(el, that[_toArray](elements));
                    }
                    return el.tagName.toLowerCase() === selector.toLowerCase()
                }
            });
        }

    } // add
};
$.toast = function(message, backgroundColor, color, count, edge) {
    if(typeof backgroundColor === "object")
        tesodev_toast.show(message, backgroundColor);
    else{
        let options = {};
        options.backgroundColor = backgroundColor;
        options.color = color;
        options.count = count;
        options.edge = edge;
        tesodev_toast.show(message, options);
    }
};
/**
 * An ajax request can be created by using following codes.
 * @memberof $#
 * @param {object} options
 * @example
 * example of options
 * {
 *  url: URL,
 *  type: 'POST', // POST or GET
 *  processData: false,
 *  contentType: false,
 *  data: formData,
 *  headers: { "X-CSRF-TOKEN": $('meta[name="_token"]').attr('content') },
 *  success: function(response){
 *      console.log(response);
 *  },
 *  error: function(error){
 *      console.log(error);
 *  }
 * }
 * @example
 * example of options
 * {
 *      url: URL,
 *      type: 'POST', // POST or GET
 *      processData: false,
 *      contentType: false,
 *      data: formData,
 *      headers: { "X-CSRF-TOKEN": $('meta[name="_token"]').attr('content') },
 * }
 * .then(function(response) {
 *      console.log(response);
 * })
 * .catch(function(error) {
 *      console.log(error);
 * });
 *
 *
 * @example $.ajax(time, options)
 * @return {Promise}
 */
$.ajax = function(options) {
    function getQueryString(object) {
        return Object.keys(object).reduce(function(acc, item) {
            let prefix = !acc ? '' : acc + '&';
            return prefix + encodeURIComponent(item) + '=' + encodeURIComponent(object[item])
        }, '')
    }
    function ready(promisetypes, xhr) {
        return function handleReady() {
            if (xhr.readyState === xhr.DONE) {
                xhr.removeEventListener('readystatechange', handleReady, !1);
                promisetypes.always.apply(promisetypes, parseResponse(xhr));
                if (xhr.status >= 200 && xhr.status < 300) {
                    if (options.success) {
                        options.success(parseResponse(xhr)[0])
                    }
                    promisetypes.then.apply(promisetypes, parseResponse(xhr))
                } else {
                    if (options.error) {
                        options.error(parseResponse(xhr)[0])
                    }
                    promisetypes.catch.apply(promisetypes, parseResponse(xhr))
                }
            }
        }
    }
    function parseResponse(xhr) {
        let result;
        try {
            result = JSON.parse(xhr.responseText)
        } catch (e) {
            result = xhr.responseText
        }
        return [result, xhr]
    }
    function hasContentType(headers) {
        return Object.keys(headers).some(function(name) {
            return name.toLowerCase() === 'content-type'
        })
    }
    let url = options.url,
        type = options.type,
        data = options.data,
        headers = options.headers;
    let returntypes = ['then', 'catch', 'always'];
    let promisetypes = returntypes.reduce(function(promise, type) {
        promise[type] = function(callback) {
            promise[type] = callback
            return promise
        };
        return promise
    }, {});
    let xhr = new XMLHttpRequest();
    xhr.open(type, url, !0);
    xhr.withCredentials = options.hasOwnProperty('withCredentials');
    headers = headers || {};
    if (!hasContentType(headers)) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    Object.keys(headers).forEach(function(name) {
        (headers[name] && xhr.setRequestHeader(name, headers[name]))
    });
    xhr.addEventListener('readystatechange', ready(promisetypes, xhr), !1);
    xhr.send(typeof data === "object" ? getQueryString(data) : data);
    promisetypes.abort = function() {
        return xhr.abort()
    };
    return promisetypes
};
$.modal = function () {
    let modals = document.getElementsByClassName("modal");
    for (let i = 0; i < modals.length; i++) {
        modals[i].onclick = function (e) {
            if (e.target.className.split(" ").indexOf("modal") > -1) {
                // e.target.style.visibility = "hidden"; // check
                $(e.target).fadeOut(10)
            }
        };
    }
};
$.tabs = function (callback){
    let tabTitles = document.getElementsByClassName("tab-title");
    for(let i = 0; i < tabTitles.length; i++){
        let v = tabTitles[i], tagA = $(tabTitles[i]).find("a");
        for(let j = 0; j < tagA.el.length; j++) {
            let el = tagA.el[j];
            el.index = j;
            document.getElementById(v.getAttribute('target')).querySelector(".active").style.display = "block";
            el.onclick = function (e) {
                if(e.target.className.split(" ").indexOf("tab-title-active")<0) {
                    let a = document.getElementById(v.getAttribute('target'));
                    for (let k = 0; k < v.getElementsByTagName("a").length; k++) {
                        v.getElementsByTagName("a")[k].className = v.getElementsByTagName("a")[k].className.replace("tab-title-active", "");
                    }
                    for (let l = 0; l < a.querySelectorAll("div.tab-data").length; l++) {
                        a.querySelectorAll("div.tab-data")[l].style.display = "none";
                    }
                    let b = a.querySelector("#" + e.target.getAttribute("href").substr(1));
                    b.style.display = "block";
                    e.target.className += "tab-title-active";
                    callback(e.target, e.target.index);
                }
            };
        }
    }
    return this
};
$.inArray = function (value, array) {
    for (let i=0; i<array.length; i++) { if (array[i] === value) return true; }
    return false;
};