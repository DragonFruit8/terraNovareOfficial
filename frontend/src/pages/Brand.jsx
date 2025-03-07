import React from "react";
import "../index.css";
import Meta from "../components/Meta";

export default function Brand() {
  return (
    <>
          <Meta
        title="Terra'Novare | Your Brand [Insert Here] - The Future of Sustainability"
        description="Learn how Terra'Novare and E-Finity are reshaping the startup ecosystem with sustainable business models and environmental responsibility."
        keywords="sustainable business, startup growth, social responsibility, environmental leadership"
        url="https://terranovare.tech/brand"
        image="/images/brand-preview.jpg"
      />
      <section
        id="main-content"
        className="titleHeader col-lg-12 col-md-12 bg-dark text-white text-center"
      >
        <h1 aria-hidden="false" className="fw-light">
          <em>Who we are, are change-makers</em>
        </h1>
      </section>

      <div className="container justify-items-center pt-5 mt-2">
        <div id="brand" className="row featurette">
          <h1 aria-hidden="false">
            <em>YOUR Brand</em>
          </h1>
          <div className="col-md-10">
            <p aria-hidden="false" className="featurette-heading fs-4">
              <span className="fs-3 fst-italic fw-bold">E-Finity </span> seeks to promote effective operational functionality in
              startups, drive philanthropic efforts, and <span className="text-muted"> facilitate community education in propositions based on
                consensus through local leadership. </span> Our mission is to empower entrepreneurs with the operational tools needed for success while ensuring that their ventures align with sustainable practices and community well-being. By promoting effective organizational functionality, we guide startups in structuring their businesses efficiently, helping them integrate social responsibility and long-term impact into their core mission.
            </p>
          </div>
        </div>

        <hr className="featurette-divider" />

        <div className="row featurette justify-content-end text-end">
          <div className="col-md-10 order-md-2">
            <h2 aria-hidden="false" className="featurette-heading">
              
              <span className="text-muted">Beyond supporting new ventures</span>
            </h2>
            <p aria-hidden="false" className="lead">
             E-Finity champions local initiatives that prioritize environmental awareness, human dignity, 
             and cooperative governance. Through collaboration with local governments, businesses, and grassroots 
             organizations, we implement frameworks that enable communities to operate under a trusted, standardized model. 
             These systems not only promote economic resilience but also ensure that environmental and social concerns remain 
             at the forefront of decision-making.
            </p>
          </div>
          {/* <div className="col-md-5 order-md-1">
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
          </div> */}
        </div>

        <hr className="featurette-divider" />

        <div className="row featurette">
          <div className="col-md-10">
            <h2 aria-hidden="false" className="featurette-heading">
              <span className="text-muted">Our approach includes the establishment of community boards</span>
            </h2>
            <p aria-hidden="false" className="lead">
            to oversee sustainable development, the introduction of progressive incentive models, and the careful monitoring of land and resource utilization. By breaking down barriers to industry entry and fostering knowledge-sharing, we create opportunities for individuals to engage, learn, and contribute to the betterment of their local ecosystem. E-Finity is more than a support network—it’s a movement toward sustainable progress, where every individual plays a role in shaping a thriving, cooperative future.
            </p>
          </div>
          {/* <div className="col-md-5">
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
          </div> */}
        </div>

        <section className="brands-support-section">
          <h2 aria-hidden="false" className="my-3">Brands WE Support</h2>
          <div className="brands-container
          ">
            <p aria-hidden="false" className="lead"><em> Coming Soon. . . </em></p>
            {/* <div className="brand-item">
              <img src="brand1-logo.png" alt="Brand 1" />
            </div>
            <div className="brand-item">
              <img src="brand2-logo.png" alt="Brand 2" />
            </div>
            <div className="brand-item">
              <img src="brand3-logo.png" alt="Brand 3" />
            </div>
            <div className="brand-item">
              <img src="brand4-logo.png" alt="Brand 4" />
            </div> */}
          </div>
        </section>
      </div>
    </>
  );
}
