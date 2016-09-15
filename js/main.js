/*jshint esversion: 6 */
// ========= ver. 1.0  ===========
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
    var jump;
    var si;
    var time = session * 60;
    var minutes, seconds;
    var counted = 0;
    var stopStatus = false;
    var playStatus = false;

    function draw(y, color, time) {
        playStatus = true;
        if (stopStatus) {
            stopStatus = false;
        } else {
            circle.clear(); // after change from session to pause clear the circle
        }
        jump = Math.ceil(canvas.height / time);
        var count = time - counted;
        counter(count);
        displayText(time);
        si = setInterval(function() {
            circle.clear();
            y += jump;
            rect.height = y;
            rect.color = color;
            rect.draw();
            counter(--count);
            circle.draw();
            displayText(time);

            if (count < 0) {
                counted = 0;
                if (color === "#6dbe04") {
                    color = "#ff4000";
                    time = pause * 60;
                } else if (color === "#ff4000") {
                    color = "#6dbe04";
                    time = session * 60;
                }
                clearInterval(si);
                draw(0, color, time);
                console.log('end of time');
            }
        }, 1000);
        // console.log('DRAW ', 'jump', jump, 'y', y, color, 'time', time, 'counted', counted, playStatus, stopStatus);
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
        ctx.font = "54px serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(minutes + ":" + seconds, canvas.width / 4, canvas.height / 2.5);
    }

    function displayText(x) {
        ctx.font = "24px Lato";
        ctx.fillStyle = "#ffffff";
        ctx.textLetterSpacing = 3;
        if (x === session * 60) {
            ctx.fillText("Session", canvas.width / 2.7, canvas.height / 1.5);
        } else if (x === pause * 60) {
            ctx.fillText("Break", canvas.width / 2.7, canvas.height / 1.5);
        }
    }

    function reset() {
        circle.clear();
        stopStatus = false;
        playStatus = false;
        y = 0;
        rect.height = 0;
        time = session * 60;
        counted = 0;
        color = "#6dbe04";
        if (si) clearInterval(si);
        circle.draw();
        // console.log('RESET ', 'jump', jump, 'y', y, color, 'time', time, 'counted', counted, playStatus, stopStatus);
    }

    function stop() {
        playStatus = false;
        stopStatus = true;
        y = rect.height;
        color = rect.color;
        if (color === "#6dbe04") {
            time = session * 60;
        } else {
            time = pause * 60;
        }
        counted = eval(time - (minutes * 60) - seconds); // jshint ignore:line
        clearInterval(si);
        // console.log('STOP ', 'jump', jump, 'y', y, color, 'time', time, 'counted', counted, playStatus, stopStatus);
    }

    canvas.addEventListener("click", function(e) {
        if (!playStatus) {
            draw(y, color, time);
        } else
        if (playStatus) {
            stop();
        }
    });

    circle.draw();
    // ----------------------- canvas end --------------------------------

    $('#playBtn').on('click', function() {
        if (stopStatus) {
            draw(y, color, time);
        } else if (!playStatus) {
            draw(y, color, time);
        }
    });
    $('#pauseBtn').on('click', function() {
        if (stopStatus) {
            draw(y, color, time);
        } else if (playStatus) {
            stop();
        }
    });
    $('#resetBtn').on('click', function() {
        reset();
    });

});
