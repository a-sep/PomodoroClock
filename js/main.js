/*jshint esversion: 6 */
// ========= ver. 0.5  ===========
$(document).ready(function() {
    var pause = Number($('#pause').text());
    var session = Number($('#session').text());
    $('button.btn-link').on('click', function() {
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

    // ------------- canvas animation ------------------------------------------------
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var circle = {
        x: 125,
        y: 125,
        radius: 125,
        color: "#6dbe04",
        draw: function() {
            ctx.beginPath();
            ctx.fillStyle = "#2c383e";
            ctx.strokeStyle = this.color;
            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.moveTo(canvas.width / 2 + 125, canvas.height / 2);
            ctx.lineWidth = 4;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.stroke();
            ctx.fill();
            ctx.beginPath();
            ctx.strokeStyle = "#2c383e";
            ctx.moveTo(canvas.width / 2 + 122, canvas.height / 2);
            ctx.lineWidth = 2;
            ctx.arc(this.x, this.y, this.radius - 3, 0, Math.PI * 2, true);
            ctx.stroke();
        },
        clear: function() {
            ctx.beginPath();
            ctx.fillStyle = "#2c383e";
            ctx.moveTo(canvas.width / 2 + 122, canvas.height / 2);
            ctx.lineWidth = 2;
            ctx.arc(this.x, this.y, this.radius - 3, 0, Math.PI * 2, true);
            ctx.fill();
        }
    };

    var rect = {
        x: 0,
        y: 0,
        height: 0,
        color: "#6dbe04",
        draw: function() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, canvas.width, this.height);
        }
    };

    var y = 0;
    var color = "#6dbe04";
    var time = session;
    var si;
    var stopStatus = false;
    var minutes, seconds;
    var counted = 0;

    // call the function with the current data
    function draw(y, color, time) {
        if (stopStatus) {
            stopStatus = false;
        } else {
            circle.clear(); // after change from session to pause clear the canvas
        }
        var jump = Math.ceil(canvas.height / time);
        time -= counted;
        counter(time); // *60 for minutes => shows full time befor interval starts

        si = setInterval(function() {
            circle.clear();
            y += jump;
            rect.height = y;
            rect.color = color;
            rect.draw();
            counter(--time); // *60 for minutes
            circle.draw();

            if (time < 0) {
                counted = 0;
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

            // }, time / canvas.height * 1000); // *60000 for minutes
        }, 1000);


        console.log('draw', jump, y, rect.height, color, time, counted);
    }

    function counter(time) {
        minutes = parseInt(time / 60, 10);
        seconds = parseInt(time % 60, 10);

        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        if (time < 0) {
            minutes = '00';
            seconds = '00';
            console.log('end of counter');
        }
        ctx.font = "48px serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(minutes + ":" + seconds, canvas.width / 2 - 50, canvas.height / 2 + 50);
        // console.log(minutes, ':', seconds);
    }

    function reset() {
        circle.clear();
        stopStatus = false;
        y = 0;
        rect.height = 0;
        time = session;
        counted = 0;
        color = "#6dbe04";
        if (si) clearInterval(si);
        circle.draw();
        console.log('reset');
    }

    function stop() {
        stopStatus = true;
        y = rect.height;
        color = rect.color;
        counted = eval(time - (minutes * 60 + seconds)); // jshint ignore:line
        if (color === "#6dbe04") {
            time = session;
        } else {
            time = pause;
        }
        clearInterval(si);
        console.log('stop', rect.y);
    }

    canvas.addEventListener("click", function(e) {

        if (stopStatus) {
            draw(y, color, time);
        } else if (rect.y !== 0 && stopStatus === false) {
            stop();
        } else {
            reset();
            draw(y, color, time);
        }
        // console.log('click', y, color, session);
    });

    circle.draw();
    //-------------- canvas end ----------------------

    $('#playBtn').on('click', function() {
        if (stopStatus) {
            draw(y, color, time);
        } else {
            reset();
            draw(y, color, time);
        }
    });
    $('#pauseBtn').on('click', function() {
        stop();
    });
    $('#resetBtn').on('click', function() {
        reset();
    });

});
