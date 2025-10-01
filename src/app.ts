import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes";

const app = express();

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://autonomix-assignment-uq1d.vercel.app/"]
    : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use("/api", routes);

export default app;
