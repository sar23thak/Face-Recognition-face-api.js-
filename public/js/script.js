const video = document.getElementById('videoInput')
var attendance = new Set([]);
var btn = document.getElementById("btn")

// tblheadrow.appendChild(tblheading)
// tblheadrow.appendChild(tblheadingblank)


Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models').catch(err => console.log(err, 'print it')),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models') //heavier/accurate version of tiny face detector
]).then(() => {
    btn.disabled = false;
}) /*enable the button here!!!*/


btn.addEventListener('click', () => {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        // const stream = video.srcObject;
        err => console.error(err)
    )





    //video.src = '../videos/speech.mp4'
    console.log('video added')
    //disable the button again here!!!
    btn.disabled = true;
    recognizeFaces()
    // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height) it is not working here :(
    // if(document.getElementById('att').clicked == true){
    //     console.log("kiliked");
    //     return;
    // }//////////////////////////////i left here
})

async function recognizeFaces() {

    const labeledDescriptors = await loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7)
    const canvas = faceapi.createCanvasFromMedia(video)
    // alert("my name is")
    // const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)

    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)



    timeintervall = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
        // console.log(detections, 'by meee')
        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

        const results = resizedDetections.map((d) => {
            return faceMatcher.findBestMatch(d.descriptor)
        })
        results.forEach((result, i) => {
            // this is how you can find the name of the attendee/////////////////////////////////////////////////////////////
            attendance.add(result.label.toString())
            console.log(attendance)
            // console.log(result.label)
            const box = resizedDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
            drawBox.draw(canvas)
            // console.log(attendance.size);//////////
            if (attendance.size.toString() != '0') {
                document.getElementById("att").style.display = "initial";
                // console.log("it should show");
                document.getElementById("btn").style.display = "none";
            }
        })
    }, 1000)


    // everything for viewing attendace is programmed here 
    /////////////////////////////////////////////////
    document.getElementById("att").onclick = function () {
        console.log('yeah');
        document.getElementById("videoInput").style.display = "none";
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        clearInterval(timeintervall);
        canvas.style.display = "none";
        document.getElementById("att").style.display = "none";
        document.getElementById("afterr").classList.remove('lett');
        document.getElementById("afterr").innerHTML = "List of Attendees"
        // how to stop cameraaaaaaaaaaaaaaaaaaaaaaaa
        // video.pause();
        // video.src = "";
        // video.getTracks()[0].stop();

        // document.getElementById("table").classList.remove("hidden");
        // making the attendace table right here table table table table table table table table table table table table table table 
        
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
        attendance = Array.from(attendance);
        let length = attendance.length;
        for (let i = 0; i < length ; i++) {
            
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
            row_name.innerHTML = attendance[i];
            
            
            nextrow.appendChild(row_serial_no);
            nextrow.appendChild(row_name);
            thead.appendChild(nextrow);

        }

        // navigator.mediaDevices.getUserMedia({ video: true })
        //     .then(stream => {
        //         window.localStream = stream;
        //         window.localStream.getVideoTracks()[0].stop(); 

        //     })

        //     .catch((err) => {
        //         console.log(err);
        //     });
        // // stop only video
        // window.x = localStream;
        // window.localStream.getVideoTracks()[0].stop(); 

    }
}




function loadLabeledImages() {
    const labels = ['sarthak', 'Black Widow', 'Captain America', 'Hawkeye', 'Tony Stark', 'Thor', 'Captain Marvel']
    // const labels = ['Prashant Kumar'] // for WebCam
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


// why faceapi is giving error on refreshing?
// how to stop webcam when it just detect a single face..}
// prmoise on youtibe
// rounded corner 