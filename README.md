# Serverless URL MEMORIZER
The application allows to insert an URL (validated only for non nullity) to store it and to optionally attach an image to the record. Some URLs can be marked as prioritized and are displayed before the others.
The application has a React front-end and a Node.js back-end deployed on AWS and using Lambda functions. It stores metadata and texts in DynamoDB tables and objects in S3.
The project has its roots in the C4 final Serverless Todo project from which it stems to explore other features both backend and frontend.
The calls are authenticated through the Auth0 identificaion service.



# (Project Specification Option 2): Functionality

* A user of the web application can use the interface to create, delete and complete an item.
* A user of the web interface can click on a "pencil" button, then select and upload a file. A file should appear in the list of items on the home page.
* If you log out from a current user and log in as a different user, the application should not show items created by the first account.
* A user needs to authenticate in order to use an application.

# (Project Specification Option 2): Codebase

* Code of Lambda functions is split into multiple files/classes. The business logic of an application is separated from code for database access, file storage, and code related to AWS Lambda.
* To get results of asynchronous operations, a student is using async/await constructs instead of passing callbacks.


# (Project Specification Option 2): Best practices

* All resources needed by an application are defined in the "serverless.yml". A developer does not need to create them manually using AWS console.
* Instead of defining all permissions under provider/iamRoleStatements, permissions are defined per function in the functions section of the "serverless.yml".
* Application has at least some of the following:

Distributed tracing is enabled
It has a sufficient amount of log statements
It generates application level metrics
* Incoming HTTP requests are validated either in Lambda handlers or using request validation in API Gateway. The latter can be done either using the serverless-reqvalidator-plugin or by providing request schemas in function definitions.

# (Project Specification Option 2): Architecture

* 1:M (1 to many) relationship between users and items is modeled using a DynamoDB table that has a composite key with both partition and sort keys. Should be defined similar to this:

   KeySchema:
      - AttributeName: partitionKey
        KeyType: HASH
      - AttributeName: sortKey
        KeyType: RANGE
		
* Items are fetched using the "query()" method and not "scan()" method (which is less efficient on large datasets)



# How to run the application


## Frontend

The client application is already configured with the right parameters to access the deployed AWS api. 
To run the React application run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless AWS api back-end.

