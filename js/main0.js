/*jshint esversion: 6 */
// ========= ver. 0.0  ===========

$(document).ready(function() {
    var pause = Number($('#pause').text());
    var session = Number($('#session').text());
    $('button').on('click', function() {
        // take value of id attribute (pause/session)
        var $arrow = $(this).attr('id');
        switch ($arrow) {
            case 'pauseUp':
                pause += 1;
                break;
            case 'pauseDown':
                pause -= 1;
                break;
            case 'sessionUp':
                session += 1;
                break;
            case 'sessionDown':
                session -= 1;
                break;
        }
        // avoid going below zero
        if (pause < 1) {
            pause = 1;
        }
        if (session < 1) {
            session = 1;
        }
        $('#pause').text(pause);
        $('#session').text(session);
    });

    // ------------- canvas ------------------------------------------------
    var ctx = document.getElementById('canvas').getContext('2d');
    var cW = ctx.canvas.width,
        cH = ctx.canvas.height;
    var y = 0;

    function circle() {
        ctx.beginPath();
        ctx.fillStyle = "#2c383e";
        ctx.strokeStyle = "#6dbe04";
        ctx.rect(0, 0, cW, cH);
        ctx.moveTo(cW / 2 + 120, cH / 2);
        ctx.lineWidth = 5;
        ctx.arc(cW / 2, cH / 2, 120, 0, Math.PI * 2, true); // Outer circle
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = "#2c383e";
        ctx.moveTo(cW / 2 + 116, cH / 2);
        ctx.lineWidth = 3;
        ctx.arc(cW / 2, cH / 2, 116, 0, Math.PI * 2, true); // Outer circle
        ctx.stroke();
    }


    function animateSession() {
        ctx.save();
        ctx.fillStyle = "#6dbe04";
        ctx.fillRect(0, y, cW, 10);
        y++;
        circle();
        ctx.restore();
    }

    function animatePause() {
        ctx.save();
        ctx.fillStyle = "#ff3000";
        ctx.fillRect(0, y, cW, 10);
        y--;
        circle();
        ctx.restore();
    }

    function startPause() {
        ctx.clearRect(0, 0, cW, cH);
        var animatePauseInterval = setInterval(animatePause, pause / canvas.height * 1000);
        var animatePauseTimeout = setTimeout(function() {
            clearInterval(animatePauseInterval);
            console.log('end of pause');
            initSession();
        }, pause * 1000);
    }


    function initSession() {

        ctx.clearRect(0, 0, cW, cH);
        var animateSessionInterval = setInterval(animateSession, session / canvas.height * 1000);
        var animateSessionTimeout = setTimeout(function() {
            clearInterval(animateSessionInterval);
            console.log('end of session');
            startPause();
        }, session * 1000);

        // $("canvas").on("click", function() {
        //     //TODO tu ma byc pausa a nie restart
        //     // initSession();
        //     if (animateSessionInterval) {
        //         clearInterval(animateSessionInterval);
        //     }
        //
        //     if (animatePauseInterval) {
        //         clearInterval(animatePauseInterval);
        //     }
        //
        // });

        // ctx.canvas.addEventListener('click', function(event) {
        //     clearInterval(animateInterval);
        // });

    }

    $("canvas").on("click", function() {
        if (y !== 0) {
            ctx.clearRect(0, 0, cW, cH);
        } else {
            initSession();
        }
    });

    window.addEventListener('load', function(event) {
        circle();
    });

});
