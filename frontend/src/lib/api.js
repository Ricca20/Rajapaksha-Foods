import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: import.meta.env.VITE_BACKEND_URL,
        prepareHeaders: (headers) => {
            const token = window.Clerk?.session?.lastActiveToken?.raw;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['Menu', 'User'],

    endpoints: (builder) => ({
        getMenu: builder.query({
            query: () => '/api/menu',
            providesTags: ['Menu'],
        }),
        setOrderWindow: builder.mutation({
            query: (data) => ({
                url: '/api/menu/order-window',
                method: 'POST',
                body: data,
            }),
            // Invalidate the menu query so it refetches
            invalidatesTags: ['Menu'],
        }),
        getUserByClerkId: builder.query({
            query: (clerkId) => `/api/user/${clerkId}`,
            providesTags: ['User']
        }),
        updateUserAddress: builder.mutation({
            query: ({ clerkId, address }) => ({
                url: `/api/user/${clerkId}/address`,
                method: 'PUT',
                body: address,
            }),
            invalidatesTags: ['User']
        }),
        createOrder: builder.mutation({
            query: (order) => ({
                url: '/api/orders',
                method: 'POST',
                body: order,
            }),
        }),
        getAllOrders: builder.query({
            query: () => '/api/orders',
        }),
        getTodayOrders: builder.query({
            query: () => '/api/orders/today',
        }),
        updateOrderStatus: builder.mutation({
            query: ({ orderId, status }) => ({
                url: `/api/orders/${orderId}/status`,
                method: 'PATCH',
                body: { status },
            }),
        }),
        getOrdersByUser: builder.query({
            query: (userId) => `/api/orders/user/${userId}`,
        }),
        cancelOrder: builder.mutation({
            query: ({ orderId, userId }) => ({
                url: `/api/orders/${orderId}/cancel`,
                method: 'POST',
                body: { userId },
            }),
        }),
    }),
});

export const { 
    useGetMenuQuery, 
    useCreateOrderMutation, 
    useGetAllOrdersQuery, 
    useGetTodayOrdersQuery,
    useUpdateOrderStatusMutation,
    useSetOrderWindowMutation,
    useGetUserByClerkIdQuery,
    useUpdateUserAddressMutation,
    useGetOrdersByUserQuery,
    useCancelOrderMutation
} = api;
