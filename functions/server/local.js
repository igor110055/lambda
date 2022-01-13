require("dotenv").config({
  path: "../../.env",
});

const app = require("./app");

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
