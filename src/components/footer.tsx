import { FaWhatsapp } from "react-icons/fa";
import { FiGithub, FiInstagram } from "react-icons/fi";
import { MdCopyright } from "react-icons/md";

export const Footer = () => {
  return (
    <footer className="w-full bg-primary text-primary-foreground">
      <div className="flex items-center justify-between mx-auto max-w-7xl py-4 px-2 mx:px-6 lg:px-8">
        <div className="flex items-center px-2 gap-1 font-light">
          <MdCopyright className="w-6 h-6" />
          <span>2025 BomberQuiz. Todos os direitos reservados.</span>
        </div>
        <div className="flex items-center px-2 gap-4">
          <button
            type="button"
            aria-label="github"
            title="Acesse nosso repositório no Github"
            className="flex items-center justify-center border-2 border-border rounded-md"
          >
            <FiGithub className="w-6 h-6" />
          </button>
          <button
            type="button"
            aria-label="instagram"
            title="Acesse nosso perfil no Instagram"
            className="flex items-center justify-center border-2 border-border rounded-md"
          >
            <FiInstagram className="w-6 h-6" />
          </button>
          <button
            type="button"
            aria-label="whatsapp"
            title="Fale conosco no Whatsapp"
            className="flex items-center justify-center border-2 border-border rounded-md"
          >
            <FaWhatsapp className="w-6 h-6" />
          </button>
        </div>
      </div>
    </footer>
  );
};
