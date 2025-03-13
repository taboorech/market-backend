import "dotenv/config";
import { createServer } from "./app";
import { Application } from "express";

async function boot() {
  let _server: Application | undefined = createServer();
  let serverName: string = "api";

  try {
    const port = parseInt(process.env.PORT || "5000", 10);

    if (_server) {
      _server.listen(port, () => {
        console.log(`APP (${serverName}) is running on port ${port}`);
      });
    }
  } catch (error) {
    console.error('Failed to boot the application', error);
    process.exit(1);
  }
}

boot();