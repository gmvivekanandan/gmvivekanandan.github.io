/*THIS SNIPPET IS A PLUGIN THAT ACTIVATES THE 
SIDE NAVIGATION FEATURE ON A 
MOBILE OR SUCH SMALLER SCREENS */
document.addEventListener('DOMContentLoaded',function(){
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems,{});
});

/*THIS SNIPPET IS A PLUGIN THAT ACTIVATES THE
SLIDER IN EVENTS SECTION */
document.addEventListener('DOMContentLoaded',function(){
    var elems = document.querySelectorAll('.slider');
    var instances = M.Slider.init(elems,{});
});

/*THIS SNIPPET IS A PLUGIN THAT ACTIVATES SCROLLSPY
FEATURE */
document.addEventListener('DOMContentLoaded',function(){
    var elems = document.querySelectorAll('.scrollspy');
    var instances = M.ScrollSpy.init(elems,{});
});