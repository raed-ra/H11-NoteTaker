// ===============================================================================
// LOAD DATA
// We are linking our routes to  "data" sources.
// ===============================================================================

const fs = require("fs");
const express = require("express");
const path = require("path")
const router = express.Router()


// ===============================================================================
// ROUTING
// ===============================================================================


  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // ---------------------------------------------------------------------------

  router.get("/api/notes", function(req, res) {
    let notesData = []
    notesData = JSON.parse(fs.readFileSync(`./db/db.json`))
    res.json(notesData);
  });


  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)

  // ---------------------------------------------------------------------------

  router.post("/api/notes", async function(req, res) {
     try {
     let notesData = []  
      notesData = JSON.parse(fs.readFileSync(`./db/db.json`)) 
      notesData.push(req.body);
      fs.writeFileSync(`./db/db.json`,JSON.stringify(notesData))  
      res.json(true); //return status code inside the header   Xxxxxxxxxxx
     }
     catch (err) {
      res.json(err) //return status code inside the header   xxxxxxxxxxxxx
     }
  });

    //--------------


  router.delete("/api/notes/:title", function(req, res) {
    let notesData = [] 
    notesData = JSON.parse(fs.readFileSync(`./db/db.json`))
    var titletobeDeleted = req.params.title;  
     notesPostDelete = notesData.filter((note)=>{
      if (note.title != titletobeDeleted) {
        return note
      } 
    })
    fs.writeFileSync(`./db/db.json`,JSON.stringify(notesPostDelete))
    res.json(true);
  });

  // ---------------------------------------------------------------------------
  // I added this below code so you could clear out the data while working with the functionality.
  router.get("/api/clear", function(req, res) {
    // Empty out the arrays of data
    notesData=[]
    fs.writeFileSync(`./db/db.json`,JSON.stringify(notesData))
    res.json({ ok: true });
  });

  module.exports = router;
