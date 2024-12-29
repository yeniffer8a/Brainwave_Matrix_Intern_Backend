import { body, validationResult } from "express-validator";

const taskValidator = {
  create: [
    body("title")
      .notEmpty()
      .withMessage("The title field is mandatory")
      .isString("The title must be a string"),
    // body("description").optional().isString("The description must be a string"),
    // body("completed")
    //   .optional()
    //   .isBoolean()
    //   .withMessage("The value must be a boolean"),
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
  //   // body("title")
  //   //   .optional()
  //   //   .notEmpty()
  //   //   .withMessage("The title field is mandatory")
  //   //   .isString("The title must be a string"),
  //   // body("description").optional().isString("The description must be a string"),
  //   body("completed")
  //     .isBoolean()
  //     .withMessage("The value must be a boolean")
  //     .notEmpty()
  //     .withMessage("The state field is mandatory"),

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

export default taskValidator;
