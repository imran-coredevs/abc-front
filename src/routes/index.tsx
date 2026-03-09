import RootLayout from '@/layouts/root'
import OverviewPage from '@/modules/overview/page'
import StrategyManagementPage from '@/modules/strategy-management/page'
import StrategyDetailsPage from '@/modules/strategy-management/pages/strategy-details'
import HistoryPage from '@/modules/history/page'
import ErrorPage from '@/modules/error/page'
import NotFoundPage from '@/modules/error/404-page'
import LoginPage from '@/modules/login/page'
import SettingsPage from '@/modules/settings/page'
import { createBrowserRouter } from 'react-router'
import ProtectedRoute from './protected.route'

export const router = createBrowserRouter([
    { path: '/login', Component: LoginPage },
    { path: '/reset-password', Component: LoginPage },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <RootLayout />,
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: '/',
                        Component: OverviewPage,
                        loader: async () => {
                            const userStorage = localStorage.getItem('arbitrax-auth-storage')
                            const user = userStorage ? JSON.parse(userStorage) : {}
                            const name = user?.state?.user?.firstName
                                ? `${user?.state?.user?.firstName} ${user?.state?.user?.lastName}`
                                : 'Admin'
                            return { name }
                        },
                        handle: ({ data }: { data: { name: string } }) => ({
                            title: `Hello, ${data.name}`,
                            subTitle: 'Overview of your CDA trading strategies',
                            isBackBtn: false,
                        }),
                    },
                    {
                        path: '/strategy-management',
                        Component: StrategyManagementPage,
                        handle: {
                            title: 'Strategy Management',
                            subTitle: 'Configure and manage your trading strategies',
                            isBackBtn: false,
                        },
                    },
                    {
                        path: '/strategy-management/:id',
                        Component: StrategyDetailsPage,
                        handle: {
                            title: 'Strategy Details',
                            subTitle: 'View and manage strategy configuration',
                            isBackBtn: true,
                        },
                    },
                    {
                        path: '/history',
                        Component: HistoryPage,
                        handle: {
                            title: 'History',
                            subTitle: 'Review your trading history and performance',
                            isBackBtn: false,
                        },
                    },
                    {
                        path: '/settings',
                        Component: SettingsPage,
                        handle: {
                            title: 'Settings',
                            subTitle: 'Manage your account, preferences, and security in one place',
                            isBackBtn: false,
                        },
                    },
                ],
            },
        ],
    },
    { path: '*', Component: NotFoundPage },
])
