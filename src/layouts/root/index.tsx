import BGCircleShadow from '@/assets/images/BGCircleShadow.png'
import TopBar from '@/components/shared/TopBar'
import { Outlet } from 'react-router'

export default function RootLayout() {
    return (
        <main className="custom-scrollbar min-h-screen max-w-full overflow-hidden">
            <div className="flex flex-1 flex-col relative">
                <div className="fixed top-0 right-5 -z-10">
                    <img src={BGCircleShadow} alt="Background Circle Shadow" className="object-cover" />
                </div>
                <TopBar />
                <main className="relative overflow-x-clip overflow-y-auto p-4 pt-24 sm:p-6 sm:pt-28 lg:pt-30">
                    <Outlet />
                </main>
            </div>
        </main>
    )
}
