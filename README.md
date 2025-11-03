# Angular-HttpClient-Connecting-Your-App-to-the-Backend
Presentation slides with help of revealjs and angular 18+ to show httpclient module functionalities to connect an app to a simple backend.

+ previous requirements 

Install NVM and choose version of nodeJS used in a brief summary these help to install nodejs and 
give us possibilities to change between any version available and set by default any that you want.

https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/

First install nvm and validate nvm --version 
1.2.2 is actually official version

after execute the following command that help us to install the longest stable version available:
nvm install lts

to set node version choose one but for default execute next command: 
note: if your user has not priviledged permissions try to gain access to cmd admin for the follow command
nvm use 24.11.0

check if version were installed correctly on the system 
node --version
npm --version

change directory and set into ng-reveal-deck that will be our angular project were we'll start to code
cd .\ng-reveal-deck\

launch the following command : 
npm install

finally in terminal execute :
npm run start

in case simple error npm: The term 'npm' is not recognized as a name of a cmdlet try to close visual studio code 
or your cmd terminal and try again to refresh your environment values but other errors will need 
to search a root cause and navigate on internet until solve it.
