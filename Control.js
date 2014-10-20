/**
 * Define how to control your content
 * by Keyboard, mouse, direct touch, virtual touchpad...
 */

if (window.HGCVS === undefined) {
    window.HGCVS = {};
}

window.HGCVS.Control = (function () {
    var Usages = {
        Mouse: false,
        KeyBoard: false,
        DirectTouch: false,
        TouchPad: false
    };

    var C$KeyBoard = (function () {
        var keyState = {};

        var keyMap = {
            8: "Backspace",
            9: "Tab",
            13: "Enter",
            16: "Shift",
            17: "Ctrl",
            18: "Alt",
            19: "PauseBreak",
            20: "CapsLock",
            27: "ESC",
            32: "Space",
            33: "PageUp",
            34: "PageDown",
            35: "End",
            36: "Home",
            37: "Left",
            38: "Up",
            39: "Right",
            40: "Down",
            45: "Insert",
            46: "Delete",
            48: 0,
            49: 1,
            50: 2,
            51: 3,
            52: 4,
            53: 5,
            54: 6,
            55: 7,
            56: 8,
            57: 9,
            65: "a",
            66: "b",
            67: "c",
            68: "d",
            69: "e",
            70: "f",
            71: "g",
            72: "h",
            73: "i",
            74: "j",
            75: "k",
            76: "l",
            77: "m",
            78: "n",
            79: "o",
            80: "p",
            81: "q",
            82: "r",
            83: "s",
            84: "t",
            85: "u",
            86: "v",
            87: "w",
            88: "x",
            89: "y",
            90: "z"
        };

        function keyEvent() {
            var e = event ? event : window.event;
            var keyCode = (e.which) ? e.which : e.keyCode;
            if (keyMap[keyCode] !== undefined) {
                if (e.type === "keydown") {
                    keyState[keyMap[keyCode]] = true;
                }
                else if (e.type === "keyup") {
                    keyState[keyMap[keyCode]] = false;
                }
            }
        }

        function init() {
            Usages.KeyBoard = true;

            this.isKeyPressed = function (keyName) {
                if (keyState[keyName] !== undefined) {
                    return keyState[keyName];
                } else {
                    return false;
                }
            }

            window.addEventListener("keydown", keyEvent, false);
            window.addEventListener("keyup", keyEvent, false);
        }

        function close() {
            Usages.KeyBoard = false;

            delete this.isKeyPressed;
            keyState = {};

            window.removeEventListener("keydown", keyEvent);
            window.removeEventListener("keyup", keyEvent);
        }


        return {
            init: init,
            close: close
        };
    })();

    var C$DirectTouch = (function () {
        var TouchMap = {
            "Up": false,
            "Down": false,
            "Left": false,
            "Right": false,
            "MultiTouch": false
        };

        var curX = -1;
        var curY = -1;

        function initCurPos() {
            var e = event ? event : window.event;
            curX = e.touches[0].clientX;
            curY = e.touches[0].clientY;
        }

        function detectDirection() {
            var e = event ? event : window.event;
            e.preventDefault();

            var newX = e.changedTouches[0].clientX;
            var newY = e.changedTouches[0].clientY;
            var dirX = newX - curX;
            var dirY = newY - curY;
            curX = newX;
            curY = newY;

            if (dirX > 1) {
                TouchMap.Right = true;
                TouchMap.Left = false;
            } else if (dirX < -1) {
                TouchMap.Right = false;
                TouchMap.Left = true;
            } else {
                TouchMap.Right = false;
                TouchMap.Left = false;
            }
            if (dirY < -1) {
                TouchMap.Up = true;
                TouchMap.Down = false;
            } else if (dirY > 1) {
                TouchMap.Up = false;
                TouchMap.Down = true;
            } else {
                TouchMap.Up = false;
                TouchMap.Down = false;
            }

            if (e.touches.length >= 2) {
                TouchMap.MultiTouch = true;
            }

//            document.body.innerHTML = "Up : " + TouchMap.Up + " Down : " + TouchMap.Down + " Left : " + TouchMap.Left + " Right : " + TouchMap.Right + " MultiTouch : " + TouchMap.MultiTouch;

        }

        function resetTouchMap() {
            var e = event ? event : window.event;
            e.preventDefault();

            if (e.touches.length === 0) {
                TouchMap.Uo = false;
                TouchMap.Down = false;
                TouchMap.Left = false;
                TouchMap.Right = false;
                TouchMap.MultiTouch = false;
            }
            else if (e.touches.length === 1) {
                TouchMap.MultiTouch = false;
            }

        }

        function init() {
            Usages.DirectTouch = true;

            this.isMovingTo = function (direction) {
                if (TouchMap[direction] !== undefined) {
                    return TouchMap[direction];
                }
                else {
                    return false;
                }
            }

            this.isMultiTouched = function () {
                return TouchMap.MultiTouch;
            }


            window.addEventListener("touchstart", initCurPos, false);
            window.addEventListener("touchmove", detectDirection, false);
            window.addEventListener("touchend", resetTouchMap, false);
        }

        function close() {
            Usages.DirectTouch = false;

            delete this.isMovingTo;
            delete this.isMultiTouched;

            window.removeEventListener("touchstart", initCurPos);
            window.removeEventListener("touchmove", detectDirection, false);
            window.removeEventListener("touchend", resetTouchMap, false);
        }

        return{
            init: init,
            close: close
        };

    })();


    return {
        Usages: Usages,
        KeyBoard: C$KeyBoard,
        DirectTouch: C$DirectTouch
    };
})();


