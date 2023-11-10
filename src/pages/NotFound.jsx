import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="flex items-center h-screen w-screen p-16 text-white">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">
            Sorry, we couldn&apos;t find this page.
          </p>
          <p className="mt-4 mb-8">
            But dont worry, you can find plenty of other things on our homepage.
          </p>
          <Link to='/'>
            <button
              rel="noopener noreferrer"
              className="px-8 py-3 font-semibold rounded bg-purple-800">
              Back to homepage
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
