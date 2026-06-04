import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signupFormFields, oauthProviders } from "@/data/mockData";

interface SignupFormProps {
  readonly className?: string;
}

export const SignupForm: React.FC<SignupFormProps> = ({ className = "" }) => {
  return (
    <Card
      variant="elevated"
      className={`p-8 md:p-10 border border-outline-variant/10 ${className}`}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-2 text-on-surface">Get Started</h2>
        <p className="text-on-surface-variant text-sm">
          Join the 10,000+ creators and teams already flowing.
        </p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {signupFormFields.map((field) => (
          <Input
            key={field.id}
            id={field.id}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
          />
        ))}

        <Button type="submit" variant="primary" size="lg" className="w-full">
          Create Account
        </Button>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/30" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface-container-lowest dark:bg-surface-container px-2 text-on-surface-variant uppercase tracking-widest font-semibold">
              Or continue with
            </span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-4">
          {oauthProviders.map((provider) => (
            <Button key={provider.id} variant="secondary" size="md" className="justify-center">
              <span className="text-sm font-semibold">{provider.label}</span>
            </Button>
          ))}
        </div>
      </form>

      <p className="mt-8 text-center text-xs text-on-surface-variant">
        By signing up, you agree to our{" "}
        <a className="text-primary font-bold hover:underline" href="#">
          Terms of Service
        </a>{" "}
        and{" "}
        <a className="text-primary font-bold hover:underline" href="#">
          Privacy Policy
        </a>
        .
      </p>
    </Card>
  );
};

export default SignupForm;
