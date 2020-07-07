/* A simple script to restrict permission to 'private' on your Google Drive Apps or Google Drive folder(s).
   Don't forget to add line 
     "oauthScopes": 
       ["https://www.googleapis.com/auth/drive.readonly", 
       "https://www.googleapis.com/auth/drive", 
       "https://www.googleapis.com/auth/spreadsheets", 
       "https://www.googleapis.com/auth/spreadsheets.currentonly"],
   in the appscript.json.
   Enjoy!      
*/

function doGet() {
  // Pass the ID of your Google Drive folder below (in "YOUR_FOLDER_ID") or if you want to restrcit permission to all your folder in Google Drive Apps 
  // then uncomment the line below and comment the line after
  // var rootf = DriveApp.getRootFolder();
  Logger.log("Starting");
  var rootf = DriveApp.getFolderById('YOUR_FOLDER_ID');                         // Put your Google Drive folder in this line
  var level = 0;
  FolderExplorer(rootf, level);  
}

function FolderExplorer(folder, level) {
  var level = level + 1;
  Logger.log("EXPLORING DIRECTORY '" + folder.getName() + "' (level " + level + ") ");

  //Removing files permission
  Logger.log("Removing files permissions for '" + folder.getName() + "' directory");
  var files = folder.searchFiles('visibility != "limited"');                                       // Searching for files with permission other than PRIVATE 
  if (files.hasNext() == false) {
    Logger.log("All files in the directory '" + folder.getName() + "' are already private or there is no such file");
  }
  while (files.hasNext()) {
    var file = files.next();
    Logger.log("Removing file permissions for '" + file.getName() + "' in the directory '" + folder.getName() + "'");
    file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.VIEW);                            // Restricting access to public files 
    Logger.log("Completed removing file permissions for '" + file.getName() + "'");
  }
  
  var folders = folder.getFolders();
  while (folders.hasNext()) {
    
    //Removing folder permission
    var folder = folders.next();
    var isPrivate = folder.getSharingAccess();
    var isView = folder.getSharingPermission();
    Logger.log("Removing directory permissions for '" + folder.getName() + "'");
    if (isPrivate == DriveApp.Access.PRIVATE && (isView == DriveApp.Permission.VIEW || isView == DriveApp.Permission.NONE)) {
      Logger.log("Directory '" + folder.getName() + "' is already private");
    }
    else {
      folder.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.VIEW);                          // Restricting access to public folders  
      var users = folder.getEditors();
      for (var i = 0; i < users.length; i++) {
        folder.removeEditor(users[i].getEmail());
        Logger.log("Completed removing directory permissions for '" + folder.getName() + "'");
      }
    
    }
  FolderExplorer(folder, level);                                                                     // Iterate through child folders and repeat the process  
  //    break;
  }
}

function Check() {
  var folder = DriveApp.getFolderById('1s5YQSeQjcwDZi7t6QsoyVDs1SxRqXf7s');
  var isPrivate = folder.getSharingAccess();
  var isView = folder.getSharingPermission();
  Logger.log(isPrivate,isView);
  var files = folder.searchFiles('visibility != "limited"');
  if (files.hasNext() == false) {
    Logger.log("all files in the directory '" + folder.getName() + "' are already private or there is no such file");
  }
  else {
    while (files.hasNext()) {
      Logger.log("Removing file permissions for '" + file.getName() + "' in the directory '" + folder.getName() + "'");
      file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.VIEW);                        // Restricting access to public files 
      Logger.log("Completed removing file permissions for '" + file.getName() + "'");
    }
  }
}
function searchPublicFolder() {
  var folder = DriveApp.getFolderById('14keq_sg08Na4wF7NHxfoNxZCJYZ3D9S_');
  searchPublicFolder2(folder);
}
function searchPublicFolder2(folder) {
  var folders = folder.getFolders();
  while (folders.hasNext()) {
    var folder = folders.next();
    var isPrivate = folder.getSharingAccess();
    var isView = folder.getSharingPermission();
    if (isPrivate == DriveApp.Access.PRIVATE && (isView == DriveApp.Permission.VIEW || isView == DriveApp.Permission.NONE)) {
    }
    else {
      Logger.log(folder.getName(),folder.getId());
    }
    
  }
  searchPublicFolder2(folder);                                                                     // Iterate through child folders and repeat the process  
  //    break;
}  
  

// In case the runtime exceeds your limit, just rerun again. It will pass all private files (but not folders)
