import { signin, oAuthSignIn } from "@/lib/actions/auth";
import { redirect, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useSignin = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    setError(null);
    setIsLoading(true);
    const result = await signin({ email, password });
    if (result.success) {
      // Redirect to dashboard or home page
      setIsLoading(false);
      redirect("/");
    }
    setIsLoading(false);
    setError(result.message || "An unknown error occurred");
  };

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setError(error);
      router.replace(`/sign-in`);
    }
  }, [searchParams, router]);

  return { isLoading, handleSubmit, error, oAuthSignIn };
};

export default useSignin;
