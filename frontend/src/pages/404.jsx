import { Link } from "react-router-dom";
import '../index.css'

function NotFound() {
  return (
    <div id='notFound' className="cover-container d-flex justify-content-center w-100 p-1 mx-auto bg-black flex-column">
      <div className="d-flex row justify-content-center text-center">
        <h1 aria-hidden="false" className="text-white display-5">404</h1>

        <p aria-hidden="false" className="text-white display-4">Uh-oh!</p>

        <p aria-hidden="false" className="mt-4 text-grey">This isn&apos;t a page silly human...</p>

        <Link
          to="/"
          className="mx-6 text-info"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
export default NotFound;
