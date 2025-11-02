import { signin } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { useState } from "react";

const useSignin = () => {
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
    console.log(result);
    if (result.success) {
      // Redirect to dashboard or home page
      setIsLoading(false);
      redirect("/");
    }
    setIsLoading(false);
    setError(result.message || "An unknown error occurred");
  };

  return { isLoading, handleSubmit, error };
};

export default useSignin;
