# YelpCamp

> yelpcamp is a place where people can share their experiences of different campgrounds.It includes feature like authentication, authorization, rating, comments, fuzzy search, in-app notification and follow - unfollow system.

  

## Table of contents

*  [Installation](#installation)

*  [Tech Stack](#tech-stack)

*  [Features](#feature)


## Installation

  


- Clone the repository using `git clone` and then change the directory to root of the project

```
git clone 
cd Outing-guide
```
- Install [mongodb](https://www.mongodb.com/)

- Start database
```
> mongod
```

- Use npm to install dependencies for the project.

```
> npm install
```

- Create .env file in root folder and add necessary credentials with variables given below.

```bash

CLOUDINARY_CLOUD_NAME='cloudinary cloud name'
CLOUDINARY_API_KEY='cloudinary api key'
CLOUDINARY_API_SECRET='cloudinary api secret'
MONGODB_URL='mongodb database url'
secret='express-sesseion secret key'

```

- Run the program 

```
> node app.js
```

- Now navigate to http://localhost:3000

***
  

## Tech Stack

> Backend
* Node js
* Mongoose

> Frontend
* Html
* Css
* Bootstrap
* javaScript

> Dependencies

* Cloudinary
* Multer
* Moment.js
* Passport
* mongoose


## Features

* User can register themselves using Register Form and can login themselves using Login Form. Authentication is implemented using mongoose local strategy of passport js. Users details will be stored in the user collection of the database.

* User can post new blog, edit and delete.

* User can comment on others blog and they can also edit and delete it.

* User can rate and review blog. 

* User can follow - unfollow each other.

* User will get in app notification
     
     * whenever someone follow them.
     * when someone commented on user's blog.
     * when someone review or rate  user's blog.
     * the person user following post a new blog.
     * the person user following post a new review.

* User can search post with post name or city name.

* Moment js is used to evaluate time of post and comment from current time.

* Avatar image and all image posted by users are uploaded on cloudinary.

  
