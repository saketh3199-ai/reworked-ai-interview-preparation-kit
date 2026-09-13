import { api } from "./api";

export const authApi = api.injectEndpoints
(
    {
        endpoints: (builder) =>
        ({
            register: builder.mutation
            (
                {
                    query: (userData) =>
                    ({
                        url: "/auth/register",
                        method: "POST",
                        body: userData
                    })
                }
            ),

            login: builder.mutation
            (
                {
                    query: (userData) =>
                    ({
                        url: "/auth/login",
                        method: "POST",
                        body: userData
                    })
                }
            )
        })
    }
);

export const {useRegisterMutation,useLoginMutation} = authApi;