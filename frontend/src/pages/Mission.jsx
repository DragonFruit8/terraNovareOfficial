import React from 'react';
import '../index.css';
import Meta from "../components/Meta"
import DonateButton from "../components/DonateButton"

export default function Mission() {
  return (
    <>
          <Meta
        title="Our Mission | Terra'Novare - Building a Sustainable Future"
        description="Discover how Terra'Novare empowers startups, drives local initiatives, and promotes sustainability. Join the movement for meaningful change."
        keywords="social impact, sustainability, startups, community empowerment, green initiatives"
        url="https://terranovare.tech/mission"
        image="/images/mission-preview.jpg"
      />
      <div>
      <section id='main-content' className="titleHeader col-lg-12 col-md-12 bg-dark text-white text-center">
        <h1 aria-hidden="false" className="fw-light px-0"><em>Change your perspective, change your life.</em></h1>
      </section>
      <div className="container justify-items-center pt-5 mt-2">


        <div id='mission' className="row featurette">
          <h1>Our Mission</h1>
          <div className="col-md-10">
            <p aria-hidden="false" className="featurette-heading fs-4">At Terra’Novare, we are dedicated to creating a harmonious future by blending cutting-edge technology, 
              environmental stewardship, and human-centered solutions. Our goal is to renew the world’s systems by integrating holistic, sustainable 
              practices with innovation. 
               <p aria-hidden="false" className="lead text-muted fs-4"> We believe in fostering a balanced relationship between people, technology, and the planet, where progress and well-being coexist seamlessly. </p></p>
          </div>
          {/* <div className="col-md-4">
            <svg className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee"></rect><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>
          </div> */}
        </div>

        <hr className="featurette-divider" />

        <div className="row featurette justify-content-end text-end">
          <div className="col-md-10 order-md-2">
            <h2 aria-hidden="false" className="featurette-heading">Our Vision </h2>
            <p aria-hidden="false" className="featurette-heading fs-4"><span className="text-muted">We are on a mission to reshape the way the world interacts</span> with its <br />resources—promoting community-driven growth, sustainable development, and collaborative innovation. Through initiatives that uplift both the environment and individuals, Terra’Novare empowers people to come together, innovate, and thrive in harmony with the Earth. </p>
          </div>
          {/* <div className="col-md-5 order-md-1">
            <svg className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee"></rect><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>
          </div> */}
        </div>

        <hr className="featurette-divider" />

        <div className="row featurette">
          <div className="col-md-10">
            <h2 aria-hidden="false" className="featurette-heading">Become a<span className="text-muted"> Sponsor</span></h2>
            <p aria-hidden="false" className="lead">As a sponsor, you have the opportunity to partner with a brand at the forefront of sustainability and innovation. Your support can help us further our mission to create solutions that benefit the environment and empower individuals. Let’s work together to make a lasting impact.</p>
          </div>
          {/* <div className="col-md-5">
            <svg className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee"></rect><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>
          </div> */}
        </div>
        <hr className="featurette-divider" />

        <div className="row featurette justify-content-end">
          <div className="col-md-10 text-end">
            <h2 aria-hidden="false" className="featurette-heading">Donate to<span className="text-muted"> the Movement</span></h2>
            <p aria-hidden="false" className="lead">Your donation helps us continue developing products, services, and initiatives that promote sustainability and innovation. Every contribution, big or small, accelerates the positive changes we strive to create.</p>
            <div className="my-2">
		<DonateButton />
            </div>
          </div>
          {/* <div className="col-md-5">
            <svg className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee"></rect><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>
          </div> */}
        </div>
      </div>
      </div>
    </>
  );
}
