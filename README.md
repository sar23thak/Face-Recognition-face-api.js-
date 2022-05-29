# Face-Recognition-face-api.js-
Attendance System based on face recognition from WebCam.  
Programming Languages used: HTML, CSS, Javascript.  
  
Some Major Technologies used: Node.Js as environment and express.js for framework along with the tensorflow.js library to develop ML models in javascript.  
We have used ***face-api.js*** , it is the javascript api use to detect and recognize faces in the browser.
  
Prerequisites to run the application in your system:  
Node.Js and Express.Js installed on your system.  
    
Open terminal shell and follow the steps listed below-  
<b>Step 1:</b> run ```npm i express``` comand to import express library and get all the required npm packages for the project.  
<b>Step 2:</b> run ```node src/app.js``` to initialize the program.  
<b>Step 3:</b>Open Browser and type ```http://localhost:3000/``` to run the code in your local environment.  
  
<b>personalizing the application.</b>  
To customize the application in order to track attendace of your class, you need to store the data of students in form of thier face's images and to do so, make separate folder of each student in labeled_images folder(Inside public folder).  
To recognize the registered faces, add the names of the student in the *script.js file*, line no. 151 in **array: const labels**, note that the name of the student should be exactly same as on the folder and in the array!.   
  
<b>How to start application</b>  
after installing all the npm packages and registering the students, you need to run the following commands in terminal.  
<b>Step 1:</b> run node src/app.js to initialize the program.  
<b>Step 2:</b>Open Browser and type http://localhost:3000/ to run the code in your local environment.  
When window appears on the browser click on ***run attendance engine*** button to start, note that sometimes face-api does not load by itself so in case the button don't work, please refresh the page once or twice!. once the api loaded and you hit the button, it will ask for the permission to open camera after which it will take a while to open camera and start recognizing faces.  
Once all students finish marking their attendance, teacher can generate the list of attendance by clicking on the button *Track class attendance*.  
  
**About the Application-**  
The Attendance System will recognize the faces of all those students who are registered in the system already, it will detect some unknown faces as well and notify the teacher about the same, after all the students done with marking their attendance teacher can track the attendance list by clicking on ***track class attendance*** button, also for the future reference the teacher can generate a excel sheet of the attendance list which will automatically download on the system.  
  
Deployed website link-  
http://face-recognition-face-api-js.vercel.app/
