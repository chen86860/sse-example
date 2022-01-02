const Koa = require("koa");
const stream = require("stream");

const app = new Koa();

app.use(async (ctx) => {
  const route = ctx.request.path;

  if (route === "/stream") {
    ctx.set({
      // necessary HTTP Headers for server sent events
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",

      // CORS settings
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
    });

    const pipe = new stream.PassThrough();
    // normalize message without event name specified
    pipe.write(`id: ${Math.random()}\ndata: hello from steam\n\n`);

    const interval = setInterval(() => {
      // normalize message with event name(eg:currentTime) specified
      pipe.write(`id: ${Math.random()}\nevent: currentTime\ndata: ${new Date().toUTCString()}\n\n`);
    }, 1000);

    ctx.body = pipe;

    // clear interval and destroy stream object while client disconnect
    ctx.res.on("close", () => {
      clearInterval(interval);
      pipe.destroy();
    });

    return;
  }

  ctx.body = "Hello World!";
});

app
  .listen(3000)
  .on("listening", () => {
    console.log("server start at http://localhost:3000");
  })
  .on("error", console.error);
