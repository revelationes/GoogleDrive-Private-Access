/* A simple script to restrict permission to 'private' on your Google Drive Apps or Google Drive folder(s).
   Don't forget to add line 
     "oauthScopes": 
       ["https://www.googleapis.com/auth/drive.readonly", 
       "https://www.googleapis.com/auth/drive", 
       "https://www.googleapis.com/auth/spreadsheets", 
       "https://www.googleapis.com/auth/spreadsheets.currentonly"],
   in the appscript.json.
   Run 'Start' to begin.
   Enjoy!      
*/

function Start() {
  // Pass the ID of your Google Drive folder below (in "YOUR_FOLDER_ID") or if you want to restrcit permission to all your folder in Google Drive Apps 
  // then uncomment the line below and comment the line after
  // var rootf = DriveApp.getRootFolder();
  var rootf = DriveApp.getFolderById('1CfRFGs5OIb3TCbZDmvuY1Bi6LiMye3Al');                         // Put your Google Drive folder in this line
  FolderExplorer(rootf);  
}

function FolderExplorer(folder) {
  Logger.log("EXPLORING DIRECTORY '" + folder.getName() + "'");

  //Removing files permission
  Logger.log("removing files permissions for '" + folder.getName() + "' directory");
  var files = folder.searchFiles('visibility != "limited"');                                       // Searching for files with permission other than PRIVATE 
  while (files.hasNext()) {
    var file = files.next();
    if (file.getId() == null) {
    }
    else {
        Logger.log("removing file permissions for '" + file.getName() + "'");
        file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.VIEW);                        // Restricting access to public files 
        Logger.log("completed removing file permissions for '" + file.getName() + "'");
    }
  }
  Logger.log("completed removing files permissions for '" + folder.getName() + "' directory");
  
  var folders = folder.getFolders();
  while (folders.hasNext()) {
    
    //removing folder permission
    var folder = folders.next();
    var isPrivate = folder.getSharingAccess();
    Logger.log("removing directory permissions for '" + folder.getName() + "'");
    if (isPrivate == DriveApp.Access.PRIVATE) {
      Logger.log("directory '" + folder.getName() + "' is already private");
    }
    else {
      folder.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.VIEW);                          // Restricting access to public folders  
      var users = folder.getEditors();
      for (var i = 0; i < users.length; i++) {
        folder.removeEditor(users[i].getEmail());
        Logger.log("completed removing directory permissions for '" + folder.getName() + "'");
      }
    
    }
  FolderExplorer(folder);                                                                           // Iterate through child folders and repeat the process  
  //    break;
  }
}


// In case the runtime exceeds your limit, just rerun again. It will pass all private files (but not folders)

