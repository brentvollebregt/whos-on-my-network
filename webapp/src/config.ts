export default {
  api: {
    root:
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_API_ROOT
        : window.location.origin
  }
};
