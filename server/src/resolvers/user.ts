import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  InputType,
  Field,
  ObjectType,
} from "type-graphql";
import argon2 from "argon2";

import { MyContext } from "../types";
import { User } from "../entities/User";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UsernamePasswordInput)
    { username, password: unhashedPassword }: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Username should be longer than 2 characters",
          },
        ],
      };
    }
    if (unhashedPassword.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "Password should be longer than 2 characters",
          },
        ],
      };
    }
    const password = await argon2.hash(unhashedPassword);
    const user = em.create(User, { username, password });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      console.log({ err, msg: err.message });
      if (
        err.code === "23505" ||
        (err.detail && err.detail.includes("already exists"))
      ) {
        return {
          errors: [
            {
              field: "username",
              message: "That username already exists",
            },
          ],
        };
      }
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => UsernamePasswordInput)
    { username, password }: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "That username doesn't exist",
          },
        ],
      };
    }
    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword) {
      return {
        errors: [
          {
            field: "password",
            message: "Invalid password",
          },
        ],
      };
    }
    return { user };
  }
}
