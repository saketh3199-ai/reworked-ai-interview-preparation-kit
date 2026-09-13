import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery
(
    {
        baseUrl: "https://reworked-ai-interview-preparation-kit.onrender.com/api",

        prepareHeaders: (headers) =>
        {
            const token = localStorage.getItem("jwt_token");

            if (token)
            {
                headers.set("authorization",`Bearer ${token}`);
            }

            return headers;
        }
    }
);

export const api = createApi
(
    {
        reducerPath: "api",
        baseQuery,
        tagTypes: ["Kit","User"],
        endpoints: () => ({})
    }
);