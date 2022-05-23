const video = document.getElementById('videoInput')
var attendance = new Set([]);
var btn = document.getElementById("btn")

// tblheadrow.appendChild(tblheading)
// tblheadrow.appendChild(tblheadingblank)


Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models').catch(err => console.log(err, 'print it')),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models') //heavier/accurate version of tiny face detector
]).then(()=>{
    btn.disabled = false;
}) /*enable the button here!!!*/



// function start() {
//     // document.body.append('Models Loaded')
    
//     navigator.getUserMedia(
//         { video:{} },
//         stream => video.srcObject = stream,
//         err => console.error(err)
//     )

//     //video.src = '../videos/speech.mp4'
//     console.log('video added')
//     recognizeFaces()
// }
btn.addEventListener('click', ()=>{
    navigator.getUserMedia(
        { video:{} },
        stream => video.srcObject = stream,
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
        
    async function recognizeFaces(){

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
            results.forEach( (result, i) => {
                // this is how you can find the name of the attendee/////////////////////////////////////////////////////////////
                attendance.add(result.label.toString())
                console.log(attendance)
                // console.log(result.label)
                const box = resizedDetections[i].detection.box
                const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
                drawBox.draw(canvas)
                // console.log(attendance.size);//////////
                if(attendance.size.toString() != '0'){
                    document.getElementById("att").style.display = "initial";
                    // console.log("it should show");
                    document.getElementById("btn").style.display = "none";
                }
            })
        },2000)


       // everything for viewing attendace is programmed here 
        /////////////////////////////////////////////////
        document.getElementById("att").onclick = function(){
            console.log('yeah');
            document.getElementById("videoInput").style.display = "none";
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            clearInterval(timeintervall);
            canvas.style.display = "none";
            document.getElementById("att").style.display = "none";
// how to stop cameraaaaaaaaaaaaaaaaaaaaaaaa
            // video.pause();
            // video.src = "";
            // video.getTracks()[0].stop();


            document.getElementById("table").classList.remove("hidden");
            // making the attendace table right here 
            // const table = document.querySelector('#table')
            // const tblheadingrow = document.querySelector('#headrow')
            // const tblheading = document.querySelector('#heading')
            // tblheadingrow.appendChild(tblheading)
            // table.appendChild(tblheadingrow)
            // document.body.append(table);
        }
    }
     
         

    
    function loadLabeledImages() {
        const labels = ['sarthak', 'Black Widow', 'Captain America', 'Hawkeye' , 'Jim Rhodes', 'Tony Stark', 'Thor', 'Captain Marvel']
        // const labels = ['Prashant Kumar'] // for WebCam
        return Promise.all(
        labels.map(async (label)=>{
            const descriptions = []
            for(let i=1; i<=2; i++) {
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