"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { LoginView } from "@/components/modules/auth/LoginView";

export default function LoginPage() {
  const router = useRouter();
  const { user, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user && token) {
      router.push("/");
    }
  }, [user, token, router]);

  return (
    <LoginView
      onLoginSuccess={() => {
        router.push("/");
      }}
    />
  );
}
