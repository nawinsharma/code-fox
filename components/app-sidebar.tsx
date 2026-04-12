"use client";

import {
	BookOpen,
	Settings,
	Moon,
	Sun,
	LogOut,
	Star,
	Crown,
	MessageSquare,
	ScrollText,
	FileText,
	Check,
} from "lucide-react";
import { Icons } from "@/components/landing/icons";
import { Github } from "@/components/icons/github";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

import Logout from "@/modules/auth/components/logout";
import { useSession } from "@/lib/auth-client";
import { useUsage } from "@/components/providers/usage-provider";

export const AppSidebar = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const pathname = usePathname();
	const { data: session } = useSession();
	const { usage, loading: usageLoading } = useUsage();

	useEffect(() => {
		setMounted(true);
	}, []);

	const navigationItems = [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: BookOpen,
		},
		{
			title: "Chat",
			url: "/dashboard/chat",
			icon: MessageSquare,
		},
		{
			title: "Repository",
			url: "/dashboard/repository",
			icon: Github,
		},
		{
			title: "Reviews",
			url: "/dashboard/reviews",
			icon: Star,
		},
		{
			title: "Logs",
			url: "/dashboard/logs",
			icon: ScrollText,
		},
		{
			title: "Rules",
			url: "/dashboard/rules",
			icon: FileText,
		},
		{
			title: "Settings",
			url: "/dashboard/settings",
			icon: Settings,
		},
	];

	const isActive = (url: string) => {
		if (url === "/dashboard") return pathname === url;
		return pathname.startsWith(url);
	};

	if (!mounted || !session) return null;

	const user = session.user;
	const userName = user.name || "GUEST";
	const userEmail = user.email || "";
	const userAvatar = user.image || "";
	const userInitials = userName
		.split(" ")
		.map((s) => s[0])
		.join("")
		.toUpperCase();

	const isPro = usage?.plan === "PRO";
	const chatUsed = usage?.chatMessagesUsed || 0;
	const chatLimit = usage?.limits[usage.plan].chat || 50;
	const chatPercentage = (chatUsed / chatLimit) * 100;

	return (
		<Sidebar>
			<SidebarHeader className="border-b">
				<div className="flex flex-col gap-3 px-2 py-4">
					<Link href="/dashboard" className="flex items-center gap-2.5 px-2">
						<Icons.logo className="size-16" />
						<span className="text-lg font-semibold text-foreground tracking-tight">
							Code Fox
						</span>
					</Link>

					<div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md bg-sidebar-accent/40">
						<Github className="w-4 h-4 text-sidebar-foreground/70 shrink-0" />
						<span className="text-xs text-sidebar-foreground/70 truncate">
							@{userName}
						</span>
						<Check className="w-3 h-3 text-emerald-500 shrink-0 ml-auto" />
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent className="px-3 py-4 flex-col gap-1">
				<SidebarMenu className="gap-1">
					{navigationItems.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
								className={`h-9 px-3 rounded-md transition-all duration-150 ${
									isActive(item.url)
										? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-medium"
										: "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground"
								}`}
							>
								<Link
									href={item.url}
									className="flex items-center gap-2.5"
								>
									<item.icon className="w-4 h-4 shrink-0" />
									<span className="text-sm">
										{item.title}
									</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>

			<SidebarFooter className="border-t px-3 py-4">
				{!usageLoading && usage && (
					<div className="px-2 mb-3 space-y-3">
						<div>
							<div className="flex justify-between text-xs mb-1">
								<span className="text-muted-foreground">
									Chat Messages
								</span>
								<span className="font-medium">
									{chatUsed}/{chatLimit}
								</span>
							</div>
							<Progress value={chatPercentage} className="h-1.5" />
						</div>

						<div className="flex items-center gap-2">
							<Crown className="w-4 h-4" />
							<span className="text-xs font-medium">
								{isPro ? "Pro Plan" : "Free Plan"}
							</span>
						</div>

						<Link href={isPro ? "/dashboard/settings" : "/dashboard/subscriptions"}>
							<Button
								variant="default"
								size="sm"
								className="w-full"
							>
								{isPro
									? "Manage Subscription"
									: "Upgrade to Pro"}
							</Button>
						</Link>
					</div>
				)}

				<SidebarSeparator />

				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size={"lg"}
									className="h-12 rounded-lg data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors"
								>
									<Avatar className="w-10 h-10 rounded-lg shrink-0">
										<AvatarImage
											src={
												userAvatar ||
												"/placeholder.svg"
											}
											alt={userName}
										/>
										<AvatarFallback className="rounded-lg">
											{userInitials}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-relaxed min-w-0">
										<span className="truncate font-semibold text-base">
											{userName}
										</span>
										<span className="truncate text-xs text-sidebar-foreground/70">
											{userEmail}
										</span>
									</div>
								</SidebarMenuButton>
							</DropdownMenuTrigger>

							<DropdownMenuContent
								className="w-80 rounded-lg"
								align="end"
								side="right"
								sideOffset={8}
							>
								<div className="flex items-center gap-3 px-4 py-4 bg-sidebar-accent/30 rounded-t-lg">
									<Avatar className="w-12 h-12 rounded-lg shrink-0">
										<AvatarImage
											src={
												userAvatar ||
												"/placeholder.svg"
											}
											alt={userName}
										/>
										<AvatarFallback className="rounded-lg">
											{userInitials}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-sm">
											{userName}
										</p>
										<p className="text-xs text-muted-foreground truncate">
											{userEmail}
										</p>
									</div>
								</div>

								<div className="px-2 py-3 border-t border-b">
									<DropdownMenuItem asChild>
										<button
											onClick={() =>
												setTheme(
													theme === "dark"
														? "light"
														: "dark",
												)
											}
											className="w-full px-3 py-3 flex items-center gap-3 cursor-pointer rounded-md hover:bg-sidebar-accent/50 transition-colors text-sm font-medium"
										>
											{theme === "dark" ? (
												<>
													<Sun className="w-5 h-5 shrink-0" />
													<span>Light Mode</span>
												</>
											) : (
												<>
													<Moon className="w-5 h-5 shrink-0" />
													<span>Dark Mode</span>
												</>
											)}
										</button>
									</DropdownMenuItem>
									<DropdownMenuItem className="cursor-pointer px-3 py-3 my-1 rounded-md hover:bg-red-500/10 hover:text-red-600 transition-colors font-medium">
										<LogOut className="w-5 h-5 mr-3 shrink-0" />
										<Logout>Sign Out</Logout>
									</DropdownMenuItem>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};
