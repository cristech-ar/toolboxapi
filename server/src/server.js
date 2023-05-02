import cors from "cors";

import express from "express";

import router from "./router/routes.js";

const app = express();

app.use(express.json());

app.use(cors({ credentials: true }));

app.use("/api", router);

const PORT = process.env.PORT || 8080;

app.listen(PORT, (err) => {
  if (err) {
    console.log("Connection Error: ", err);
    return;
  }
  console.log(`Server listening on port ${PORT}`);
});

export default app;