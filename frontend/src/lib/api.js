import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
    tagTypes: ['Menu', 'Inventory', 'Reviews'],

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
        updateMenu: builder.mutation({
            query: (data) => ({
                url: '/api/menu',
                method: 'POST',
                body: data,
            }),
            // Invalidate the menu query so it refetches
            invalidatesTags: ['Menu'],
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
        getAllOrders: builder.query({
            query: () => '/api/orders',
        }),
        getFilteredOrders: builder.query({
            query: ({ startDate, endDate }) => {
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                return `/api/orders/filtered?${params.toString()}`;
            },
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
        // Inventory endpoints
        getInventoryItems: builder.query({
            query: () => '/api/inventory',
            providesTags: ['Inventory'],
        }),
        getLowStockItems: builder.query({
            query: () => '/api/inventory/low-stock',
            providesTags: ['Inventory'],
        }),
        getInventoryStats: builder.query({
            query: () => '/api/inventory/stats',
            providesTags: ['Inventory'],
        }),
        createInventoryItem: builder.mutation({
            query: (data) => ({
                url: '/api/inventory',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Inventory'],
        }),
        updateInventoryItem: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/inventory/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Inventory'],
        }),
        updateStockLevel: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/inventory/${id}/stock`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Inventory'],
        }),
        deleteInventoryItem: builder.mutation({
            query: (id) => ({
                url: `/api/inventory/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Inventory'],
        }),
        getStockUpdateHistory: builder.query({
            query: ({ itemId, page = 1, limit = 20 }) => `/api/inventory/${itemId}/stock-history?page=${page}&limit=${limit}`,
            providesTags: (result, error, { itemId }) => [{ type: 'Inventory', id: `history-${itemId}` }],
        }),
        
                // Review endpoints
        createReview: builder.mutation({
            query: (data) => ({
                url: '/api/reviews',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Reviews'],
        }),
        getAllReviews: builder.query({
            query: (params) => ({
                url: '/api/reviews',
                params,
            }),
            providesTags: ['Reviews'],
        }),
        getReviewsByUser: builder.query({
            query: (userId) => `/api/reviews/user/${userId}`,
            providesTags: ['Reviews'],
        }),
        canUserReviewOrder: builder.query({
            query: ({ orderId, userId }) => `/api/reviews/can-review/${orderId}?userId=${userId}`,
            providesTags: ['Reviews'],
        }),
        deleteReview: builder.mutation({
            query: (reviewId) => ({
                url: `/api/reviews/${reviewId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Reviews'],
        }),

        // Employee endpoints
        getAllEmployees: builder.query({
            query: (params) => ({
                url: '/api/employees',
                params,
            }),
            providesTags: ['Employees'],
        }),
        getEmployeeById: builder.query({
            query: (id) => `/api/employees/${id}`,
            providesTags: ['Employees'],
        }),
        getEmployeeStatistics: builder.query({
            query: () => '/api/employees/statistics',
            providesTags: ['Employees'],
        }),
        createEmployee: builder.mutation({
            query: (data) => ({
                url: '/api/employees',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Employees'],
        }),
        updateEmployee: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/employees/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Employees'],
        }),
        deleteEmployee: builder.mutation({
            query: (id) => ({
                url: `/api/employees/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Employees', 'Attendance'],
        }),

        // Attendance endpoints
        getAttendanceRecords: builder.query({
            query: (params) => ({
                url: '/api/employees/attendance/records',
                params,
            }),
            providesTags: ['Attendance'],
        }),
        getTodayAttendance: builder.query({
            query: () => '/api/employees/attendance/today',
            providesTags: ['Attendance'],
        }),
        getEmployeeAttendance: builder.query({
            query: ({ id, month, year }) => ({
                url: `/api/employees/${id}/attendance`,
                params: { month, year },
            }),
            providesTags: ['Attendance'],
        }),
        markAttendance: builder.mutation({
            query: (data) => ({
                url: '/api/employees/attendance',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Attendance'],
        }),
        updateAttendance: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/employees/attendance/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Attendance'],
        }),
        deleteAttendance: builder.mutation({
            query: (id) => ({
                url: `/api/employees/attendance/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Attendance'],
        }),
    }),
});

export const { 
    useGetMenuQuery, 
    useCreateOrderMutation, 
    useGetAllOrdersQuery, 
    useGetFilteredOrdersQuery,
    useGetTodayOrdersQuery,
    useUpdateOrderStatusMutation,
    useSetOrderWindowMutation,
    useUpdateMenuMutation,
    useGetUserByClerkIdQuery,
    useUpdateUserAddressMutation,
    useGetOrdersByUserQuery,
    useCancelOrderMutation,
    // Inventory hooks
    useGetInventoryItemsQuery,
    useGetLowStockItemsQuery,
    useGetInventoryStatsQuery,
    useCreateInventoryItemMutation,
    useUpdateInventoryItemMutation,
    useUpdateStockLevelMutation,
    useDeleteInventoryItemMutation,
    useGetStockUpdateHistoryQuery,
    // Review hooks
    useCreateReviewMutation,
    useGetAllReviewsQuery,
    useGetReviewsByUserQuery,
    useCanUserReviewOrderQuery,
    useDeleteReviewMutation,
    // Employee hooks
    useGetAllEmployeesQuery,
    useGetEmployeeByIdQuery,
    useGetEmployeeStatisticsQuery,
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
    // Attendance hooks
    useGetAttendanceRecordsQuery,
    useGetTodayAttendanceQuery,
    useGetEmployeeAttendanceQuery,
    useMarkAttendanceMutation,
    useUpdateAttendanceMutation,
    useDeleteAttendanceMutation
} = api;
