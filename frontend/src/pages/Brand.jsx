import React from "react";
import "../index.css";
// import { Link } from 'react-router-dom';

export default function Brand() {
  return (
    <>
      <section
        id="titleHeader"
        className="col-lg-12 col-md-12 bg-dark text-white text-center"
      >
        <h1 className="fw-light">
          <em>Who we are, are change-makers</em>
        </h1>
      </section>

      <div className="container justify-items-center pt-5 mt-2">
        <div id="#mission" className="row featurette">
          <h1>
            <em>E-Finity</em>
          </h1>
          <div className="col-md-8">
            <p className="featurette-heading fs-5">
              E-Finity seeks to promote effective operational functionality in
              startups, drive philanthropic efforts, and{" "}
              <span className="text-muted">
                {" "}
                facilitate community education in propositions based on
                consensus through local leadership.
              </span>
            </p>
            <p className="lead">
              {/* Some great placeholder content for the first featurette here. Imagine some exciting prose here. */}
            </p>
          </div>
          <div className="col-md-4">
            <svg
              className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
              width="500"
              height="500"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Placeholder: 500x500"
              preserveAspectRatio="xMidYMid slice"
              focusable="false"
            >
              <title>Placeholder</title>
              <rect width="100%" height="100%" fill="#eee"></rect>
              <text x="50%" y="50%" fill="#aaa" dy=".3em">
                500x500
              </text>
            </svg>
          </div>
        </div>

        <hr className="featurette-divider" />

        <div className="row featurette">
          <div className="col-md-7 order-md-2">
            <h2 className="featurette-heading">
              Oh yeah, it’s that good.{" "}
              <span className="text-muted">See for yourself.</span>
            </h2>
            <p className="lead">
              {/* Another featurette? Of course. More placeholder content here to give you an idea of how this layout would work with some actual real-world content in place. */}
            </p>
          </div>
          <div className="col-md-5 order-md-1">
            <svg
              className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
              width="500"
              height="500"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Placeholder: 500x500"
              preserveAspectRatio="xMidYMid slice"
              focusable="false"
            >
              <title>Placeholder</title>
              <rect width="100%" height="100%" fill="#eee"></rect>
              <text x="50%" y="50%" fill="#aaa" dy=".3em">
                500x500
              </text>
            </svg>
          </div>
        </div>

        <hr className="featurette-divider" />

        <div className="row featurette">
          <div className="col-md-7">
            <h2 className="featurette-heading">
              And lastly, this one.{" "}
              <span className="text-muted">Checkmate.</span>
            </h2>
            <p className="lead">
              {/* And yes, this is the last block of representative placeholder content. Again, not really intended to be actually read, simply here to give you a better view of what this would look like with some actual content. Your content. */}
            </p>
          </div>
          <div className="col-md-5">
            <svg
              className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
              width="500"
              height="500"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Placeholder: 500x500"
              preserveAspectRatio="xMidYMid slice"
              focusable="false"
            >
              <title>Placeholder</title>
              <rect width="100%" height="100%" fill="#eee"></rect>
              <text x="50%" y="50%" fill="#aaa" dy=".3em">
                500x500
              </text>
            </svg>
          </div>
        </div>

        <section class="brands-support-section">
          <h2>Brands We Support</h2>
          <div class="brands-container">
            <div class="brand-item">
              <img src="brand1-logo.png" alt="Brand 1" />
            </div>
            <div class="brand-item">
              <img src="brand2-logo.png" alt="Brand 2" />
            </div>
            <div class="brand-item">
              <img src="brand3-logo.png" alt="Brand 3" />
            </div>
            <div class="brand-item">
              <img src="brand4-logo.png" alt="Brand 4" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
