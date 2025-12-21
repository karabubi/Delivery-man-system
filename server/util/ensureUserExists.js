
// /Users/salehalkarabubi/works/project/Delivery-man-system/server/util/ensureUserExists.js
const db = require("./db-connect");
const { clerkClient } = require("@clerk/express");

async function ensureUserExists(userId) {
  // email optional holen (geht nur wenn Clerk Secret gesetzt ist)
  let email = "placeholder@clerk.dev";
  try {
    const user = await clerkClient.users.getUser(userId);
    email = user?.emailAddresses?.[0]?.emailAddress || email;
  } catch (e) {
    // falls Clerk call fehlschlägt -> placeholder lassen
  }

  await db("users")
    .insert({ id: userId, email })
    .onConflict("id")
    .merge({ email });

  return { id: userId, email };
}

module.exports = { ensureUserExists };
