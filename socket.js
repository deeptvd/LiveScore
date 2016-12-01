/**
 * Executed when the page has finished loading.
 */
window.onload = function () {
    var comments = ["Good Shot", "Missed to field", "Classic Text Book Shot", "Hat trick", " Classical Sot", "Unbelievable miss", "Very good catch by mid-on player"];
    var score = [4,6];
    var currentScore=0;
    var numberOfBalls=0;
    var overs=0;
    var buttonSend = document.getElementById("send-button");
    var buttonStop = document.getElementById("stop-button");
    var label = document.getElementById("status-label");
    var socket = null;
    var myInterval=null;


    /**
     * Disconnect and close the connection.
     */
    buttonStop.onclick = function (event) {
        if (socket.readyState == WebSocket.OPEN) {
            console.log("stopping "+socket.readyState +" "+WebSocket.OPEN);
            socket.close();
            currentScore=0;
            numberOfBalls=0;
            overs=0;
            clearInterval(myInterval);
            socket=null;

        }
    }

    /**
     * Send the message and empty the text field.
     */
    buttonSend.onclick = function (event) {

        if (socket == null) {

            // Web socket connection
            socket = new WebSocket("ws://echo.websocket.org");

            /**
             * WebSocket onmessage event.
             */
            socket.onmessage = function (event) {
                if (typeof event.data === "string") {
                    // Display message.
                    currentScore+=score[getRandomInt(0,1)];
                    numberOfBalls++;
                    if(numberOfBalls%6==0)
                        overs++;
                    label.innerHTML =  "Live scoreboard:<br/>Current Score: <Strong>" + currentScore +" runs - " +overs+ " overs </Strong>"+
                        "<br />Commentator: <strong>" + comments[getRandomInt(0,6)] + "</strong>";
                }
            }

            /**
             * WebSocket onopen event.
             */
            socket.onopen = function (event) {
                label.innerHTML = "Live scoreboard:";
                console.log("socket.readyState"+socket.readyState);
                myInterval=setInterval(function () {
                        sendMessage();
                    }, 2000);
            }

            /**
             * WebSocket onclose event.
             */
            socket.onclose = function (event) {
                var code = event.code;
                var reason = event.reason;
                var wasClean = event.wasClean;

                if (wasClean) {
                    label.innerHTML = label.innerHTML+"<br/>Live update ended.";
                }
                else {
                    label.innerHTML = "Connection closed with message: " + reason + " (Code: " + code + ")";
                }
            }

            /**
             * WebSocket onerror event.
             */
            socket.onerror = function (event) {
                label.innerHTML = "Error: " + event;
            }
        }
    }

    function sendMessage() {
        // console.log("text is "+text);
        if (socket.readyState == WebSocket.OPEN) {
            socket.send("get");
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}