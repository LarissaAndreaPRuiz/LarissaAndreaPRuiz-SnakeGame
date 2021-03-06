;
(function(window, document) {


    var options = window.html5 || {};


    var reSkip = /^<|^(?:button|form|map|select|textarea|object|iframe)$/i;


    var saveClones = /^<|^(?:a|b|button|code|div|fieldset|form|h1|h2|h3|h4|h5|h6|i|iframe|img|input|label|li|link|ol|option|p|param|q|script|select|span|strong|style|table|tbody|td|textarea|tfoot|th|thead|tr|ul)$/i;


    var supportsHtml5Styles;

    var supportsUnknownElements;

    (function() {
        var a = document.createElement('a');

        a.innerHTML = '<xyz></xyz>';


        supportsHtml5Styles = ('hidden' in a);

        if (supportsHtml5Styles && typeof injectElementWithStyles == 'function') {
            injectElementWithStyles('#modernizr{}', function(node) {
                node.hidden = true;
                supportsHtml5Styles = (window.getComputedStyle ?
                    getComputedStyle(node, null) :
                    node.currentStyle).display == 'none';
            });
        }

        supportsUnknownElements = a.childNodes.length == 1 || (function() {

            try {
                (document.createElement)('a');
            } catch (e) {
                return true;
            }
            var frag = document.createDocumentFragment();
            return (
                typeof frag.cloneNode == 'undefined' ||
                typeof frag.createDocumentFragment == 'undefined' ||
                typeof frag.createElement == 'undefined'
            );
        }());

    }());

    /**
     
     * @param {Document} ownerDocument The document.
     * @param {String} cssText The CSS text.
     * @returns {StyleSheet} The style element.
     */
    function addStyleSheet(ownerDocument, cssText) {
        var p = ownerDocument.createElement('p'),
            parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

        p.innerHTML = 'x<style>' + cssText + '</style>';
        return parent.insertBefore(p.lastChild, parent.firstChild);
    }

    /**
     
     * @private
     * @returns {Array} An array of shived element node names.
     */
    function getElements() {
        var elements = html5.elements;
        return typeof elements == 'string' ? elements.split(' ') : elements;
    }

    /**
     * @private
     * @param {Document|DocumentFragment} ownerDocument The document.
     */
    function shivMethods(ownerDocument) {
        var cache = {},
            docCreateElement = ownerDocument.createElement,
            docCreateFragment = ownerDocument.createDocumentFragment,
            frag = docCreateFragment();

        ownerDocument.createElement = function(nodeName) {

            if (!html5.shivMethods) {
                docCreateElement(nodeName);
            }

            var node;

            if (cache[nodeName]) {
                node = cache[nodeName].cloneNode();
            } else if (saveClones.test(nodeName)) {
                node = (cache[nodeName] = docCreateElement(nodeName)).cloneNode();
            } else {
                node = docCreateElement(nodeName);
            }


            return node.canHaveChildren && !reSkip.test(nodeName) ? frag.appendChild(node) : node;
        };

        ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
            'var n=f.cloneNode(),c=n.createElement;' +
            'h.shivMethods&&(' +

            getElements().join().replace(/\w+/g, function(nodeName) {
                cache[nodeName] = docCreateElement(nodeName);
                frag.createElement(nodeName);
                return 'c("' + nodeName + '")';
            }) +
            ');return n}'
        )(html5, frag);
    }



    /**

     * @memberOf html5
     * @param {Document} ownerDocument The document to shiv.
     * @returns {Document} The shived document.
     */
    function shivDocument(ownerDocument) {
        var shived;
        if (ownerDocument.documentShived) {
            return ownerDocument;
        }
        if (html5.shivCSS && !supportsHtml5Styles) {
            shived = !!addStyleSheet(ownerDocument,

                'article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}' +

                'audio{display:none}' +

                'canvas,video{display:inline-block;*display:inline;*zoom:1}' +

                '[hidden]{display:none}audio[controls]{display:inline-block;*display:inline;*zoom:1}' +

                'mark{background:#FF0;color:#000}'
            );
        }
        if (!supportsUnknownElements) {
            shived = !shivMethods(ownerDocument);
        }
        if (shived) {
            ownerDocument.documentShived = shived;
        }
        return ownerDocument;
    }


    /**
     * @type Object
     * @example
     *
     * // options can be changed before the script is included
     * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
     */
    var html5 = {

        /**
         
         * @memberOf html5
         * @type Array|String
         */
        'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video',

        /**
         
         * @memberOf html5
         * @type Boolean
         */
        'shivCSS': !(options.shivCSS === false),

        /**
    
         * @memberOf html5
         * @type Boolean
         */
        'shivMethods': !(options.shivMethods === false),

        /**
   
     * @memberOf html5
     * @type String
     */
        'type': 'default',


        'shivDocument': shivDocument
    };



    window.html5 = html5;


    shivDocument(document);

}(this, document));