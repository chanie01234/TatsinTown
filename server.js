// express web server
import { createRequestHandler } from "@remix-run/express";
import express from "express";
import cors from "cors";

const viteDevServer =
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === "production"
        ? null
        : await import("vite").then((vite) =>
            vite.createServer({
                server: { middlewareMode: true },
            })
        );

const app = express();
app.use(
    viteDevServer
        ? viteDevServer.middlewares
        : express.static("build/client")
);
app.use(cors());

const build = viteDevServer
    ? () =>
        viteDevServer.ssrLoadModule(
            "virtual:remix/server-build"
        )
    : await import("./build/server/index.js");

app.all("*", createRequestHandler({ build }));

app.listen(3000, () => {
    console.log("App listening on http://localhost:3000");
});
