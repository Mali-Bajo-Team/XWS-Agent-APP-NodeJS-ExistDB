const { getPostData } = require('./utils')

var Connection = require("./index.js");

var options = {
    // host: "192.168.48.2",
    host: "localhost",
    port: 8443,
    rest: "/exist/rest",
    auth: "admin:"
};
var connection = new Connection(options);

const http = require("http");
const PORT = process.env.PORT || 5000;
const server = http.createServer(async (req, res) => {

    if (req.url === "/api" && req.method === "GET") {
        
        //GET METODA ZA XML BAZU
        connection.get("/db/apps/doc/report.xml", function(res) {
            // collect input and print it out upon end
            var data = [];
            res.on("data", function(chunk) {
                data.push(chunk);
            });
            res.on("end", function() {
                console.log(data.join(""));
            });
            res.on("error", function(err) {
                console.log("error: " + err);
            });
        });

        //response headers
        res.writeHead(200, { "Content-Type": "application/json" });
        //set the response
        res.write("File readed from ExideDB!");
        //end the response
        res.end();
    }
    else if (req.url === "/api" && req.method === "POST") {
        try {
            const body = await getPostData(req)
            const obj = JSON.parse(body)
            const report = obj.report

            var XMLWriter = require('xml-writer'),
            fs = require('fs');
            var ws = fs.createWriteStream('./report.xml');
            ws.on('close', function() {
            console.log(fs.readFileSync('./report.xml', 'UTF-8'));
            });
            xw = new XMLWriter(false, function(string, encoding) {
            ws.write(string, encoding);
            });
            xw.startDocument('1.0', 'UTF-8').startElement(function() {
            return 'report';
            }).startElement(function() {
                return 'content';
            }).text(function() {
            return  report;
            }).endElement(function() {
                return 'content';
            }).endElement(function() {
                return 'report';
            });
            ws.end();
        
            connection.store("./report.xml", "/db/apps/doc");
            res.writeHead(201, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify("Report written to ExideDB!"))  
        } catch (error) {
            console.log(error)
        }
    }

    // If no route present
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});
 


