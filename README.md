# Mobile Web Specialist Certification Course

Go [here](https://github.com/udacity/mws-restaurant-stage-2) to get the backend server of this project.

## Project Setup

- Make sure you have node (version 8 and above) installed on your local machine
- Run `npm install` on the root folder to install dependencies
- Run `npm start` or `gulp` to start the gulp task which will start the server for development on `http://localhost:3000`
- Run `npm dist` or `gulp dist` to make a production build. It will also start a local server for the production build on `http://localhost:8080`
- Make sure to place new images in the `app/images` folder as there is a gulp task that produces optimized images from there.
- For the gulp `imageResize` task, make sure you have `graphicsmagick` and `imagemagick` installed on your machine
