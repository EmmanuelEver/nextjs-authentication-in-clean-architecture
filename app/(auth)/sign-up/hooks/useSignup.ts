import { signup } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const useSignup = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // TODO: Implement sign up logic
    setIsSubmitting(true);
    try {
      const result = await signup({ email, password, name, confirmPassword });
      console.log(result);
      if (result.success) {
        // Redirect to dashboard or home page
        setIsSubmitting(false);
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setIsSubmitting(false);
      setError("Failed to create user");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        redirect("/sign-in");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return { isSuccess, isSubmitting, error, handleSubmit };
};

export default useSignup;
