import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full"></div>

      <div className="w-full max-w-md p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-black text-white mb-2">
            Politechnika <span className="text-primary italic">Centralna</span>
          </h1>
          <p className="text-slate-500 text-xs uppercase tracking-[0.3em] font-black">Core Secure Access</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
