const StreamArray = require("stream-json/streamers/StreamArray");
const path = require("path");
const fs = require("fs");

const jsonStream = StreamArray.withParser();
let counter = 0;

//You'll get json objects here
//Key is an array-index here
jsonStream.on("data", ({ key, value }) => {
    // if ("GB" === value.country) {
  console.log(counter++); 
    //   fs.appendFileSync("./file.json", JSON.stringify(value) + ",");
    // }
});

jsonStream.on("end", () => {
  console.log("All done");
});

const filename = path.join(__dirname, "file.json");
fs.createReadStream(filename).pipe(jsonStream.input);
