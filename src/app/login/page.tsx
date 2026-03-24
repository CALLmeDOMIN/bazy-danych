import LoginForm from "./LoginForm";
import AghLogo from "@/components/AghLogo";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full"></div>

      <div className="w-full max-w-md p-8">
        <div className="text-center mb-10">
          <AghLogo className="w-24 h-32 mx-auto mb-6 text-white" />
          <h1 className="text-3xl font-serif font-black text-white mb-2 uppercase tracking-wide">
             Akademia <span className="text-primary">Górniczo-Hutnicza</span>
          </h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-black">System Obsługi Zasobów Akademickich</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
