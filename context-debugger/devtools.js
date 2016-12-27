

// The function below is executed in the context of the inspected page.
var page_getProperties = function() {
  try {
    function debugObject(obj) {
      var noProto = Object.create(null);
      
      Object.keys(obj || {}).forEach(function(x) {
        if (x.startsWith('_')) {
          return;
        }

        noProto[x] = obj[x];
      });

      return noProto;
    }

    function controllerDebugObject(controller) {
      let controllerDebugger = debugObject({
        Controller: controller,
        'View-Model': controller.viewModel
      });

      if (controller.view) {
        controllerDebugger.View = controller.view;
      }

      return controllerDebugger;
    }

    function _getRepeaterContext(node) {
      var current = node.nextSibling;

      while(current) {
        if (current.nodeType === 8 && current.viewSlot) {
          var children = current.viewSlot.children;

          for (var i = 0, ii = children.length; i < ii; ++i) {
            var view = children[i];
            var currentChild = view.firstChild
            var lastChild = view.lastChild;
            var nextChild;

            while (currentChild) {
              nextChild = currentChild.nextSibling;
              
              if (currentChild === node) {
                return view.bindingContext;
              }

              if (currentChild === lastChild) {
                break;
              }

              currentChild = nextChild;
            }
          }
        }

        current = current.nextSibling;
      }

      return null;
    }

    function _getBindingContext(node) {
      if (!node) {
        return null;
      }

      if (node.aurelia) {
        return node.aurelia.root.viewModel;
      } else if (node.au) {
        var au = node.au;

        if (au.controller) { //custom element
          var controller = au.controller;
          var tagName = node.tagName ? node.tagName.toLowerCase() : null;
          var repeaterContext;

          if (tagName === 'router-view') {
            return controller.viewModel.view.controller.viewModel;
          } else if (tagName === 'compose') {
            return controller.viewModel.currentViewModel;
          } else if (controller['with']) {
            return controller['with'].viewModel.value;
          } else if (repeaterContext = _getRepeaterContext(node)) {
            return repeaterContext;
          } else {

          }
        }
      }

      return _getBindingContext(node.parentNode);
    }

    function getBindingContext(node) {
      var repeaterContext;

      if (repeaterContext = _getRepeaterContext(node)) {
        return repeaterContext;
      }

      return _getBindingContext(node.parentNode);
    }

    var selectedNode = $0;
    var inspector = debugObject();

    if (selectedNode.au) {
      var au = selectedNode.au;

      if (au.controller) {
        inspector['Custom Element'] = controllerDebugObject(au.controller);
      }

      var tagName = selectedNode.tagName ? selectedNode.tagName.toLowerCase() : null;
      var customAttributes = Object.keys(au).filter(function(key) {
        return key !== 'controller' && key !== tagName;
      });

      if (customAttributes.length) {
        var customAttributesDebug = inspector['Custom Attributes'] = debugObject();
        customAttributes.forEach(function(x) { customAttributesDebug[x] = controllerDebugObject(au[x]); });
      }
    }

    inspector['Binding Context'] = getBindingContext(selectedNode);

    return inspector;
  } catch (e) {
    console.log('Aurelia Properties plug-in error:', e);
  }
};

chrome.devtools.panels.elements.createSidebarPane(
  "Aurelia",
  function(sidebar) {
    function updateElementProperties() {
      sidebar.setExpression("(" + page_getProperties.toString() + ")()");
    }

    updateElementProperties();

    chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
  }
);
