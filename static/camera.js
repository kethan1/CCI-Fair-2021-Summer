// Grab elements, create settings, etc.
const video = document.getElementById('video');

// Get access to the camera!
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        globalThis.video.srcObject = stream;
        video.play();
    });
}

document.getElementById("snap").addEventListener("click", function() {

    const canvas = document.createElement("canvas");
    const change_canvas = document.querySelector("#changeCanvas");

    change_canvas.textContent = '';

    // scale the canvas accordingly
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // draw the video at that frame
    const ctx = canvas.getContext('2d');
    ctx.filter = 'grayscale(1)';
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
        var canvas2 = fx.canvas();
    } catch (e) {
        alert(e);
        return;
    }
    var texture = canvas2.texture(canvas);
    canvas2.draw(texture).brightnessContrast(0, 0);
    canvas2.update();

    change_canvas.appendChild(canvas2);
    
    var brightness = document.createElement("p");
    var contrast = document.createElement("p");
    var brightness_input = document.createElement("input");
    var contrast_input = document.createElement("input");

    brightness_input.type = "range";
    brightness_input.min = -1;
    brightness_input.max = 1;
    brightness_input.step = 0.01;
    brightness_input.value = 0;

    contrast_input.type = "range";
    contrast_input.min = -1;
    contrast_input.max = 1;
    contrast_input.step = 0.01;
    contrast_input.value = 0;

    brightness.appendChild(brightness_input);
    contrast.appendChild(contrast_input);

    current_brightness = brightness_input.value;
    current_contrast = contrast_input.value;

    brightness.querySelector("input[type='range']").addEventListener("input", function() {
        canvas2.draw(texture).brightnessContrast(this.value, current_contrast);
        canvas2.update();
        current_brightness = brightness_input.value;
    });
    contrast.querySelector("input[type='range']").addEventListener("input", function() {
        canvas2.draw(texture).brightnessContrast(current_brightness, this.value);
        canvas2.update();
        current_contrast = contrast_input.value;
    });

    change_canvas.appendChild(brightness);
    change_canvas.appendChild(contrast);
    change_canvas.scrollIntoView();

    var get_text_button = document.createElement("button");
    get_text_button.textContent = "Get Text";
    get_text_button.classList.add("waves-effect", "waves-light", "btn");
    get_text_button.addEventListener("click", function() {
        Tesseract.recognize(
            canvas2.toDataURL(),
            'eng',
            {
                logger: m => {
                    console.log(m)
                    if (!(m.progress === 1)) {
                        document.querySelector(".progress").style.visibility = 'visible';
                        document.querySelector(".determinate").style.width = String(m.progress * 100) + "%";
                    } else {
                        document.querySelector(".progress").style.visibility = 'hidden';
                    }
                    current_action.textContent = m.status;
                }
            })
            .then(( { data: { text } }) => {
                document.getElementById("outputText").textContent = text;
                console.log(text);
            }
        )
    });
    change_canvas.appendChild(get_text_button);    
});
