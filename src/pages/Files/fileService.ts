/* import { gapi } from 'gapi-script';

const SCOPE = 'https://www.googleapis.com/auth/drive.file';
const CLIENT_SECRETS = {
  client_id: '562573605990-ed40ktd3plhl9afmlrfm934o9c5kdhp9.apps.googleusercontent.com',
  client_secret: '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',
  api_key: "AIzaSyAncVGG7B3hwjcPZeDI_su_cFzF7U4-7g4"
};
const FILE_ID = "1S0-uTp4kXLGvslN_TCx8kCYelU8DesuM";

function initClient() {
  gapi.client.init({
    apiKey: CLIENT_SECRETS.api_key,
    clientId: CLIENT_SECRETS.client_id,
    scope: SCOPE
  })
}

function login() {
  gapi.auth2.getAuthInstance().signIn().then(function() {
    console.log('User signed in');
    // Optionally, you can now call the download function or any other API
  });
}

function downloadFile() {
  gapi.client.drive.files.get({
    fileId: FILE_ID,
    alt: 'media'
  }).then(function(response) {
    const fileContent = response.body;
    console.log('Downloaded file:', fileContent);
    
    // Example: Download the file as a Blob (or handle it however you need)
    const blob = new Blob([fileContent], {type: 'application/octet-stream'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = 'JDR_Fate_DATA.json'; // Set the filename and extension
    a.click();
  }, function(error) {
    console.log('Error downloading file: ', error);
  });
}

function uploadFile(file) {
  const metadata = {
    'name': file.name, // Name of the file you want on Drive
    'mimeType': file.type, // Mime type of the file
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
  form.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
  xhr.setRequestHeader('Authorization', 'Bearer ' + gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token);
  xhr.onload = function() {
    const response = JSON.parse(xhr.responseText);
    console.log('File uploaded successfully:', response);
  };
  xhr.send(form);
}

export const fileService = {
  initClient,
  login,
  downloadFile,
  uploadFile
}; */