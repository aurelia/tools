const OS = require('os');
const FS = require('fs');
const child_process = require('child_process');

const proc = null;

if(OS.platform === 'win32'){
  proc = child_process.exec('cmd.exe eslint -v', RenameFile);
}
else{
  proc = child_process.exec('eslint -v', RenameFile);
}

function RenameFile(error, stdout, stderr) {
  const ESLint_major_version = stdout[1];
  const file_version = (ESLint_major_version === '2' ? '.eslintrc2' : '.eslintrc1');

  if(!ESLint_major_version){
    console.error('ESLint not installed globally');
  }
  else{
    FS.rename(file_version, '../.eslintrc', (error) => {
      if(error) {
        console.error('Execution error', error);
      }
      if (stderr) {
        console.error('Error renaming .eslintrc', stderr);
      }
    });
  }

}
