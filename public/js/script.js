const video = document.getElementById('videoInput')
var attendance = new Set([]); //creating set to count raw attendace
var btn = document.getElementById("btn")
var filtered_attendees = []; //final attendance after removing "unknown" faces..

Promise.all([
    // importing faceapi.js 
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models') //heavier/accurate version of tiny face detector
]).then(() => {
    btn.disabled = false;
    /*enabled the button here!!!*/
})

document.getElementById("about").onclick = function(){
    window.open("https://github.com/sar23thak/Face-Recognition-face-api.js-");
    //code for get help button on top right of the screen
}

btn.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({
        video: true
      })
      .then(stream => {
        window.localStream = stream;
        video.srcObject = stream;
      })
      .catch((err) => {
        console.log(err);
      });



    //disable the button again here!!!
    btn.disabled = true;
    recognizeFaces()
})

async function recognizeFaces() {

    // creating a canvas that lay over video to recognize faces 
    const labeledDescriptors = await loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7)
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)

    // function to start recognizing faces using face-api.js 
    timeintervall = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
        // console.log(detections, 'by meee')
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        // the line 50 delete the old canvas after the set time interval to avoid so many boxes over the canvas 
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

        const results = resizedDetections.map((d) => {
            return faceMatcher.findBestMatch(d.descriptor)
        })

        // adding the name of faces recognised to the raw set "attendance"
        results.forEach((result, i) => {
            attendance.add(result.label.toString())
            console.log(attendance)
            // console.log(result.label) printing name of student recognized
            const box = resizedDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
            drawBox.draw(canvas)
            if (attendance.size.toString() != '0') {
                // displaying the attendancelist button and erasing the run engine button
                document.getElementById("att").style.display = "initial";
                document.getElementById("btn").style.display = "none";
            }
        })
    }, 1000)


    // everything for viewing attendace is programmed here 
    document.getElementById("att").onclick = function () {
        // displaying off everything (video, canvas, boxes) to display  the attendance list further 
        document.getElementById("videoInput").style.display = "none";
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        clearInterval(timeintervall);
        canvas.style.display = "none";
        //closing the camera after use in next two lines
        localStream.getVideoTracks()[0].stop();
        video.src = '';
    
        document.getElementById("att").style.display = "none";
        document.getElementById("afterr").classList.remove('lett');
        document.getElementById("afterr").innerHTML = "List of Attendees"

        // making the attendace table right here
        let table = document.createElement('table');
        let thead = document.createElement('table');
        let tbody = document.createElement('tbody');
        table.appendChild(thead);
        table.appendChild(tbody);
        document.getElementById('body').appendChild(table);
        
        let row1 = document.createElement('tr');
        row1.style.backgroundColor = "#EEA47FFF";
        let heading1 = document.createElement('th');
        heading1.innerHTML = "Sr. No."
        let heading2 = document.createElement('th');
        heading2.innerHTML = "Name of Student";
        row1.appendChild(heading1);
        row1.appendChild(heading2);
        thead.appendChild(row1);

        // here we will filter the set and form a net array which will remove the unknown faces from the final attendees list 
        attendance = Array.from(attendance);
        var x = false;
        let length = attendance.length;
        for (let j = 0; j < length; j++) {
            if (attendance[j] == "unknown") {
                x = true;
                continue;
            }
            else{
                filtered_attendees.push(attendance[j]);
            }
        }
        // filling data in table 
        let strength = filtered_attendees.length;
        for (let i = 0; i < strength; i++) {
            let nextrow = document.createElement('tr');
            if (i%2 == 0) {
                nextrow.style.backgroundColor= "#00539CFF";
                nextrow.style.color = "#EEA47FFF";
            }
            else{
                nextrow.style.backgroundColor= "#EEA47FFF";
                nextrow.style.color = "#00539CFF";
            }
            let row_serial_no = document.createElement('td');
            row_serial_no.innerHTML = i+1;
            let row_name = document.createElement('td');
            row_name.innerHTML = filtered_attendees[i];
            
            nextrow.appendChild(row_serial_no);
            nextrow.appendChild(row_name);
            thead.appendChild(nextrow);
        }
        // mentioning the total strength of class 
        let para = document.createElement('p')
        para.innerHTML = "Total  Strength:" + strength
        document.body.append(para);
        if (strength == 0) {
            alert("None of the student attended the class!");
            
        }
        if (x == true) {
            alert("Some unknown students were present in your class!")
        }
    }
}
// code for fetching data of the images from the folder "labeled_images" to write over the boxes
function loadLabeledImages() {
    const labels = ['sarthak', 'Captain America', 'Hawkeye', 'Tony Stark', 'Thor']
    return Promise.all(
        labels.map(async (label) => {
            const descriptions = []
            for (let i = 1; i <= 2; i++) {
                const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                // console.log(label + i + JSON.stringify(detections))
                descriptions.push(detections.descriptor)
            }
            // document.body.append(label+' Faces Loaded | ')
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}