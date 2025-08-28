import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getTodayOrders } from '../../../backend/application/application.order';
export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
    tagTypes: ['Menu'],

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
    }),
});

export const { 
    useGetMenuQuery, 
    useCreateOrderMutation, 
    useGetAllOrdersQuery, 
    useGetTodayOrdersQuery,
    useUpdateOrderStatusMutation,
    useSetOrderWindowMutation
} = api;
