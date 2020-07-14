document.addEventListener('DOMContentLoaded',function(){
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems,{});
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems, {dist:-200});
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.carousel2');
    var instances = M.Carousel.init(elems, {indicators:true});
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {});
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.materialboxed');
    var instances = M.Materialbox.init(elems, {});
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.scrollspy');
    var instances = M.ScrollSpy.init(elems, {});
});