import argon2 from 'argon2';

/** An argon2id hash of a random value nobody knows, verified when no owner matches so every path costs the same. */
const DUMMY_HASH = '$argon2id$v=19$m=65536,p=4,t=3$HmkJ/o7DJO5keIG3FS0WWQ$sXuQ4zgIOBz8zJkZ06hIBtkpuEHi5TEnnBmGxpRg0Cc';

/** Verifies the password against the hash, or against a dummy hash when there is none. */
export async function verifyPassword(passwordHash: string | null, password: string): Promise<boolean> {
  const matches = await argon2.verify(passwordHash ?? DUMMY_HASH, password);
  return passwordHash !== null && matches;
}
