// example with express-validator in routes
const { body, validationResult } = require("express-validator");

router.post(
  "/register",
  [
    body("email").isEmail(),
    body("username").isLength({ min: 3 }),
    body("phone").isMobilePhone("any"),
    body("password").isStrongPassword({ minLength: 8 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
  authController.register
);
