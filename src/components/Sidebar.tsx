import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, ClipboardCheck, Boxes, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/workers", label: "Workers", icon: Users },
  { to: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
];

export const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const isSupervisor = user?.role === "SUPERVISOR";
  const visibleItems = isAdmin
    ? items
    : isSupervisor
      ? items.filter((item) => ["/attendance", "/inventory"].includes(item.to))
      : items.filter((item) => item.to !== "/orders");

  return (
    <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar md:block">
      <div className="sticky top-16 flex flex-col gap-1 p-4">
        <p className="mb-2 px-2 text-xs uppercase tracking-wider text-sidebar-foreground/60">
          Operations
        </p>
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
