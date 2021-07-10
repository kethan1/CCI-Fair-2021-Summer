var video = document.getElementById('video');
var camera = document.getElementById('camera_radio_button_show');
var file = document.getElementById('upload_file_radio_button_show');
var stream = undefined;

camera.addEventListener('click', function() {
    document.getElementById('show_camera_section').style.display = 'block';
    globalThis.video = document.createElement("video");
    video.id = "video";
    video.width = "480";
    video.height = "360";
    video.autoplay = true;
    document.getElementById('show_camera_section').insertBefore(video, document.getElementById('show_camera_section').firstChild);
    document.getElementById('show_file_input_section').style.display = 'none';
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            globalThis.stream = stream;
            video.srcObject = stream;
            video.play();
        });
    }
});
file.addEventListener('click', function() {
    document.getElementById('show_camera_section').style.display = 'none';
    if (stream !== undefined) {
        video.pause()
        video.remove();
        stream.getTracks().forEach(function(track) {
            track.stop();
        });
    }
    document.getElementById('show_file_input_section').style.display = 'block';
});

// Get access to the camera!

document.getElementById("snap").addEventListener("click", function() {
    const canvas = document.createElement("canvas");
    const change_canvas = document.querySelector("#changeCanvas");

    try {
        var canvas_glfx = fx.canvas();
    } catch (e) {
        alert(e);
        return;
    }

    change_canvas.textContent = '';

    // scale the canvas accordingly
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    ctx.filter = 'grayscale(1)';

    if (document.querySelector('input[type=file]').files.length > 0) {
        // draw the video at that frame
        var img = new Image();
        img.src = URL.createObjectURL(document.querySelector('input[type=file]').files[0]);

        img.onload = function() {
            ctx.drawImage(img, 0, 0);

            var texture = canvas_glfx.texture(canvas);
            canvas_glfx.draw(texture).brightnessContrast(0, 0);
            canvas_glfx.update();
            canvas_glfx.style.width = "70%"
            
            var brightness = document.createElement("p"),
                contrast = document.createElement("p"),
                brightness_input = document.createElement("input"),
                contrast_input = document.createElement("input");

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
                canvas_glfx.draw(texture).brightnessContrast(this.value, current_contrast);
                canvas_glfx.update();
                current_brightness = brightness_input.value;
            });
            contrast.querySelector("input[type='range']").addEventListener("input", function() {
                canvas_glfx.draw(texture).brightnessContrast(current_brightness, this.value);
                canvas_glfx.update();
                current_contrast = contrast_input.value;
            });

            var get_text_button = document.createElement("button");
            get_text_button.textContent = "Get Text";
            get_text_button.classList.add("waves-effect", "waves-light", "btn");
            get_text_button.addEventListener("click", function() {
                Tesseract.recognize(
                    canvas_glfx.toDataURL(),
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
                        document.getElementById("outputText").style.visibility = 'visible';
                        console.log(text);
                    }
                )
            });
            
            change_canvas.appendChild(canvas_glfx);
            change_canvas.appendChild(brightness);
            change_canvas.appendChild(contrast);
            change_canvas.appendChild(get_text_button);
            change_canvas.scrollIntoView();
        }
    } else {
        // draw the video at that frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        var texture = canvas_glfx.texture(canvas);
        canvas_glfx.draw(texture).brightnessContrast(0, 0);
        canvas_glfx.update();
        
        var brightness = document.createElement("p"),
            contrast = document.createElement("p"),
            brightness_input = document.createElement("input"),
            contrast_input = document.createElement("input"),
            brightness_text = document.createElement("span"),
            contrast_text = document.createElement("span");

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

        brightness_text.textContent = "Brightness: ";
        contrast_text.textContent = "Contrast: ";

        brightness.appendChild(brightness_text);
        brightness.appendChild(brightness_input);
        contrast.appendChild(contrast_text);
        contrast.appendChild(contrast_input);

        current_brightness = brightness_input.value;
        current_contrast = contrast_input.value;

        brightness.querySelector("input[type='range']").addEventListener("input", function() {
            canvas_glfx.draw(texture).brightnessContrast(this.value, current_contrast);
            canvas_glfx.update();
            current_brightness = brightness_input.value;
        });
        contrast.querySelector("input[type='range']").addEventListener("input", function() {
            canvas_glfx.draw(texture).brightnessContrast(current_brightness, this.value);
            canvas_glfx.update();
            current_contrast = contrast_input.value;
        });

        var get_text_button = document.createElement("button");
        get_text_button.textContent = "Get Text";
        get_text_button.classList.add("waves-effect", "waves-light", "btn");
        get_text_button.addEventListener("click", function() {
            Tesseract.recognize(
                canvas_glfx.toDataURL(),
                'eng',
                {
                    logger: m => {
                        console.log(m)
                        if (!(m.progress === 1)) {
                            document.querySelector("#progress_bars").style.visibility = 'visible';
                            document.querySelector(".determinate").style.width = String(m.progress * 100) + "%";
                        } else {
                            document.querySelector("#progress_bars").style.visibility = 'hidden';
                        }
                        current_action.textContent = m.status;
                    }
                })
                .then(( { data: { text } }) => {
                    document.getElementById("outputText").textContent = text;
                    document.querySelector("h4").style.visibility = "visible";
                    console.log(text);
                }
            )
        });

        change_canvas.appendChild(canvas_glfx);
        change_canvas.appendChild(brightness);
        change_canvas.appendChild(contrast);
        change_canvas.appendChild(get_text_button);
        change_canvas.scrollIntoView();
    }
});
