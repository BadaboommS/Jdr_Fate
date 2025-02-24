import { MdFileOpen } from "react-icons/md"
import { Link } from "react-router-dom"

export default function Error () {
  return (
    <div>
      <p>Error 404</p>
      <Link to='/file'>
        <div className='navbar-icon group'>
          <MdFileOpen size="32" />
          <span className='navbar-tooltip group-hover:scale-100 scale-0'><p>Retour sur le site</p></span>
        </div>
      </Link>
    </div>
  )
}