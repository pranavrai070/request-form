var nodemailer = require('nodemailer');
const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs')
const multer = require('multer')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(bodyParser.json());


var subject;
var body;
var path;
var name;
var request;
var deadline;
var subject;
var email;
var keywords;
var tasks;
var details;
var image;




var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./images");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: Storage
}).single("image"); //Field name and max count

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/sendemail',(req,res) => {
    upload(req,res,function(err){
        if(err){
            console.log(err)
            return res.end("Something went wrong!");
        }else{
            
            subject = req.body.subject
            path = req.file.path
            name=req.body.name
            request=req.body.request
            deadline=req.body.deadline
            email=req.body.email
            keywords=req.body.keywords
            tasks=req.body.tasks
            details=req.body.details
            image=req.body.image
            console.log(subject)
            console.log(body)
            console.log(req.file)
            console.log(req.files)
            
            const output = `
            <p>You have a new contact request</p>
            <h3>Contact Details</h3>
            <ul>  
              <li>Request Type: ${req.body.request}</li>
              <li>Requester Name: ${req.body.name}</li>
              <li>Content Subject: ${req.body.subject}</li>
              <li>Content Deadline: ${req.body.deadline}</li>
              <li>Email: ${req.body.email}</li>
              <li>Target Keywords: ${req.body.keywords}</li>
              <li>Tasks/Steps: ${req.body.tasks}</li>
              <p>The file is attached to this email</p>
        
            </ul>
            <h3>Content Details</h3>
            <p>${req.body.details}</p>
          `;



            var transporter = nodemailer.createTransport({
                service: 'gmail',
                host:'smtp.gmail.com',
                auth: {
                  user: 'pranavrai070@gmail.com',
                  pass: 'Gmail@1999'
                }
              });
              
              var mailOptions = {
                from: '"Request Form" <pranavrai070@gmail.com>',
                to:'pranavrai070@gmail.com',
                subject:subject,
                html:output,
                attachments: [
                  {
                   path: path
                  }
               ]
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                  fs.unlink(path,function(err){
                    if(err){
                        return res.end(err)
                    }else{
                        console.log("deleted")
                        return res.redirect('/result.html')
                    }
                  })
                }
              });
        }
    })
})

app.listen(5000,() => {
    console.log("App started on Port 5000")
})
