var CIC = {};

CIC.Screen = function () {
    var canvas = undefined;

    function init(parent) {
        if (canvas === undefined) {
            canvas = document.createElement("canvas");
            setStyle("margin", "0px");
            setStyle("padding", "0px");
            setStyle("position", "absolute");
            setStyle("border", "black 1px solid");
            parent = parent || document.body;
            if (parent instanceof HTMLElement) {
                parent.appendChild(canvas);
            } else {
                throw new TypeError("parent는 HTML 요소여야 합니다.")
            }
        } else {
            throw new Error("이미 생성된 캔버스가 있습니다.");
        }
    }

    function setStyle(name, value) {
        if (canvas === undefined) {
            throw new ReferenceError("캔버스가 존재하지 않습니다. Screen.init()을 먼저 호출한 뒤 사용해야 합니다.");
        }
        if (typeof name === "string") {
            canvas.style[name] = value;
        } else {
            throw new TypeError("스타일 요소 이름은 String 타입이어야 합니다.");
        }
    }

    function setAttribute(name, value) {
        if (canvas === undefined) {
            throw new ReferenceError("캔버스가 존재하지 않습니다. Screen.init()을 먼저 호출한 뒤 사용해야 합니다.");
        }
        if (typeof name === "string") {
            canvas.setAttribute(name, value);
        } else {
            throw new TypeError("애트리뷰트 이름은 String 타입이어야 합니다.");
        }
    }

    function setLocation(x, y) {
        if (typeof x === "number" && typeof y === "number") {
            setStyle("left", x + "px");
            setStyle("top", y + "px");
        } else {
            throw new TypeError("x, y 값은 number 타입으로만 지정할 수 있습니다.")
        }
    }

    function setSize(width, height) {
        if (typeof width === "number" && typeof height === "number") {
            canvas.width = width;
            canvas.height = height;
        } else {
            throw new TypeError("width, height 값은 number 타입으로만 지정할 수 있습니다.")
        }
    }

    function setScale(scale) {
        if (typeof scale === "number") {
            if (scale === 0) {
                var cLength;
                var wLength;
                if (canvas.width >= parseInt(canvas.style.left)) {
                    cLength = canvas.width;
                    wLength = window.innerWidth;
                } else {
                    cLength = canvas.height;
                    wLength = window.innerHeight;
                }
                scale = wLength / cLength;
            } else {
                scale *= 0.01;
            }
            setStyle("transform", "scale3d(" + scale + ", " + scale + ", " + 1 + ")");
            setStyle("left", ((window.innerWidth - canvas.width) / 2) + "px");
            setStyle("top", ((window.innerHeight - canvas.height) / 2) + "px");
        } else {
            throw new TypeError("number 타입의 인자를 입력해야 합니다.");
        }
    }

    return {
        init: init,
        setStyle: setStyle,
        setAttribute: setAttribute,
        setLocation: setLocation,
        setSize: setSize,
        setScale: setScale
    };
}();

CIC.Input = function () {
    var KeyBoard = function () {
        var inUse = false;
        var keyMap = {
            "Backspace": 8,
            "Tab": 9,
            "Enter": 13,
            "Shift": 16,
            "Ctrl": 17,
            "Alt": 18,
            "PauseBreak": 19,
            "CapsLock": 20,
            "ESC": 27,
            "Space": 32,
            "PageUp": 33,
            "PageDown": 34,
            "End": 35,
            "Home": 36,
            "Left": 37,
            "Up": 38,
            "Right": 39,
            "Down": 40,
            "Insert": 45,
            "Delete": 46,
            "0": 48,
            "1": 49,
            "2": 50,
            "3": 51,
            "4": 52,
            "5": 53,
            "6": 54,
            "7": 55,
            "8": 56,
            "9": 57,
            "a": 65,
            "b": 66,
            "c": 67,
            "d": 68,
            "e": 69,
            "f": 70,
            "g": 71,
            "h": 72,
            "i": 73,
            "j": 74,
            "k": 75,
            "l": 76,
            "m": 77,
            "n": 78,
            "o": 79,
            "p": 80,
            "q": 81,
            "r": 82,
            "s": 83,
            "t": 84,
            "u": 85,
            "v": 86,
            "w": 87,
            "x": 88,
            "y": 89,
            "z": 90
        };

        var keyState = [];

        function isInUse() {
            return inUse;
        }

        function init() {
            inUse = true;
            for (var i = 0; i < 100; i++) {
                keyState[i] = false;
            }
            window.addEventListener("keydown", keyEvent, false);
            window.addEventListener("keyup", keyEvent, false);
        }

        function keyEvent() {
            var e = event ? event : window.event;
            var keyCode = (e.which) ? e.which : e.keyCode;
            if (keyCode >= 0 && keyCode <= keyState.length) {
                if (e.type === "keydown") {
                    keyState[keyCode] = true;
                } else if (e.type === "keyup") {
                    keyState[keyCode] = false;
                }
            }
        }

        function isKeyDown(keyName) {
            if (inUse) {
                var keyCode = keyMap[keyName];
                if (keyCode !== undefined) {
                    return keyState[keyCode];
                } else {
                    throw new ReferenceError("매핑되지 않은 키에 대한 조회입니다");
                }
            } else {
                throw new SyntaxError("키보드를 사용하지 않도록 설정되어 있습니다. 키보드 입력을 활성화하려면 Input.KeyBoard.init()을 호출하십시오.");
            }
        }

        function close() {
            inUse = false;
            window.removeEventListener("keydown", keyEvent);
            window.removeEventListener("keyup", keyEvent);
        }

        return {
            isInUse: isInUse,
            init: init,
            isKeyDown: isKeyDown,
            close: close
        }
    }();

    var Touch = function () {
        var inUse = false;

        var startedPosition;
        var currentPosition;

        function isInUse() {
            return inUse;
        }

        function start() {
            var e = event ? event : window.event;
            e.preventDefault();

            startedPosition = CIC.Vector.create(e.touches[0].clientX, e.touches[0].clientY);
            currentPosition = CIC.Vector.clone(startedPosition);
        }

        function update() {
            var e = event ? event : window.event;
            e.preventDefault();
            console.log(e.changedTouches[0]);

            currentPosition.x = e.changedTouches[0].clientX;
            currentPosition.y = e.changedTouches[0].clientY;
        }

        function getStartedPosition() {
            if (inUse) {
                return startedPosition;
            } else {
                throw new SyntaxError("화면 터치를 사용하지 않도록 설정되어 있습니다. 터치 입력을 활성화하려면 Input.Touch.init()을 호출하십시오.")
            }
        }

        function getDeltaPosition() {
            if (inUse) {
                return CIC.Vector.subtract(currentPosition, startedPosition);
            } else {
                throw new SyntaxError("화면 터치를 사용하지 않도록 설정되어 있습니다. 터치 입력을 활성화하려면 Input.Touch.init()을 호출하십시오.")
            }
        }

        function getCurrentPosition() {
            if (inUse) {
                return currentPosition;
            } else {
                throw new SyntaxError("화면 터치를 사용하지 않도록 설정되어 있습니다. 터치 입력을 활성화하려면 Input.Touch.init()을 호출하십시오.")
            }
        }

        function init() {
            inUse = true;
            window.addEventListener("touchstart", start, false);
            window.addEventListener("touchmove", update, false);
        }

        function close() {
            inUse = false;
            window.removeEventListener("touchstart", start, false);
            window.removeEventListener("touchmove", update, false);
        }

        return {
            isInUse: isInUse,
            init: init,
            close: close,
            getStartedPosition: getStartedPosition,
            getDeltaPosition: getDeltaPosition,
            getCurrentPosition: getCurrentPosition
        };
    }();

    return {
        KeyBoard: KeyBoard,
        Touch: Touch
    }
}();

CIC.Vector = function () {
    function vector(x, y) {
        this.x = x;
        this.y = y;
    }

    function create(x, y) {
        if (typeof x === "number" && typeof y === "number") {
            return new vector(x, y);
        } else {
            throw new TypeError("Vector를 생성하려면 number 타입의 x, y를 입력하세요.");
        }
    }

    function clone(src) {
        if (src.constructor.name === "vector") {
            return new vector(src.x, src.y);
        } else {
            throw new TypeError("clone()에 입력하는 매개변수는 vector의 인스턴스여야 합니다.");
        }
    }

    function subtract(minuend, subtrahend) {
        if (minuend.constructor.name === "vector"
            && subtrahend.constructor.name === "vector") {
            return new vector(minuend.x - subtrahend.x, minuend.y - subtrahend.y);
        } else {
            throw new TypeError("subtract()에 입력하는 매개변수는 두 개의 vector입니다.");
        }
    }

    return {
        create: create,
        clone: clone,
        subtract: subtract
    };
}();

CIC.Physics = function () {

}();

CIC.Object = function () {
    var cicObject = function (name) {
        this.name = name;
        this.transform = {
            position: CIC.Vector.create(0, 0),
            rotation: undefined,
            scale: CIC.Vector.create(1, 1) //scale수치는 canvas에 최종적으로 draw할 때 적용하면 됨 (Destination Width, Height가 된다)
        };
        this.drawSrc = null;
        this.updaterQueue = [];
        this.collider = null;
        this.rigidBody = null;
    }

    cicObject.prototype.setPosition = function (pos, y) {
        if (pos.constructor.name === "vector" && y === undefined) {
            this.transform.position = pos;
        } else if (typeof pos === "number" && typeof y === "number") {
            this.transform.position.x = pos;
            this.transform.position.y = y;
        } else {
            throw new TypeError("setPosition은 vector 타입의 인자를 하나 받거나 number타입의 x, y값을 받습니다")
        }
    }

    cicObject.prototype.setRotation = function () {
    }

    cicObject.prototype.setScale = function (scale, y) {
        if (scale.constructor.name === "vector" && y === undefined) {
            this.transform.position = scale;
        } else if (typeof scale === "number" && typeof y === "number") {
            this.transform.position.x = scale;
            this.transform.position.y = y;
        } else {
            throw new TypeError("setScale은 vector 타입의 인자를 하나 받거나 number타입의 x, y값을 받습니다")
        }
    }

    cicObject.prototype.setDrawSrc = function (src) {
        //if(src.constructor.name === "sprite" ||){}
    };
    cicObject.prototype.addUpdater = function (updater) {
        if (typeof updater === "function") {
            this.updaterQueue.push(updater);
        } else {
            throw new TypeError("updater로는 function 타입의 객체만 사용할 수 있습니다.");
        }
    };
    cicObject.prototype.setCollider = function (collider) {
        //collider type과 position 설정
    };
    cicObject.prototype.setRigidBody = function (rigidBody) {
        //rigidbody 설정
    };

    var pool = {};

    function create(name) {
        if (typeof name === "string") {
            if (pool[name] === undefined) {
                var newObj = new cicObject(name);
                pool[name] = newObj;
                return newObj;
            }
            else {
                throw new Error("Object Pool에 같은 이름을 가진 오브젝트가 있습니다.");
            }
        } else {
            throw new TypeError("CIC Object의 이름에는 string 타입만 사용할 수 있습니다.");
        }
    }

    function get(name) {
        if (typeof name === "string") {
            if (pool[name] !== undefined) {
                return pool[name];
            }
            else {
                throw new ReferenceError("Object Pool에 해당하는 오브젝트가 없습니다.");
            }
        } else {
            throw new TypeError("찾으려는 오브젝트의 이름을 string 타입으로 입력하십시오.");
        }
    }

    //프로젝트 내 전체 오브젝트들을 관리할 수 있는 자료구조 설계 필요

    function clone(name) {
        //var newObj =
    }

    function makePool(obj, num) {
        //num만큼의 길이를 가지는 오브젝트 풀 생성. (clone으로 복사)
    }

    return {
        create: create,
        get: get
    }
}();

CIC.Resource = function () {
    var imagePool = {};

    function loadImage(name, imgSrc) {
        if (typeof name === "string" && typeof imgSrc === "string") {
            var img = new Image();
            img.src = imgSrc;
            img.onload = function () {
                imagePool[name] = img;
            }
        } else {
            throw new TypeError("이미지 객체의 이름과 파일 경로를 string 타입으로 입력해야 합니다.");
        }
    }

    function getImage(name) {
        var img = imagePool[name];
        if (img !== undefined) {
            return img;
        } else {
            throw new ReferenceError("로드되지 않은 이미지 엘리먼트입니다.");
        }
    }

    var sprite = function (name) {
        this.image = getImage(name);
        this.drawPosition = CIC.Vector.create(0, 0);
        this.drawSize = {
            width: this.image.width,
            height: this.image.height
        };
    };

    sprite.prototype.getDrawPosition = function () {
        return this.drawPosition;
    };

    sprite.prototype.setDrawPosition = function (pos) {
        if (pos.constructor.name === "vector") {
            this.drawPosition = pos;
        } else {
            throw new TypeError("vector 오브젝트만 입력 가능");
        }
    }

    sprite.prototype.getDrawX = function () {
        return this.drawPosition.x;
    };

    sprite.prototype.setDrawX = function(x){
        if(typeof x === "number"){
            this.drawPosition.x = x;
        }else{
            throw new TypeError("x는 number여야 합니다.");
        }
    }

    sprite.prototype.getDrawY = function () {
        return this.drawPosition.y;
    };

    sprite.prototype.setDrawY = function(y){
        if(typeof y === "number"){
            this.drawPosition.x = y;
        }else{
            throw new TypeError("y는 number여야 합니다.");
        }
    }
    sprite.prototype.getDrawSize = function () {
        return this.drawSize;
    }

    sprite.prototype.getDrawWidth = function () {
        return this.drawSize.width;
    };

    sprite.prototype.getDrawHeight = function () {
        return this.drawSize.height;
    };

    function createSprite(name, x, y) {
        if (typeof name === "string") {
            return new sprite(name);
        } else {
            throw new TypeError("이미지 객체의 이름을 string 타입으로 입력해야 합니다.");
        }
    }

    var animation = function () {
        this.frames = [];
    };

    var animationFrame = function (sprite, x, y, width, height) {

    };

    animation.prototype.getFrameCount = function () {
        return this.frames.length;
    };

    animation.prototype.addFrame = function (sprite, x, y) {

    };

    return {
        loadImage: loadImage,
        getImage: getImage,
        createSprite: createSprite,
    };

}();
