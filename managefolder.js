const PARENT_FOLDER_ID = "1y-wg3aTHMtMnYQL45uyWDq_w_gOOUiZj";

const initialize = () => {
  const form = FormApp.getActiveForm();
  ScriptApp.newTrigger("onFormSubmit").forForm(form).onFormSubmit().create();
};

const onFormSubmit = ({ response } = {}) => {
  try {
    const facultyResponse = response.getItemResponses()[0].getResponse()
    const facultyName = response.getRespondentEmail()
    //const time = response.getTimestamp()
    const facultyfolderName = facultyResponse + ' | ' + facultyName
    const files = response
      .getItemResponses()
      .filter(
        (itemResponse) =>
          itemResponse.getItem().getType().toString() === "FILE_UPLOAD"
      )
      .map((itemResponse) => itemResponse.getResponse())
      .reduce((a, b) => [...a, ...b], []);

    if (files.length > 0) {
      const parentFolder = DriveApp.getFolderById(PARENT_FOLDER_ID);
      const subfolder = parentFolder.createFolder(facultyfolderName);
      files.forEach((fileId) => {
        DriveApp.getFileById(fileId).moveTo(subfolder);
      });
    }
  } catch (f) {
    Logger.log(f);
  }

  
  function deleteEmptyFolders() {
  const PARENT_FOLDER_ID = "1y-wg3aTHMtMnYQL45uyWDq_w_gOOUiZj";
  const parentFolder = DriveApp.getFolderById(PARENT_FOLDER_ID);
  const folders = parentFolder.getFolders();
  while (folders.hasNext()) {
    const subFolder = folders.next();
    treeFolder(parentFolder, subFolder);
  }
  }

  function treeFolder(parentFolder, folder) {


    const childfolders = folder.getFolders();      

    while (childfolders.hasNext()) {               
      const childfolder = childfolders.next();
      treeFolder(folder, childfolder);
    }

    const hasFile = folder.getFiles().hasNext();               
    const hasFolder = folder.getFolders().hasNext();               

    if (!hasFile && !hasFolder) {            
      folder.setTrashed(true)
    }             
  }
};
