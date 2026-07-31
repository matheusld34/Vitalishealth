import Image from "next/image";
import logoImage from "@/app/assets/images/logo.png";

const BrandPanel = () => {
  return (
    <>
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative z-10 w-full flex flex-col justify-between py-16 px-12 lg:px-20">
          <div className="flex flex-col items-center justify-center flex-1 gap-10">
            <div className="w-40 h-40 lg:w-48 lg:h-48 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
              <div className="w-28 h-28 lg:w-32 lg:h-32 bg-white/5 rounded-2xl flex items-center justify-center">
                <Image
                  src={logoImage}
                  alt="Vitalis Health Logo"
                  width={140}
                  height={140}
                  className="w-auto h-auto"
                  priority
                />
              </div>
            </div>

            <div className="text-center space-y-5">
              <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Vitalis Health
              </h1>
              <p className="text-brand-100 text-lg lg:text-xl leading-relaxed max-w-md">
                Cuidado e tecnologia para sua saúde. Acesse o portal da clínica.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-white/60 text-sm font-medium tracking-wider uppercase">
            <span>Cuidado integral e tecnológico</span>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-white/30" />
              <span className="w-2 h-2 rounded-full bg-white/50" />
              <span className="w-2 h-2 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden w-full bg-gradient-to-br from-brand-50 to-white pt-6 pb-10 px-6">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
              <path d="M12 22c4.97 0 9-3.582 9-8 0-1.5-.4-2.929-1.1-4.14A10.974 10.974 0 0 0 12 2 10.97 10.97 0 0 0 4.1 9.86C3.4 11.07 3 12.5 3 14c0 4.418 4.03 8 9 8z" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-brand-700">Vitalis Health</span>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="w-40 h-40 bg-brand-100/50 rounded-3xl flex items-center justify-center">
            <Image
              src={logoImage}
              alt="Vitalis Health Logo"
              width={120}
              height={120}
              className="w-auto h-auto"
              priority
            />
          </div>
          <h2 className="text-3xl font-bold text-brand-600">Vitalis Health</h2>
        </div>
      </div>
    </>
  );
};

export default BrandPanel;
