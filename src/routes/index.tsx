import RootLayout from '@/layouts/root'
import NotFoundPage from '@/modules/error/404-page'
import ErrorPage from '@/modules/error/page'
import HistoryPage from '@/modules/history/page'
import LoginPage from '@/modules/login/page'
import OverviewPage from '@/modules/overview/page'
import SettingsPage from '@/modules/settings/page'
import StrategyManagementPage from '@/modules/strategy-management/page'
import CreateEditStrategyPage from '@/modules/strategy-management/pages/create-edit-strategy'
import StrategyDetailsPage from '@/modules/strategy-management/pages/strategy-details'
import { createBrowserRouter } from 'react-router'
import ProtectedRoute from './protected.route'

export const router = createBrowserRouter([
    { path: '/login', Component: LoginPage },
    { path: '/reset-password', Component: LoginPage },
    { path: '/auth/set-password', Component: LoginPage },
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
                            const userStorage =
                                localStorage.getItem('cda-trading-bot-auth-storage-user') ||
                                sessionStorage.getItem('cda-trading-bot-auth-storage-user')
                            const user = userStorage ? JSON.parse(userStorage) : null
                            const name = user?.firstName
                                ? `${user.firstName} ${user.lastName}`.trim()
                                : 'Investor'
                            return { name }
                        },
                        handle: ({
                            title: 'Overview',
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
                        path: '/strategy-management/create',
                        Component: CreateEditStrategyPage,
                        handle: {
                            title: 'Create Strategy',
                            subTitle: 'Configure a new automated trading strategy',
                            isBackBtn: true,
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
                        path: '/strategy-management/:id/edit',
                        Component: CreateEditStrategyPage,
                        handle: {
                            title: 'Edit Strategy',
                            subTitle: 'Update your trading strategy configuration',
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
