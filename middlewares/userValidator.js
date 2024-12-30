import { body, validationResult } from "express-validator";

const userValidator = {
  create: [
    body("email", "Ups!! Email is required").not().isEmpty(),
    body("email", "Email is invalid!!").normalizeEmail().isEmail(),
    body(
      "password",
      "Hey!! pasword must contain at least, 8 characters between, uppercase, lowercase, numbers and special characters"
    ).isStrongPassword(),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array().map((error) => error.msg) });
      }
      next();
    },
  ],
  // update: [
  //   body("email", "Ups!! Email is required").optional().not().isEmpty(),
  //   body("email", "Email is invalid!!").normalizeEmail().isEmail(),
  //   body(
  //     "password",
  //     "Hey!! pasword must contain at least, 8 characters between, uppercase, lowercase, numbers and special characters"
  //   )
  //     .optional()
  //     .isStrongPassword(),
  //   async (req, res, next) => {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res
  //         .status(400)
  //         .json({ errors: errors.array().map((error) => error.msg) });
  //     }
  //     next();
  //   },
  // ],
};

export default userValidator;
