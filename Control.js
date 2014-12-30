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
        Flicking: false,
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
//            console.log(keyState);
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

    var C$Flicking = (function () {
        var FlickMap = {
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
                FlickMap.Right = true;
                FlickMap.Left = false;
            } else if (dirX < -1) {
                FlickMap.Right = false;
                FlickMap.Left = true;
            } else {
                FlickMap.Right = false;
                FlickMap.Left = false;
            }
            if (dirY < -1) {
                FlickMap.Up = true;
                FlickMap.Down = false;
            } else if (dirY > 1) {
                FlickMap.Up = false;
                FlickMap.Down = true;
            } else {
                FlickMap.Up = false;
                FlickMap.Down = false;
            }

            if (e.touches.length >= 2) {
                FlickMap.MultiTouch = true;
            }

            document.body.innerHTML = "Up : " + FlickMap.Up + " Down : " + FlickMap.Down + " Left : " + FlickMap.Left + " Right : " + FlickMap.Right + " MultiTouch : " + FlickMap.MultiTouch;

        }

        function resetTouchMap() {
            var e = event ? event : window.event;
            e.preventDefault();

            if (e.touches.length === 0) {
                FlickMap.Uo = false;
                FlickMap.Down = false;
                FlickMap.Left = false;
                FlickMap.Right = false;
                FlickMap.MultiTouch = false;
            }
            else if (e.touches.length === 1) {
                FlickMap.MultiTouch = false;
            }

        }

        function init() {
            Usages.Flicking = true;

            this.isMovingTo = function (direction) {
                if (FlickMap[direction] !== undefined) {
                    return FlickMap[direction];
                }
                else {
                    return false;
                }
            }

            this.isMultiTouched = function () {
                return FlickMap.MultiTouch;
            }


            window.addEventListener("touchstart", initCurPos, false);
            window.addEventListener("touchmove", detectDirection, false);
            window.addEventListener("touchend", resetTouchMap, false);
        }

        function close() {
            Usages.Flicking = false;

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
        Flicking: C$Flicking
    };
})();


