"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { signIn } from "@/lib/auth-client";
import { GithubIcon } from "@/components/icons/github";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";

type AuthDialogContextType = {
	open: () => void;
};

const AuthDialogContext = createContext<AuthDialogContextType | null>(null);

export function useAuthDialog() {
	const ctx = useContext(AuthDialogContext);
	if (!ctx) throw new Error("useAuthDialog must be used within AuthDialogProvider");
	return ctx;
}

export function AuthDialogProvider({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const open = useCallback(() => setIsOpen(true), []);

	const handleGithubLogin = async () => {
		setIsLoading(true);
		try {
			await signIn.social({
				provider: "github",
			});
		} catch (error) {
			console.error("GitHub login failed:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthDialogContext.Provider value={{ open }}>
			{children}
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold tracking-tight">
							Welcome to Code Fox
						</DialogTitle>
						<DialogDescription>
							Sign in with GitHub to start getting AI-powered code reviews on your pull requests.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-4 pt-2">
						<button
							onClick={handleGithubLogin}
							disabled={isLoading}
							className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
						>
							<GithubIcon width={20} height={20} />
							{isLoading ? "Signing in..." : "Continue with GitHub"}
						</button>
						<p className="text-xs text-center text-muted-foreground">
							By continuing, you agree to our{" "}
							<a href="#" className="underline hover:text-primary">
								Terms of Service
							</a>{" "}
							and{" "}
							<a href="#" className="underline hover:text-primary">
								Privacy Policy
							</a>
						</p>
					</div>
				</DialogContent>
			</Dialog>
		</AuthDialogContext.Provider>
	);
}
