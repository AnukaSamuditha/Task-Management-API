import jwt from "jsonwebtoken";

const generateAccessToken = (userID: string) => {
  const accessToken = jwt.sign(
    { userID },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES as any },
  );

  return accessToken;
};

const generateRefreshToken = (userID: string) => {
  const refreshToken = jwt.sign(
    { userID },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES as any },
  );

  return refreshToken;
};

export { generateAccessToken, generateRefreshToken };
