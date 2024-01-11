const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.json({ message: "Docker is easy 🐳" })
});

app.listen(PORT, (error) => {
  if (!error)
    console.log("Server is Successfully Running on port " + PORT)
  else
    console.log("Error occurred, server can't start", error);
}
); 
