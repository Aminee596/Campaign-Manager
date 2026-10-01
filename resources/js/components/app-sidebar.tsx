import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Syringe, UserCog, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

    const allNavItems = [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid, roles: ['admin', 'medecin', 'infirmier', 'rh_agent', 'rh_consultant'] },
        { title: 'Campaigns', href: '/campaigns', icon: Syringe, roles: ['admin', 'medecin', 'infirmier'] },
        { title: 'Collaborators', href: '/collaborators', icon: Users, roles: ['admin', 'rh_agent'] },
        { title: 'Users', href: '/users', icon: UserCog, roles: ['admin'] },
    ];
    const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage().props;
    const role = (auth.user as typeof auth.user & { role: string }).role;
    const mainNavItems: NavItem[] = allNavItems.map((item) => ({
        ...item,
        disabled: !item.roles.includes(role),
    }));

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>
                        <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
