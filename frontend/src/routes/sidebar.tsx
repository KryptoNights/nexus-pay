import {
  ArrowCircleDownIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/outline";

import UserProfile from "public/assets/svgs/UserProfile";
import { TbBrandTwitter } from "react-icons/tb";

interface INavigation {
  name: string;
  href: string;
  icon?: any;
  current?: boolean;
  checkActive?(pathname: String, route: INavigation): boolean;
  exact?: boolean;
}

interface IBottomNavigation {
  name: string;
  href: string;
  icon?: any;
}

interface IBottomIcons {
  name: string;
  href: string;
  icon?: any;
}

interface IBottomDisclaimer {
  name: string;
  href: string;
}

export function routeIsActive(pathname: String, route: INavigation): boolean {
  if (route.checkActive) {
    return route.checkActive(pathname, route);
  }

  return route?.exact
    ? pathname == route?.href
    : route?.href
      ? pathname.indexOf(route.href) === 0
      : false;
}

const navigation: INavigation[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
    current: true,
    exact: true,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: UsersIcon,
    current: false,
  },
  {
    name: "Insights",
    href: "/insights",
    icon: UsersIcon,
    current: false,
  },
  {
    name: "Requests",
    href: "/requests",
    icon: ArrowCircleDownIcon,
    current: false,
  },
  // { name: '404', href: '/404', icon: FolderIcon, current: false },
  // { name: '500', href: '/500', icon: CalendarIcon, current: false },
  // { name: "Keyless", href: "/login", icon: InboxIcon, current: false },
];

const bottomNavigation: IBottomNavigation[] = [
  // { name: 'Docs', href: '#', icon: BookOpenIcon },
  { name: "Profile", href: "/profile", icon: UserProfile },
];

const bottomIcons: IBottomIcons[] = [
  // {
  //   name: "GitHub",
  //   href: "https://github.com/kavishshahh",
  //   icon: TbBrandGithub,
  // },
  {
    name: "Twitter",
    href: "https://x.com/paywithnexus",
    icon: TbBrandTwitter,
  },
  // {
  //   name: "Discord",
  //   href: "https://twitter.com/kavishshahh",
  //   icon: TbBrandDiscord,
  // },
  // {
  //   name: 'Medium',
  //   href: 'https://github.com/JonnysCode/hardhat-nextjs-starter-dashboard',
  //   icon: TbBrandMedium,
  // },
];

const bottomDisclaimer: IBottomDisclaimer[] = [
  { name: "About", href: "#" },
  { name: "Privacy", href: "#" },
  { name: "Terms", href: "#" },
];

export function updateCurrentItem(route: INavigation) {
  navigation.map((item) => (item.current = false));
  route.current = true;
}

export { bottomDisclaimer, bottomIcons, bottomNavigation };
export type { IBottomNavigation, INavigation };
export default navigation;
