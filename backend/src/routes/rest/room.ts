import express from "express";
import {body, oneOf, param} from "express-validator";
import validate from "@/middlewares/validate";
import roomHandlers from "@/handlers/room";

const router = express.Router();
const TOKEN_LENGTH = 8;

const noEmptyArray = (arr: unknown[]) => arr.length ? arr : undefined

router.post("/",
    body("users").isArray({ min: 1, max: 5 }),
    body("top").default(10).isInt({ min: 1, max: 30 }),
    body("threshold").default(0.5).isFloat({ min: 0, max: 1 }),
    oneOf([
        body('genre').optional().isString().notEmpty(),
        body('genre').optional().isArray().customSanitizer(noEmptyArray)
    ]),
    oneOf([
        body('decade').optional().isString().notEmpty(),
        body('decade').optional().isArray().customSanitizer(noEmptyArray)
    ]),
    validate,
    roomHandlers.createRoomHandler,
);
router.get(
  "/:id",
  param("id").isString().isLength({ min: TOKEN_LENGTH, max: TOKEN_LENGTH }),
  validate,
  roomHandlers.getRoomHandler,
);
router.put('/:id/settings',
    param("id").isString().isLength({ min: TOKEN_LENGTH, max: TOKEN_LENGTH }),
    body("top").default(10).isInt({ min: 1, max: 30 }),
    body("threshold").default(0.5).isFloat({ min: 0, max: 1 }),
    oneOf([
        body('genre').optional().isString().notEmpty(),
        body('genre').optional().isArray().customSanitizer(noEmptyArray)
    ]),
    oneOf([
        body('decade').optional().isString().notEmpty(),
        body('decade').optional().isArray().customSanitizer(noEmptyArray)
    ]),
    validate,
    roomHandlers.updateSettingsHandler,
);
router.put('/:id/users',
    param("id").isString().isLength({ min: TOKEN_LENGTH, max: TOKEN_LENGTH }),
    body("users").isArray({ min: 1, max: 5 }),
    validate,
    roomHandlers.updateUsersHandler,
);
router.delete(
  "/:id",
  param("id").isString().isLength({ min: TOKEN_LENGTH, max: TOKEN_LENGTH }),
  validate,
  roomHandlers.deleteRoomHandler,
);

export default router;
