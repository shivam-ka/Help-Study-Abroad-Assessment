"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Compass, LogIn } from "lucide-react";
import axios, { AxiosError } from "axios";
import Link from "next/link";

export default function AdminLoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post("/api/admin/signup", {
                email,
                password,
            });

            if (response.data.success) {
                toast({
                    title: "Success",
                    description: "Account created successfully!",
                });
            }
        } catch (err) {
            const error = err as AxiosError<{ error: string }>;
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.error || "sing up error",
            });
        }

        setIsLoading(false);
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <form onSubmit={handleLogin}>
                    <CardHeader className="text-center">
                        <div className="flex justify-center items-center gap-2 mb-2">
                            <Compass className="h-10 w-10 text-accent" />
                            <h1 className="font-headline text-3xl font-bold text-primary">
                                Course Compass
                            </h1>
                        </div>
                        <CardTitle className="text-2xl font-headline">
                            Admin Sign Up
                        </CardTitle>
                        <CardDescription className="capitalize">
                            Enter your credentials to Create the admin account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="test@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{" "}
                            <Link
                                href="/admin/login"
                                className="font-medium text-primary hover:underline"
                            >
                                Login
                            </Link>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Account"}
                            {!isLoading && <LogIn className="ml-2 h-4 w-4" />}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
