
export default function DashboardLoading() {
    return (
        <div className="flex h-full w-full flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800" />
                <div className="h-10 w-32 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800" />
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Chart Skeleton */}
                <div className="col-span-4 h-[400px] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />

                {/* Recent Activity Skeleton */}
                <div className="col-span-3 h-[400px] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            </div>
        </div>
    )
}
