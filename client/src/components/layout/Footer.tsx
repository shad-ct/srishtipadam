import logo from '../../assets/logo.png';

export const Footer = () => {
    
  return (
    <footer className="bg-surface py-8 mt-auto border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Srishtipadham Logo" className="w-7 h-7 object-contain rounded-full" />
            <span className="font-bold text-primary">Srishtipadham</span>
          </div>
          <div className="text-sm text-text-secondary">
            &copy; {new Date().getFullYear()} Srishtipadham. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
