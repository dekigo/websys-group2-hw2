//should give you the element you clicked
//dunno if it works yet

$("body").click(function(event) {
    var clickedelement=$(event.target.nodeName);
});