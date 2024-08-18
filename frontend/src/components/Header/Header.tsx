import SidebarToggle from '@/components/Header/SidebarToggle'
import dynamic from 'next/dynamic'
import DropdownIcon from 'public/assets/svgs/DropdownIcon'
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

const Header = ({ title }: HeaderProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const handlePopupOpen = () => {
    setIsPopupOpen(true)
  }

  const handlePopupClose = () => {
    setIsPopupOpen(false)
  }

  // Define Popup as a separate component
  const Popup = ({ onClose }: { onClose: () => void }) => {
    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    }

    return (
      <div
        id="modal"
        className="modal modal-open fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleBackgroundClick}
      >
        <div className="modal-box bg-gray-800 text-white max-w-sm relative">
          <button
            id="closeBtn"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
          <div className="flex flex-col items-center">
            <div className="avatar">
              <div className="w-24 rounded-full bg-pink-300 p-2">
                <img src="path/to/avatar.png" alt="Avatar" className="mask mask-squircle" />
              </div>
            </div>
            <h3 className="font-bold text-lg mt-4">0x6D...aF46</h3>
            <p className="text-gray-400">0 ETH</p>
            <div className="modal-action flex justify-between w-full mt-6">
              <button className="btn btn-outline btn-primary">Copy Address</button>
              <button className="btn btn-outline btn-secondary">Disconnect</button>
            </div>
          </div>
        </div>
      </div>
    )
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
            className="text-white btn btn-primary p-0 m-3 bg-[rgb(0,0,0)] rounded-xl hover:bg-transparent"
          >
            <div className="block pt-[8px] pr-[8px] pb-[8px] pl-[12px]">
              0 ETH
            </div>
            <div className="bg-custom-gradient pt-[6px] pr-[8px] pl-[8px] pb-[8px] font-bold rounded-xl flex items-center h-[100%]">
              <div className="gap-[6px] flex align-middle">
                <div>0x234</div>
                <DropdownIcon />
              </div>
            </div>
          </button>
        </div>
      </div>
      {isPopupOpen && <Popup onClose={handlePopupClose} />}
    </div>
  )
}

export default Header
