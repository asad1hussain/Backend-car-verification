import { Request, Response, NextFunction } from "express";
import { User } from "../Model";
import { AppDataSource } from "../data-source";

const userRepository = AppDataSource.getRepository(User);

export const checkExistingUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  try {
    const emailcheck = await userRepository.findOneBy({ email });

    if (emailcheck) {
      return res.json(400).send("User already exists");
    }

    next();
  } catch (error) {
    console.error(error);
  }
};
