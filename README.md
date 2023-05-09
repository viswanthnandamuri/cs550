To run the frontned:
go to frontend dolder cd frontend
run command npm start

To run the backend
Stay is cs550 folder and execute command npm run dev

To change db connections
go to db folder cd db
and update these configuration settings
var connection = mysql.createConnection({
host: "localhost",
user: "root",
password: "password",
database: "data",
});
