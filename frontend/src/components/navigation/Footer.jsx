import { Link } from "react-router-dom";
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-indigo-600">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-sky-200">
              Sobre Nosotros
            </h3>
            <p className="text-sky-100">
              Plataforma líder en educación en línea, ofreciendo cursos de alta
              calidad para tu desarrollo profesional.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-sky-200">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/courses"
                  className="transition-colors text-sky-100 hover:text-white">
                  Cursos
                </Link>
              </li>
              <li>
                <Link
                  to="/my-courses"
                  className="transition-colors text-sky-100 hover:text-white">
                  Mis Cursos
                </Link>
              </li>
              <li>
                <Link
                  to="/certificates"
                  className="transition-colors text-sky-100 hover:text-white">
                  Certificados
                </Link>
              </li>
              <li>
                <Link
                  to="/progress"
                  className="transition-colors text-sky-100 hover:text-white">
                  Progreso
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-sky-200">
              Soporte
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/help"
                  className="transition-colors text-sky-100 hover:text-white">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="transition-colors text-sky-100 hover:text-white">
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="transition-colors text-sky-100 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="transition-colors text-sky-100 hover:text-white">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-sky-200">
              Síguenos
            </h3>
            <div className="flex space-x-4">
              {/* <a
                href="#"
                className="transition-colors text-sky-100 hover:text-white">
                <FaFacebook size={24} />
              </a>
              <a
                href="#"
                className="transition-colors text-sky-100 hover:text-white">
                <FaTwitter size={24} />
              </a>
              <a
                href="#"
                className="transition-colors text-sky-100 hover:text-white">
                <FaInstagram size={24} />
              </a>
              <a
                href="#"
                className="transition-colors text-sky-100 hover:text-white">
                <FaLinkedin size={24} />
              </a> */}
            </div>
          </div>
        </div>
        <div className="pt-8 mt-8 text-center border-t border-indigo-400">
          <p className="text-sky-100">
            &copy; {new Date().getFullYear()} E-Learning Platform. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
