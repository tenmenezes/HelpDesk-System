import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

interface FormValues {
  username: string;
  email: string;
  password: string;
  phone: string;
  sector: string;
  type: string;
}

interface PasswordInputProps {
  field: ControllerRenderProps<FormValues, "password">;
}

export function PasswordInput({ field }: PasswordInputProps) {
  const [show, setShow] = useState(false);
  function getPasswordStrength(password: string) {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { label: "Fraca", level: 1, color: "bg-red-600" };
    if (score === 3)
      return { label: "Média", level: 2, color: "bg-yellow-600" };
    if (score === 4) return { label: "Forte", level: 3, color: "bg-green-600" };
    return { label: "Muito Forte", level: 4, color: "bg-emerald-600" };
  }

  const passwordStrength = getPasswordStrength(field.value || "");

  return (
    <>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          placeholder="Digite uma senha forte"
          {...field}
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex items-center absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={() => setShow(!show)}
        >
          {show ? (
            <EyeOffIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
      {field.value && (
        <div className="space-y-1 mt-2">
          <div className="w-full h-2 transition-all bg-neutral-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${passwordStrength.color}`}
              style={{ width: `${(passwordStrength.level / 4) * 100}%` }}
            ></div>
            <p className="text-sm text-muted-foreground">
              Senha - <strong>{passwordStrength.label}</strong>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
