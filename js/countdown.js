$(document).ready(function() {
    $('.product-countdown').each(function() {

        finalDate =  $(this).data('final');
        var $clock = $(this);

        $clock.countdown(finalDate, function(event) {
        $(this).html(event.strftime('<div class="day d-flex align-items-end"><div class="number-countdown">%D</div><small>d</small></div><div class="hour d-flex align-items-end"><div class="number-countdown">%H</div><small>h</small></div> <div class="minute d-flex align-items-end"><div class="number-countdown">%M</div><small>m</small></div> <div class="second d-flex align-items-end"><div class="number-countdown">%S</div><small>s</small></div>'));
		// debugger
        });
    });

});
