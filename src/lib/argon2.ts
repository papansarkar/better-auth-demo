import { hash, verify, type Options } from "@node-rs/argon2";


const opts: Options = {
 memoryCost: 19456,
 timeCost: 2,
 parallelism: 1,
 outputLen: 32,
}

export async function hashPassword(password: string) {
 const result = await hash(password, opts)
  return result;
}

export async function verifyPassword(data: {password: string, hash: string}) {
 const result = await verify( data.hash, data.password, opts)
  return result;
}