import "dotenv/config";
import { initSentry } from "./config/sentry";
import app from "./app";

initSentry();

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, HOST, () => {
  console.log(`Server started on http://${HOST}:${PORT}`);
});
