var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $noteCategory = $(".note-category");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .titles");
var $categoryList = $(".list-container .categories");//

// activeNote is used to keep track of the note in the textarea
var activeNote = {};


// A function for getting all notes from the db
var getNotes = function() {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};

// A function for saving a note to the db
var saveNote = function(note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};

// A function for deleting a note from the db
var deleteNote = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  });
};

// If there is an activeNote, display it, otherwise render empty inputs
var renderActiveNote = function() {
  $saveNoteBtn.hide();
  if (activeNote.category!=undefined) {
    //console.log("readonlyON")
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteCategory.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
    $noteCategory.val(activeNote.category)
  } else {
    //console.log("readonlyOFF")
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteCategory.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
    $noteCategory.val("")
  }
};

// Get the note data from the inputs, save it to the db and update the view -----------
var handleNoteSave = function() {
  var newNote = {
    category: $noteCategory.val(),
    title: $noteTitle.val(),
    text: $noteText.val()
  }; 

  saveNote(newNote).then(function(data) {
    getAndRenderNotes();
    renderActiveNote();
  });
};//----------------------

// Delete the clicked note
var handleNoteDelete = function(event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  var note = $(this)
    .parent(".list-group-item")
    .data();


  if (activeNote.title === note.title) {
    activeNote = {};
    deleteNote(note.title).then(function() {
      getAndRenderNotes();
      renderActiveNote();
    });
  }
};

// Sets the activeNote and displays it
var handleNoteView =  async function() {
  title = $(this).data("title");
  $("li.list-group-item").removeClass("gray")
  $(this).addClass("gray")
  let data= await getNotes();
  activeNote = (data.filter((note)=>{
    if (note.title === title) return note
  }))[0]
  renderActiveNote();
};

// handles and sets up for category based view
var handleCategoryView =  async function() {
  cat = $(this).data("cat");    
  let data= await getNotes();
  $("li.list-group-item").removeClass("gray")
  renderNoteList(data,cat);
  $(this).addClass("gray")
};

// Sets the activeNote to and empty object and allows the user to enter a new note
var handleNewNoteView = function() {
  activeNote = {};
  renderActiveNote();
};

// If a note's title or text are empty, hide the save button
// Or else show it//--------------------
var handleRenderSaveBtn = function() {
  if (!$noteTitle.val().trim() || !$noteText.val().trim() || !$noteCategory.val().trim() ||activeNote.category!=undefined) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};//--------------------

// Render's the list of note titles/-----------------
var renderNoteList = function(notes,category) {
  $noteList.empty();

  //var noteListItems = [];
  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];
    if (category === "All categories" || note.category === category) { 
      let objTitle = {"title":note.title}
      var $li = $("<li class='list-group-item'>").data(objTitle);//
      var $span = $("<span>").text(note.title);
      var $delBtn = $(
        "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
      )
      $li.append($span, $delBtn);
      $noteList.append($li);
    }
  }
};


// Render's the list of note Categories/------------
var renderCategoryList = function(notes) {
  $categoryList.empty();

//this is used so repetitive categories are not called more than once
  var categories= ["All categories"]
  cat = notes.map((note)=> {
    if (!categories.includes(note.category)) { 
      //categoryName = note.category;
      categories.push(note.category);
    }
    return categories
  })

  for (var i = 0; i < categories.length; i++) {
    var category = categories[i];
    let objcat = {"cat":category}
    var $li = $("<li class='list-group-item'>").data(objcat);//
    var $span = $("<span>").text(category);
    // var $delBtn = $(
    //   "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    // );
    $li.append($span);
    $categoryList.append($li);
  }
};//----------------

// Gets notes from the db and renders them to the sidebar------------------
var getAndRenderNotes = function() {
  return getNotes().then(function(data) {
    renderNoteList(data,"All categories");
    renderCategoryList(data);
  });
};//-----------------

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn); //
$noteText.on("keyup", handleRenderSaveBtn); //
$noteCategory.on("keyup", handleRenderSaveBtn);  //
$categoryList.on("click",".list-group-item", handleCategoryView);
// Gets and renders the initial list of notes
getAndRenderNotes();
