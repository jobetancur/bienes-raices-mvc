import jwt from "jsonwebtoken";

const createToken = data => jwt.sign({ id: data.id, name: data.name, email: data.email }, process.env.JWT_SECRET, { expiresIn: '8h' });

const createId = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

export { createId, createToken };
