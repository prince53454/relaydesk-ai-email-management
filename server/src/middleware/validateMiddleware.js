import { ApiError } from "../utils/ApiError.js";
function validateBody(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(
        new ApiError(400, "Validation failed", result.error.flatten().fieldErrors)
      );
    }
    req.body = result.data;
    return next();
  };
}
export {
  validateBody
};
