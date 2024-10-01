# PsExercise: Fullstack Developer Evaluation Exercise

## Introduction

PsExercise is a web application developed by Carlo Poletto as a test for PrediSurge with the aim of creating an activity manager able to register/authenticate/authorize users and allow them to create/modify/filter/delete all the activities associated with their account. To satisfy these requests, different technologies such as Docker, ASP NET Core, PostgreSQL and React were used in order to guarantee good levels of security, ease of installation and clean code.

## Architectural Description

PsExercise's architecture can be divided into three main areas: the backend, the frontend and the database. For the backend and database, two separate Docker containers running Alpine OS were used for compilation (backend), initialization (database) and execution. To facilitate the management of these containers, Docker Compose was employed through the definition of the `docker-compose.yml` file.

### Technology Stack

The technology stack used includes:

- ASP.NET Core v8.0
- PostgreSQL v13
- React.js v17.0.2
- Semantic UI React v2.1.5

### Folder Organization

The project is organized into the following folders:

- **backend**: contains the Dockerfile and the source code for the backend of the application. The initial setup is based on the [official documentation](https://learn.microsoft.com/it-it/aspnet/core/host-and-deploy/docker/building-net-docker-images?view=aspnetcore-8.0)
    - **Source**: folder with the backend source code.
        - **Controller**: folder containing the definition of all exposed services.
        - **Database**: folder with classes responsible for executing database queries.
        - **Misc**: folder containing various utility classes.
        - **Models**: folder with model and DTO classes.
    - **wwwroot**: folder containing the compiled frontend files.
    - **appsettings.json**: configuration file.
    - **aspnetapp.sln**: ASP.NET Core solution.
    - **Dockerfile**: Docker image for the backend.
- **database**: folder containing the PostgreSQL database volume and the database initialization file.
    - **data**: folder with the PostgreSQL volume.
    - **scripts**: folder with SQL scripts necessary to initialize the database, creating all the necessary tables and users for the correct functioning of the project. This script runs automatically on the first database launch (or whenever no data is present).
- **frontend**: folder containing the configuration and source code of the frontend.
    - **src**: folder with the frontend source code.
        - **Index.tsx**: entry point of the React application.
    - **package.json**: file defining dependencies, build/run scripts, and general application information.
    - **tsconfig.json**: file configuring the TypeScript compiler.
    - **webpack.config.js**: file configuring Webpack, the bundler used to bundle and optimize the Typescript project.
- **scripts**: folder containing utility bash scripts.
    - **build.sh**: script to compile (both frontend and backend) and run PsExercise.
    - **resetDatabase.sh**: script to reset the database by deleting all existing data and forcing re-initialization.
    - **test.sh**: script to test the backend's exposed services.
- **docker-compose.yml**: Docker Compose configuration file.

PS: The database initialization script also takes care of inserting the following 3 application users into the database:

| Email             | Password  |
| ---               | ---       |
| user1@email.com   | pass      |
| user2@email.com   | pass      |
| user3@email.com   | pass      |

## Backend Services

The backend exposes REST services useful for managing users and tasks. These services are configured through classes inside the `backend/Source/Controller` folder. The following table describes their expected behavior:

| Class Name        | Path                  | Method    | Auth JWT Required | Input     | Output            | Description |
| ---               | ---                   | ---       | ---               | ---       | ---               | ---           |
| UserController    | /User/SignUp          | POST      | No                | SignUpDto | -                 | service to create a new user |
| UserController    | /User/SignIn          | POST      | No                | SignInDto | -                 | service to log-in |
| UserController    | /User/SignOut         | POST      | Yes               | -         | -                 | service to log-out |
| UserController    | /User/GetLoggedUser   | GET       | No                | -         | -                 | service to get logged in user data |
| TaskController    | /Task/GetAll          | GET       | Yes               | -         | List of TaskDTO   | service to get logged in user's Tasks |
| TaskController    | /Task/Create          | POST      | Yes               | TaskDto   | -                 | service to create a new task |
| TaskController    | /Task/Delete/{taskId} | DELETE    | Yes               | Task ID   | -                 | service to delete a task |

## Running Locally

### Prerequisites

To compile and run PsExercise, the following prerequisites are required:

- Client Docker (v26.1.1)
- Node.js (v16.14.1)
- Yarn (v1.22.22)

Note: The application was compiled, run, and tested on Windows 11 64-bit with the versions of the prerequisites indicated in parentheses.

### Compilation and Execution

To compile and run the application, simply navigate to the `scripts` folder and execute `build.sh`, which will:

- Compile the frontend.
- Copy the produced files (.js, .css, etc.) to `backend/wwwroot`.
- Start the backend and database Docker containers.
- Display the backend logs.

Once the script finishes execution, PsExercise will be accessible at http://localhost:5121/.

**NB**: keep in mind that the database initialization may take 1 or 2 minutes. For this reason, after the first launch it is recommended to wait a bit before entering the application via browser.

## Future Improvements

Below are the main improvements for possible future development:

- Due to time constraints, some features (such as task filtering/editing) have not been developed and would be beneficial to complete.
- At the time of writing, Semantic UI has not received updates for a long time, limiting the versions of dependencies used on the frontend. It may be worth considering using a different framework.
- To make local application execution easier, it could be beneficial to use a Docker container for the frontend as well.