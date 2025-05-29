import express, { Express, Request, Response } from "express";

const app: Express = express();
const PORT = 5001;

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Test server running on http://127.0.0.1:${PORT}`);
});

// Keep the process alive and log heartbeat every 10 seconds
setInterval(() => {
  console.log("Server heartbeat - alive");
}, 10000);
