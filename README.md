## Node.js Python String Generator

This application generates a string using a python script and inputs the result into a MySQL server.

### Usage

Configure your mysql config details in 'config/mysql.js'. Run 'node server.js' within the project directory. Ensure that you have npm modules installed before running.

### API Definition

You may use your API client of choice such as Postman.

```
PUT http://localhost:5000/api/pycalc
```