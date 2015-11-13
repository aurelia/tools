// The function below is executed in the context of the inspected page.
var page_getProperties = function () {
  try {
    function addModelProperties(key, model, useLongName) {
      for (var property in model.__observers__) {
        var observer = model.__observers__[property];
        var propertyName = observer.propertyName;
        var currentValue = observer.getValue ? observer.getValue() : observer.currentValue;
        var getType = {};
        var isFunction = (property && getType.toString.call(property) === '[object Function]');
        if (!isFunction && propertyName !== undefined) {
          props.push({
            'name': useLongName ? key + "." + propertyName : propertyName,
            'value': currentValue
          });
        }
      }
    }

    var data = window.jQuery && $0 ? jQuery.data($0) : {};
    var selectedNode = $0;
    var aureliaNode = selectedNode;
    // go up the structure until an element affected by aurelia is found
    while (aureliaNode !== null && aureliaNode !== undefined && aureliaNode.au === undefined) {
      aureliaNode = aureliaNode.parentNode;
    }

    if (!aureliaNode) {
      return false;
    }

    var props = [];

    Object.keys(aureliaNode.au).forEach(function (key) {
      var model = aureliaNode.au[key].model || aureliaNode.au[key].viewModel; // compatibility with aurelia 0.17 and 0.18
      if (model && key !== 'controller') {
        var useLongName = aureliaNode.au['controller'] === undefined || $0 !== aureliaNode;
        addModelProperties(key, model, useLongName);
      }
    });

    if (props.length !== 0) {
      var copy = {__proto__: null};
      props.forEach(function (prop) {
        copy[prop.name] = prop.value;
      });
      return copy;
    }
    return null;
  }
  catch (e) {
    console.log('Aurelia Properties plug-in error:', e);
  }
};

chrome.devtools.panels.elements.createSidebarPane(
  "Aurelia Properties",
  function (sidebar) {
    function updateElementProperties() {
      sidebar.setExpression("(" + page_getProperties.toString() + ")()");
    }

    updateElementProperties();
    chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
  });


