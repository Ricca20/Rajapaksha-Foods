import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),

    endpoints: (builder) => ({
        getMenu: builder.query({
            query: () => '/api/menu',
        }),
        getUserByClerkId: builder.query({
            query: (clerkId) => `/api/user/${clerkId}`,
        }),
        updateUserAddress: builder.mutation({
            query: ({ clerkId, address }) => ({
                url: `/api/user/${clerkId}/address`,
                method: 'PUT',
                body: address,
            }),
            // Invalidate or refetch queries if you use cache tags in the future
        }),
        createOrder: builder.mutation({
            query: (order) => ({
                url: '/api/orders',
                method: 'POST',
                body: order,
            }),
        }),
        getOrdersByUser: builder.query({
            query: (userId) => `/api/orders/user/${userId}`,
        }),
    }),
});

export const { useGetMenuQuery, useCreateOrderMutation, useGetUserByClerkIdQuery, useUpdateUserAddressMutation, useGetOrdersByUserQuery } = api;
