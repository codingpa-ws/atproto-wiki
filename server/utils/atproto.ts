import { JoseKey } from "@atproto/jwk-jose";
import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { atprotoSessions, atprotoStates } from "../db/schema";
import { count, eq } from "drizzle-orm";
import { db } from "./db";

const config = {
  scope: "atproto",
  privateJWK: process.env.PRIVATE_JWK!,
};

export async function newClient({ host }: { host: string }) {
  const jwk = JSON.parse(config.privateJWK);
  jwk.kid = jwk.kid || "default";
  const key = await JoseKey.fromJWK(JSON.stringify(jwk));

  return new NodeOAuthClient({
    clientMetadata: {
      application_type: "web",
      redirect_uris: [`https://${host}/api/atproto-login`],
      response_types: ["code"],
      grant_types: ["authorization_code", "refresh_token"],
      scope: config.scope,
      token_endpoint_auth_method: "private_key_jwt",
      token_endpoint_auth_signing_alg: "ES256",
      jwks: {
        keys: [{ ...key.publicJwk!, kid: jwk.kid }],
      },
      dpop_bound_access_tokens: true,
      client_uri: `https://${host}`,
      client_id: `https://${host}/.well-known/atproto/oauth-client.json`,
      client_name: host,
    },
    keyset: [key],

    stateStore: {
      async set(key, internalState) {
        const state = JSON.stringify(internalState);
        await db
          .insert(atprotoStates)
          .values({ key, state })
          .onConflictDoUpdate({
            target: atprotoStates.key,
            set: { state },
          });
      },
      async get(key) {
        const [state] = await db
          .select()
          .from(atprotoStates)
          .where(eq(atprotoStates.key, key))
          .limit(1);

        return state ? JSON.parse(state.state) : undefined;
      },
      async del(key) {
        await db.delete(atprotoStates).where(eq(atprotoStates.key, key));
      },
    },

    sessionStore: {
      async set(key, internalSession) {
        const session = JSON.stringify(internalSession);
        await db
          .insert(atprotoSessions)
          .values({ key, session })
          .onConflictDoUpdate({
            target: atprotoSessions.key,
            set: { session },
          });
      },
      async get(key) {
        const [session] = await db
          .select()
          .from(atprotoSessions)
          .where(eq(atprotoSessions.key, key))
          .limit(1);

        return session ? JSON.parse(session.session) : undefined;
      },
      async del(key) {
        await db.delete(atprotoSessions).where(eq(atprotoSessions.key, key));
      },
    },
  });
}
