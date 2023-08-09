# Gourmet Academy

**Gourmet Academy** is my final project for the Angular course in SoftUni is created with Node.js, Express.js, MongoDB with Mongoose for the backend, and Angular for the frontend.

**Gourmet Academy** is a web application that allows users to explore different types of cuisines, view restaurant menus, and place orders for delivery. The project has two main user roles: _User_ and _Administrator_, each with specific privileges and functionalities.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
   - [User Features](#user-features)
   - [Administrator Features](#administrator-features)
3. [Demo](#demo)
4. [Deployment](#deployment)
   - [Backend Deployment](#backend-deployment)
   - [Frontend Deployment](#frontend-deployment)
   - [Database](#database)
5. [Architecture-Overview](#architecture-overview)
6. [Screenshots](#screenshots)
   
## Introduction

The main objective of Gourmet Academy is to provide users with an easy-to-use platform to explore various cuisines, view restaurant menus, and place orders for delivery. It supports three types of users:

- **Not Logged-in User:** Can view menus for each restaurant, login, register, and access the "About Us" page.
- **Logged-in User:** Can buy from any restaurant, view their own profile, and modify/cancel orders within a five-minute window. They can also leave comments on restaurants and edit/delete their own comments.
- **Logged-in Admin:** Administrators have additional functionalities that include adding new restaurants, managing products for their own restaurant, and viewing statistics for top-selling restaurants and products.

## Features

### User Features

- Browse menus for each restaurant
- Register and log in to an account
- Place orders from any restaurant
- Access a personal profile page
- Modify or cancel orders within five minutes
- Leave comments on restaurants and edit/delete their own comments

### Administrator Features

- Create new restaurants
- Manage products for their restaurant
- Edit or delete existing restaurants and products
- View short statistics for top-selling restaurants and products
- Cannot place orders or leave comments

## Demo

Check out the live demo of Gourmet Academy at [https://main--gourmet-academy.netlify.app/](https://main--gourmet-academy.netlify.app/)

**Demo Admin User:**

    - Email: peter@abv.bg
    - Password: 123456

    - Email: john@abv.bg
    - Password: 123456

    - Email: mary@abv.bg
    - Password: 123456

**Demo Regular User:**

    - Email: stamat@abv.bg
    - Password: 123456

    - Email: prifan@abv.bg
    - Password: 123456

## Deployment

### Backend Deployment

The backend of Gourmet Academy is deployed on [Render](https://render.com/). The backend handles the core functionalities, including user authentication, order processing, and restaurant/product management.

### Frontend Deployment

The Angular frontend of Gourmet Academy is deployed on [Netlify](https://www.netlify.com/). Netlify serves the frontend to users and provides a seamless browsing experience.

### Database

The MongoDB database used for Gourmet Academy is hosted on [MongoDB Cloud](https://cloud.mongodb.com). MongoDB Cloud ensures reliable and scalable data storage for the application.

## Architecture-Overview

## App Module
The `AppModule` is the root module of the application. It sets up the main components and services, and it acts as the entry point to the application.

![AppModule](https://github.com/TodorYadkov/SoftUni/assets/4013980/777ae6e6-a42e-4f0c-a77f-aeddc607f8f3)

## Features Module
The `FeaturesModule` contains feature-specific components.

![features-module](https://github.com/TodorYadkov/SoftUni/assets/4013980/543b520b-447e-4e6b-a3c2-e2ecae55c4c4)


## Shared Module
The `SharedModule` includes components that are shared across the application.

![SharedModule](https://github.com/TodorYadkov/SoftUni/assets/4013980/e4b935ec-8003-442c-a5cf-f01f2f4b9653)

## Routes
The routing configuration defines the navigation paths within the application, allowing users to access different views based on their roles and actions.

![routes](https://github.com/TodorYadkov/SoftUni/assets/4013980/cde36bd9-a870-4a14-943e-c4d8d9b3b7e0)

## Entire overview
![overview](https://github.com/TodorYadkov/SoftUni/assets/4013980/65fe5fb1-01cc-4aa2-b3da-4c272bb48970)

# Screenshots

## Home Page
![home_page](https://github.com/TodorYadkov/SoftUni/assets/4013980/0b9eb47f-7f39-45c0-bc8d-cefc39076e2d)
![home_page-1](https://github.com/TodorYadkov/SoftUni/assets/4013980/a10d4ab9-aba1-4370-8236-ed00b5b97faf)

## Login
![login](https://github.com/TodorYadkov/SoftUni/assets/4013980/43e92aea-df0e-4501-9cb5-0303993b0f7b)

## Register
![register](https://github.com/TodorYadkov/SoftUni/assets/4013980/6689afd1-5cb7-4c3f-9694-3a832016c06e)

## About Us
![about-us](https://github.com/TodorYadkov/SoftUni/assets/4013980/59941b8e-db22-48f2-a453-d135bda2072d)

## User Profile
![user-profile](https://github.com/TodorYadkov/SoftUni/assets/4013980/343e37f8-9f3a-49fa-bc5a-111cd0724fb4)

## Admin Profile
![user-admin](https://github.com/TodorYadkov/SoftUni/assets/4013980/7e664f40-d818-47dc-bdca-64ab723f2014)

## Order
![order](https://github.com/TodorYadkov/SoftUni/assets/4013980/da365179-b158-4058-a6b3-859e48c558ba)

## Navigation - Not Logged In
![nav_not_logged](https://github.com/TodorYadkov/SoftUni/assets/4013980/ecfb9c48-3704-4878-af24-8247dbaa1faf)

## Navigation - Logged In User
![nav_logged_user](https://github.com/TodorYadkov/SoftUni/assets/4013980/d5c6988c-381c-4647-b417-69420cc2981a)

## Navigation - Logged In Admin
![nav_logged_admin](https://github.com/TodorYadkov/SoftUni/assets/4013980/10ee64ae-3434-4127-b8d1-0bef34323ae2)

## Footer
![footer](https://github.com/TodorYadkov/SoftUni/assets/4013980/fe953e77-32b2-4677-90a9-dbc910a6e3e8)
