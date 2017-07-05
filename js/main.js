
$(document).ready(function(){
	//Side Menu Active
	$('.sidemenu li a').click(function(){
		$('li a').removeClass('active');
		$(this).addClass('active');
	});
});

/*0630sidemenu*/
$(document).ready(function () {
    
    $('.navbar-toggle').click(function (e) {
        $('.nav-sm').html($('.navbar-collapse').html());
        $('.sidebar-nav').toggleClass('active');
        $(this).toggleClass('active');
    });

    var $sidebarNav = $('.sidebar-nav');

    // Hide responsive navbar on clicking outside
    $(document).mouseup(function (e) {
        if (!$sidebarNav.is(e.target) // if the target of the click isn't the container...
            && $sidebarNav.has(e.target).length === 0
            && !$('.navbar-toggle').is(e.target)
            && $('.navbar-toggle').has(e.target).length === 0
            && $sidebarNav.hasClass('active')
            )// ... nor a descendant of the container
        {
            $('.navbar-toggle').click();
        }
    });

    //highlight  active link
    // $('ul.main-menu li a').each(function () {
    //     if ($($(this))[0].href == String(window.location))
    //         $(this).parent().addClass('active');
    // });  
});