# Mobile Web Specialist Certification Course

This project is for the Mobile Web Specialist Course on Udacity. The Project Invloved making a website a performant Progressive Web Application (PWA).

The main folder for this project is in the `src` folder. When a production build is made, it is outputed to the a `dist` folder.

This project requires a backend server. Go [here](https://github.com/udacity/mws-restaurant-stage-3) to get the backend server of this project.

## Project Setup

- Make sure you have node (version 8 and above) installed on your local machine
- Run `npm install` on the root folder to install dependencies
- Run `npm start` or `gulp` to start the gulp task which will start the server for development on `http://localhost:8000`
- Run `npm dist` or `gulp dist` to make a production build. It will also start a local server for the production build on `http://localhost:8080`
- Make sure to place new images in the `app/images` folder as there is a gulp task that produces optimized images from there.
- For the gulp `imageResize` task, make sure you have `graphicsmagick` and `imagemagick` installed on your machine

## Note

The explore all features of this project, you would need a browser with PWA support. The application will still work on browsers that dont support PWA features, but the PWA features won't just work.

## TODO

- Edit gulp file to have a better build process.
- Break `app/scripts/dbhelper.js` file into smaller files.
- Write all promise funtions with `aysnc` and `await` format.
- Paginate Reviews in restaurants page
- Move Google maps key and port configs into an `.env` file
