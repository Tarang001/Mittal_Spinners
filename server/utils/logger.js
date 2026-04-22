export const logger = {
  apiHit: (method, path) => {
    console.log(JSON.stringify({ type: "api_hit", method, path, at: new Date().toISOString() }));
  },
  error: (error, context = "server_error") => {
    console.error(
      JSON.stringify({
        type: "error",
        context,
        message: error?.message || "Unexpected error",
        stack: error?.stack,
        at: new Date().toISOString(),
      })
    );
  },
  email: (status, detail) => {
    console.log(JSON.stringify({ type: "email_status", status, detail, at: new Date().toISOString() }));
  },
};
