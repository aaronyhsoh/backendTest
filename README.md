Prerequisites:
1. Ensure that docker is installed on device
2. This project is using node v14.17.4 and npm v6.14.14
3. Postman app for testing

Steps to run app:
1. Run the following commands to create a mongodb container:
`docker volume create --name=mongodata`
`docker run --name mongodb -v mongodata:/data/db -d -p 27017:27017 mongo`
2. Shell into the container using this command `docker exec -it mongodb bash`
3. Once in the container, shell into the mongodb using this command `mongo`
4. Initialise a database using `use cafe_db`
5. Navigate to project location and run `node index.js`. You will see the message "Server started on port 8080"

Testing the app:
1. Populate the database with a list of cafe by sending a POST request to `localhost:8080/v1/task/cafe` with the following request body:
```
{
    "name": "cafe1",
    "description": "cafe1 description",
    "logo": "url",
    "location": "Tampines"
}
```

2. Check that the cafe is successfully added to the database by sending a GET request to `localhost:8080/v1/task/cafes?location=Tampines`. Note that the cafe will only show up if the location string in the query matches the cafe's location. Also take note of the `id` field of the cafe in the response:
```
[
    {
        "Key": "Cafe",
        "name": "test_cafe6",
        "description": "test_cafe6 description",
        "employees": 0,
        "logo": "url",
        "location": "Tampines",
        "id": "ed381924-35b8-43da-8a62-a594dc09cc42"
    },
    {
        "Key": "Cafe",
        "name": "test_cafe7",
        "description": "test_cafe6 description",
        "employees": 0,
        "logo": "url",
        "location": "Tampines",
        "id": "c9b9ff8e-bc74-4766-8c60-a6b3bbb4debc"
    }
]
```

3. Add a new employee to a cafe by sending a POST request to this endpoint `localhost:8080/cafe/employee` with the following request body:
```
{
    "name": "employee1",
    "days_worked": 1,
    "cafe": "450c4179-0a4f-4241-bb56-965a88b5ad13"
}

```
The `cafe` field in the above request body is the uuid of the cafe that can be retrieved from `localhost:8080/cafes?location=Tampines`

4. Check that the employee is added to the database by calling this endpoint `localhost:8080/cafes/employees`


Things to note:
1. Some criteria not fulfilled due to time constraint (containerisation)