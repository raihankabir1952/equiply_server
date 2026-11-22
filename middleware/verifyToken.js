
// import { createRemoteJWKSet, jwtVerify } from "jose";

// const baseURL = process.env.BETTER_AUTH_URL;

// const JWKS = createRemoteJWKSet(
//     new URL(`${baseURL}/auth/jwks`)
// );

// const verifyToken = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.status(401).json({
//                 message: "Unauthorized! Access token required.",
//             });
//         }

//         const token = authHeader.split(" ")[1];

//         const { payload } = await jwtVerify(token, JWKS, {
//             issuer: baseURL,
//             audience: baseURL,
//             algorithms: ["EdDSA"],
//         });

//         if (
//             !payload.sub ||
//             !["customer", "owner", "admin"].includes(payload.role)
//         ) {
//             return res.status(401).json({
//                 message: "Invalid access token!",
//             });
//         }

//         req.user = {
//             id: payload.sub,
//             email: payload.email,
//             role: payload.role,
//         };

//         next();
//     } catch (error) {
//         console.error("JWT verification error:", error.message);

//         return res.status(401).json({
//             message: "Invalid or expired access token!",
//         });
//     }
// };

// export default verifyToken;

//new for mobile deply
import { createRemoteJWKSet, jwtVerify } from "jose";

const baseURL = process.env.BETTER_AUTH_URL;

// JWKS সরাসরি backend থেকে আনা হবে (proxy ছাড়া)
const jwksURL = process.env.JWKS_URL || `${baseURL}/auth/jwks`;

const JWKS = createRemoteJWKSet(new URL(jwksURL));

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Unauthorized! Access token required.",
            });
        }

        const token = authHeader.split(" ")[1];

        const { payload } = await jwtVerify(token, JWKS, {
            issuer: baseURL,
            audience: baseURL,
            algorithms: ["EdDSA"],
        });

        if (
            !payload.sub ||
            !["customer", "owner", "admin"].includes(payload.role)
        ) {
            return res.status(401).json({
                message: "Invalid access token!",
            });
        }

        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        };

        next();
    } catch (error) {
        console.error("JWT verification error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired access token!",
        });
    }
};

export default verifyToken;
