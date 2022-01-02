const API = "http://localhost:3000/stream";

const logEle = document.querySelector("#log") as HTMLTextAreaElement;
console.log = (...args) => {
  logEle.value += args.join(" ") + "\n";
};

const initClient = () => {
  const source = new EventSource(API, {
    withCredentials: true,
  });

  source.addEventListener("open", (e: Event) => {
    console.log("event source is open");
  });

  // event name not specified, message is default
  source.addEventListener("message", (e: MessageEvent) => {
    console.log("'message' event received:", e.data);
  });

  // event name(eg:currentTime) specified
  source.addEventListener("currentTime", (e: any) => {
    console.log("'currentTime' event received:", e.data);
  });

  source.addEventListener("error", (e: Event) => {
    console.error("event source error", e);
    source.close();
  });
};

window.addEventListener("load", initClient);
