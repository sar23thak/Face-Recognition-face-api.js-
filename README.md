# Face-Recognition-face-api.js-
Attendance System based on face recognition from WebCam.
Programming Languages used: HTML, CSS, Javascript.  
  
Some Major Technologies used: Node.Js as environment and express.js for framework along with the tensorflow.js library for face detection and recognition.  
  
Prerequisites to run the application in your system:  
Node.Js and Express.Js installed on your system.  
    
Open terminal shell and follow the steps listed below-  
<b>Step 1:</b> run ```npm i express``` comand to import express library and get all the required npm packages for the project.  
<b>Step 2:</b> run ```node src/app.js``` to initialize the program.  
<b>Step 3:</b>Open Browser and type ```http://localhost:3000/``` to run the code in your local environment.  
  
<b>personalizing the application.</b>  
To customize the application to track attendace of your class, you need to store the data of students in form of thier face's images and to do so, make separate folder of each student in labeled_images folder(Inside public folder).  
To recognize the registered faaces, add the names of the student in the *script.js file*, line no. 145 in **array: const labels**.  
  
On starting the application on browser it will take a while to open camera and start recognizing faces.  
Once all students finish marking their attendance, teacher can generate the list of attendance by clicking on the button *Track class attendance*.
