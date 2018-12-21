const parse = event => {
  const body = event.body;
  const headers = event.headers;

  if (!body || !headers) {
    throw new Error("Invalid event data passed");
  }

  return { body, headers };
};

const checkHeaders = headers => {
  if (
    headers &&
    headers.hasOwnProperty("x-github-event") &&
    headers["x-github-event"] === "push"
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
  const { body, headers } = parse(event);
  if (!checkHeaders(headers) || !hasBeforeAndAfter(body)) {
    return false;
  }
  return body;
};
