
import SidebarToggle from '@/components/Header/SidebarToggle'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const ThemeSelector = dynamic(
  () => import('@/components/Header/ThemeSelector'),
  {
    ssr: false,
  }
)

interface HeaderProps {
  title?: string
}

const Popup = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-4 rounded shadow-lg">
      <h2 className="text-lg font-bold">Popup</h2>
      <p>Content</p>
      <button onClick={onClose} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Close
      </button>
    </div>
  </div>
)

const Header = ({ title }: HeaderProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const handlePopupOpen = () => {
    setIsPopupOpen(true)
  }

  const handlePopupClose = () => {
    setIsPopupOpen(false)
  }
  return (
    <div className="navbar sticky top-0 z-50 bg-base-200 bg-opacity-30 p-4">
      <div className="flex flex-grow justify-between gap-3">
        <div className="flex flex-row gap-3">
          <div className="flex lg:hidden">
            <SidebarToggle />
          </div>
          <div className="flex flex-auto items-center">
            <h1 className="text-md align-middle font-bold leading-none text-primary sm:text-2xl">
              {title}
            </h1>
          </div>
        </div>
        <div className="flex flex-auto items-center justify-end gap-3">
          <ThemeSelector className="pt-1" />
          <button
            onClick={handlePopupOpen}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            New Button
          </button>
        </div>
      </div>
      {isPopupOpen && <Popup onClose={handlePopupClose} />}
    </div>
  )
}

export default Header
