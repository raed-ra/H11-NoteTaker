// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

const fs = require("fs");


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/notes", function(req, res) {
    let notesData = []
    notesData = JSON.parse(fs.readFileSync(`./db/db.json`))
    res.json(notesData);
  });


  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the   is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

  app.post("/api/notes", async function(req, res) {
    // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
    // It will do this by sending out the value "true" have a table
    // req.body is available since we're using the body parsing middleware
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


  app.delete("/api/notes/:title", function(req, res) {
    // Note the code hecre. Our "server" will respond to requests and let users know if they have a table or not.
    // It will do this by sending out the value "true" have a table
    // req.body is available since we're using the body parsing middleware
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
  // I added this below code so you could clear out the table while working with the functionality.
  // Don"t worry about it!
  app.get("/api/clear", function(req, res) {
    // Empty out the arrays of data
    notesData=[]
    fs.writeFileSync(`./db/db.json`,JSON.stringify(notesData))
    res.json({ ok: true });
  });
};
