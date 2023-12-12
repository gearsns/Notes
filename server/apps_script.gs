const folderID = "xxxxxxxx";
const filename = "Notes.json";

function doGet() {
  const uploadFolder = DriveApp.getFolderById(folderID);
  const files = uploadFolder.getFilesByName(filename);
  let json = "{}";
  if(files.hasNext()){
    const file = files.next();
    const blob = file.getBlob();
    json = blob.getDataAsString();
  }
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(json);
  return output;
}

function doPost(e) {
  const uploadFolder = DriveApp.getFolderById(folderID);
  const files = uploadFolder.getFilesByName(filename);
  if(files.hasNext()){
    const file = files.next();
    file.setContent(e.postData.getDataAsString());
  } else {
    uploadFolder.createFile(filename, e.postData.getDataAsString());
  }

  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify({ message: "success!" }));

  return output;
}