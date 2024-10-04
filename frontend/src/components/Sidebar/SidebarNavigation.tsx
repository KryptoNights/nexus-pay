import { useRouter } from "next/router";

import { INavigation, routeIsActive } from "@/routes/sidebar";
import clsx from "clsx";

interface IProps {
  navigation: INavigation[];
  linkClicked: () => void;
  className?: string;
}

const SidebarNavigation = ({ navigation, linkClicked, className }: IProps) => {
  const { pathname } = useRouter();
  const router = useRouter();
  const pushtoRoute = (item: any) => {
    router.push(item);
  };
  return (
    <ul className={clsx("menu", className)}>
      {navigation.map((item) => (
        <li
          onClick={() => pushtoRoute(item.href)}
          className={clsx(
            routeIsActive(pathname, item)
              ? "bordered text-primary"
              : "opacity-75"
          )}
          key={item.name}
        >
          {/* <Link legacyBehavior href={item.href} key={item.name}> */}
          <div className="text-sm font-semibold" onClick={linkClicked}>
            <item.icon className="mr-2 h-6 w-6" aria-hidden="true" />
            {item.name}
          </div>
          {/* </Link> */}
        </li>
      ))}
    </ul>
  );
};

export default SidebarNavigation;
