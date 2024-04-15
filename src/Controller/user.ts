import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../Model";
import { AppDataSource } from "../data-source";

const userRepository = AppDataSource.getRepository(User);

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = {
      email,
      password: await bcrypt.hash(password, 10),
    };

    const user = await userRepository.save(data);

    if (user) {
      let token = jwt.sign({ id: user.id }, "ydwygyegyegcveyvcyegc", {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      return res.status(200).send(user);
    } else {
      return res.status(400).send("Details are not correct");
    }
  } catch (error) {
    console.error(error);
  }
};

//login authentication

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      const isSame = await bcrypt.compare(password, user.password);

      if (isSame) {
        let token = jwt.sign({ id: user.id }, "ydwygyegyegcveyvcyegc", {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });

        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });

        return res.status(200).send(user);
      } else {
        return res.status(400).send("Authentication failed");
      }
    } else {
      return res.status(400).send("Authentication failed");
    }
  } catch (error) {
    console.error(error);
  }
};
