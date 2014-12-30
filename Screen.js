/**
 * Created by oldgieui on 2014. 10. 27..
 * Create Content screen
 */
if (window.HGCVS === undefined) {
    window.HGCVS = {};
}

window.HGCVS.Screen = (function () {
    var C$Canvas = (function () {
        var canvas = undefined;

        function setAttribute(name, value) {
            try {
                if (typeof name !== "string") {
                    throw new TypeError("애트리뷰트 이름은 String 타입이어야 합니다.");
                } else {
                    canvas.setAttribute(name, value);
                }
            } catch (error) {
                console.error(error.name + " : " + error.message);
            }
        }

        function setStyle(name, value) {
            try {
                if (typeof name !== "string") {
                    throw new TypeError("애트리뷰트 이름은 String 타입이어야 합니다.");
                } else {
                    canvas.style[name] = value;
                }
            } catch (error) {
                console.error(error.name + " : " + error.message);
            }
        }

        function init(width, height) {
            if (canvas !== undefined) {
                throw new Error("이미 생성된 캔버스가 있습니다.");
            }
            canvas = document.createElement("canvas");
            setStyle("margin", "0px");
            setStyle("padding", "0px");
            setStyle("position", "absolute");
            setStyle("border", "black 1px solid");
            setSize(width, height);
            document.body.appendChild(canvas);
        }

        function setId(id) {
            try {
                setAttribute("id", id);
            } catch (error) {
                console.error(error.name + " : " + error.message);
            }
        }

        function setLocation(x, y) {
            try {
                if (typeof x !== "number" || typeof y !== "number") {
                    throw new TypeError("number 타입으로만 지정할 수 있습니다.")
                }
                setStyle("left", x + "px");
                setStyle("top", y + "px");
            } catch (error) {
                console.error(error.name + " : " + error.message);
            }
        }

        function setSize(width, height) {
            try {
                if ((width && height) !== undefined) {
                    canvas.width = width;
                    canvas.height = height;
                }
                setStyle("left", ((window.innerWidth - canvas.width) / 2) + "px");
                setStyle("top", ((window.innerHeight - canvas.height) / 2) + "px");
            } catch (error) {
                console.error(error.name + " : " + error.message);
            }
        }

        /**
         * 0 to fullScreen
         * @param scale
         */
        function setScale(scale) {
            try {
                if (scale === undefined) {
                    throw new TypeError("확대할 비율을 입력하세요");
                } else if (typeof scale !== "number") {
                    throw new TypeError("number 타입만 사용 가능");
                }
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
            } catch (error) {
                console.error(error.name + " : " + error.message);
            }
        }

        return {
            setAttribute: setAttribute,
            setStyle: setStyle,
            init: init,
            setId: setId,
            setLocation: setLocation,
            setSize: setSize,
            setScale: setScale
        };
    })();


    var C$Background = (function () {
        return {};
    })();

    var C$DOM = (function () {
        return {};
    })();

    return {
        Canvas: C$Canvas,
        Background: C$Background,
        DOM: C$DOM
    };
})();