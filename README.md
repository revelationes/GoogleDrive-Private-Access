# GoogleDrive-Private-Access
A simple script to restrict permission to 'private' on your Google Drive Apps or Google Drive folder(s).
   Don't forget to add line 
     "oauthScopes": 
       ["https://www.googleapis.com/auth/drive.readonly", 
       "https://www.googleapis.com/auth/drive", 
       "https://www.googleapis.com/auth/spreadsheets", 
       "https://www.googleapis.com/auth/spreadsheets.currentonly"],
   in the appscript.json.
   Enjoy!      
