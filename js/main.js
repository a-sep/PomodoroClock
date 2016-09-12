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
        reset();
    });
    // });

    // ------------- canvas animation ------------------------------------------------
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var circle = {
        x: 125,
        y: 125,
        radius: 121,
        color: "#6dbe04",
        draw: function() {
            ctx.beginPath();
            ctx.fillStyle = "#2c383e";
            ctx.strokeStyle = this.color;
            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.moveTo(canvas.width / 2 + 120, canvas.height / 2);
            ctx.lineWidth = 5;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.stroke();
            ctx.fill();
            ctx.beginPath();
            ctx.strokeStyle = "#2c383e";
            ctx.moveTo(canvas.width / 2 + 116, canvas.height / 2);
            ctx.lineWidth = 4;
            ctx.arc(this.x, this.y, this.radius - 4, 0, Math.PI * 2, true);
            ctx.stroke();
        }
    };

    var rect = {
        x: 0,
        y: 0,
        vy: 1,
        color: "#6dbe04",
        draw: function() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, canvas.width, 5);
        }
    };

    var y = 0;
    var color = "#6dbe04";
    var time = session;
    var si;
    var stopStatus = false;

    // call the function with the current data
    function draw(y, color, time) {
        if (stopStatus) {
            stopStatus = false;
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // after change from session to pause clear the canvas
        }

        si = setInterval(function() {
            rect.y = y;
            y++;
            rect.color = color;
            rect.draw();
            circle.draw();

            if (rect.y >= canvas.height) {
                if (color === "#6dbe04") {
                    color = "#ff4000";
                    time = pause;
                } else if (color === "#ff4000") {
                    color = "#6dbe04";
                    time = session;
                }
                clearInterval(si);
                draw(0, color, time);
                console.log('end of time');
            }
        }, time / canvas.height * 1000);

        console.log('draw', y, color, time);
    }

    function reset() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stopStatus = false;
        y = 0;
        time = session;
        color = "#6dbe04";
        if (si) clearInterval(si);
        circle.draw();
        console.log('reset');
    }

    function stop() {
        stopStatus = true;
        y = rect.y;
        color = rect.color;
        if (color === "#6dbe04") {
            time = session;
        } else{
            time = pause;
        }
        clearInterval(si);
        console.log('stop', rect.y);
    }

    canvas.addEventListener("click", function(e) {
        if (stopStatus) {
            draw(y, color, time);
        } else {
            reset();
            draw(y, color, time);
        }
        // console.log('click', y, color, session);
    });

    canvas.addEventListener("mouseout", function(e) {
        stop();
    });

    circle.draw();
});
