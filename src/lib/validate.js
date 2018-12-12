const checkHeaders = headers => {
  if (
    headers.indexOf("X-GitHub-Event") !== -1 &&
    headers.indexOf("push") !== -1
  ) {
    return true;
  }

  return false;
};

const parse = event => {
  if (
    !event ||
    !event.hasOwnProperty("body") ||
    !event.hasOwnProperty("headers")
  ) {
    return { body: false, headers: false };
  }

  const body = JSON.parse(event.body);
  const headers = JSON.stringify(event.headers);

  return { body, headers };
};

const hasBeforeAndAfter = body => {
  if (body.before && body.after) {
    return true;
  }
};

export const validate = event => {
  try {
    const { body, headers } = parse(event);

    if (!body || !headers) {
      return false;
    }

    if (!checkHeaders(headers)) return false;
    if (!hasBeforeAndAfter(body)) return false;
    return body;
  } catch (e) {
    // console.log(e.message);
    return false;
  }
};
