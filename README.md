# Table of contents
1. [Description](#Description)
2. [Features](#Features)
3. [Functionality and Inner Workings](#Functionality)
    1. [Backend](#Backend)
    2. [Frontend](#Frontend)
4. [Deploying your own FastBox Web App](#Deploy)
    1. [Obtain Your Cloudinary Credentials](#Cloudinary)
    2. [Update the .env File](#env)
    3. [Setup Your Heroku Account](#heroku)
    4. [Update `API_URL` in Auth.js](#auth)
    5. [Create a New Build for the React App](#build)
    6. [Setup the Git Repository](#git)
    7. [Push to Heroku](#push)


<a name="Description"></a>
# FastBox
FastBox is a light and minimalistic media cloud. It is designed to be fast and easily accessible by delivering a simple and smooth design. What makes it special is its sharing speed that depends on qrcodes, urls and short box codes. You can now share your files with anyone at anytime without worrying about any little details, we we provide some good security measures well.

<a name="Features"></a>
# 🌟 FastBox Features
 FastBox's Features
FastBox is mainly centered on quick file sharing and secure file storing.
- **Upload** most file types (jpegs, pngs, txts, mp4, exe ...)
- Fortify your box/cloud with **restrictions and security measures**.
- **Easily share** your box and media around with people.
- **Create, move, rename and download** files.
- View **box statistics** (overall media size, number of times accessed ...)

<a name="Functionality"></a>
# 🛠 FastBox Functionality and Inner Workings
This section will basically explain how FastBox was built. This will mostly cover all *backend* work which was written
using **Flask, a micro web framework written in Python**. In addition, this will explain how most of the User Interface Design is built which will cover
the *frontend* part of the web application that was written using **React, a front-end JavaScript library for building user interfaces based
on UI components**. 

<a name="Backend"></a>
### Backend
- The backend code is structured with **Flask application Factory Pattern and blueprints**.
- **Configuration and logging** are initialized inside the application factory function `create_app()`.
- FastBox uses REST API architecture for server-client communication. Every part and feature of the web application
has its own *api route* in the backend code (Flask) which is responsible for a certain task. Every feature or part of the web app has its own folder that contains functions, routes, blueprint and initializations.
- All HTTPS requests used are *POST* requests regardless the goal of the request. It was used because it can hold more
content sometimes as the URL can have a maximum length on some browsers, it is not cached by default and it can
be more secure and private. This may violate the REST API principle which states that every method should have its distinct
functionality.
- The underlying database that the web application uses to manage users/posts/comments/talents/likes/notifications... records is **PostgreSQL, a relational database management system**. All queries are made using **SQLAlchemy, an object-relational mapper for the Python programming language**.
- For authentication, the user must login to the box using the box code and the password used in the box creation process. All passwords are stored securely using **bcrypt, a password-hashing function** which is extremely resistant to rainbow table-based attacks
due to the *salting* used in the hashing function in addition to the *cost* factor which slows the hashing function
making it prohibitively expensive to brute-force anything. However, you can still access the box using a share URL created in box settings, or using a qrcode created upon box creation.
- There is no restriction on password length or strength as FastBox is meant to be quick and fast. We believe that forcing a strong password will increase the secuirty at the expense of conveniece and accessing speed. Every user should be responsible for his box password strength.
- Upon accessing the box using one of the following methods (share URL, QRCODE, code-password) two tokens are issued. Access token which will be binded under a column in the box database model. This will be used to verify that the following request is made to the box it claims it is making it to by comparing the access token in the request with the access token in the box's access token's column. The second token is the activity token which is used to restrict the user previlleges while using the box by verifying and checking the activity state/rights of the activity token in the request. Only people who access the box using a code-password combination are considered superior users that have all access/edit rights to the box. If these users enable a certain option in settings, only users like them will be able to upload and edit the box, or they can uncheck this option and allow any user who access the box to edit the box content. **Settings are only editable by users who access the box using a code-password combination**. 
- The QRCODE is created using the **segno python library**. It represents a share URL in a qrcode form.
- All the uploaded files and media are stored in a cloudinary account dedicated for FastBox.
> **Note:**
  > 
  > This means that the media uploaded is viewable by people who have access to this cloudinary account. (The media is not end-to-end encrypted.) For this, there will be a documentation on how to host your own FastBox web app using your own cloudinary account which will mean that no one can view your files except you. This may only have one benefit over using cloudinary itself, and that is the sharing speed and simple user interface.

- Two factor authentication can be activated for boxes. It will use a fastbox's email to send 2FA emails to the specified email. **Only users who access the box using a code-password combination can add a 2FA security method**. 
- The folder/file hierarchy is calculated in the frontend. The backend will send two json variables so the frontend can calculate the chosen file hierarchy. **1-** `folder_file_id_mapping` which is used to display information on every file/folder id (parent, name, size ...). **2-** `id_mapping` which is used to show the children of every folder using IDs.

<a name="Frontend"></a>
### Frontend
- The User Interface is built using the **React Library**. The web application's frontend is split into **multiple components** which simplifies readability and makes editing the UI way simpler. The web application relies heavily on conditional rendering and only functional components are used.
- All requests made to the backend rely on the **Fetch API**. Data that should be sent within the request is basically stored either in the component's state (using the *useState hook*), or in the session storage.
- The files' hierarchy needed variables and other data are fetched from the backend with the *Fetch API* when the **component first mounts**. This is achieved using the **useEffect** hook. The *Fetch API* also gets called again to update the data whenever the URL or the data the user wants to see, changes. Also, it is called whenever a **submit/edit/upload event happens, so the server could update the database**.
-  The file hierarchy is calculated using a **recursive function** in the frontend. To display children of folders over and over, **recursive nested components are used as well**.  *E.g, The same component is used inside itself.*
- The layout of the UI design is mostly written using **flexbox containers**. These containers help in *organizing the layout and elements* with minimum effort and code while maintaining a good looking user interface.
- The web application is **responsive on most devices and screens**. To maintain a *good looking responsive* design, **CSS breakpoints and the react-responsive library** are used. These breakpoints are defined according to the **min-width** property.
- Some routes are only accessible **to authenticated users**. To protect these routes from unauthenticated users, a **PrivateRoute** component is used. This route will only allow users who are logged in by **checking if they have both *access_token* and *activity_token* in session storage**. **If the *access_token* and *activity_token* are present but wrong, the user will get access right to this route only, and not to the box content, as the tokens should get validated and verified by the frontend on every request**.
- For css animations, **Animate.css and Animista** libraries were used.