class Picker {
    constructor(field, width, height) {

        var pick = document.getElementById("color-picker " + field)
        this.initval = 1;
        if (pick == null) {
            var el = document.createElement("div")
            var el1 = document.createElement("canvas")
            el1.setAttribute("id", "color-picker " + field)
            el.appendChild(el1)

            document.body.appendChild(el)
            pick = el1
            this.initval = 0
        }

        this.target = pick;
        this.width = width;
        this.height = height;
        this.fieldId = field;
        this.field = document.getElementById(field);
        this.target.width = this.width;
        this.target.height = height;
        //Get context 
        this.context = this.target.getContext("2d");
        //Circle 
        this.pickerCircle = { x: 10, y: 10, width: 7, height: 7 };

        this.listenForEvents();
        this.init()
    }

    init() {
        if (this.initval == 0) {
            setInterval(() => this.draw(), 1);
        }
        this.onChange(this.hexToRgb(document.getElementById(this.fieldId).value))
        this.target.style.display = "none"
        this.initval++

    }

    draw() {
        this.build();
    }

    build() {
        let gradient = this.context.createLinearGradient(0, 0, this.width, 0);

        //Color Stops
        gradient.addColorStop(0, "rgb(255, 0, 0)");
        gradient.addColorStop(0.15, "rgb(255, 0, 255)");
        gradient.addColorStop(0.33, "rgb(0, 0, 255)");
        gradient.addColorStop(0.49, "rgb(0, 255, 255)");
        gradient.addColorStop(0.67, "rgb(0, 255, 0)");
        gradient.addColorStop(0.84, "rgb(255, 255, 0)");
        gradient.addColorStop(1, "rgb(255, 0, 0)");
        //Fill it
        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.width, this.height);

        //Apply black and white 
        gradient = this.context.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.width, this.height);

        //Circle 
        this.context.beginPath();
        this.context.arc(this.pickerCircle.x, this.pickerCircle.y, this.pickerCircle.width, 0, Math.PI * 2);
        this.context.strokeStyle = "black";
        this.context.stroke();
        this.context.closePath();
    }

    componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    hexToRgb(hex) {
        if (/^#([a-f0-9]{3}){1,2}$/.test(hex)) {
            if (hex.length == 4) {
                hex = '#' + [hex[1], hex[1], hex[2], hex[2], hex[3], hex[3]].join('');
            }
            var c = '0x' + hex.substring(1);
            return { r: (c >> 16) & 255, g: (c >> 8) & 255, b: c & 255 }
        }
    }

    listenForEvents() {
        var that = this;
        let isMouseDown = false;
        const onMouseDown = (e) => {
            console.log(e.target.id)
            console.log(e.target.className)
            var id = "color-picker " + that.fieldId
            if (e.target.className == "myColorP" && e.target.id == document.getElementById(that.fieldId).id) {
                show()
                console.log(e.target.id)
            }
            else if (e.target.id == id) {
                let currentX = e.clientX - this.target.offsetLeft + window.pageXOffset;
                let currentY = e.clientY - this.target.offsetTop + window.pageYOffset;
                if (currentY > this.pickerCircle.y && currentY < this.pickerCircle.y + this.pickerCircle.width && currentX > this.pickerCircle.x && currentX < this.pickerCircle.x + this.pickerCircle.width) {
                    isMouseDown = true;
                } else {
                    this.pickerCircle.x = currentX;
                    this.pickerCircle.y = currentY;
                }
                that.onChange(that.getPickedColor())
            }
            else
                hide();
        }

        const onMouseMove = (e) => {
            if (isMouseDown) {
                let currentX = e.clientX - this.target.offsetLeft + window.pageXOffset;
                let currentY = e.clientY - this.target.offsetTop + window.pageYOffset;
                this.pickerCircle.x = currentX;
                this.pickerCircle.y = currentY;
            }
        }

        const onMouseUp = () => {
            isMouseDown = false;
        }

        const hide = () => {
            this.target.style.display = "none"
        }

        const show = () => {
            this.target.style.display = "block"
            console.log(this.field.offsetTop)

            var viewportOffset = document.getElementById(this.fieldId).getBoundingClientRect();
            // these are relative to the viewport, i.e. the window
            var top = viewportOffset.top + document.getElementById(this.fieldId).clientHeight;
            var left = viewportOffset.left;



            this.target.style.top = top + "px";
            this.target.style.left = left + "px";
            this.target.style.position = "absolute"
            this.target.style.zIndex = "5000"
        }

        //Register 
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }

    getPickedColor() {
        let imageData = this.context.getImageData(this.pickerCircle.x, this.pickerCircle.y, 1, 1);
        return { r: imageData.data[0], g: imageData.data[1], b: imageData.data[2] };
    }

    onChange(color) {
        document.getElementById(this.fieldId).value = this.rgbToHex(color.r, color.g, color.b)
        document.getElementById(this.fieldId).style.backgroundImage = "linear-gradient(to right, rgb(" + color.r + " " + color.g + " " + color.b + ") 0%, rgb(" + color.r + " " + color.g + " " + color.b + ") 30px, rgba(0, 0, 0, 0) 31px, rgba(0, 0, 0, 0) 100%)"//, url('" + 
        document.getElementById(this.fieldId).style.paddingLeft = "30px"
    }
}

(function init() {
    var colors = document.getElementsByClassName("myColorP")
    for (var i = 0; i < colors.length; i++) {
        let picker = new Picker(colors[i].id, 150, 120);
        setInterval(() => picker.draw(), 1);
        picker.onChange(picker.hexToRgb(picker.field.value))
    }
})();