import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
    endpoints: (builder) => ({
        getMenu: builder.query({
            query: () => '/api/menu',
        }),
    }),
});
export const { useGetMenuQuery } = api;
