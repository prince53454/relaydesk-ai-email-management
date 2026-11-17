const logger = {
  info: (msg, meta) => {
    console.log(`[RelayDesk] ${(/* @__PURE__ */ new Date()).toISOString()} INFO: ${msg}`, meta ?? "");
  },
  warn: (msg, meta) => {
    console.warn(`[RelayDesk] ${(/* @__PURE__ */ new Date()).toISOString()} WARN: ${msg}`, meta ?? "");
  },
  error: (msg, err) => {
    console.error(`[RelayDesk] ${(/* @__PURE__ */ new Date()).toISOString()} ERROR: ${msg}`, err ?? "");
  }
};
export {
  logger
};
