import BrandPanel from "@/components/login/BrandPanel";
import RegisterForm from "./RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <BrandPanel />
      <div className="md:hidden flex-1 bg-white rounded-t-[2rem] -mt-8 relative z-20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="w-16 h-1.5 bg-gray-200 rounded-full mx-auto mb-2 mt-3" />
        <RegisterForm />
      </div>
      <div className="hidden md:flex md:w-1/2">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
