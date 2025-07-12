import { FaGithub } from "react-icons/fa";

export function Footer() {
  return (
    <nav className="w-full text-white py-3 px-4 flex items-center justify-between"
    style={{
        backgroundColor: '#050505',
        color: '#efebe3'
    }}
    >

      {/* Texte centré */}
      <div className="text-center text-sm font-semibold flex">
        <div className="flex items-center gap-2">
            <img src="./assets/image.png" alt="Logo" style={{width: '4.2em'}}/>
        </div>
        <p style={{margin: 'auto', marginLeft: '0.4em', textShadow: '1px 1px 1px #ab110c', fontSize: '0.9em'}}>V4</p>
      </div>

      {/* Liens GitHub */}
      <div className="flex items-center gap-4 justify-end text-sm">
        <a
          href="https://github.com/BadaboommS"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-red-400"
        >
          <FaGithub />
          @BadaboommS
        </a>
        <a
          href="https://github.com/turbokadi"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-red-400"
        >
          <FaGithub />
          @turbokadi
        </a>
      </div>
    </nav>
  );
}
