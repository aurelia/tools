// The function below is executed in the context of the inspected page.
var page_getProperties = function() {
  var data = window.jQuery && $0 ? jQuery.data($0) : {};
  // The current selected node
  var selectedElement = $0;
  if (selectedElement.parentNode){
    var parent = selectedElement.parentNode;
    var props = [];
    if (parent && parent.childNodes.length > 0){
      NodeList.prototype.forEach = Array.prototype.forEach
      parent.childNodes.forEach(function (node){
        if (node.classList) {
          var validAureliaTarget = node.classList.contains('au-target');
          if (validAureliaTarget && node.primaryBehavior){
            var target = node.primaryBehavior.executionContext;
            for(var property in target.__observers__) {
              var propertyName = target.__observers__[property].propertyName;
              var currentValue = target.__observers__[property].currentValue;
              var getType = {};
              var isFunction = (property && getType.toString.call(property) === '[object Function]');
              if (!isFunction) {
                props.push({'name': propertyName, 'value': currentValue});
              }
            }
          }
          // TODO: Go up the chain and continue looking instead of just the direct parent
        }
      });
    }
    if (props){
      var copy = { __proto__: null };
      props.forEach(function(prop) {
        copy[prop.name] = prop.value;
      });
      return copy;
    }
  }
  return false;
}

chrome.devtools.panels.elements.createSidebarPane(
    "Aurelia Properties",
    function(sidebar) {
  function updateElementProperties() {
    sidebar.setExpression("(" + page_getProperties.toString() + ")()");
  }
  updateElementProperties();
  chrome.devtools.panels.elements.onSelectionChanged.addListener(
      updateElementProperties);
});
