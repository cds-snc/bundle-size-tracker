const parse = event => {
  if (
    !event ||
    !event.hasOwnProperty("body") ||
    !event.hasOwnProperty("headers")
  ) {
    return { body: false, headers: false };
  }

  let body;
  if (typeof event.body === "object") {
    body = event.body;
  } else {
    body = JSON.parse(event.body);
  }
  const headers = event.headers;

  if (!body || !headers) {
    throw new Error("Invalid event data passed");
  }

  return { body, headers };
};

const checkHeaders = headers => {
  if (
    headers &&
    headers.hasOwnProperty("X-GitHub-Event") &&
    headers["X-GitHub-Event"] === "push"
  ) {
    return true;
  }

  return false;
};

const hasBeforeAndAfter = body => {
  if (!body.before || !body.after) {
    throw new Error("Invalid event data");
  }

  return true;
};

export const validate = event => {
  try {
    const { body, headers } = parse(event);
    if (!checkHeaders(headers) || !hasBeforeAndAfter(body)) {
      return false;
    }
    return body;
  } catch (e) {
    // console.log(e.message);
    return false;
  }
};
