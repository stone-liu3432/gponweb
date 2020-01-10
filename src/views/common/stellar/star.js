const starMap = function(canvas) {
    let context = canvas.getContext("2d");
    let stars = {},
        particleIndex = 0,
        anm_id = 0,
        settings = {
            density: 300,
            maxLife: 100,
            groundLevel: canvas.height,
            leftWall: 0,
            rightWall: canvas.width,
            alpha: 0.0,
            maxAlpha: 1
        };
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        settings.rightWall = canvas.width;
        settings.groundLevel = canvas.height;
        redraw();
    }

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    function redraw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "rgba(0,0,0,0)";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function Star() {
        this.x = Math.floor(Math.random() * canvas.width);

        this.y = Math.floor(Math.random() * canvas.height);

        this.vx = Math.random() * 0.05 + 0.025; // 水平偏移，也是移动速度

        // 星星的尺寸
        this.particleSize = 0.5 + (Math.random() + 0.1 / 4);
        particleIndex++;
        stars[particleIndex] = this;
        this.alpha = 0.0;
        this.maxAlpha = 0.2 + (this.y / canvas.height) * Math.random() * 0.8;
        this.alphaAction = 1;
    }

    Star.prototype.draw = function() {
        // 横坐标移动
        this.x += this.vx;
        // y坐标
        this.y = this.y;

        // 透明度慢慢起来
        if (this.alphaAction == 1) {
            if (this.alpha < this.maxAlpha) {
                this.alpha += 0.005;
            } else {
                this.alphaAction = -1;
            }
        } else {
            if (this.alpha > 0.2) {
                this.alpha -= 0.002;
            } else {
                this.alphaAction = 1;
            }
        }

        if (this.x + this.particleSize * 2 >= settings.rightWall) {
            // x到左侧
            this.x = this.x - settings.rightWall;
        }

        // 绘制星星
        context.beginPath();
        context.fillStyle = "rgba(255,255,255," + this.alpha.toString() + ")";
        context.arc(this.x, this.y, this.particleSize, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
    };

    function render() {
        redraw();

        // 星星的数目
        // IE下性能有限，数目小
        var length = 400;
        if (!history.pushState) {
            // IE9
            length = 200;
        } else if (document.msHidden != undefined) {
            // IE10+
            length = 300;
        }

        if (Object.keys(stars).length > length) {
            settings.density = 0;
        }

        for (var i = 0; i < settings.density; i++) {
            if (Math.random() > 0.97) {
                new Star();
            }
        }

        // 星星实时移动
        for (var i in stars) {
            stars[i].draw();
        }

        anm_id = requestAnimationFrame(render);
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(fn) {
            return setTimeout(fn, 17);
        };
        window.cancelAnimationFrame = function(timer) {
            return clearTimeout(timer);
        };
    }

    function destroy() {
        window.removeEventListener("resize", resizeCanvas);
        window.cancelAnimationFrame(anm_id);
        context = null;
        canvas = null;
    }

    render();

    return { destroy };
};

export default starMap;
