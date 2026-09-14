
import { api } from "./api";

export const kitApi = api.injectEndpoints
(
    {
        endpoints: (builder) =>
        ({
            getKits: builder.query
            (
                {
                    query: () =>"/kits",
                    providesTags: ["Kit"]
                }
            ),

            getKit: builder.query
            (
                {
                    query: (kitId) =>`/kits/${kitId}`,
                    providesTags: (result,error,kitId) =>[{type: "Kit",id: kitId}]
                }
            ),

            createKit: builder.mutation
            (
                {
                    query: (kitData) =>
                    ({
                        url: "/kits",
                        method: "POST",
                        body: kitData
                    }),

                    invalidatesTags: ["Kit"]
                }
            ),
            updateKit: builder.mutation
            (
                {
                    query: ({kitId, kitData}) =>
                    (
                        {url: `/kits/${kitId}`,method: "PUT",body: kitData}
                    ),

                    invalidatesTags: (result,error,{kitId}) =>
                    [
                        {type: "Kit",id: kitId},
                        "Kit"
                    ]
                }
            ),
            regenerateQuestions: builder.mutation
            (
                {
                    query: (kitId) =>
                    ({
                        url: `/kits/${kitId}/regenerate`,
                        method: "POST"
                    }),

                    invalidatesTags: (result,error,kitId) =>
                    [
                        {type: "Kit",id: kitId},
                        "Kit"
                    ]
                }
            ),
            updatePractice: builder.mutation
            (
                {
                    query: ({kitId,confidence}) =>
                    ({
                        url: `/kits/${kitId}/practice`,
                        method: "PUT",
                        body:
                        {
                            confidence
                        }
                    }),

                    invalidatesTags: (result,error,{kitId}) =>
                    [
                        {type: "Kit",id: kitId},
                        "Kit"
                    ]
                }
            ),
            deleteKit: builder.mutation
            (
                {
                    query: (kitId) =>
                    ({
                        url: `/kits/${kitId}`,
                        method: "DELETE"
                    }),

                    invalidatesTags: ["Kit"]
                }
            ),
        })
    }
);

export const {
    useGetKitsQuery,
    useGetKitQuery,
    useCreateKitMutation,
    useUpdateKitMutation,
    useDeleteKitMutation,
    useRegenerateQuestionsMutation,
    useUpdatePracticeMutation
} = kitApi;
