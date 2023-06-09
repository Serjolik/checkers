
function saveFormData(event) {
    // Get the form element
    event.preventDefault();
    let form = document.getElementById("form");

    // Create an object to store the form data
    let formData = {};


    // Loop over all the form fields and add their values to the formData object
    for (let i = 0; i < form.elements.length; i++) {
        let element = form.elements[i];
        if (element.type !== "submit") {
            if (element.name === "figureSizeMin" || element.name === "figureSizeMax") {
                if (!formData["figureSize"]){
                    formData["figureSize"] = {};
                }
                formData.figureSize[element.name] = element.value;
            } else if (element.name === "x_min" || element.name === "x_max" || element.name === "y_min" || element.name === "y_max" || element.name === "z_min" || element.name === "z_max") {
                if (!formData["offset"]){
                    formData["offset"] = {};
                }
                formData.offset[element.name] = element.value;
            } else {
                formData[element.name] = element.value;
            }
        }
    }

    // Convert the formData object to a JSON string

    let jsonData = JSON.stringify(formData);
    sendData(jsonData);
}



function sendData(data) {
    var xhr = new XMLHttpRequest();
    console.log("xhr");
    xhr.open("POST", "/processes", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    document.getElementById('loading-animation').style.display = 'block';
    document.body.classList.add('dimmed');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
            } else {
                setTimeout(function() {
                    sendGetRequest();
                }, 5000);
            }
        }
    };
    xhr.send(data);
}

function sendGetRequest() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 201) {
            let response = JSON.parse(xhr.responseText);
            let jsonText = JSON.stringify(response.json_data);
            let image = response.image;

            // Update the image and json text

            let jsonData = document.getElementById("json_data");
            document.getElementById("myImage").src = `data:image/jpg;base64,${image}`;
            jsonData.textContent = jsonText;
            document.body.classList.remove('dimmed');
            document.getElementById("loading-animation").style.display = "none";
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });

            // Create a download link for the JSON file and add it to the page
            let jsonDownload = document.getElementById('json_download');
            jsonDownload.textContent = 'Download JSON';
            jsonDownload.addEventListener('click', () => {

                const blob = new Blob([jsonText], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'data.json';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });

            document.body.classList.remove('dimmed');
            document.getElementById("loading-animation").style.display = "none";
            document.getElementById("json_download").style.display = "block";
            document.getElementById("json_data").style.display = "block";
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });

        }
        else {
            // Request failed, handle error
            console.error('Image and json request failed');
        }
    };
    xhr.open("GET", "/processes/check", true);
    xhr.send();
}


